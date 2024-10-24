import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 定义样式
const styles = {
  registerContainer: {
    maxWidth: '400px',
    margin: '150px auto',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  registerTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  registerButton: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  loginLink: {
    display: 'block',
    textAlign: 'right',
    marginTop: '15px',
    color: '#007bff',
    cursor: 'pointer',
  },

};

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 使用 navigate 钩子

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username: username,
        password: password
      },{
        headers: {
            'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      navigate('/'); // 注册成功后跳转到登录页面
    } catch (error) {
      console.error(error);
      alert('用户名已经已注册，请更换用户名重试');
    }
  };

  return (
    <div style={styles.registerContainer}>
      <h2 style={styles.registerTitle}>注册账号</h2>
      <form onSubmit={handleRegister}>
        <div style={styles.formGroup}>
          <label>用户名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label>密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <button type="submit" style={styles.registerButton}>
          注册
        </button>

      </form>
      <div style={styles.loginLink} onClick={() => navigate('/')}>
        返回登录
        </div>
    </div>
  );
}

export default Register;
