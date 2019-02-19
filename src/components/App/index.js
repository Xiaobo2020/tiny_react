import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import LoginPage from '@/containers/LoginPage';
import BucketsPage from '@/containers/BucketsPage';

import './index.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={BucketsPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/buckets" component={BucketsPage} />
            <Route component={BucketsPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;