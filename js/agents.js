// agents.js — interactive input handling for the 5 Agent demos

document.addEventListener('DOMContentLoaded', () => {

  // ---------- HR Agent chat ----------
  const hrInput = document.getElementById('hrChatInput');
  const hrBody = document.getElementById('hrChatBody');

  window.hrSend = function () {
    if (!hrInput || !hrBody) return;
    const text = hrInput.value.trim();
    if (!text) return;

    // append user bubble
    const userMsg = document.createElement('div');
    userMsg.className = 'hr-msg user';
    userMsg.innerHTML = `<div class="hr-bubble">${escapeHtml(text)}</div><div class="hr-avatar user">G</div>`;
    hrBody.appendChild(userMsg);

    // typing indicator
    const botMsg = document.createElement('div');
    botMsg.className = 'hr-msg bot';
    botMsg.innerHTML = `<div class="hr-avatar bot">HR</div><div class="hr-bubble"><em style="color:var(--text-secondary);">正在处理...</em></div>`;
    hrBody.appendChild(botMsg);

    hrInput.value = '';
    hrBody.scrollTop = hrBody.scrollHeight;

    setTimeout(() => {
      botMsg.querySelector('.hr-bubble').innerHTML =
        `已收到需求 <b>"${escapeHtml(text.slice(0, 40))}"</b>。请上传对应账单，或在上方选择快速模板。演示中，我会自动映射到公司科目并生成 PR/PO。`;
      hrBody.scrollTop = hrBody.scrollHeight;
    }, 900);
  };

  if (hrInput) {
    hrInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        window.hrSend();
      }
    });
  }

  document.querySelectorAll('.hr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const t = chip.getAttribute('data-text') || chip.textContent;
      if (hrInput) {
        hrInput.value = t;
        hrInput.focus();
      }
    });
  });

  // ---------- Finance Agent ----------
  const finQuery = document.getElementById('finQuery');

  window.finRun = function () {
    if (!finQuery) return;
    const btn = document.querySelector('.fin-query .agent-btn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '审核中...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        // pulse the dashboard
        document.querySelectorAll('.fin-col').forEach(c => {
          c.style.transition = 'transform 0.3s';
          c.style.transform = 'scale(1.01)';
          setTimeout(() => (c.style.transform = ''), 300);
        });
      }, 900);
    }
  };

  document.querySelectorAll('.fin-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (finQuery) {
        finQuery.value = tag.getAttribute('data-q') || tag.textContent;
        finQuery.focus();
      }
    });
  });

  if (finQuery) {
    finQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); window.finRun(); }
    });
  }

  // ---------- Customer Agent ----------
  const custQuery = document.getElementById('custQuery');

  window.custRun = function () {
    const btn = document.querySelector('.cust-search .agent-btn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '搜索中...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        document.querySelectorAll('.cust-card').forEach((c, i) => {
          c.style.opacity = '0.3';
          setTimeout(() => (c.style.opacity = ''), 200 + i * 120);
        });
      }, 700);
    }
  };

  if (custQuery) {
    custQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); window.custRun(); }
    });
  }

  document.querySelectorAll('.cust-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cust-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ---------- Bidding Agent ----------
  window.bidRun = function () {
    const btn = document.querySelector('.bid-run');
    if (!btn) return;
    const cost = parseFloat((document.getElementById('bidCost') || {}).value) || 8200;
    const qty = parseFloat((document.getElementById('bidQty') || {}).value) || 500;
    btn.disabled = true;
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>测算中...</span>';

    setTimeout(() => {
      // update hero live based on inputs
      const rec = Math.round(cost * 1.195);
      const priceEl = document.querySelector('.bid-hero-price');
      const subEl = document.querySelector('.bid-hero-sub');
      if (priceEl) priceEl.textContent = '¥ ' + rec.toLocaleString();
      if (subEl) {
        const margin = rec - cost;
        subEl.innerHTML =
          `<span>中标概率 <b class="up">${Math.max(60, 85 - Math.round((rec - cost) / 200))}%</b></span>` +
          `<span>单套毛利 <b>¥${margin.toLocaleString()}</b></span>` +
          `<span>项目总利润 <b>¥ ${(margin * qty).toLocaleString()}</b></span>`;
      }
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 800);
  };

  // ---------- R&D Agent ----------
  const rdQuery = document.getElementById('rdQuery');

  window.rdRun = function () {
    const btn = document.querySelector('.rd-send');
    if (btn) {
      btn.style.background = '#00e0b8';
      const answerBody = document.querySelector('.rd-answer-body');
      if (answerBody) {
        answerBody.style.opacity = '0.4';
        setTimeout(() => (answerBody.style.opacity = ''), 700);
      }
      setTimeout(() => (btn.style.background = ''), 600);
    }
  };

  if (rdQuery) {
    rdQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.rdRun(); }
    });
    // auto-grow
    rdQuery.addEventListener('input', () => {
      rdQuery.style.height = 'auto';
      rdQuery.style.height = Math.min(rdQuery.scrollHeight, 120) + 'px';
    });
  }

  document.querySelectorAll('.rd-suggest').forEach(s => {
    s.addEventListener('click', () => {
      if (rdQuery) {
        rdQuery.value = s.textContent;
        rdQuery.focus();
        window.rdRun();
      }
    });
  });

  document.querySelectorAll('.rd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rd-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
});
