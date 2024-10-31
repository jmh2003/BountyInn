import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';

// styled-components 定义

const Container = styled.div`
  padding: 20px;
  max-width: 800px; /* 保持原有的最大宽度 */
  margin: auto;
`;

const CommentList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column; /* 单列布局 */
  gap: 20px; /* 每个评论框之间的间隔 */
`;

const CommentItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Nickname = styled.p`
  font-weight: bold;
  margin: 0;
`;

const Timestamp = styled.p`
  color: #888;
  font-size: 12px;
  margin: 0;
`;

const Content = styled.p`
  margin-top: 10px;
  text-indent: 2em;
  text-align: left;
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  margin-top: 30px; /* 将搜索框向下移动 */
  padding: 12px 20px;
  width: 100%;
  max-width: 600px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 30px; /* 圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  outline: none;
  transition: all 0.3s ease; /* 过渡效果 */

  &:focus {
    border-color: #007bff; /* 聚焦时改变边框颜色 */
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2); /* 聚焦时加大阴影 */
  }

  &::placeholder {
    color: #aaa; /* 占位符颜色 */
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #1aad19;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
  margin-top: 10px;
  width: 150px;
  align-self: flex-end;

  &:hover {
    background-color: #179b16;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    width: 100%;
    align-self: stretch;
  }
`;

// 主组件

function Forum() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [newComment, setNewComment] = useState({ comment_content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username') || '';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, comments]);

  /**
   * 获取评论数据
   */
  const fetchComments = async () => {
    setLoading(true);
    try {
      // 如果后端支持根据搜索词过滤，可以在此处传递参数
      // const params = {};
      // if (searchTerm) params.search = searchTerm;
      // const res = await axios.get('http://127.0.0.1:8000/api/comments/', { params });

      // 假设后端不支持搜索过滤，则获取所有评论并在前端过滤
      const res = await axios.get('http://127.0.0.1:8000/api/comments/');
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("获取评论失败", err);
      setError("无法获取评论");
      setLoading(false);
    }
  };

  /**
   * 应用搜索过滤
   */
  const applyFilters = () => {
    if (!searchTerm) {
      setFilteredComments(comments);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = comments.filter(comment =>
      comment.comment_nickname.toLowerCase().includes(lowerSearch) ||
      comment.comment_content.toLowerCase().includes(lowerSearch)
    );
    setFilteredComments(filtered);
  };

  /**
   * 处理发布新评论
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 如果用户名不存在，提示错误
    if (!username) {
      setError("请输入昵称");
      return;
    }

    const commentData = {
      comment_nickname: username,
      comment_content: newComment.comment_content,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/comments/', commentData);
      setNewComment({ comment_content: '' });
      fetchComments(); // 刷新评论列表
      setError(null);
    } catch (err) {
      console.error("发布评论失败", err);
      setError("无法发布评论");
    }
  };

  /**
   * 处理搜索输入的变化
   */
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h2>论坛</h2>

      {/* 查询部分 */}
      <SearchInput
        type="text"
        placeholder="按用户名或评论内容查询..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* 评论列表部分 */}
      <CommentList>
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <CommentItem key={comment.comment_id}>
              <CommentHeader>
                <Nickname>{comment.comment_nickname}</Nickname>
                <Timestamp>{new Date(comment.created_at).toLocaleString()}</Timestamp>
              </CommentHeader>
              <Content>{comment.comment_content}</Content>
            </CommentItem>
          ))
        ) : (
          <p>没有找到评论。</p>
        )}
      </CommentList>

      {/* 发布评论部分 */}
      <Form onSubmit={handleSubmit}>
        <TextArea
          placeholder="留言内容"
          value={newComment.comment_content}
          onChange={(e) => setNewComment({ ...newComment, comment_content: e.target.value })}
          required
        ></TextArea>
        <Button type="submit">发布留言</Button>
      </Form>
    </Container>
  );
}

export default Forum;
