import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from './Header';

const username = localStorage.getItem('username');

const PageContainer = styled.div`
  display: flex;
  padding: 20px;
  background-color: #f0f4f7;
  width: 100%;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
`;

const SidebarOption = styled.div`
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => (props.active ? '#2196f3' : 'transparent')};
  color: ${props => (props.active ? 'white' : '#333')};
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  &:hover {
    background-color: #bbdefb;
  }
`;

const MainContainer = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  color: #333;
  border-bottom: 2px solid #e0f7fa;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const Content = styled.div`
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  color: #555;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%; /* 确保头像为圆形 */
  border: 3px solid #ddd;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #26a69a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #00796b;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const UserInfo = ({ username }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/get-user-info/', { username });
      setUserInfo(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("获取用户信息失败", error);
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/update-password/', { username, newPassword });
        setShowModal(false);
        setFeedback(response.data.message || "密码已更新");
      } catch (error) {
        setFeedback("密码更新失败");
        console.error("密码更新失败", error);
      }
    } else {
      setFeedback("密码不匹配，请重新输入");
    }
  };

  const updateNickname = async () => {
    if (newNickname) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/update-nickname/', { username, newNickname });
        setFeedback(response.data.message || "昵称已更新");
      } catch (error) {
        setFeedback("昵称更新失败");
        console.error("昵称更新失败", error);
      }
    } else {
      setFeedback("请输入新昵称");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [username]);

  if (loading) {
    return <p>正在加载用户信息...</p>;
  }

  return (
    <div>
      <Header username={username} />

      <PageContainer>
        {/* 左侧选择栏 */}
        <Sidebar>
          <SidebarOption
            active={activeSection === 'personalInfo'}
            onClick={() => setActiveSection('personalInfo')}
          >
            个人信息
          </SidebarOption>
          <SidebarOption
            active={activeSection === 'accountSettings'}
            onClick={() => setActiveSection('accountSettings')}
          >
            账号设置
          </SidebarOption>
        </Sidebar>

        {/* 右侧内容展示 */}
        <MainContainer>
          {activeSection === 'personalInfo' ? (
            <>
              <SectionTitle>个人信息</SectionTitle>
              <AvatarContainer>
                <Label>头像</Label>
                <Avatar src={userInfo.avatar || '/default-avatar.png'} alt="用户头像" />
              </AvatarContainer>
              <InfoSection>
                <Label>昵称</Label>
                <Content>{userInfo.nickname || '加载中...'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>用户ID</Label>
                <Content>{userInfo.user_id || '加载中...'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>信用分数</Label>
                <Content>{userInfo.credit_score || '加载中...'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>剩余积分</Label>
                <Content>{userInfo.remaining_points || '加载中...'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>能力分数</Label>
                <Content>{userInfo.ability_score || '加载中...'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>是否活跃</Label>
                <Content>{userInfo.is_alive ? '活跃' : '未活跃'}</Content>
              </InfoSection>
              <InfoSection>
                <Label>自我介绍</Label>
                <Content>{userInfo.user_introduction || '加载中...'}</Content>
              </InfoSection>
            </>
          ) : (
            <>
              <SectionTitle>账号设置</SectionTitle>
              <InfoSection>
                <Label>昵称</Label>
                <StyledInput
                  type="text"
                  placeholder="输入新的昵称"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                />
                <Button onClick={updateNickname}>修改昵称</Button>
              </InfoSection>
              <InfoSection>
                <Label>用户密码</Label>
                <Button onClick={() => setShowModal(true)}>修改密码</Button>
              </InfoSection>
            </>
          )}
          {feedback && <p style={{ color: feedback.includes("失败") ? "red" : "green" }}>{feedback}</p>}
        </MainContainer>

        {/* 修改密码弹出框 */}
        {showModal && (
          <Modal>
            <ModalContent>
              <h3>修改密码</h3>
              <StyledInput
                type="password"
                placeholder="输入新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <StyledInput
                type="password"
                placeholder="确认新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={updatePassword}>确认修改</Button>
              <Button onClick={() => setShowModal(false)} style={{ marginTop: '10px', backgroundColor: '#e57373' }}>
                取消
              </Button>
            </ModalContent>
          </Modal>
        )}
      </PageContainer>
    </div>
  );
};

export default UserInfo;
