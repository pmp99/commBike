import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './assets/Amethyst 400.ttf'
import './assets/Novecento NarrowLight.otf'
import ReduxProvider from "./redux/ReduxProvider";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();