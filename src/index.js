import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Route, Router, IndexRoute } from 'react-router'
import Root from './Root';
import App from './App';
import Raffle from './Raffle'
import FourOFour from './FourOFour'
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Root}>
      <IndexRoute component={App} />
      <Route path="raffle" component={Raffle}/>
      <Route path="*" component={FourOFour}/>
    </Route>
  </Router>, document.getElementById('root'))