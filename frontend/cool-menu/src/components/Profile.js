import React from 'react';
import Header from './Header';

const Profile = () => {
  const username = localStorage.getItem('username');
  
  return (
    <div>
      <Header />
      <div>
        <h1>{username} 的用户信息</h1>
        {/* 用户信息展示区域，可以添加更多的用户信息 */}
        <p>这里是关于用户 {username} 的更多信息...</p>
      </div>
    </div>
  );
};

export default Profile;
