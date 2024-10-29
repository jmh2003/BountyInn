import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from './Header'; // 引入 Header 组件

const username = localStorage.getItem('username');

// 样式设置
const Container = styled.div`
  display: flex;
  padding: 20px;
  align-items: flex-start;
`;

const TableContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa; /* 设置为浅色背景 */
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`;

const SelectionContainer = styled.div`
  flex: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* 使右边部分占满页面的高度 */
`;

const RankingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff; /* 表格白色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #e3f2fd; /* 表头背景颜色 */
  }
`;

const BlueSelection = styled.div`
  background-color: #e0f7fa; /* 浅蓝色背景 */
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  flex-grow: 2; /* 排行种类部分占更多空间 */
`;

const RedSelection = styled.div`
  background-color: #ffebee; /* 浅红色背景 */
  padding: 20px;
  border-radius: 10px;
  flex-grow: 1; /* 个人排名部分占少一些空间 */
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 100%;
  font-size: 16px;
  background-color: #fff;
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 100%;
  font-size: 16px;
  background-color: #fff;
`;

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  background-color: #26a69a;
  color: white;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #00796b;
  }
`;

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [rankType, setRankType] = useState('剩余积分');
  const [userRank, setUserRank] = useState(null);
  const [userId, setUserId] = useState(''); // 假设用户输入ID或其他标识

  // 获取排名数据
  const fetchRankings = async (type) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/get-rankings/', { rankType: type });
      setRankings(response.data.rankings);
    } catch (error) {
      console.error("获取排名数据失败", error);
    }
  };

  // 获取用户个人排名
  const fetchUserRank = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/get-user-rank/', { rankType, userId });
      setUserRank(response.data.userRank);
    } catch (error) {
      console.error("获取用户排名失败", error);
    }
  };

  useEffect(() => {
    fetchRankings(rankType); // 默认加载剩余积分的排名数据
  }, [rankType]);

  return (
    <div>
      <Header username={username} /> {/* 添加 Header 组件 */}

      <Container>
        <TableContainer>
          <h2>排行榜</h2>
          <RankingsTable>
            <thead>
              <tr>
                <th>序号</th>
                <th>用户ID</th> {/* 新增用户ID列 */}
                <th>名字</th>
                <th>分数</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* 显示排名序号 */}
                  <td>{rank.user_id}</td> {/* 显示用户ID */}
                  <td>{rank.name}</td>
                  <td>{rank.score}</td>
                </tr>
              ))}
            </tbody>
          </RankingsTable>
        </TableContainer>

        <SelectionContainer>
          <BlueSelection>
            <h3>选择排名种类</h3>
            <StyledSelect value={rankType} onChange={(e) => setRankType(e.target.value)}>
              <option value="剩余积分">剩余积分</option>
              <option value="能力分数">能力分数</option>
              <option value="信用分数">信用分数</option>
            </StyledSelect>
          </BlueSelection>

          <RedSelection>
            <h3>查询个人排名</h3>
            <StyledInput
              type="text"
              placeholder="输入你的ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <StyledButton onClick={fetchUserRank}>查询</StyledButton>
            {userRank && (
              <div>
                <p>你的排名: {userRank.rank}</p>
                <p>分数: {userRank.score}</p>
              </div>
            )}
          </RedSelection>
        </SelectionContainer>
      </Container>
    </div>
  );
};

export default Rankings;
