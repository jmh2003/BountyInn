
import React from 'react';
import styled from 'styled-components';


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
          <RuleItem>一、角色介绍：在赏金客栈，每位用户都拥有双重身份：既是发布任务的东家，也是接受任务的猎人。</RuleItem>
          <RuleItem>二、操作指南：</RuleItem>
          <RuleItem>  1 积分获取：新用户注册后，将自动获得50积分作为初始资金。积分可用于发布任务和支付给猎人的报酬。</RuleItem>
          <RuleItem>  2 发布任务：东家进入“任务发布”页面，填写任务信息，发布任务。 </RuleItem>
          <RuleItem>  3 接取任务：猎人进入“任务大厅”，根据标签和输入描述筛选任务，查看任务信息，申请心仪的任务，等待东家分配。  </RuleItem>
          <RuleItem>  4 编辑任务：东家在“任务管理”界面，查看所有已发布任务，可以对任务进行编辑或删除。  </RuleItem>
          <RuleItem>  5 指派任务：东家在“任务管理”界面，查看候选猎人，将任务指派给猎人。  </RuleItem>
          <RuleItem>  6 任务提交：猎人在“任务管理”界面的“待办任务”，将自己申请到的待办任务完成，将任务的结果提交，等待东家审核。  </RuleItem>
          <RuleItem>  7 任务评价：东家在“任务管理”界面的“待评论”，对猎人提交的结果进行评价，系统自动完成积分转换。  </RuleItem>
          <RuleItem>三、注意事项：</RuleItem>
          <RuleItem>  1 设置任务赏金，确保不超过账户积分余额。  </RuleItem>
          <RuleItem>  2 任务进行中，东家不可修改任务信息。  </RuleItem>
          <RuleItem>  3 一个任务可以多个猎人申请，最终等待东家分配给某一个猎人。  </RuleItem>
          <RuleItem>  4 东家对任务审核完毕之前，猎人可以重复提交任务的结果 </RuleItem>
          <RuleItem>  5 论坛请勿发表不当言论。对规则有疑问请在论坛留言。   </RuleItem>

        </RulesList>
      </Container>
    </>
  );
};

export default Rules;