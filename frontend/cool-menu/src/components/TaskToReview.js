// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ManageTask.css';
// import styled from 'styled-components';
// import Header from './Header';


// // 样式定义
// const TaskListContainer = styled.div`
//   padding: 20px;
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 20px;

//   @media (max-width: 1024px) {
//     grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   }

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const TaskCard = styled.div`
//   border: 1px solid #ccc;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   background-color: ${(props) => props.backgroundColor || '#fff'};
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;

// const TaskTitle = styled.h3`
//   font-size: 20px;
//   font-weight: bold;
//   margin-bottom: 10px;
// `;

// const TaskMeta = styled.div`
//   font-size: 14px;
//   color: #555;
//   margin-bottom: 20px;
// `;

// const TaskButton = styled.button`
//   padding: 10px 15px;
//   font-size: 14px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const ModalBackground = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const ModalContent = styled.div`
//   background-color: white;
//   padding: 30px;
//   border-radius: 10px;
//   width: 90%;
//   max-width: 600px;
// `;

// const InputLabel = styled.label`
//   display: block;
//   margin-bottom: 5px;
//   font-weight: bold;
// `;

// const EditTaskInput = styled.input`
//   margin-bottom: 15px;
//   padding: 10px;
//   width: 100%;
//   height: 40px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// `;

// const EditTaskTextarea = styled.textarea`
//   margin-bottom: 15px;
//   padding: 10px;
//   width: 100%;
//   height: 100px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   resize: vertical;
// `;

// const ErrorMessage = styled.div`
//   color: red;
//   margin-bottom: 15px;
// `;

// // const getTaskBackgroundColor = (tag) => {
// //   switch (tag.toLowerCase()) {
// //     case 'learning':
// //       return '#e0f7fa';
// //     case 'job':
// //       return '#fff9c4';
// //     case 'else':
// //       return '#c8e6c9';
// //     default:
// //       return '#ffffff';
// //   }
// // };

// // 辅助函数
// const getTaskBackgroundColor = (is_reviewed) => {
 
//   if (is_reviewed) {
//     return 'rgb(255,242,202)'; // 绿色
//   }
//   return 'rgb(227,242,217)'; // 橙色
// };

// // 主组件
// const TaskToReview = () => {
//   const username = localStorage.getItem('username');
//   // 如果需要用户ID，确保从localStorage中获取
//   // const userId = localStorage.getItem('user_id');

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [editTask, setEditTask] = useState(null);
//   const [editTaskData, setEditTaskData] = useState({ rating: '', comment: '' });
//   const [submitError, setSubmitError] = useState(null);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/tasks_for_review/?username=${username}`);
//         const validTasks = response.data.filter((task) => task.task_status);
//         setTasks(validTasks);
//         setLoading(false);
//       } catch (err) {
//         setFetchError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [username]);

//   const handleEditClick = (task) => {
//     setEditTask(task);
//     setEditTaskData({ rating: '', comment: '' 
//       ,is_reviewed: task.is_reviewed,

//     });
//     setSubmitError(null);
//   };

//   const handleEditSubmit = async () => {
//     const { rating, comment ,is_reviewed} = editTaskData;
  
//     if (!rating || !comment.trim()) {
//       setSubmitError('评分和评论不能为空。');
//       return;
//     }

//     if (is_reviewed) {
//       alert('Task has been reviewed. You cannot edit the outcome.');
//       return;
//     }
//       // 打印 reviewer_id 以进行调试
//     console.log('Reviewer ID:', editTask.creator_id);
  
//     const payload = {
//       task_id: editTask.task_id,
//       reviewee_id: editTask.assignee_id,
//       reviewer_id: editTask.creator_id, // 确保 editTask.creator_id 有效
     
//       rating: parseInt(rating, 10),
//       comment: comment.trim(),
//       hjm:200
//     };
  
//     console.log('Submitting review with payload:', payload); // 调试用
  
//     try {
//       const response = await axios.post(`http://127.0.0.1:8000/api/submit_review/`, payload);
//       console.log('Review submitted successfully:', response.data);
//       setEditTask(null);
//       const updatedTasks = tasks.filter(task => task.task_id !== editTask.task_id);
//       setTasks(updatedTasks);
//       setSubmitError(null);
//     } catch (error) {
//       console.error('提交评价时出错:', error);
//       setSubmitError('提交评价时出错，请稍后再试。');
//     }
//   };

