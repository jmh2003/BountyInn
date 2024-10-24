import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';

const HomePageContainer = styled.div`
  padding: 20px 50px 30px;
  display: flex; /* 使用 Flexbox 布局 */
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 任务之间的间距 */
  animation: slideDown 0.5s ease forwards;
`;

const Task = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  flex: 0 0 calc(50% - 10px); /* 每行显示2个任务 */
  box-sizing: border-box; /* 计算边框和内边距 */
  background-color: ${props => props.bgColor}; /* 根据传入的颜色设置背景颜色 */
`;

const HomePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');

  const tasks = [
    { id: 1, title: '任务1', description: '任务描述1' },
    { id: 2, title: '任务2', description: '任务描述2' },
    { id: 3, title: '任务3', description: '任务描述3' },
    { id: 4, title: '任务4', description: '任务描述4' },
    { id: 5, title: '任务5', description: '任务描述5' },
    { id: 6, title: '任务6', description: '任务描述6' },
    { id: 7, title: '任务7', description: '任务描述7' },
    { id: 8, title: '任务8', description: '任务描述8' },
    { id: 9, title: '任务9', description: '任务描述9' },
    { id: 10, title: '任务10', description: '任务描述10' },
    { id: 11, title: '任务11', description: '任务描述11' },
    { id: 12, title: '任务12', description: '任务描述12' },
    { id: 13, title: '任务13', description: '任务描述13' },
    { id: 14, title: '任务14', description: '任务描述14' },
    { id: 15, title: '任务15', description: '任务描述15' },
    { id: 16, title: '任务16', description: '任务描述16' },
    { id: 17, title: '任务17', description: '任务描述17' },
    { id: 18, title: '任务18', description: '任务描述18' },
    { id: 19, title: '任务19', description: '任务描述19' },
    { id: 20, title: '任务20', description: '任务描述20' },
  ];

  // 定义颜色选项
  const colors = ['#E8E8E8'];

  // 随机选择颜色的函数
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div>
      <Header username={username} />{}
      <HomePageContainer>
        {tasks.map(task => (
          <Task key={task.id} bgColor={getRandomColor()}> {/* 传入随机颜色 */}
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </Task>
        ))}
      </HomePageContainer>
    </div>

  );
};

export default HomePage;
