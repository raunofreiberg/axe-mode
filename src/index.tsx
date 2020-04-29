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

function Violation(props: { target: any; violations: Result[] }) {
  const targetRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  function handleMouseEnter() {
    setOpen(true);
  }

  function handleMouseLeave() {
    setOpen(false);
  }

  React.useEffect(() => {
    const targetNode = document.querySelector(props.target);
    targetRef.current = targetNode;

    const overlayNode = document.createElement('axe-mode-overlay');
    const { observe, unobserve } = observeRect(targetNode, targetRect => {
      setOverlayPosition(overlayNode, targetRect);
    });

    document.body.appendChild(overlayNode);
    observe();
    overlayNode.addEventListener('mouseenter', handleMouseEnter);
    overlayNode.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.removeChild(overlayNode);
      unobserve();
      overlayNode.removeEventListener('mouseenter', handleMouseEnter);
      overlayNode.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [props.target]);

  if (!open) {
    return null;
  }

  return (
    <Popover targetRef={targetRef} className="popover">
      <h1>{props.target}</h1>
      {props.violations.map(violation => {
        const checksByNode = [
          // Array of checks that were made where at least one must have passed
          ...violation.nodes.filter(node =>
            node.target.includes(props.target)
          )[0].any,
          // Array of checks that were made where all must have passed.
          ...violation.nodes.filter(node =>
            node.target.includes(props.target)
          )[0].all,
        ];

        return (
          <div key={violation.id}>
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {violation.help}
            </a>
            {checksByNode.map(check => (
              <p key={check.id}>{check.message}</p>
            ))}
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

  const violationsByNode = segmentViolationsByNode(violations);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      <span ref={child}>{children}</span>
      {violationsByNode.map(({ node, violations }, index) => (
        <Violation key={index} target={node} violations={violations} />
      ))}
    </>
  );
}
