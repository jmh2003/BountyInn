import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = styled.nav`
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const MenuLink = styled(Link)`
  color: white;
  margin: 0 10px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #ffd700; /* 金黄色，用于hover效果 */
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: #ffd700;
  }
`;

const Header = () => {
  return (
    <NavBar>
      <div className="menu">
        <MenuLink to="/tasks">任务大厅</MenuLink>
        <MenuLink to="/publish">发布任务</MenuLink>
        <MenuLink to="/rankings">排行榜</MenuLink>
        <MenuLink to="/Profiles">用户信息</MenuLink>
      </div>
    </NavBar>
  );
};

export default Header;