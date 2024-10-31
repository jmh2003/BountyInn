

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';

// styled-components 定义

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

// const CommentItem = styled.div`
//   border-bottom: 1px solid #ddd;
//   padding: 10px 0;
// `;




const CommentItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 800px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: none;
  }
`;

// 主组件

function Forum() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ comment_content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username') || '';
  const [filter, setFilter] = useState({ search: '', start_date: '', end_date: '' });
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      fetchComments();
    }, 500); // 延迟500ms执行
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search, filter.start_date, filter.end_date]);

  /**
   * 根据当前的过滤条件获取评论
   */
  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.search) params.search = filter.search;
      if (filter.start_date) params.start_date = filter.start_date;
      if (filter.end_date) params.end_date = filter.end_date;

      const res = await axios.get('http://127.0.0.1:8000/api/comments/', { params });
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("获取评论失败", err);
      setError("无法获取评论");
      setLoading(false);
    }
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
   * 处理过滤条件的变化
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  /**
   * 重置过滤条件，显示所有评论
   */
  const handleResetFilter = () => {
    setFilter({ search: '', start_date: '', end_date: '' });
    setLoading(true);
    fetchComments();
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <Container>
        <h2>论坛</h2>

        {/* 查询过滤部分 */}
        <FilterContainer>
          <SearchForm>
            <SearchInput
              type="text"
              name="search"
              placeholder="按用户名或评论内容查询"
              value={filter.search}
              onChange={handleFilterChange}
            />
           
            {/* 实时搜索无需提交按钮，可以保留或移除 */}
            {/* <Button type="submit">查询</Button> */}
            
            {/* 保留重置按钮 */}
            <Button type="button" onClick={handleResetFilter}>
              重置查询
            </Button>
          </SearchForm>
        </FilterContainer>


        {/* 评论列表部分 */}
       <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment.comment_id}>
              <CommentHeader>
                <Nickname>{comment.comment_nickname}</Nickname>
                <Timestamp>{new Date(comment.created_at).toLocaleString()}</Timestamp>
              </CommentHeader>
              <Content>{comment.comment_content}</Content>
            </CommentItem>
          ))}
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
    </div>
  );
}

export default Forum;
