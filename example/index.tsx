import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AxeMode from '../src/index';

const App = () => {
  return (
    <AxeMode>
      <div style={{ padding: 32 }}>
        <span
          style={{
            background: 'rgb(229, 243, 255)',
            color: '#6469FF',
            borderRadius: 4,
            padding: 8,
          }}
        >
          I don't have enough contrast!
        </span>
        <h1 aria-expanded="asda">Heading 1</h1>
        <img
          src="https://avatars1.githubusercontent.com/u/23662329?v=4"
          width="100"
          height="100"
        />
        <button id="yo" />
        <button />
        <input id="yo" />
        <button aria-expanded="asdadas" style={{ margin: 300 }}>
          Sup!
        </button>
      </div>
    </AxeMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
