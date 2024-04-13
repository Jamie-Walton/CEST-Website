import Page from './pages/Page';
import { Landing } from './pages/Landing';
import { Analyze } from './pages/Analyze';
import { Report } from './pages/Report';
import './css/main.css';
import './css/pages.css';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store.js';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
              <Route exact path='/' element={<Page page={<Landing/>}/>} />
              <Route path='/analyze' element={<Page page={<Analyze/>}/>} />
              <Route path='/report' element={<Page page={<Report/>}/>} />
              <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default App;
