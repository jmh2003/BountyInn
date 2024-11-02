import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageTask.css';
import styled from 'styled-components';
import Header from './Header';

const Background = styled.div`
background-image: url('/inn.jpg'); /* 确保图片位于 public 文件夹 */
background-size: cover;
background-repeat: no-repeat;
background-position: center;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: -1;

`;

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

const EditTaskInput = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: 150px; /* Adjusted height */
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical; /* Allow vertical resizing */
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

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskReview, setTaskReview] = useState(null); // 新增状态来存储评价信息
  const [editTask, setEditTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks_for_assignee/?username=${username}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [username]);

  // 获取任务评价信息的函数
  const fetchTaskReview = async (taskId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/get_task_score/`, {
        task_id: taskId,
      });
      setTaskReview(response.data); // 将获取到的评价信息存储到状态中
    } catch (error) {
      console.error('Error fetching task review:', error);
    }
  };

  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setTaskReview(null); // 清空之前的评价信息，以防上一个任务的评价信息被短暂显示
    fetchTaskReview(task.task_id); // 点击查看详情时，调用获取评价信息的函数
  };

  const filteredTasks = tasks.filter(task =>
    (selectedTag === 'All' || task.task_tag.toLowerCase() === selectedTag.toLowerCase()) &&
    (task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tags = ['All', ...new Set(tasks.map(task => task.task_tag).filter(tag => tag !== 'Else')), 'Else'];

  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTaskData({
      task_outcome: task.task_outcome,
      is_reviewed: task.is_reviewed,
    });
  };

  const handleEditSubmit = async () => {
    const { task_outcome, is_reviewed } = editTaskData;

    if (!task_outcome || task_outcome.trim() === '') {
      alert('Task outcome cannot be empty.');
      return;
    }
    if (is_reviewed) {
      alert('Task has been reviewed. You cannot edit the outcome.');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/submit_task_outcome/`, {
        task_id: editTask.task_id,
        task_outcome: task_outcome,
      });
      setEditTask(null);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/?username=${username}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <>
      <Background />
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
              {taskTagMap[tag]}
            </FilterButton>
          ))}
        </FilterContainer>

        <TaskListContainer>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Task key={task.task_id} tag={task.task_tag}>
                <TaskTitle>{task.task_title}</TaskTitle>
                <TaskMeta>
                  <span><strong>任务标签:</strong> {taskTagMap[task.task_tag]}</span>
                  <span><strong>奖励积分:</strong> {task.reward_points}</span>
                  <span><strong>任务状态:</strong> {taskStatusMap[task.task_status]}</span>
                  <span><strong>截止日期:</strong> {new Date(task.deadline).toLocaleString()}</span>
                </TaskMeta>
                <TaskButton onClick={() => handleViewTaskDetails(task)}>查看详情</TaskButton>
                <TaskButton onClick={() => handleEditClick(task)}>提交成果</TaskButton>
              </Task>
            ))
          ) : (
            <p>无任务.</p>
          )}
        </TaskListContainer>

        {/* Task Details Modal */}
        {selectedTask && (
          <ModalBackground onClick={() => setSelectedTask(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>{selectedTask.task_title}</h3>
              <p>{selectedTask.task_description}</p>
              <TaskMeta>
                <span><strong>任务标签:</strong> {taskTagMap[selectedTask.task_tag]}</span>
                <span><strong>奖励积分:</strong> {selectedTask.reward_points}</span>
                <span><strong>任务状态:</strong> {taskStatusMap[selectedTask.task_status]}</span>
                <span><strong>截止日期:</strong> {new Date(selectedTask.deadline).toLocaleString()}</span>
              </TaskMeta>
              <p><strong>提交信息：</strong>{selectedTask.task_outcome}</p>

              {/* 用户评价部分 */}
              {taskReview ? (
                <div>
                  <h4>用户评价</h4>
                  <p><strong>评分:</strong> {taskReview.rating}</p>
                  <p><strong>评论:</strong> {taskReview.comment}</p>
                  <p><strong>评价时间:</strong> {new Date(taskReview.review_at).toLocaleString()}</p>
                </div>
              ) : (
                <p>无评价信息</p>
              )}
              <TaskButton onClick={() => setSelectedTask(null)}>关闭</TaskButton>
            </ModalContent>
          </ModalBackground>
        )}

        {/* Edit Task Modal */}
        {editTask && (
          <ModalBackground onClick={() => setEditTask(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>提交成果（在东家评论前可以重复提交）</h3>
              <EditTaskInput
                value={editTaskData.task_outcome}
                onChange={(e) => setEditTaskData({ ...editTaskData, task_outcome: e.target.value })}
                placeholder="提交成果,此处可以传入云盘网址，将附件传入云盘"
              />
              <TaskButton onClick={handleEditSubmit}>提交</TaskButton>
              <TaskButton onClick={() => setEditTask(null)}>取消</TaskButton>
            </ModalContent>
          </ModalBackground>
        )}
      </div>
    </>
    
  );
};

export default ManageTasks;
