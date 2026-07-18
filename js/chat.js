// chat.js — AI chat floating widget

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('chatFab');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  if (!fab || !chatWindow) return;

  // Toggle chat window
  fab.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  });

  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Send message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      typing.remove();
      const response = getResponse(text);
      appendMessage(response, 'bot');
    }, 1200 + Math.floor(Math.random() * 800));
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function appendMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Mock responses based on keywords
  function getResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('他克莫司') || lower.includes('tacrolimus')) {
      return '他克莫司胶囊是健耕医药的核心产品之一，属于免疫抑制剂类药物。主要用于器官移植术后的抗排斥反应治疗。目前我司生产的是仿制药，规格为0.5mg和1mg胶囊。';
    }
    if (lower.includes('集采') || lower.includes('竞标') || lower.includes('价格')) {
      return '根据最新集采政策，第九批集采中他克莫司胶囊共有12家企业参与，7家中标。建议您查看"竞标价格预测"板块了解我们的定价模型分析结果。';
    }
    if (lower.includes('netsuite') || lower.includes('erp') || lower.includes('财务')) {
      return '健耕已通过Qoder的MCP接口完成与NetSuite ERP的集成。目前支持：应付账款查询、账单审核数据拉取、财务报表BI分析、供应商信息同步等功能。';
    }
    if (lower.includes('薛武军') || lower.includes('客户')) {
      return '薛武军教授是西安交通大学第一附属医院肾脏病医院院长，在器官移植和免疫抑制领域有深厚积累。系统已标记其为A+级合作契合度客户。建议关注其最新的机器灌注相关研究。';
    }
    if (lower.includes('mcp') || lower.includes('接口') || lower.includes('集成')) {
      return 'MCP（模型上下文协议）是一种标准化接口协议，类似"万能插头"。通过MCP，Qoder可以安全连接企业内部的ERP、OA、CRM等系统，实现数据拉取和业务操作，无需为每个系统单独开发对接。';
    }
    if (lower.includes('qoder') || lower.includes('ai')) {
      return 'Qoder是公司已采购的企业级AI助手（阿里云部署），支持MCP标准集成接口。当前已实现：NetSuite财务系统集成、智能文档审核、知识库问答等场景。';
    }
    return '感谢您的提问。我可以帮您查询公司产品信息、财务数据、客户资料、AI集成方案等。您可以尝试问我关于"他克莫司"、"集采竞标"、"NetSuite集成"或"客户画像"等话题。';
  }
});
