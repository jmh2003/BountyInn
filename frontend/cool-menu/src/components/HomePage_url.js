import React, { useEffect, useState } from 'react'; // 引入 useEffect 和 useState
import styled from 'styled-components';

const HomePageContainer = styled.div`
  padding: 20px;
  animation: slideDown 0.5s ease forwards;
`;

const Task = styled.div`
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

const HomePage = () => {
  const [tasks, setTasks] = useState([]); // 使用 useState 来管理任务状态

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/tasks'); // 调用后端API
        const data = await response.json();
        setTasks(data); // 更新任务状态
      } catch (error) {
        console.error('获取任务时出错:', error);
      }
    };

    fetchTasks(); // 调用获取数据的函数
  }, []); // 空数组表示只在组件挂载时执行

  return (
    <HomePageContainer>
      {tasks.map(task => (
        <Task key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </Task>
      ))}
    </HomePageContainer>
  );
};

export default HomePage;