import './styles.css';
import * as React from 'react';
import axe, { ElementContext, Result } from 'axe-core';
import Popover from '@reach/popover';
import observeRect from '@reach/observe-rect';
import { IconMinor, IconModerate, IconSevere } from './icons';

type ViolationsByNode = Array<{ node: string; violations: Result[] }>;

function validateNode(node: ElementContext): Promise<Result[]> {
  return new Promise((resolve, reject) => {
    axe.run(node, { reporter: 'v2' }, (error, results) => {
      if (error) reject(error);
      resolve(results.violations);
    });
  });
}

// Copied from:
// https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
// ¯\_(ツ)_/¯
function getComponentFromNode(node: HTMLElement): string {
  const [component] = Object.keys(node)
    .filter(key => key.startsWith('__reactInternalInstance$'))
    .map((key: string) => {
      const fiberNode = (node as any)[key];
      const component = fiberNode && fiberNode._debugOwner;
      return component.type.displayName || component.type.name;
    });
  return component;
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

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      toggle();
    }
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

    targetNode.setAttribute('tabindex', '-1');
    overlayNode.setAttribute('role', 'button');
    overlayNode.setAttribute('tabindex', '0');

    overlayNode.addEventListener('mousedown', toggle);
    overlayNode.addEventListener('keydown', handleKeydown);
    overlayNode.addEventListener('blur', close);

    return () => {
      unobserve();
      document.body.removeChild(overlayNode);
      overlayNode.removeEventListener('mousedown', toggle);
      overlayNode.removeEventListener('keydown', handleKeydown);
      overlayNode.removeEventListener('blur', close);
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
        <h2>Accessibility violation</h2>
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
      <code>
        {getComponentFromNode(document.querySelector(target)) || target}
      </code>
      {violations.map(violation => {
        const [{ any, all }] = violation.nodes.filter(node =>
          node.target.includes(target)
        );

        return (
          <article key={violation.id} className="checks">
            <div className="header">
              {violation.impact === 'minor' ? (
                <IconMinor />
              ) : violation.impact === 'moderate' ? (
                <IconModerate />
              ) : (
                <IconSevere />
              )}
              <h3>
                <a
                  href={violation.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {violation.help}
                </a>
              </h3>
            </div>
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
          </article>
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
  const idleId = React.useRef<number | null>(null);
  const [interactive, setInteractive] = React.useState(false);
  const childrenRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (disabled || interactive) {
      return;
    }

    if (childrenRef.current) {
      if (idleId.current && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId.current);
        idleId.current = null;
      }

      // Safari does not support requestIdleCallback 😔
      if ('requestIdleCallback' in window) {
        idleId.current = window.requestIdleCallback(getViolations);
      } else {
        getViolations();
      }
    }
    return () => {
      if (idleId.current && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId.current);
        idleId.current = null;
      }
    };
    function getViolations() {
      validateNode(childrenRef.current as ElementContext).then(setViolations);
    }
  }, [children, disabled, interactive]);

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
      <span ref={childrenRef}>{children}</span>
      {violationsByNode.map(({ node, violations }, index) => (
        <Violation key={index} target={node} violations={violations} />
      ))}
    </>
  );
}
