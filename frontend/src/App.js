import Landing from './pages/Landing';
import Analyze from './pages/Analyze';
import ROISelection from './pages/ROISelection';
import './css/main.css';
import './css/pages.css';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store.js';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
              <Route exact path='/' element={<Landing/>} />
              <Route path='/analyze' element={<Analyze/>} />
              <Route path='/roi' element={<ROISelection/>} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default App;
