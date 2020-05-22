import * as React from 'react';
import { AxeModeProps } from './axe-mode';

const AxeMode = React.lazy(() => import('./axe-mode'));

export default function Loader(props: AxeModeProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <React.Suspense fallback={null}>
        <AxeMode {...props} />
      </React.Suspense>
    );
  }
  return <React.Fragment>{props.children}</React.Fragment>;
}

export { AxeModeProps };
