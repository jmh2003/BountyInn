import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Profile = () => {
  return (
    <Container>
      <h2>用户信息</h2>
      {/* 在这里添加用户信息的展示逻辑 */}
    </Container>
  );
};

export default Profile;