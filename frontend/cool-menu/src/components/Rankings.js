import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from './Header'

const Container = styled.div`
  padding: 20px;
`;

const Rankings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');

  return (
    <div>
      <Header username={username} />
      <Container>
        <h2>排行榜</h2>
        {/* 在这里添加排行榜的列表和逻辑 */}
      </Container>
    </div>
  );
};

export default Rankings;