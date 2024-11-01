import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

// 定义样式
const styles = {
  backgroundImage: {
    backgroundImage: `url('/login.png')`,
    backgroundSize: 'cover', // 使用 'cover' 使背景图覆盖整个容器
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'fixed', // 固定背景图
    top: 0,
    left: 0,
    width: '100%', // 让宽度为 100%
    height: '100%', // 让高度为 100%
    zIndex: -1, // 确保背景在最底层
  }, 
  registerContainer: {
    maxWidth: '300px',
    maxHeight: '500px',
    margin: '100px auto',
    padding: '30px 50px 100px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))', // 渐变背景，边缘更黑
    //opacity: 0.7, // 背景透明度
    transition: 'all 0.3s ease',
  },
  WebTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '44px',
    fontWeight: 'bold',
    //background: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)', // 设置您想要的渐变背景
    background: 'linear-gradient(120deg, rgb(250,247,171) 0%, #FFD700 100%)', 
    WebkitBackgroundClip: 'text', // 剪裁背景到文本
    color: 'transparent', // 文字颜色设置为透明
   
  },
  registerTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formInput: {
    width: '70%',
    padding: '10px',
    border: 'none',
    borderBottom: '3px solid white',
    boxShadow: 'none',
    transition: 'border-color 0.02s',
    backgroundColor: 'transparent',
    zIndex: 1,
    outline: 'none',
    color: 'white',
    opacity: 0.8,
    fontSize: '14px',
  },
  formInputFocus: {
    borderColor: '1px solid white',
    outline: 'none',
  },
  registerButton: {
    marginBottom: '20px',
    width: '50%',
    textAlign: 'center',
    padding: '10px',
    border: 'none',
    borderRadius: '20px',
   // background: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
    background: 'linear-gradient(120deg, rgb(250,247,171) 0%, #FFD700 100%)', 
    color: 'black',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginButtonHover: {
    backgroundColor: '#0056b3',
  },
  loginLink: {
    display: 'block',
    bottom: '10px',
    left: '95%',
    textAlign: 'right',
    marginTop: '15px',
    color: 'white',
    opacity: 0.6,
    cursor: 'pointer',
    fontSize: '12px',
    textDecoration: 'underline',
  },

  modalBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'left',
  },
  modalButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },

};

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 使用 navigate 钩子
  const [showRules, setShowRules] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/register/`, {
        username: username,
        password: password
      },{
        headers: {
            'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      // navigate('/'); // 注册成功后跳转到登录页面
      setShowRules(true); // 注册成功后显示规则
    } catch (error) {
      console.error(error);
      alert('用户名已经已注册，请更换用户名重试');
    }
  };

  const handleCloseRules = () => {
    setShowRules(false);
    navigate('/'); // 关闭规则后返回登录页面
  };

  return (
    <div style={styles.backgroundImage}>
      <div style={styles.registerContainer}>
        <h2 style={styles.WebTitle}>BOUNTY INN</h2>
        <h2 style={styles.registerTitle}>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <i className="fas fa-user" style={{ color: 'white', marginRight: '10px' }}></i> {/* 用户图标 */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.formInput}
              placeholder="UserName"
            />
          </div>
          <div style={styles.formGroup}>
            <i className="fas fa-lock" style={{ color: 'white', marginRight: '10px' }}></i> {/* 锁图标 */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.formInput}
              placeholder='UserPassword'
            />
          </div>
          <button type="submit" style={styles.registerButton}>
            Sign up
          </button>

        </form>
        <div style={styles.loginLink} onClick={() => navigate('/')}>
          Back
          </div>
      </div>


      {showRules && (
        <div style={styles.modalBackground}>
          <div style={styles.modalContent}>
            <h3>客栈规则</h3>
            <ol>
              <li>新顾客注册东家可在本客栈领取五十积分启动资金，可用于发布任务；</li>
              <li>东家可在任务发布处发布任务，东家需要选择合适的标签、表述完善任务内容以更好的展示给猎人，并需要牢记自己的资金，以确保给予猎人的报酬不要超过自己的资金。</li>
              <li>东家可在任务管理处管理自己发布的任务：包括编辑任务信息、删除任务、查看任务进度、选择心仪的猎人。但是东家不可以在任务进行中修改任务信息。</li>
              <li>猎人可在任务大厅接取自己心仪的任务，本客栈任务大厅支持筛选标签功能，以便于猎人寻找任务。</li>
              <li>任务完成后，猎人可在任务管理处提交任务，待东家在任务管理处确认任务完成情况、给予反馈后可领取赏金。</li>
              <li>论坛是本客栈提供给顾客交流的平台。请避免一些不当言论引发冲突。任何可能引发矛盾的言语在尝试发布时就应当予以禁止。</li>
            </ol>
            <button style={styles.modalButton} onClick={handleCloseRules}>确定</button>
          </div>
        </div>
      )}



    </div>
  );
}

export default Register;
