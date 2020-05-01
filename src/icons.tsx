import * as React from 'react';
import { useId } from '@reach/auto-id';

export const IconMinor: React.FC<Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'viewBox'
>> = props => {
  const titleId = `minor-icon-${useId(props.id)}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
      {...props}
      viewBox="0 0 500 500"
    >
      <title id={titleId}>Minor impact</title>
      <path
        d="M439.8,30.73C330.44,13.58,233.42,80.12,124.31,73.18l.13-1.74a31.5,31.5,0,0,0-62.83-4.65L34.12,438.28A31.49,31.49,0,0,0,63.21,472c.79.06,1.57.09,2.36.09A31.51,31.51,0,0,0,97,442.93l6.85-92.58c109,16.51,205.76-49.64,314.59-42.6a31.22,31.22,0,0,0,33.21-29.06q7.15-107.8,14.3-215.09A31.13,31.13,0,0,0,439.8,30.73Z"
        fill="#FF9800"
      />
    </svg>
  );
};

export const IconModerate: React.FC<Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'viewBox'
>> = props => {
  const titleId = `moderate-icon-${useId(props.id)}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
      {...props}
      viewBox="0 0 500 500"
    >
      <title id={titleId}>Moderate impact</title>
      <path
        d="M250,18C121.87,18,18,121.87,18,250S121.87,482,250,482,482,378.13,482,250,378.13,18,250,18Zm-20.6,89.34h42a14.54,14.54,0,0,1,14.52,15.35l-8.33,148.79A14.54,14.54,0,0,1,263,285.21H237.4a14.53,14.53,0,0,1-14.52-13.76l-8-148.79A14.54,14.54,0,0,1,229.4,107.34Zm49.35,287.19q-10.26,10.13-28.87,10.13-19.08,0-29-10.25T211,366q0-18.39,9.78-28.52t29.1-10.13q19.32,0,29.22,10T289,366Q289,384.4,278.75,394.53Z"
        fill="#FF5B5B"
      />
    </svg>
  );
};

export const IconSevere: React.FC<Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'viewBox'
>> = props => {
  const titleId = `severe-icon-${useId(props.id)}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
      {...props}
      viewBox="0 0 500 500"
    >
      <title id={titleId}>Severe impact</title>
      <path
        d="M492.39,420,282.09,44.09C268.05,19,232,19,217.91,44.09L7.61,420c-13.71,24.51,4,54.72,32.09,54.72H460.3C488.38,474.73,506.1,444.52,492.39,420Zm-263-291.94h42a14.54,14.54,0,0,1,14.52,15.35l-8.33,148.79A14.54,14.54,0,0,1,263,305.94H237.4a14.54,14.54,0,0,1-14.52-13.76l-8-148.79A14.53,14.53,0,0,1,229.4,128.07Zm49.35,287.19q-10.26,10.13-28.87,10.13-19.08,0-29-10.25t-9.9-28.4q0-18.37,9.78-28.51t29.1-10.13q19.32,0,29.22,10t9.9,28.63Q289,405.13,278.75,415.26Z"
        fill="#FFB963"
      />
    </svg>
  );
};
