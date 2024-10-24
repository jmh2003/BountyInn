import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const TaskListContainer = styled.div`
  padding: 20px;
  animation: slideDown 0.5s ease forwards;
`;

const Task = styled.div`
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

const TaskList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');

  const tasks = [
    { id: 1, title: '任务1', description: '任务描述1' },
    { id: 2, title: '任务2', description: '任务描述2' },
    // 更多任务
  ];

  return (
    <div>
      <Header username={username}/>
      <TaskListContainer>
        {tasks.map(task => (
          <Task key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </Task>
        ))}
      </TaskListContainer>
    </div>
  );
};

export default TaskList;