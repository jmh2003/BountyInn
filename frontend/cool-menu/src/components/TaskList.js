import React from 'react';
import styled from 'styled-components';

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
  const tasks = [
    { id: 1, title: '任务1', description: '任务描述1' },
    { id: 2, title: '任务2', description: '任务描述2' },
    // 更多任务
  ];

  return (
    <TaskListContainer>
      {tasks.map(task => (
        <Task key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </Task>
      ))}
    </TaskListContainer>
  );
};

export default TaskList;