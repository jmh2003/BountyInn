import React, { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import './ManageTask.css';
import styled from 'styled-components';
import Header from './Header';
import { useNavigate } from 'react-router-dom';


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
  gap: 10px;
  margin-top: 10px;
`;

const CandidateButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-top: 15px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #218838;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #1e7e34;
  }
`;


const CandidateList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto; /* 滚动效果 */
`;

// Update CandidateItem to improve visual appearance on selection
const CandidateItem = styled.li`
  padding: 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 8px;
  text-align: center;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #f0f8ff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  &.selected {
    background-color: #e0f7fa;
    border-color: #007bff;
    font-weight: bold;
  }
`;


const PromptText = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 10px;
`;

const taskStatusMap = {
  "awaiting": '待接取',
  'ongoing': '进行中',
  'finished': '已完成',
  'aborted': '已废弃',
  // 添加其他状态映射
};

const taskTagMap = {
  'All': '全部',
  'Learning': '学习',
  'Job': '工作',
  'Life': '生活',
  'Else': '其他',
  // 添加其他标签映射
};


const ManageTasks = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); // 定义 navigate 变量
  const user_id = localStorage.getItem('user_id');
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
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null); // 确认删除任务的状态
  const [selectedCandidates, setSelectedCandidates] = useState([]); // 选中的候选人
  const [showCandidateModal, setShowCandidateModal] = useState(false); // 显示候选人弹窗
  

  const handleCandidateClick = (task) => {
    const candidatesWithTaskId = task.candidates.map(candidate => ({
      name: candidate,
      task_id: task.task_id,
    }));
    setSelectedCandidates(candidatesWithTaskId);
    setShowCandidateModal(true);
  };

  const handleCandidateSelect = async (task_id, candidate) => {
    setSelectedCandidates((prev) =>
      prev.map((item) =>
        item.name === candidate
          ? { ...item, isSelected: true }
          : { ...item, isSelected: false }
      )
    );
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/transactions/assign_task/`, {
        creator_id: user_id,
        task_id: task_id,
        hunter_name: candidate,
      });
  
      if (response.data.message) {
        alert(response.data.message);
        // Update the task status in the frontend
        setTasks(tasks.map(task => 
          task.task_id === task_id ? { ...task, task_status: 'ongoing' } : task
        ));
        setShowCandidateModal(false);
      } else if (response.data.error) {
        alert(`Error: ${response.data.error}`); // 显示后端返回的error信息
      }
    } catch (error) {
      // 检查错误响应是否包含详细的错误信息
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to assign task');
      }
    }
  };
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/?username=${username}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [username]);

  // 筛选任务时排除掉已删除 (aborted) 的任务
  const filteredTasks = tasks.filter(task =>
    task.task_status !== 'aborted' && // 排除掉已删除的任务
    (selectedTag === 'All' || task.task_tag.toLowerCase() === selectedTag.toLowerCase()) &&
    (task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tags = ['All',  ...new Set(tasks.map(task => task.task_tag).filter(tag => tag !== 'Else')), 'Else'];

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
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/change_task/`, {
            task_id: editTask.task_id,  // 添加任务 ID
            task_title,
            task_description,
            task_tag,
            reward_points,
            deadline,
        });
        setEditTask(null);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/?username=${username}`);
        setTasks(response.data);
    } catch (error) {
        console.error('Error updating task:', error);
    }
  };

  const handleDeleteClick = (task) => {
    setConfirmDeleteTask(task); // 设置当前选择要删除的任务
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/delete_task/`, {
        task_id: confirmDeleteTask.task_id,
      });

      // 在前端移除已删除的任务
      setTasks(tasks.filter(task => task.task_id !== confirmDeleteTask.task_id));

      setConfirmDeleteTask(null); // 重置确认状态
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div>加载任务中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  // const handleUserClick = async (userId) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}`);
  //     setUserInfo(response.data);
  //     setSelectedUser(userId);
  //   } catch (error) {
  //     console.error('Error fetching user info:', error);
  //   }
  // };

  return (
    <div>
      <SearchInput
        type="text"
        placeholder="搜索任务..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <FilterContainer>
        {tags.map(tag => (
          <FilterButton
            key={tag}
            active={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </FilterButton>
        ))}
      </FilterContainer> */}
          <FilterContainer>
            {tags.map(tag => (
              <FilterButton
                key={tag}
                active={selectedTag === tag}
                onClick={() => setSelectedTag(tag)}
                tag={tag} // 传递标签名称以便在样式中使用
              >
                {taskTagMap[tag]}
              </FilterButton>
            ))}
            <FilterButton onClick={() => navigate('/task-to-do')} tag="TaskToDo">待办任务</FilterButton>
            <FilterButton onClick={() => navigate('/task-to-review')} tag="TaskToReview">待评论</FilterButton>
          </FilterContainer>

      {/* <TaskButton onClick={handleTaskToDoClick}>Task To Do</TaskButton>
      <TaskButton onClick={handleTaskToReviewClick}>Task To Review</TaskButton> */}

      <TaskListContainer>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Task key={task.task_id} tag={task.task_tag}>
              <TaskTitle>{task.task_title}</TaskTitle>
              <TaskMeta>
                <span><strong>任务标签</strong> {taskTagMap[task.task_tag]}</span>
                <span><strong>奖励积分:</strong> {task.reward_points}</span>
                <span><strong>任务状态:</strong> {taskStatusMap[task.task_status]}</span>
                <p><strong>截止日期:</strong> {new Date(task.deadline).toLocaleString()}</p>
                <CandidateButton onClick={() => handleCandidateClick(task)}>
                  可选猎人: {task.candidates.length}
                </CandidateButton>
              </TaskMeta>
              <ButtonContainer>
              <TaskButton onClick={() => setSelectedTask(task)}>查看详情</TaskButton>

              {/* 只有当任务状态为 "awaiting" 时显示 Edit 和 Delete 按钮 */}
              {task.task_status === 'awaiting' && (
                <>
                  <TaskButton onClick={() => handleEditClick(task)}>编辑</TaskButton>
                  <TaskButton onClick={() => handleDeleteClick(task)}>删除</TaskButton>
                </>
              )}
              </ButtonContainer>
            </Task>
          ))
        ) : (
          <p>无任务.</p>
        )}
      </TaskListContainer>
      
      {/* 候选者列表弹窗 */}
      {showCandidateModal && (
        <ModalBackground onClick={() => setShowCandidateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>候选猎人</h3>
            <PromptText>请选择猎人:</PromptText>
            <CandidateList>
              {selectedCandidates.length > 0 ? (
                selectedCandidates.map(({ name, task_id, isSelected }) => (
                  <CandidateItem
                    key={name}
                    className={isSelected ? "selected" : ""}
                    onClick={() => handleCandidateSelect(task_id, name)}
                  >
                    {name}
                  </CandidateItem>
                ))
              ) : (
                <p>无猎人可选</p>
              )}
            </CandidateList>
            <TaskButton onClick={() => setShowCandidateModal(false)}>关闭</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}
      
      {/* 任务详情弹窗 */}
      {selectedTask && (
        <ModalBackground onClick={() => setSelectedTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.task_title}</h3>
            <p>{selectedTask.task_description}</p>
            <TaskMeta>
              <span><strong>任务标签:</strong> {taskTagMap[selectedTask.task_tag]}</span>
              <span><strong>奖励积分:</strong> {selectedTask.reward_points}</span>
              <span><strong>状态:</strong> {taskStatusMap[selectedTask.task_status]}</span>
              <span><strong>任务截止日期:</strong> {new Date(selectedTask.deadline).toLocaleString()}</span>
              <p><strong>候选猎人:</strong> {selectedTask.candidates && selectedTask.candidates.length > 0 ? selectedTask.candidates.join(', ') : 'nobody'}</p>
            </TaskMeta>
            <TaskButton onClick={() => setSelectedTask(null)}>关闭</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}

      {/* 编辑任务弹窗 */}
      {editTask && (
        <ModalBackground onClick={() => setEditTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>编辑任务</h3>
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
            <TaskButton onClick={handleEditSubmit}>保存</TaskButton>
            <TaskButton onClick={() => setEditTask(null)}>取消</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}

      {selectedUser && (
        <ModalBackground onClick={() => setSelectedUser(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{userInfo.nickname}</h3>
            <p><strong>信誉值:</strong> {userInfo.credit_score}</p>
            <p><strong>能力值:</strong> {userInfo.ability_score}</p>
            <TaskButton onClick={() => setSelectedUser(null)}>关闭</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}

      {/* 删除确认弹窗 */}
      {confirmDeleteTask && (
        <ModalBackground onClick={() => setConfirmDeleteTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>你确定要删除 "{confirmDeleteTask.task_title}"?</p>
            <TaskButton onClick={handleDeleteConfirm}>是的，删除</TaskButton>
            <TaskButton onClick={() => setConfirmDeleteTask(null)}>取消</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}
    </div>
  );
};

export default ManageTasks;
