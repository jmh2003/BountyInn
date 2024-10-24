import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// 如果使用FontAwesome, 请确保安装并导入相应的组件
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // 导入退出图标

const NavBar = styled.nav`
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 纵向居中对齐 */
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Menu = styled.div`
  display: flex;
  justify-content: flex-start; /* 更改为左对齐 */
  flex-grow: 1; /* 让菜单项占据可用空间 */
`;

const MenuLink = styled(Link)`
  color: white;
  margin: 0 30px; /* 增加左右的间距 */
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffd700; /* 金黄色，用于hover效果 */
  }
`;

const ExitLink = styled(Link)`
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin-left: 30px;
  margin-right: 10px;
`;

const Header = ({ username }) => {
  return (
    <NavBar>
      <Menu>
        <MenuLink to={`/tasks?username=${encodeURIComponent(username)}`}>任务大厅</MenuLink>
        <MenuLink to={`/manage?username=${encodeURIComponent(username)}`}>任务管理</MenuLink>
        <MenuLink to={`/publish?username=${encodeURIComponent(username)}`}>任务发布</MenuLink>
        <MenuLink to={`/rankings?username=${encodeURIComponent(username)}`}>排行榜</MenuLink>
        <MenuLink to={`/Profile?username=${encodeURIComponent(username)}`}>用户信息</MenuLink>
      </Menu>
      <ExitLink to={'/'}>
        <FontAwesomeIcon icon={faSignOutAlt} /> {/* 添加图标 */}
        退出
      </ExitLink>
    </NavBar>
  );
};

export default Header;
