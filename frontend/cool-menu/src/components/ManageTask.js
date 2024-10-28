import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageTask.css';
import Header from './Header';

function ManageTasks() {
  const username = localStorage.getItem('username');

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // 根据 username 获取用户的任务
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?username=${username}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [username]); // 依赖项包含 username

  return (
    <div>
      <Header username={username} />
      <div className="tasks-container">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div className="task-card" key={task.task_id}>
                <h3 className="task-title">{task.task_title}</h3>
                <p className="task-description">{task.task_description}</p>
                <p className="task-tag">Tag: {task.task_tag}</p>
                <p className="task-reward">Reward: {task.reward_points}</p>
                <p className="task-status">Status: {task.task_status}</p>
                <p className="task-deadline">Deadline: {new Date(task.deadline).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTasks;
