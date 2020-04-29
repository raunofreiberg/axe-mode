import './styles.css';
import * as React from 'react';
import axe, { ElementContext, Result } from 'axe-core';
import Popover from '@reach/popover';
import observeRect from '@reach/observe-rect';

type ViolationsByNode = Array<{ node: string; violations: Result[] }>;

function validateNode(node: ElementContext): Promise<Result[]> {
  return new Promise((resolve, reject) => {
    axe.run(node, { reporter: 'v2' }, (error, results) => {
      if (error) reject(error);
      resolve(results.violations);
    });
  });
}

function segmentViolationsByNode(violations: Result[]): ViolationsByNode {
  // Find all DOM nodes affected by the violations
  const nodes = violations.flatMap(violation =>
    violation.nodes.flatMap(node => node.target)
  );

  // Based on the found nodes, find all violations that they caused
  return nodes.map(node => {
    const violationsByNode = violations.filter(violation =>
      violation.nodes.some(n => n.target.includes(node))
    );
    return {
      node,
      violations: violationsByNode,
    };
  });
}

function setOverlayPosition(
  overlayNode: HTMLElement,
  { width, height, x, y }: DOMRect
) {
  overlayNode.style.setProperty('width', `${width}px`);
  overlayNode.style.setProperty('height', `${height}px`);
  overlayNode.style.setProperty('left', `${x}px`);
  overlayNode.style.setProperty('top', `${y}px`);
}

function Violation({
  target,
  violations,
}: {
  target: any;
  violations: Result[];
}) {
  const [open, setOpen] = React.useState(false);
  const targetRef = React.useRef<HTMLElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLElement | null>(null);

  function toggle() {
    setOpen(prevOpen => !prevOpen);
  }

  function close() {
    setOpen(false);
  }

  React.useEffect(() => {
    const targetNode = document.querySelector(target);
    const overlayNode = document.createElement('axe-mode-overlay');

    targetRef.current = targetNode;
    overlayRef.current = overlayNode;

    const { observe, unobserve } = observeRect(targetNode, targetRect => {
      setOverlayPosition(overlayNode, targetRect);
    });

    observe();
    document.body.appendChild(overlayNode);
    overlayNode.addEventListener('mousedown', toggle);

    return () => {
      unobserve();
      document.body.removeChild(overlayNode);
      overlayNode.removeEventListener('mousedown', toggle);
    };
  }, [target]);

  React.useEffect(() => {
    function listener(e: MouseEvent) {
      const eventTarget = e.target as Node;
      const isTargetInPopover =
        eventTarget === overlayRef.current ||
        popoverRef.current?.contains(eventTarget);

      if (!isTargetInPopover) {
        close();
      }
    }

    if (open) {
      document.addEventListener('mousedown', listener);
    }

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [open, target]);

  if (!open) {
    return null;
  }

  return (
    <Popover ref={popoverRef} targetRef={targetRef} className="popover">
      <div className="controls">
        <h1>Accessibility violation</h1>
        <button className="close" aria-label="Close popover" onClick={close}>
          <svg viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <code>{target}</code>
      {violations.map(violation => {
        const [{ any, all }] = violation.nodes.filter(node =>
          node.target.includes(target)
        );

        return (
          <div key={violation.id} className="checks">
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {violation.help}
            </a>
            {!!all.length && (
              <>
                <small>Fix all of the following:</small>
                <ul>
                  {all.map(check => (
                    <li key={check.id}>{check.message}</li>
                  ))}
                </ul>
              </>
            )}
            {!!any.length && (
              <>
                <small>Fix any of the following:</small>
                <ul>
                  {any.map(check => (
                    <li key={check.id}>{check.message}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );
      })}
    </Popover>
  );
}

export interface AxeModeProps {
  children: React.ReactElement | React.ReactElement[];
  disabled?: boolean;
}

export default function AxeMode({ children, disabled }: AxeModeProps) {
  const [violations, setViolations] = React.useState<Result[]>([]);
  const [idleId, setIdleId] = React.useState(null);
  const child = React.useRef(null);
  const [interactive, setInteractive] = React.useState(false);

  React.useEffect(() => {
    if (disabled) {
      return;
    }

    if (child.current) {
      if (idleId) {
        // requestIdleCallback has no types:
        // https://github.com/microsoft/TypeScript/issues/21309
        // @ts-ignore
        cancelIdleCallback(idleId);
        setIdleId(null);
      }

      // requestIdleCallback has no types:
      // https://github.com/microsoft/TypeScript/issues/21309
      // @ts-ignore
      const id = requestIdleCallback(() => {
        validateNode((child.current as unknown) as ElementContext).then(
          setViolations
        );
      });
      setIdleId(id);
    }
  }, [children, disabled]);

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'i') {
        setInteractive(!interactive);
      }
    }

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [interactive]);

  const violationsByNode = segmentViolationsByNode(violations);

  if (disabled || interactive) {
    return <>{children}</>;
  }

  console.log(violationsByNode);

  return (
    <>
      <span ref={child}>{children}</span>
      {violationsByNode.map(({ node, violations }, index) => (
        <Violation key={index} target={node} violations={violations} />
      ))}
    </>
  );
}
