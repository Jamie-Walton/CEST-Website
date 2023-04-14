import Landing from './pages/Landing';
import Analyze from './components/Analyze';
import './css/main.css';
import './css/pages.css';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
            <Route exact path='/' element={<Landing/>} />
            <Route path='/analyze' element={<Analyze/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