//   if (loading) {
//     return <div>加载中...</div>;
//   }

//   if (fetchError) {
//     return <div>加载任务时出错: {fetchError}</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <TaskListContainer>
//         {tasks.length > 0 ? (
//           tasks.map((task) => (
//             <TaskCard key={task.task_id} backgroundColor={getTaskBackgroundColor(task.is_reviewed)}>
//               <div>
//                 <TaskTitle>{task.task_title}</TaskTitle>
//                 <TaskMeta>
//                   <span><strong>状态:</strong> {task.task_status}</span>
//                   <p><strong>截止日期:</strong> {new Date(task.deadline).toLocaleString()}</p>
//                 </TaskMeta>
//               </div>
//               <TaskButton onClick={() => handleEditClick(task)}>评价任务</TaskButton>
//             </TaskCard>
//           ))
//         ) : (
//           <p>未找到任务。</p>
//         )}
//       </TaskListContainer>

//       {editTask && (
//         <ModalBackground onClick={() => setEditTask(null)}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <h3>提交任务评价</h3>
//             {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
//             <div>
//               <InputLabel>评分:</InputLabel>
//               <EditTaskInput
//                 type="number"
//                 min="1"
//                 max="5"
//                 value={editTaskData.rating}
//                 onChange={(e) => setEditTaskData({ ...editTaskData, rating: e.target.value })}
//                 placeholder="输入评分 (1-5)"
//               />
//             </div>
//             <div>
//               <InputLabel>评论:</InputLabel>
//               <EditTaskTextarea
//                 value={editTaskData.comment}
//                 onChange={(e) => setEditTaskData({ ...editTaskData, comment: e.target.value })}
//                 placeholder="输入评论"
//               />
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//               <TaskButton onClick={handleEditSubmit}>提交</TaskButton>
//               <TaskButton onClick={() => setEditTask(null)}>取消</TaskButton>
//             </div>
//           </ModalContent>
//         </ModalBackground>
//       )}
//     </div>
//   );
// };

// export default TaskToReview;


//////////////////////////上面的代码是可以跑的



























import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageTask.css';
import styled from 'styled-components';
import Header from './Header';

const EditTaskTextarea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;


const TaskListContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
`;


const getTaskBackgroundColor = (is_reviewed) => {
  return is_reviewed ? 'rgb(255,242,202)' : 'rgb(227,242,217)'; // Modify as needed
};

const Task = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${props => getTaskBackgroundColor(props.is_reviewed)};
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TaskTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

const TaskMeta = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const TaskButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  margin-top: 30px;
  padding: 12px 20px;
  width: 100%;
  max-width: 600px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const EditTaskInput = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const FilterButton = styled.button`
  padding: 10px;
  font-size: 14px;
  background-color: ${props => (props.active ? '#28a745' : '#007bff')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: auto;
  margin: 0 5px;

  &:hover {
    background-color: ${props => (props.active ? '#218838' : '#0056b3')};
  }
`;


const ManageTasks = () => {
  const username = localStorage.getItem('username');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/api/tasks_for_review/?username=${username}`);
  //       setTasks(response.data.filter(task => task.task_status));
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchTasks();
  // }, [username]);

    useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks_for_review/?username=${username}`);
        const validTasks = response.data.filter((task) => task.task_status);
        setTasks(validTasks);
        setLoading(false);
      } catch (err) {
        setFetchError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [username]);

  const filteredTasks = tasks.filter(task =>
    (selectedTag === 'All' || task.task_tag.toLowerCase() === selectedTag.toLowerCase()) &&
    (task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tags = ['All', ...new Set(tasks.map(task => task.task_tag).filter(tag => tag !== 'Else')), 'Else'];



  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTaskData({ rating: '', comment: '' 
      ,is_reviewed: task.is_reviewed,

    });
    setSubmitError(null);
  };

  const handleEditSubmit = async () => {
    const { rating, comment ,is_reviewed} = editTaskData;
  
    if (!rating || !comment.trim()) {
      setSubmitError('评分和评论不能为空。');
      return;
    }

    if (is_reviewed) {
      alert('Task has been reviewed. You cannot edit the review.');
      return;
    }
      // 打印 reviewer_id 以进行调试
    console.log('Reviewer ID:', editTask.creator_id);
  
    const payload = {
      task_id: editTask.task_id,
      reviewee_id: editTask.assignee_id,
      reviewer_id: editTask.creator_id, // 确保 editTask.creator_id 有效
     
      rating: parseInt(rating, 10),
      comment: comment.trim(),
      hjm:200
    };
  
    console.log('Submitting review with payload:', payload); // 调试用
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/submit_review/`, payload);
      console.log('Review submitted successfully:', response.data);
      setEditTask(null);
      const updatedTasks = tasks.filter(task => task.task_id !== editTask.task_id);
      setTasks(updatedTasks);
      setSubmitError(null);
    } catch (error) {
      console.error('提交评价时出错:', error);
      setSubmitError('提交评价时出错，请稍后再试。');
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (fetchError) {
    return <div>加载任务时出错: {fetchError}</div>;
  }



  return (
    <div>
      <Header />
      <SearchInput
        type="text"
        placeholder="搜索任务..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FilterContainer>
        {tags.map(tag => (
          <FilterButton
            key={tag}
            active={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </FilterButton>
        ))}
      </FilterContainer>
      
      <TaskListContainer>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Task key={task.task_id} tag={task.task_tag}>
              <TaskTitle>{task.task_title}</TaskTitle>
              <TaskMeta>
                <span><strong>Tag:</strong> {task.task_tag}</span>
                <span><strong>Reward Points:</strong> {task.reward_points}</span>
                <span><strong>Status:</strong> {task.task_status}</span>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
              </TaskMeta>
              <TaskButton onClick={() => setSelectedTask(task)}>View Details</TaskButton>
              <TaskButton onClick={() => handleEditClick(task)}>Submit Task review</TaskButton>
            </Task>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </TaskListContainer>

      {/* Task Details Modal */}
      {selectedTask && (
        <ModalBackground onClick={() => setSelectedTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.task_title}</h3>
            <p>{selectedTask.task_description}</p>
            <TaskMeta>
              <span><strong>Tag:</strong> {selectedTask.task_tag}</span>
              <span><strong>Reward Points:</strong> {selectedTask.reward_points}</span>
              <span><strong>Status:</strong> {selectedTask.task_status}</span>
              <span><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleString()}</span>
              <p><strong>Candidates:</strong> {selectedTask.candidates && selectedTask.candidates.length > 0 ? selectedTask.candidates.join(', ') : 'nobody'}</p>
            </TaskMeta>
            <TaskButton onClick={() => setSelectedTask(null)}>Close</TaskButton>
          </ModalContent>
        </ModalBackground>
      )}


       {editTask && (
        <ModalBackground onClick={() => setEditTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>提交任务评价</h3>
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            <div>
              <InputLabel>评分:</InputLabel>
              <EditTaskInput
                type="number"
                min="1"
                max="5"
                value={editTaskData.rating}
                onChange={(e) => setEditTaskData({ ...editTaskData, rating: e.target.value })}
                placeholder="输入评分 (1-5)"
              />
            </div>
            <div>
              <InputLabel>评论:</InputLabel>
              <EditTaskTextarea
                value={editTaskData.comment}
                onChange={(e) => setEditTaskData({ ...editTaskData, comment: e.target.value })}
                placeholder="输入评论"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <TaskButton onClick={handleEditSubmit}>提交</TaskButton>
              <TaskButton onClick={() => setEditTask(null)}>取消</TaskButton>
            </div>
          </ModalContent>
        </ModalBackground>
      )}

      {/* {editTask && (
        <ModalBackground onClick={() => setEditTask(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>提交任务评价</h3>
            <EditTaskInput
              value={editTaskData.comment}
              onChange={(e) => setEditTaskData({ ...editTaskData, comment: e.target.value })}
              placeholder="输入评论"
            />
            <TaskButton onClick={handleEditSubmit}>提交</TaskButton>
            <TaskButton onClick={() => setEditTask(null)}>取消</TaskButton>
          </ModalContent>
        </ModalBackground>
      )} */}
    </div>
  );
};

export default ManageTasks;
