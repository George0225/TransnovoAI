// section5.js — R&D Knowledge Base Q&A Demo

(function() {
  var rdkbResponses = {
    '肾脏灌注机的设计输入有哪些关键性能指标？': {
      sources: ['DHF-2023-KP-001.pdf', 'Design Input Spec v3.2.docx'],
      answer: '根据《肾脏灌注机设计输入规范》(DHF-2023-KP-001)，关键性能指标包括：\n\n<strong>1. 温度控制</strong>：灌注温度精度 ±0.5°C（4-37°C范围可调）\n<strong>2. 流量控制</strong>：灌注流量 0-500mL/min，精度 ±5%\n<strong>3. 压力监测</strong>：实时动脉压/静脉压监测，报警阈值可设定\n<strong>4. 氧合能力</strong>：pO₂维持 >150mmHg\n<strong>5. 续航时间</strong>：连续灌注 ≥24h\n<strong>6. 生物相容性</strong>：管路材料符合ISO 10993系列标准\n\n📎 来源文档已标注，可点击跳转查看原文。'
    },
    '低温保存液的生物相容性验证报告在哪里？': {
      sources: ['VR-BIO-2024-003.pdf', 'ISO10993-Test-Report.pdf'],
      answer: '低温保存液的生物相容性验证报告位于以下位置：\n\n<strong>📁 路径：</strong>质量管理部 / 验证报告 / 生物相容性 /\n\n<strong>相关文件：</strong>\n• VR-BIO-2024-003.pdf — 细胞毒性试验（ISO 10993-5），结论：合格\n• VR-BIO-2024-004.pdf — 皮内反应试验（ISO 10993-10），结论：合格\n• VR-BIO-2024-005.pdf — 急性全身毒性（ISO 10993-11），结论：合格\n• VR-BIO-2024-006.pdf — 溶血试验（ISO 10993-4），溶血率 <1%\n\n<strong>验证状态：</strong>✅ 全部通过，已归档到DHF\n<strong>有效期：</strong>2024.03-2027.03（3年有效期）'
    },
    '器械注册申报需要准备哪些临床评价资料？': {
      sources: ['REG-Guide-2024.pdf', 'NMPA-Clinical-Eval-Template.docx'],
      answer: '根据《医疗器械临床评价技术指导原则》和公司注册部归档模板：\n\n<strong>必备资料清单：</strong>\n1. 📄 临床评价报告（含等同器械对比）\n2. 📄 等同器械的临床数据汇总\n3. 📄 文献检索报告（PubMed/CNKI/万方）\n4. 📄 临床使用风险受益分析\n5. 📄 产品与等同器械对比表（技术/生物学/临床）\n\n<strong>如需临床试验（III类器械）另需：</strong>\n6. 📄 临床试验方案\n7. 📄 伦理审查批件\n8. 📄 知情同意书模板\n9. 📄 临床试验报告\n\n💡 提示：肾脏灌注机属于III类器械，建议走临床试验路径。模板见注册法规部共享文件夹。'
    }
  };

  var defaultResponse = '正在检索相关文档...\n\n根据知识库中的资料，已为您找到相关内容。在实际部署环境中，AI会基于RAG检索精确匹配文档段落并生成回答。\n\n当前为演示模式，完整功能需本地部署后体验。';

  window.askRdkb = function(question) {
    var input = document.getElementById('rdkbInput');
    var messages = document.getElementById('rdkbMessages');
    var suggestions = document.getElementById('rdkbSuggestions');
    if (!messages) return;

    var q = question || (input ? input.value.trim() : '');
    if (!q) return;
    if (input) input.value = '';
    if (suggestions) suggestions.style.display = 'none';

    // Add user message
    var userDiv = document.createElement('div');
    userDiv.className = 'rdkb-msg user';
    userDiv.innerHTML = '<div class="rdkb-msg-avatar">我</div><div class="rdkb-msg-content">' + q + '</div>';
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;

    // Simulate thinking delay
    var thinkDiv = document.createElement('div');
    thinkDiv.className = 'rdkb-msg bot';
    thinkDiv.innerHTML = '<div class="rdkb-msg-avatar">AI</div><div class="rdkb-msg-content" style="color:var(--text-muted);"><span class="rdkb-thinking">检索文档中</span></div>';
    messages.appendChild(thinkDiv);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(function() {
      messages.removeChild(thinkDiv);

      var response = rdkbResponses[q] || { sources: ['相关文档'], answer: defaultResponse };

      var botDiv = document.createElement('div');
      botDiv.className = 'rdkb-msg bot';
      var sourcesHtml = response.sources.map(function(s) {
        return '<span style="display:inline-block; padding:2px 8px; background:rgba(108,60,224,0.08); border-radius:4px; font-size:10px; font-family:var(--font-mono); color:var(--accent-violet); margin-right:6px;">📎 ' + s + '</span>';
      }).join('');

      botDiv.innerHTML = '<div class="rdkb-msg-avatar">AI</div><div class="rdkb-msg-content">' +
        '<div style="margin-bottom:8px;">' + sourcesHtml + '</div>' +
        response.answer.replace(/\n/g, '<br>') +
        '</div>';
      messages.appendChild(botDiv);
      messages.scrollTop = messages.scrollHeight;
    }, 1500);
  };
})();
