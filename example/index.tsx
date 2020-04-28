import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { A11y } from '../src/index';

const App = () => {
  return (
    <A11y>
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
        <button aria-expanded="asdadas">Sup!</button>
      </div>
    </A11y>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
