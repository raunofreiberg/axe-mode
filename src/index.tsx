import * as React from 'react';
import { AxeModeProps } from './axe-mode';

export const AxeMode =
  process.env.NODE_ENV === 'development'
    ? React.lazy(() => import('./axe-mode'))
    : React.Fragment;

export { AxeModeProps };
export default AxeMode;
