import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './PublishTask.css';
import Header from './Header';

function PublishTask() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');

  const [taskTag, setTaskTag] = useState('learning');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const tokenMatch = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    if (tokenMatch) {
      const token = tokenMatch.split('=')[1];
      setCsrfToken(token);
    } else {
      console.error("CSRF token not found");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedDeadline = new Date(deadline);
    const currentTime = new Date();
    if (selectedDeadline < currentTime) {
      alert('截止时间不能早于当前时间，请选择一个有效的截止时间。');
      return;
    }

    const points = Number(rewardPoints);
    if (points < 0) {
      alert('回报点数不能为负数，请输入有效的回报点数。');
      return;
    }

    if (taskTitle.length > 50) {
      alert('任务标题不能超过50个字符。');
      return;
    }
    if (taskDescription.length > 200) {
      alert('任务描述不能超过200个字符。');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await axios.post('http://127.0.0.1:8000/api/add_task/', {
        task_tag: taskTag,
        task_title: taskTitle,
        task_description: taskDescription,
        username: username,
        reward_points: points,
        deadline: deadline,
      }, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      setSuccessMessage('任务创建成功！');
      setTaskTag('learning');
      setTaskTitle('');
      setTaskDescription('');
      setRewardPoints('');
      setDeadline('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('任务创建失败：' + (error.response?.data?.error || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header username={username} />
      <div className="publish-task-container">
        <h2>Add Task</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="task_tag">Task Tag:</label>
          <select id="task_tag" value={taskTag} onChange={(e) => setTaskTag(e.target.value)}>
            <option value="Learning">Learning</option>
            <option value="Life">Life</option>
            <option value="Job">Job</option>
            <option value='Else'>Else</option>
          </select><br />
          <div className="form-group">
            <label htmlFor="task_tag">Task Tag:</label>
            <select id="task_tag" value={taskTag} onChange={(e) => setTaskTag(e.target.value)}>
              <option value="Learning">Learning</option>
              <option value="Life">Life</option>
              <option value="Job">Job</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task_title">Task Title:</label>
            <input
              type="text"
              id="task_title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task_description">Task Description:</label>
            <textarea
              id="task_description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reward_points">Reward Points:</label>
            <input
              type="number"
              id="reward_points"
              value={rewardPoints}
              onChange={(e) => setRewardPoints(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline:</label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>{loading ? '提交中...' : 'Add Task'}</button>
        </form>
      </div>
    </div>
  );
}

export default PublishTask;
