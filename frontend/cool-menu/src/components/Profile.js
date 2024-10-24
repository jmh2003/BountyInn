import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const Profile = () => {
  const location = useLocation(); // 获取当前位置
  const queryParams = new URLSearchParams(location.search); // 创建查询参数对象
  const username = queryParams.get('username'); // 获取 username 值

  return (
    <div>
      <Header username={username} />
      <div>
        <h1>{username} 的用户信息</h1>
        {/* 用户信息展示区域，可以添加更多的用户信息 */}
        <p>这里是关于用户 {username} 的更多信息...</p>
      </div>
    </div>
  );
};

export default Profile;
