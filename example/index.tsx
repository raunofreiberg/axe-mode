import 'react-app-polyfill/ie11';
import './styles.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AxeMode from '../src/index';

function Subtitle() {
  return <h6>Accessibility testing componentized</h6>;
}

function Image() {
  return (
    <img
      src="https://avatars1.githubusercontent.com/u/23662329?v=4"
      width="40"
      height="40"
      id="hey"
    />
  );
}

const App = () => {
  return (
    <AxeMode>
      <header>
        <a href="#" className="iconLink" id="hey">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="currentColor"
            />
          </svg>
        </a>
        <Image />
      </header>
      <main>
        <div className="login">
          <h1>Axe Mode</h1>
          <Subtitle />
          <input placeholder="Username" />
          <input placeholder="Password" />
          <button aria-expanded="foo" onClick={() => console.log('yo')}>
            Label
          </button>
        </div>
      </main>
    </AxeMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
