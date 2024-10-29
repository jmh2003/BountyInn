import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageTask.css';
import styled from 'styled-components';
import Header from './Header';



const TaskListContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const getTaskBackgroundColor = (tag) => {
  switch (tag.toLowerCase()) {
    case 'learning':
      return '#e0f7fa';
    case 'job':
      return '#fff9c4';
    case 'else':
      return '#c8e6c9';
    default:
      return '#ffffff';
  }
};

const Task = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${props => getTaskBackgroundColor(props.tag)};
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 10px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  margin-top: 30px;
  padding: 12px 20px;
  width: 100%;
  max-width: 600px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
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
  width: auto;
  margin: 0 5px;

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
  max-width: 600px;
  width: 100%;
`;

const EditTaskInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const EditTaskTextarea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 调整按钮间距 */
  margin-top: 10px;
`;

const ManageTasks = () => {
  const username = localStorage.getItem('username');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?username=${username}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [username]);

  const filteredTasks = tasks.filter(task =>
    (selectedTag === 'All' || task.task_tag.toLowerCase() === selectedTag.toLowerCase()) &&
    (task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tags = ['All', ...new Set(tasks.map(task => task.task_tag).filter(tag => tag !== 'Else')), 'Else'];

  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTaskData({
      task_title: task.task_title,
      task_description: task.task_description,
      task_tag: task.task_tag,
      reward_points: task.reward_points,
      deadline: task.deadline,
    });
  };

  const handleEditSubmit = async () => {
    const { task_title, task_description, task_tag, reward_points, deadline } = editTaskData;

    // 防呆设计：检查输入是否有效
    if (!task_title || !task_description || !task_tag || reward_points <= 0 || !deadline) {
        alert('Please fill out all fields correctly!');
        return;
    }

    try {
        await axios.put(`http://127.0.0.1:8000/api/change_task/`, {
            task_id: editTask.task_id,  // 添加任务 ID
            task_title,
            task_description,
            task_tag,
            reward_points,
            deadline,
        });
        setEditTask(null);
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?username=${username}`);
        setTasks(response.data);
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);

const handleDeleteClick = (task) => {
  setConfirmDeleteTask(task);
};

const handleDeleteConfirm = async () => {
  try {
    await axios.patch(`http://127.0.0.1:8000/api/delete_task/`, {
      task_id: confirmDeleteTask.task_id,
    });
    setTasks(tasks.map(task =>
      task.task_id === confirmDeleteTask.task_id ? { ...task, task_status: 'aborted' } : task
    ));
    setConfirmDeleteTask(null);
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};
  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error}</div>;
  }

  const handleUserClick = async (userId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}`);
    setUserInfo(response.data);
    setSelectedUser(userId);
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};


  return (
    <div>
      <Header />
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
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
                <p>
                  <strong>Candidates:</strong>
                  {task.candidates && task.candidates.length > 0
                    ? task.candidates.map(candidate => (
                        <span key={candidate} onClick={() => handleUserClick(candidate)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginRight: '5px' }}>
                          {candidate}
                        </span>
                      ))
                    : 'nobody'}
                </p>
              </TaskMeta>
              <ButtonContainer>
                <TaskButton onClick={() => setSelectedTask(task)}>View Details</TaskButton>
                <TaskButton onClick={() => handleEditClick(task)}>Edit</TaskButton>
                <TaskButton onClick={() => handleDeleteClick(task)}>Delete</TaskButton>
              </ButtonContainer>
            </Task>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </TaskListContainer>

      {/* 任务详情弹窗 */}
      {selectedTask && (
        <ModalBackground onClick={() => setSelectedTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.task_title}</h3>
            <p>{selectedTask.task_description}</p>
            <TaskMeta>
              <span><strong>Tag:</strong> {selectedTask.task_tag}</span>
              <span><strong>Reward Points:</strong> {selectedTask.reward_points}</span>
              <span><strong>Status:</strong> {selectedTask.task_status}</span>
              <span><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</span>
              <p><strong>Candidates:</strong> {selectedTask.candidates && selectedTask.candidates.length > 0 ? selectedTask.candidates.join(', ') : 'nobody'}</p>
            </TaskMeta>
            <TaskButton onClick={() => setSelectedTask(null)}>Close</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}

      {/* 编辑任务弹窗 */}
      {editTask && (
        <ModalBackground onClick={() => setEditTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <EditTaskInput
              type="text"
              value={editTaskData.task_title}
              onChange={(e) => setEditTaskData({ ...editTaskData, task_title: e.target.value })}
              placeholder="Task Title"
            />
            <EditTaskTextarea
              value={editTaskData.task_description}
              onChange={(e) => setEditTaskData({ ...editTaskData, task_description: e.target.value })}
              placeholder="Task Description"
            />
            <EditTaskInput
              type="text"
              value={editTaskData.task_tag}
              onChange={(e) => setEditTaskData({ ...editTaskData, task_tag: e.target.value })}
              placeholder="Task Tag"
            />
            <EditTaskInput
              type="number"
              value={editTaskData.reward_points}
              onChange={(e) => setEditTaskData({ ...editTaskData, reward_points: Number(e.target.value) })}
              placeholder="Reward Points"
            />
            <EditTaskInput
              type="datetime-local"
              value={editTaskData.deadline}
              onChange={(e) => setEditTaskData({ ...editTaskData, deadline: e.target.value })}
            />
            <TaskButton onClick={handleEditSubmit}>Save Changes</TaskButton>
            <TaskButton onClick={() => setEditTask(null)}>Cancel</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}

      {selectedUser && (
          <ModalBackground onClick={() => setSelectedUser(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>{userInfo.nickname}</h3>
              <p><strong>Credit Score:</strong> {userInfo.credit_score}</p>
              <p><strong>Ability Score:</strong> {userInfo.ability_score}</p>
              <TaskButton onClick={() => setSelectedUser(null)}>Close</TaskButton>
            </ModalContent>
          </ModalBackground>
        )}


      {/* 删除确认弹窗 */}
      {confirmDeleteTask && (
        <ModalBackground onClick={() => setConfirmDeleteTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the task "{confirmDeleteTask.task_title}"?</p>
            <TaskButton onClick={handleDeleteConfirm}>Yes, Delete</TaskButton>
            <TaskButton onClick={() => setConfirmDeleteTask(null)}>Cancel</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}
    </div>
  );
};

export default ManageTasks;
