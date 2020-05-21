type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  // tsdx supports this out of the box, can be useful for omitting unused code 
  // from the prod bundle.
  const __DEV__: boolean;
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}

export {};
