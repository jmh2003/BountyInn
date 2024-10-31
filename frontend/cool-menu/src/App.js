import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import PublishTask from './components/PublishTask';
import Rankings from './components/Rankings_new';
import Profile from './components/Profile_new';
import ReceiveTask from './components/ReceiveTask';
import Login from './components/Login';
import Register from './components/Register';
import ManageTasks from './components/ManageTask';
import './App.css';
import TaskToDo from './components/TaskToDo';
import TaskToReview from './components/TaskToReview';
import Forum from './components/Forum';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/publish" element={<PublishTask />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homepage" element={<TaskList />} />
        <Route path='/receive' element={<ReceiveTask />} />
        <Route path='/register' element={<Register />} />
        <Route path='/manage' element={<ManageTasks />} />
        <Route path="/task-to-do" element={<TaskToDo/>} />
        <Route path="/task-to-review" element={<TaskToReview/>} />
        <Route path='/' element={<Login />} />
        <Route path='/forum' element={<Forum />} />
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
