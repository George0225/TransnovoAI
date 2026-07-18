// section2.js — Financial audit demo logic

document.addEventListener('DOMContentLoaded', () => {
  const auditLog = document.getElementById('auditLog');
  if (!auditLog) return;

  // Simulate additional log entries appearing
  const additionalLogs = [
    { text: '> [AUTO] 建议关联查询采购订单 PO-2024-0334...', cls: 'log-info' },
    { text: '> po_amount_match: PASSED ✓ — PO金额 ¥284,500 与发票一致', cls: 'log-pass' },
    { text: '> [CONCLUSION] 金额差异源于合同补充协议，需人工确认', cls: 'log-info' },
  ];

  let logIndex = 0;
  const logInterval = setInterval(() => {
    if (logIndex >= additionalLogs.length) {
      clearInterval(logInterval);
      return;
    }
    const entry = additionalLogs[logIndex];
    const div = document.createElement('div');
    div.innerHTML = `> <span class="${entry.cls}">${entry.text.replace('> ', '')}</span>`;
    div.style.opacity = '0';
    div.style.transform = 'translateY(8px)';
    auditLog.appendChild(div);
    auditLog.scrollTop = auditLog.scrollHeight;

    requestAnimationFrame(() => {
      div.style.transition = 'all 0.3s ease-out';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });

    logIndex++;
  }, 4000);
});
