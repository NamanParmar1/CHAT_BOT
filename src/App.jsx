import React from 'react';
import DynamicForm from './components/DynamicForm'; // Assuming DynamicForm component is in src/components
import FormCreator from './components/FormCreater';

import "./App.css";
import FormList from './components/FormList';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<FormCreator />} />
            <Route path="/form-list" element={<FormList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
