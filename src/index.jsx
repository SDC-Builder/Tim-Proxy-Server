import React from 'react';
import ReactDOM from 'react-dom';
import { About } from './About.jsx';

ReactDOM.hydrate(<About state={window.__INITIAL__DATA__} />, document.getElementById('about'));
