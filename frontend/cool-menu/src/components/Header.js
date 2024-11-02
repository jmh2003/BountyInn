import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';

const NavBar = styled.nav`
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Menu = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const MenuLink = styled(Link)`
  color: ${props => (props.isSelected ? '#ffd700' : 'white')};
  margin: 0 30px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

const ExitLink = styled(Link)`
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin-left: 30px;
  margin-right: 10px;
`;

const FloatingBall = styled.div`
  background-color: #333;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
`;

const ChatBox = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 300px;
  max-height: ${props => (props.isMinimized ? '40px' : '400px')};
  overflow-y: auto;
  transition: max-height 0.3s ease;
  color: black; /* 设置字体颜色为黑色 */
  position: fixed;
  bottom: 100px;
  right: 20px;
  display: ${props => (props.isVisible ? 'block' : 'none')};
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Input = styled.input`
  width: calc(100% - 22px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black; /* 设置字体颜色为黑色 */
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #555;
  }
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => (props.isUser ? '#e1ffc7' : '#f1f1f1')};
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  color: black; /* 设置字体颜色为黑色 */
`;

const UserProfileImage = styled.img`
  border-radius: 50%; /* 设置为圆形 */
  height: 35px; /* 设置高度，按需调整 */
  width: 35px; /* 设置宽度，按需调整 */
  cursor: pointer; /* 鼠标悬停时显示为指针 */
  margin-left: 100px; /* 添加左边距 */
`;

const Header = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { text: input, isUser: true };
    setInput('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/get_openai_response/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      const botMessage = { text: data.answer || '店小二好累，请稍后再试', isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      const botMessage = { text: '店小二好累，请稍后再试', isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleMenuClick = (button, path) => {
    return (event) => {
      event.preventDefault(); // 阻止默认的链接跳转行为
      setSelectedButton(button);
      navigate(path);
    };
  };

  return (
    <NavBar>
      <img src="/logo.png" alt="Logo" style={{ height: '40px', marginLeft: '30px', marginRight: '10px' }} />
      <Menu>
        <MenuLink
          to={'/tasks'}
          isSelected={selectedButton === 'tasks'}
          onClick={handleMenuClick('tasks', '/tasks')}
        >
          任务大厅
        </MenuLink>
        <MenuLink
          to={'/manage'}
          isSelected={selectedButton === 'manage'}
          onClick={handleMenuClick('manage', '/manage')}
        >
          任务管理
        </MenuLink>
        <MenuLink
          to={'/publish'}
          isSelected={selectedButton === 'publish'}
          onClick={handleMenuClick('publish', '/publish')}
        >
          任务发布
        </MenuLink>
        <MenuLink
          to={'/rankings'}
          isSelected={selectedButton === 'rankings'}
          onClick={handleMenuClick('rankings', '/rankings')}
        >
          排行榜
        </MenuLink>
        <MenuLink
          to={'/forum'}
          isSelected={selectedButton === 'forum'}
          onClick={handleMenuClick('forum', '/forum')}
        >
          赏金论坛
        </MenuLink>
        <MenuLink
          to={'/rules'}
          isSelected={selectedButton === 'rules'}
          onClick={handleMenuClick('rules', '/rules')}
        >
          客栈规则
        </MenuLink>

      </Menu>
      <UserProfileImage
        src="/user.jpg"
        alt="用户信息"
        onClick={() => window.location.href = '/Profile'}
      />
      <ExitLink to={'/'}>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </ExitLink>
      
      {/* <Draggable>
        <FloatingBall onClick={toggleVisibility}>
        
          AI
        </FloatingBall>
      </Draggable>

      <Draggable>
        <ChatBox isMinimized={isMinimized} isVisible={isVisible}>
          <ChatHeader onClick={toggleMinimize}>
            <span>AI 对话</span>
            <FontAwesomeIcon icon={isMinimized ? faWindowMaximize : faWindowMinimize} />
          </ChatHeader>
          {!isMinimized && (
            <>
              {messages.map((msg, index) => (
                <Message key={index} isUser={msg.isUser}>
                  {msg.text}
                </Message>
              ))}
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="输入你的问题..."
              />
              <Button onClick={handleSubmit}>提交</Button>
            </>
          )}
        </ChatBox>
      </Draggable> */}


    </NavBar>
  );
};

export default Header;