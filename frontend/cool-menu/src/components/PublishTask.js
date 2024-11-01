import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublishTask.css';
import Header from './Header'; // 引入 Header 组件
function PublishTask() {
  const username = localStorage.getItem('username');
  const [taskTag, setTaskTag] = useState('Learning');
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
      alert('奖励积分不能为负数，请输入有效的奖励积分。');
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
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/add_task/`, {
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
      setTaskTag('Learning');
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
    <div className="publish-task-page">
      {/* <Header username={username} /> */}
      <div className="publish-task-container">
        <div className="form-section">
          <h2>发布任务</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="task_tag">任务标签</label>
              <select id="task_tag" value={taskTag} onChange={(e) => setTaskTag(e.target.value)}>
                <option value="Learning">学习</option>
                <option value="Life">生活</option>
                <option value="Job">工作</option>
                <option value="Else">其他</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task_title">任务标题:</label>
              <input
                type="text"
                id="task_title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task_description">任务描述:</label>
              <textarea
                id="task_description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reward_points">奖金（积分数）:</label>
              <input
                type="number"
                id="reward_points"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                placeholder="请输入奖励积分数"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">任务截止日期:</label>
              <input
                type="datetime-local"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>{loading ? '提交中...' : '提交'}</button>
          </form>
        </div>

        <div className="info-section">
          <h3>我们的优势</h3>
          <p><i className="fas fa-users"></i> 找专业人做专业事。</p>
          <p><strong>多</strong>  海量人才 品类多</p>
          <p><strong>快</strong>  高效服务 响应快</p>
          <p><strong>好</strong>  品质保障 服务好</p>
          <p><strong>省</strong>  平台交易 更省心</p>
          <p>因为服务内容和需求不同，方案和报价不同，具体方案以实际沟通需求评估为准。</p>
        </div>
      </div>
    </div>
  );
}

export default PublishTask;
