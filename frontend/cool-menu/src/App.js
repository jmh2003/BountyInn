import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import PublishTask from './components/PublishTask';
import Rankings from './components/Rankings';
import Profile from './components/Profile';
import './App.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/publish" element={<PublishTask />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;