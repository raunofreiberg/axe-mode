# axe-mode

> WIP

This project is an attempt to leverage [`axe-core`](https://github.com/dequelabs/axe-core) in a component to find accessibility violations and provide information on how to resolve them.

Currently, this only works for React.

![Demo](https://i.gyazo.com/2eeb2f0bacbabfbe706932c545ec682c.gif)


## Usage

Make sure to have `axe-core` installed as a dependency.

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

**Note**: Make sure to only run in production by using the `disabled` prop with your environment variable.

## Development

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, [we use Parcel's aliasing](https://github.com/palmerhq/tsdx/pull/88/files).

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.
