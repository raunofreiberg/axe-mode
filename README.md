# axe-mode

![npm](https://img.shields.io/npm/v/axe-mode?color=%236469FF)

> WIP

This project is an attempt to leverage [`axe-core`](https://github.com/dequelabs/axe-core) in a component to find accessibility violations and provide information on how to resolve them.

Currently, this only works for React.

[See it in action on CodeSandbox.](https://codesandbox.io/s/divine-surf-bziuo?file=/src/App.tsx)

![Demo](https://i.gyazo.com/2eeb2f0bacbabfbe706932c545ec682c.gif)


## Usage

Install the library:

```bash
yarn add axe-mode -D
```

or

```bash
npm install axe-mode --save-dev
```

Import the component and wrap it around your application or any other component tree you would like to validate:

```tsx
import AxeMode from 'axe-mode';

function App() {
  return (
    <AxeMode disabled={process.env.NODE_ENV !== 'development'}>
      <h1 aria-expanded="123">Hello world!</h1>
    </AxeMode>
  );
}
```

Launch your application as usual. Any violations of accessibility will show up as an overlay. If you wish to interact with your application, overlays can be toggled on/off with `Ctrl + I`.

You can safely leave the component around your application since [this whole library and its dependencies will be dropped in production.](https://github.com/raunofreiberg/axe-mode/blob/master/src/index.tsx#L7)

**Note**: Make sure to only run in production by using the `disabled` prop with your environment variable.
