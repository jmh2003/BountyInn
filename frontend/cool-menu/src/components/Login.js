import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 定义样式
const styles = {
    loginContainer: {
      maxWidth: '400px',
      maxHeight: '250px',
      margin: '150px auto',
      padding: '30px 50px 100px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      transition: 'all 0.3s ease',
    },
    loginTitle: {
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
      transition: 'border-color 0.2s',
    },
    formInputFocus: {
      borderColor: '#007bff',
      outline: 'none',
    },
    loginButton: {
      width: '100%',
      textAlign: 'center',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    loginButtonHover: {
      backgroundColor: '#0056b3',
    },
    registerLink: {
      display: 'block',
      textAlign: 'right',
      marginTop: '15px',
      color: '#007bff',
      cursor: 'pointer',
    },
  };

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 使用 navigate 钩子

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username: username,
        password: password
      });
      console.log(response.data);
      navigate(`/homepage?username=${encodeURIComponent(username)}`); // 登录成功后跳转到 /homepage
    } catch (error) {
      console.error(error);
      alert('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h2 style={styles.loginTitle}>欢迎登录</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.formGroup}>
          <label>用户名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.formInput}
            onFocus={(e) => e.target.style.borderColor = styles.formInputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = ''}
          />
        </div>
        <div style={styles.formGroup}>
          <label>密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.formInput}
            onFocus={(e) => e.target.style.borderColor = styles.formInputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = ''}
          />
        </div>
        <button
          type="submit"
          style={styles.loginButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.loginButtonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.loginButton.backgroundColor}
        >
          登录
        </button>
      </form>
      <div style={styles.registerLink} onClick={() => navigate('/register')}>
        注册账号
      </div>
    </div>
  );
}

export default Login;
