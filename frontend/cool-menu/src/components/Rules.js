// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';
// import Header from './Header';

// // styled-components 定义

// // 背景组件
// const Background = styled.div`
//   background-image: url('/inn.jpg'); /* 确保图片位于 public 文件夹 */
//   background-size: cover;
//   background-repeat: no-repeat;
//   background-position: center;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: -1;
// `;



// // 内容容器
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
  
//   padding: 40px;
//   max-width: 1000px;
//   margin: 20px auto;
//   background-color: rgba(255, 255, 255, 0.8); /* 半透明背景提升可读性 */
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
//   font-family: 'Times New Roman', Times, serif;
//   color: #333;
//   min-height: 100vh;
// `;

// const Title = styled.h2`
//   text-align: center;
//   color: #333;
//   margin-bottom: 20px;
// `;

// const RulesList = styled.ol`
//   list-style-type: decimal;
//   padding-left: 20px;
// `;

// const RuleItem = styled.li`
//   text-align: left;
//   margin-bottom: 10px;
//   line-height: 1.6;
//   color: #555;
// `;

// const CommentList = styled.div`
//   margin-top: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;

// const CommentItem = styled.div`
//   border: 1px solid #ddd;
//   border-radius: 8px;
//   padding: 15px;
//   background-color: #fff;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// `;


// const CommentHeader = styled.div`
//   display: flex;
// `;

// const Rules = () => {
//   return (

//     <Container>
//       <Title>客栈规则</Title>
     
//       <RulesList>
//         <RuleItem>新顾客注册东家可在本客栈领取五十积分启动资金，可用于发布任务；</RuleItem>
//         <RuleItem>东家可在任务发布处发布任务，东家需要选择合适的标签、表述完善任务内容以更好的展示给猎人，并需要牢记自己的资金，以确保给予猎人的报酬不要超过自己的资金。</RuleItem>
//         <RuleItem>东家可在任务管理处管理自己发布的任务：包括编辑任务信息、删除任务、查看任务进度、选择心仪的猎人。但是东家不可以在任务进行中修改任务信息。</RuleItem>
//         <RuleItem>猎人可在任务大厅接取自己心仪的任务，本客栈任务大厅支持筛选标签功能，以便于猎人寻找任务。</RuleItem>
//         <RuleItem>任务完成后，猎人可在任务管理处提交任务，待东家在任务管理处确认任务完成情况、给予反馈后可领取赏金。</RuleItem>
//         <RuleItem>论坛是本客栈提供给顾客交流的平台。请避免一些不当言论引发冲突。任何可能引发矛盾的言语在尝试发布时就应当予以禁止。</RuleItem>
//       </RulesList>
     
//     </Container>
//   );
// };

// export default Rules;


import React from 'react';
import styled from 'styled-components';
import Header from './Header';

// 背景组件
const Background = styled.div`
  background-image: url('/inn.jpg'); /* 确保图片位于 public 文件夹 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

// 内容容器
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  padding: 40px;
  max-width: 800px;
  margin: 20px auto;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景提升可读性 */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-family:  '宋体', 'SimSun', 'Songti SC', serif;
  color: #333;
  min-height: 60vh;
`;

const Title = styled.h2`
  text-align: center;
  color: #000;
`;

const RulesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RuleItem = styled.li`
  text-align: left;
  margin-bottom: 10px;
  line-height: 1.6;
  color: #000;
`;

const Rules = () => {
  return (
    <>
      <Background />
      <Container>

        <Title>客栈规则</Title>
        <RulesList>
          <RuleItem>新顾客注册东家可在本客栈领取五十积分启动资金，可用于发布任务；</RuleItem>
          <RuleItem>东家可在任务发布处发布任务，东家需要选择合适的标签、表述完善任务内容以更好的展示给猎人，并需要牢记自己的资金，以确保给予猎人的报酬不要超过自己的资金。</RuleItem>
          <RuleItem>东家可在任务管理处管理自己发布的任务：包括编辑任务信息、删除任务、查看任务进度、选择心仪的猎人。但是东家不可以在任务进行中修改任务信息。</RuleItem>
          <RuleItem>猎人可在任务大厅接取自己心仪的任务，本客栈任务大厅支持筛选标签功能，以便于猎人寻找任务。</RuleItem>
          <RuleItem>任务完成后，猎人可在任务管理处提交任务，待东家在任务管理处确认任务完成情况、给予反馈后可领取赏金。</RuleItem>
          <RuleItem>论坛是本客栈提供给顾客交流的平台。请避免一些不当言论引发冲突。任何可能引发矛盾的言语在尝试发布时就应当予以禁止。</RuleItem>
        </RulesList>
      </Container>
    </>
  );
};

export default Rules;