import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import axios from 'axios'; // 导入 axios 进行 API 请求

// 设置 TaskListContainer 的样式，使用 grid 布局来实现响应式三列布局
const TaskListContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 20px; /* 每个任务框之间的间隔 */

  /* 响应式设计 - 根据屏幕宽度调整列数 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 屏幕宽度小于1024px时显示两列 */
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); /* 屏幕宽度小于768px时显示一列 */
  }
`;

// 定义任务背景颜色，根据不同标签返回不同颜色
const getTaskBackgroundColor = (tag) => {
  switch (tag.toLowerCase()) {
    case 'learning':
      return '#e0f7fa'; // 浅蓝色
    case 'job':
      return '#fff9c4'; // 浅黄色
    case 'else':
      return '#c8e6c9'; // 浅绿色
    default:
      return '#ffffff'; // 默认白色
  }
};

const Task = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${props => getTaskBackgroundColor(props.tag)};
  height: 200px; /* 固定高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 确保按钮在底部 */
`;

const TaskTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

const TaskMeta = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const TaskButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  background-color: ${props => (props.disabled ? '#ccc' : '#007bff')}; /* 如果按钮被禁用，显示灰色 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')}; /* 如果按钮被禁用，改变鼠标样式 */

  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#0056b3')}; /* 如果按钮被禁用，保持灰色 */
  }
`;

// 搜索框样式
const SearchInput = styled.input`
  margin-bottom: 20px;
  margin-top: 30px; /* 添加的 margin-top 用于将搜索框向下移动 */
  padding: 12px 20px;
  width: 100%;
  max-width: 600px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 30px; /* 设置圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  outline: none;
  transition: all 0.3s ease; /* 添加过渡效果 */

  &:focus {
    border-color: #007bff; /* 聚焦时改变边框颜色 */
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2); /* 聚焦时加大阴影 */
  }

  &::placeholder {
    color: #aaa; /* 占位符的颜色 */
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px; /* 设置按钮间距 */
  margin: 20px 0;
`;

const FilterButton = styled.button`
  padding: 10px;
  font-size: 14px;
  background-color: ${props => (props.active ? '#28a745' : '#007bff')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: auto; /* 设置按钮为自适应宽度 */
  margin: 0 5px; /* 按钮之间的水平间距 */

  &:hover {
    background-color: ${props => (props.active ? '#218838' : '#0056b3')};
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
`;

const TaskList = () => {
  const user_id = localStorage.getItem('user_id');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 用于搜索任务的关键词
  const [selectedTag, setSelectedTag] = useState('All'); // 用于筛选任务的标签
  const [selectedTask, setSelectedTask] = useState(null); // 当前选中的任务
  const [applyMessage, setApplyMessage] = useState(''); // 任务申请反馈信息
  const [appliedTasks, setAppliedTasks] = useState([]); // 已申请的任务ID列表
  const [creatorNicknames, setCreatorNicknames] = useState({}); // 任务创建者的昵称列表

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/all_tasks/');
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // 对每个任务获取其creator的nickname
    const fetchNicknames = async () => {
      for (const task of tasks) {
        if (!creatorNicknames[task.creator_id]) {
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/find_user/', {
              user_id: task.creator_id,
            });
            if (response.data.nickname) {
              setCreatorNicknames((prev) => ({
                ...prev,
                [task.creator_id]: response.data.nickname,
              }));
            }
          } catch (err) {
            console.error(`Error fetching nickname for user ${task.creator_id}:`, err);
          }
        }
      }
    };if (tasks.length > 0) {
      fetchNicknames();
    }
  }, [tasks]);

  const handleApply = async (taskId) => {
    try {
      if (!user_id) {
        setApplyMessage('User ID is missing. Please log in.');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/transactions/apply_for_task/', {
        hunter_id: user_id,
        task_id: taskId,
      });
      if (response.data.message) {
        setApplyMessage(response.data.message);
        setAppliedTasks([...appliedTasks, taskId]); // 任务申请成功后更新已申请任务的列表
      } else if (response.data.error) {
        setApplyMessage(response.data.error);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setApplyMessage(err.response.data.error);
      } else {
        setApplyMessage('Error occurred while applying for the task.');
      }
    }
  };

  const checkIfTaskApplied = async (taskId) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/transactions/check_task_applied/', {
        hunter_id: user_id,
        task_id: taskId,
      });

      if (response.data.applied) {
        setAppliedTasks([...appliedTasks, taskId]); // 如果任务已申请，加入到 appliedTasks 列表中
      }
    } catch (err) {
      console.error("Error checking task applied status:", err);
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setApplyMessage('');
    checkIfTaskApplied(task.task_id); // 检查任务是否已申请
  };

  const filteredTasks = tasks.filter(task =>
    (selectedTag === 'All' || task.task_tag.toLowerCase() === selectedTag.toLowerCase()) &&
    (task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tags = ['All', ...new Set(tasks.map(task => task.task_tag).filter(tag => tag !== 'Else')), 'Else'];

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error}</div>;

  return (
    <div>
      <SearchInput
        type="text"
        placeholder="Search tasks by title or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        {tags.map(tag => (
          <FilterButton
            key={tag}
            active={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </FilterButton>
        ))}
      </FilterContainer>

      <TaskListContainer>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Task key={task.task_id} tag={task.task_tag}>
              <TaskTitle>{task.task_title}</TaskTitle>
              <TaskMeta>
                <span><strong>Tag:</strong> {task.task_tag}</span>
                <span><strong>Reward Points:</strong> {task.reward_points}</span>
                <span><strong>Status:</strong> {task.task_status}</span>
                <span><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</span>
                <span><strong>Creator:</strong> {creatorNicknames[task.creator_id] || 'Loading...'}</span> {/* 显示creator的nickname */}
              </TaskMeta>
              <TaskButton
                onClick={() => openTaskModal(task)}
              >
                View Details
              </TaskButton>
            </Task>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </TaskListContainer>

      {selectedTask && (
        <ModalBackground onClick={() => { setSelectedTask(null); setApplyMessage(''); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.task_title}</h3>
            <p>{selectedTask.task_description}</p>
            <TaskMeta>
              <span><strong>Tag:</strong> {selectedTask.task_tag}</span>
              <span><strong>Reward Points:</strong> {selectedTask.reward_points}</span>
              <span><strong>Status:</strong> {selectedTask.task_status}</span>
              <span><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</span>
            </TaskMeta>

            <TaskButton
              onClick={() => handleApply(selectedTask.task_id)}
              disabled={appliedTasks.includes(selectedTask.task_id)} // 如果任务已申请，禁用按钮
            >
              {appliedTasks.includes(selectedTask.task_id) ? 'Already Applied' : 'Apply for Task'}
            </TaskButton>

            {applyMessage && <p>{applyMessage}</p>}

            <TaskButton onClick={() => setSelectedTask(null)}>Close</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}
    </div>
  );
};

export default TaskList;
