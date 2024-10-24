import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from './Header';

// 样式设置
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f4f7;
`;

const UserCard = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  text-align: center;
  background: linear-gradient(135deg, #e3f2fd 30%, #fce4ec 90%);
`;

const Header1 = styled.h2`
  color: #3f51b5;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.span`
  font-weight: bold;
  color: #424242;
`;

const Placeholder = styled.span`
  color: #9e9e9e;
  font-style: italic;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  &:hover {
    background-color: #388e3c;
  }
`;

const UserInfo = ({ username }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 从后端获取用户信息的函数
  const fetchUserInfo = async () => {
    try {
      const response = await axios.post('/api/get-user-info/', { username });
      setUserInfo(response.data.user);  // 假设后端返回的数据结构
      setLoading(false);  // 数据获取后设置为非加载状态
    } catch (error) {
      console.error("获取用户信息失败", error);
      setLoading(false);  // 获取失败后同样设置为非加载状态
    }
  };

  // 页面加载时从后端获取数据
  useEffect(() => {
    fetchUserInfo();
  }, [username]);

  // 如果数据在加载过程中，显示“加载中...”占位符
  if (loading) {
    return <p>正在加载用户信息...</p>;
  }

  return (
    <div>
        <Header />
        <Container>
            <UserCard>
                <Header1>用户信息</Header1>

                {/* 用户ID */}
                <InfoRow>
                <Label>用户ID:</Label>
                {userInfo ? <span>{userInfo.user_id}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 姓名 */}
                <InfoRow>
                <Label>姓名:</Label>
                {userInfo ? <span>{userInfo.nickname}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 用户简介 */}
                <InfoRow>
                <Label>用户简介:</Label>
                {userInfo ? <span>{userInfo.user_introduction}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 信用分数 */}
                <InfoRow>
                <Label>信用分数:</Label>
                {userInfo ? <span>{userInfo.credit_score}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 剩余积分 */}
                <InfoRow>
                <Label>剩余积分:</Label>
                {userInfo ? <span>{userInfo.remaining_points}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 能力分数 */}
                <InfoRow>
                <Label>能力分数:</Label>
                {userInfo ? <span>{userInfo.ability_score}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                {/* 活跃状态 */}
                <InfoRow>
                <Label>活跃状态:</Label>
                {userInfo ? <span>{userInfo.is_alive ? '活跃' : '未活跃'}</span> : <Placeholder>数据不可用</Placeholder>}
                </InfoRow>

                <Button>显示更多信息</Button>
            </UserCard>
        </Container>
    </div>
  );
};

export default UserInfo;
