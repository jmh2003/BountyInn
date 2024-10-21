import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSRF_TOKEN } from "./csrftoken.js";

function PublishTask() {
  const [taskTag, setTaskTag] = useState('learning');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [creatorId, setCreatorId] = useState(''); // 用户ID状态
  const [rewardPoints, setRewardPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // 从cookie中获取CSRF令牌
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
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add_task/', {
        task_tag: taskTag,
        task_title: taskTitle,
        task_description: taskDescription,
        creator_id: creatorId,
        reward_points: rewardPoints,
        deadline: deadline,
      }, {
        headers: {
          'X-CSRFToken': csrfToken, // 添加CSRF令牌
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task_tag">Task Tag:</label>
        <select id="task_tag" value={taskTag} onChange={(e) => setTaskTag(e.target.value)}>
          <option value="learning">Learning</option>
          <option value="life">Life</option>
          <option value="job">Job</option>
        </select><br />

        <label htmlFor="task_title">Task Title:</label>
        <input
          type="text"
          id="task_title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        /><br />

        <label htmlFor="task_description">Task Description:</label>
        <textarea
          id="task_description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        /><br />

        <label htmlFor="creator_id">Creator ID:</label>
        <input
          type="text"
          id="creator_id"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          required
        /><br />

        <label htmlFor="reward_points">Reward Points:</label>
        <input
          type="number"
          id="reward_points"
          value={rewardPoints}
          onChange={(e) => setRewardPoints(e.target.value)}
          required
        /><br />

        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        /><br />

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default PublishTask;
