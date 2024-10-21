import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TaskList from './components/TaskList';
import HomePage from './components/HomePage';
import PublishTask from './components/PublishTask';
import Rankings from './components/Rankings';
import Profile from './components/Profile';
import ReceiveTask from './components/ReceiveTask';
import Login from './components/Login';
import './App.css';

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/publish" element={<PublishTask />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path='/receive' element={<ReceiveTask />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
