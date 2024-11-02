import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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

const PageContainer = styled.div`
  display: flex;
  position: fixed;
  background-color: #f0f4f7;
  background-image: url('/inn.jpg'); /* 添加背景图路径 */
  background-size: cover; /* 背景图覆盖整个容器 */
  background-position: center; /* 背景图居中 */
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: rgba(0, 0, 0, 0.2); /* 设置黑色背景和透明度 */
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
`;

const SidebarOption = styled.div`
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => (props.active ? '#6BB8B2' : '#6BB8B2')};
  color: ${props => (props.active ? 'white' : 'white')};
  font-weight: ${props => (props.active ? 'bold' : 'bold')};
  &:hover {
    background-color: #538B87;
  }
`;

const MainContainer = styled.div`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.2); /* 设置黑色背景和透明度 */
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  border-bottom: 2px solid #e0f7fa;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const InfoSection = styled.div`
  flex: 1; /* 平均分配宽度 */
  margin-right: 10px; /* 右边留出空间 */
  margin-bottom: 10px;
  
  /* 为最后一个 InfoSection 移除右边距 */
  &:last-child {
    margin-right: 10px;
  }

  
`;

const Label = styled.div`
  color: white;
  margin-bottom: 5px;
`;

const Content = styled.div`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  color: #555;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  color: #ffd700;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #ddd;
`;

const StyledInput = styled.input`
  height: 50px;
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: rgba(255, 255, 255, 0.8);
  margin-right: 30px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: RGBA(0, 0, 0, 0.5);
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

  width: 500px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between; /* 控制每个信息之间的空间 */
  margin-bottom: 0px;
  width: calc(100% - 30px); 
`;

const avatarContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px'
};

const Textarea = styled.textarea`
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: rgba(255, 255, 255, 0.8);
  margin-right: 30px;
  font-size: 16px; /* 增加字体大小 */
  resize: vertical; /* 允许垂直调整大小 */
  overflow: auto; /* 自动显示滚动条 */
  min-height: 200px; /* 设置最小高度 */
`;




const UserInfo = () => {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false); // 新增状态
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newBio, setNewBio] = useState(''); // 新增状态
  const [feedback, setFeedback] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/get_user_info/`, { 
        username: username });
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
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/update_password/`, { 
          username: username, 
          new_password: newPassword });
        setShowPasswordModal(false);
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
        const response = await axios.post( `${process.env.REACT_APP_API_BASE_URL}/api/update_nickname/`, { 
          username: username, 
          new_nickname: newNickname });
        setFeedback(response.data.message || "昵称已更新");
        setTimeout(() => {
          setFeedback(null);
        }, 2000);
        setUsername(newNickname);
        localStorage.setItem('username', newNickname);
      } catch (error) {
        setFeedback("昵称已经被他人占用，请输入新昵称");
        console.error("昵称已经被他人占用，请输入新昵称", error);
      }
    } else {
      setFeedback("请输入新昵称");
    }
  };

  const updateBio = async () => { // 新增更新自我介绍的方法
    if (newBio) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/update_bio/`, { 
          username: username, 
          new_bio: newBio });
        setFeedback(response.data.message || "自我介绍已更新");
        setTimeout(() => {
          setFeedback(null);
        }, 2000);
        setUserInfo({ ...userInfo, user_introduction: newBio }); // 更新local状态
        setShowBioModal(false); // 关闭模态框
      } catch (error) {
        setFeedback("自我介绍更新失败");
        console.error("自我介绍更新失败", error);
      }
    } else {
      setFeedback("请输入自我介绍");
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
      <PageContainer>
        {/* 左侧选择栏 */}
        <Sidebar>
        <div style={avatarContainerStyle}>
               
                <Avatar src="/user.jpg" alt="用户头像" />
              </div>

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
              
              {/* 第一行信息 */}
              <InfoRow>
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
              </InfoRow>

              {/* 第二行信息 */}
              <InfoRow>
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
              </InfoRow>

              {/* 单独一行的自我介绍 */}
              <InfoSection>
                <Label>自我介绍</Label>
                <Content>{userInfo.user_introduction || '加载中...'}</Content>
                <Button onClick={() => { setNewBio(userInfo.user_introduction); setShowBioModal(true); }}>
                  编辑自我介绍
                </Button>
              </InfoSection>
            </>
          ) : (
            <>
              <SectionTitle>账号设置</SectionTitle>
              <InfoSection>
                <Label>输入用户新昵称</Label>
                <StyledInput
                  type="text"
                  placeholder="输入新的昵称"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                />
                <Button onClick={updateNickname}>修改昵称</Button>
              </InfoSection>
              <InfoSection>
              
                <Button onClick={() => setShowPasswordModal(true)}>修改密码</Button>
              </InfoSection>
            </>
          )}
          {feedback && <p style={{ color: feedback.includes("失败") ? "red" : "white" }}>{feedback}</p>}
        </MainContainer>


        {/* 修改密码弹出框 */}
        {showPasswordModal && (
          <Modal>
            <ModalContent>
              <h3 style={{color:"black"}}>修改密码</h3>
              <label style={{color:"black"}}>输入新密码</label>
              <StyledInput
                type="password"
                placeholder="输入新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label style={{color:"black"}}>确认新密码</label>
              <StyledInput
                type="password"
                placeholder="确认新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={updatePassword}>确认修改</Button>
              <Button onClick={() => setShowPasswordModal(false)} style={{ marginTop: '10px', backgroundColor: '#e57373' }}>
                取消
              </Button>
            </ModalContent>
          </Modal>
        )}

        {/* 编辑自我介绍的弹出框 */}
        {showBioModal && (
          <Modal>
            <ModalContent>
              <h3 style={{color:"black"}} >编辑自我介绍</h3>
              <Textarea
                type="text"
                placeholder="输入新的自我介绍"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <Button onClick={updateBio}>确认修改</Button>
              <Button onClick={() => setShowBioModal(false)} style={{ marginTop: '10px', backgroundColor: '#e57373' }}>
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
