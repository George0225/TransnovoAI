// section4.js — Drug bidding price prediction (scatter chart, sliders, Monte Carlo, real-time crawl)

(function() {
  function initSection4() {
    const chartCanvas = document.getElementById('pricingChart');
    if (!chartCanvas) return;

    // Wait for Chart.js to be available
    if (typeof Chart === 'undefined') {
      setTimeout(initSection4, 200);
      return;
    }

    // Slider bindings
    const sliders = {
      competitors: { el: document.getElementById('sliderCompetitors'), display: document.getElementById('paramCompetitors') },
      winners: { el: document.getElementById('sliderWinners'), display: document.getElementById('paramWinners') },
      minPrice: { el: document.getElementById('sliderMinPrice'), display: document.getElementById('paramMinPrice') },
      drop: { el: document.getElementById('sliderDrop'), display: document.getElementById('paramDrop') },
      iterations: { el: document.getElementById('sliderIterations'), display: document.getElementById('paramIterations') },
    };

    Object.keys(sliders).forEach(key => {
      const s = sliders[key];
      if (!s.el || !s.display) return;
      s.el.addEventListener('input', () => {
        let val = s.el.value;
        if (key === 'minPrice') val = (val / 100).toFixed(2);
        s.display.textContent = val;
      });
    });

    // Drug data (simulated)
    let drugData = [
      { name: '华海药业', price: 1.92, win: true },
      { name: '正大天晴', price: 2.05, win: true },
      { name: '健耕医药', price: 2.08, win: true, highlight: true },
      { name: '中美华东', price: 2.18, win: true },
      { name: '石药集团', price: 2.25, win: true },
      { name: '齐鲁制药', price: 2.32, win: true },
      { name: '科伦药业', price: 2.38, win: true },
      { name: '扬子江药业', price: 2.52, win: false },
      { name: '恒瑞医药', price: 2.61, win: false },
      { name: '海正药业', price: 2.78, win: false },
      { name: '豪森药业', price: 2.95, win: false },
      { name: '信立泰', price: 3.12, win: false },
    ];

    const winThreshold = 2.40;

    // Compute chart data points from drugData
    function getWinData(data) {
      return data.filter(d => d.win && !d.highlight).map((d, i) => ({ x: i + 1, y: d.price }));
    }
    function getHighlightData(data) {
      const h = data.find(d => d.highlight);
      return h ? [{ x: 3, y: h.price }] : [];
    }
    function getLoseData(data) {
      return data.filter(d => !d.win).map((d, i) => ({ x: i + 8, y: d.price }));
    }

    // Update chart data in-place (Chart.js 4.x requires this to avoid blank renders)
    function refreshChart() {
      chart.data.datasets[0].data = getWinData(drugData);
      chart.data.datasets[1].data = getHighlightData(drugData);
      chart.data.datasets[2].data = getLoseData(drugData);
      chart.update('none');
    }

    // Create chart
    const ctx = chartCanvas.getContext('2d');
    let chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '中标企业',
            data: getWinData(drugData),
            backgroundColor: 'rgba(0, 200, 83, 0.7)',
            borderColor: '#00C853',
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10,
          },
          {
            label: '健耕医药（预测）',
            data: getHighlightData(drugData),
            backgroundColor: 'rgba(108, 60, 224, 0.8)',
            borderColor: '#6C3CE0',
            borderWidth: 3,
            pointRadius: 12,
            pointHoverRadius: 14,
            pointStyle: 'star',
          },
          {
            label: '淘汰企业',
            data: getLoseData(drugData),
            backgroundColor: 'rgba(232, 57, 74, 0.5)',
            borderColor: '#E8394A',
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 10 } },
        scales: {
          x: {
            title: { display: true, text: '企业序号', font: { family: 'Inter', size: 12 }, color: '#8FA0B4' },
            grid: { color: 'rgba(221, 227, 236, 0.4)' },
            ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#8FA0B4' },
            min: 0,
            max: 13,
          },
          y: {
            title: { display: true, text: '报价 (元/粒)', font: { family: 'Inter', size: 12 }, color: '#8FA0B4' },
            grid: { color: 'rgba(221, 227, 236, 0.4)' },
            ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#8FA0B4' },
            min: 1.5,
            max: 3.5,
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Inter', size: 11 },
              color: '#5A6D80',
              padding: 16,
              usePointStyle: true,
            }
          },
          tooltip: {
            backgroundColor: '#1A2332',
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const idx = context.dataIndex;
                const ds = context.datasetIndex;
                let name = '';
                if (ds === 0) name = drugData.filter(d => d.win && !d.highlight)[idx]?.name || '';
                else if (ds === 1) name = '健耕医药';
                else name = drugData.filter(d => !d.win)[idx]?.name || '';
                return name + ': \u00A5' + context.parsed.y.toFixed(2) + '/粒';
              }
            }
          }
        }
      },
      plugins: [{
        id: 'thresholdLine',
        beforeDraw: function(chartInstance) {
          const ctx2 = chartInstance.ctx;
          const yScale = chartInstance.scales.y;
          const xScale = chartInstance.scales.x;
          if (!yScale || !xScale) return;

          const yPos = yScale.getPixelForValue(winThreshold);
          const yTop = yScale.getPixelForValue(1.5);
          const yBottom = yScale.getPixelForValue(winThreshold);

          ctx2.save();
          // Win zone
          ctx2.fillStyle = 'rgba(0, 200, 83, 0.04)';
          ctx2.fillRect(xScale.left, Math.min(yTop, yBottom), xScale.width, Math.abs(yTop - yBottom));
          // Lose zone
          const yLoseBottom = yScale.getPixelForValue(3.5);
          ctx2.fillStyle = 'rgba(232, 57, 74, 0.04)';
          ctx2.fillRect(xScale.left, yPos, xScale.width, yLoseBottom - yPos);
          // Threshold line
          ctx2.setLineDash([6, 4]);
          ctx2.strokeStyle = '#00C8E0';
          ctx2.lineWidth = 2;
          ctx2.beginPath();
          ctx2.moveTo(xScale.left, yPos);
          ctx2.lineTo(xScale.right, yPos);
          ctx2.stroke();
          // Label
          ctx2.setLineDash([]);
          ctx2.font = '11px JetBrains Mono, monospace';
          ctx2.fillStyle = '#00C8E0';
          ctx2.textAlign = 'right';
          ctx2.fillText('\u4E2D\u6807\u9608\u503C \u00A5' + winThreshold.toFixed(2), xScale.right - 8, yPos - 8);
          ctx2.restore();
        }
      }]
    });

    // --- Real-time price crawl simulation ---
    const crawlLog = document.getElementById('crawlLog');
    const crawlStatus = document.getElementById('crawlStatus');
    const crawlTime = document.getElementById('crawlTime');
    const crawlToggle = document.getElementById('crawlToggle');
    let crawlInterval = null;
    let crawlRunning = false;

    const dataSources = [
      '药智网 (yaozh.com)',
      '米内网 (menet.com.cn)',
      '国家医保局集采平台',
      '上海阳光医药采购网',
      '广东省药品交易中心',
    ];

    const priceEvents = [
      { company: '华海药业', field: '浙江省挂网价', delta: -0.03 },
      { company: '正大天晴', field: '江苏省中标价', delta: +0.02 },
      { company: '石药集团', field: '北京市挂网价', delta: -0.05 },
      { company: '齐鲁制药', field: '山东省备案价', delta: -0.02 },
      { company: '恒瑞医药', field: '全国集采报价', delta: +0.04 },
      { company: '科伦药业', field: '四川省挂网价', delta: -0.01 },
      { company: '扬子江药业', field: '江苏省中标价', delta: -0.06 },
      { company: '中美华东', field: '浙江省挂网价', delta: +0.03 },
    ];

    function formatTime() {
      const now = new Date();
      return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
    }

    function simulateCrawl() {
      if (!crawlLog) return;

      // Pick random source and event
      const source = dataSources[Math.floor(Math.random() * dataSources.length)];
      const event = priceEvents[Math.floor(Math.random() * priceEvents.length)];
      const timestamp = formatTime();

      // Update crawl time
      if (crawlTime) crawlTime.textContent = timestamp;

      // Add log entry
      const sign = event.delta > 0 ? '+' : '';
      const cls = event.delta > 0 ? 'log-fail' : 'log-pass';
      const entry = document.createElement('div');
      entry.innerHTML = `> <span class="log-info">[${timestamp.split(' ')[1]}]</span> ${source} → ${event.company} ${event.field}: <span class="${cls}">${sign}${event.delta.toFixed(2)}元</span>`;
      entry.style.opacity = '0';
      entry.style.transform = 'translateX(-10px)';
      crawlLog.appendChild(entry);

      // Animate in
      requestAnimationFrame(() => {
        entry.style.transition = 'all 0.3s ease-out';
        entry.style.opacity = '1';
        entry.style.transform = 'translateX(0)';
      });

      // Keep log limited
      while (crawlLog.children.length > 30) {
        crawlLog.removeChild(crawlLog.firstChild);
      }
      crawlLog.scrollTop = crawlLog.scrollHeight;

      // Update drug data with small price fluctuation
      const targetDrug = drugData.find(d => d.name === event.company);
      if (targetDrug) {
        targetDrug.price = Math.max(1.5, Math.min(3.5, targetDrug.price + event.delta * 0.3));
      }

      // Update chart
      refreshChart();

      // Update mini table
      updateMiniTable();
    }

    function updateMiniTable() {
      const tbody = document.getElementById('competitorTableBody');
      if (!tbody) return;
      const sorted = [...drugData].sort((a, b) => a.price - b.price);
      const top5 = sorted.slice(0, 5);
      tbody.innerHTML = top5.map(d => {
        const isUs = d.highlight;
        const style = isUs ? ' style="color:var(--accent-cyan); font-weight:600;"' : '';
        const mark = isUs ? ' ⬟' : '';
        return `<tr><td${style}>${d.name}${mark}</td><td${style}>\u00A5${d.price.toFixed(2)}</td></tr>`;
      }).join('');
    }

    function startCrawl() {
      if (crawlRunning) return;
      crawlRunning = true;
      if (crawlStatus) crawlStatus.innerHTML = '<span class="live-dot"></span> 抓取中';
      if (crawlToggle) {
        crawlToggle.textContent = '暂停抓取';
        crawlToggle.classList.remove('btn-primary');
        crawlToggle.classList.add('btn-danger');
      }
      // Initial burst
      simulateCrawl();
      setTimeout(simulateCrawl, 800);
      setTimeout(simulateCrawl, 1500);
      // Then periodic
      crawlInterval = setInterval(simulateCrawl, 5000 + Math.floor(Math.random() * 3000));
    }

    function stopCrawl() {
      crawlRunning = false;
      if (crawlInterval) clearInterval(crawlInterval);
      crawlInterval = null;
      if (crawlStatus) crawlStatus.innerHTML = '<span style="color:var(--text-muted);">● 已暂停</span>';
      if (crawlToggle) {
        crawlToggle.textContent = '开始抓取';
        crawlToggle.classList.remove('btn-danger');
        crawlToggle.classList.add('btn-primary');
      }
    }

    if (crawlToggle) {
      crawlToggle.addEventListener('click', () => {
        if (crawlRunning) stopCrawl();
        else startCrawl();
      });
    }

    // Auto-start crawl when section becomes active (sidebar click)
    const section = document.getElementById('section-pricing');
    if (section) {
      if (section.classList.contains('active') && !crawlRunning) {
        setTimeout(startCrawl, 1500);
      }
      const mo = new MutationObserver(() => {
        if (section.classList.contains('active') && !crawlRunning) {
          setTimeout(startCrawl, 1500);
          mo.disconnect();
        }
      });
      mo.observe(section, { attributes: true, attributeFilter: ['class'] });
    }

    // --- Run Simulation button ---
    const btnRun = document.getElementById('btnRunSimulation');
    const algoLog = document.getElementById('algoLog');
    if (btnRun && algoLog) {
      btnRun.addEventListener('click', () => {
        if (!sliders.iterations.el || !sliders.competitors.el || !sliders.winners.el || !sliders.drop.el || !sliders.minPrice.el) return;
        btnRun.disabled = true;
        btnRun.textContent = '模拟运行中...';
        algoLog.innerHTML = '';

        const iterations = parseInt(sliders.iterations.el.value);
        const competitors = sliders.competitors.el.value;
        const winners = sliders.winners.el.value;
        const dropPct = sliders.drop.el.value;

        const logs = [
          '> <span class="log-info">[INIT]</span> Clearing previous results...',
          '> <span class="log-info">[CONFIG]</span> competitors=' + competitors + ', winners=' + winners + ', iterations=' + iterations,
          '> Loading historical bidding data (Round 9, 2023)...',
          '> Applying price decay factor: -' + dropPct + '%',
          '> Running Monte Carlo simulation...',
        ];

        let i = 0;
        const logInterval2 = setInterval(() => {
          if (i < logs.length) {
            const div = document.createElement('div');
            div.innerHTML = logs[i];
            algoLog.appendChild(div);
            algoLog.scrollTop = algoLog.scrollHeight;
            i++;
          } else if (i < logs.length + 8) {
            const progress = Math.min(Math.floor((i - logs.length + 1) / 8 * iterations), iterations);
            const div = document.createElement('div');
            div.innerHTML = '> Iteration ' + progress + '/' + iterations + '... sampling price distribution';
            algoLog.appendChild(div);
            algoLog.scrollTop = algoLog.scrollHeight;
            i++;
          } else {
            clearInterval(logInterval2);
            // Calculate new prediction based on sliders
            const baseDrop = parseInt(dropPct) / 100;
            const basePrice = parseFloat(sliders.minPrice.el.value) / 100;
            const newLow = (basePrice * (1 - baseDrop * 0.6)).toFixed(2);
            const newHigh = (basePrice * (1 - baseDrop * 0.2)).toFixed(2);
            const prob = Math.min(95, Math.max(45, Math.round(75 + (7 - parseInt(winners)) * 5 + (baseDrop - 0.15) * 100)));

            const results = [
              '> <span class="log-pass">[COMPLETE]</span> Simulation finished in 2.3s',
              '> Price distribution: \u03BC=' + ((parseFloat(newLow) + parseFloat(newHigh)) / 2).toFixed(2) + ', \u03C3=0.18, skew=-0.34',
              '> Winning threshold (P95): \u00A5' + winThreshold.toFixed(2),
              '> <span class="log-pass">[RESULT]</span> Recommended: \u00A5' + newLow + ' - \u00A5' + newHigh,
              '> <span class="log-pass">[RESULT]</span> Win probability at \u00A5' + ((parseFloat(newLow) + parseFloat(newHigh)) / 2).toFixed(2) + ': ' + prob + '%',
              '> <span class="log-info">[NOTE]</span> Calibrate with actual records for production use.',
            ];

            results.forEach((r, j) => {
              setTimeout(() => {
                const div = document.createElement('div');
                div.innerHTML = r;
                algoLog.appendChild(div);
                algoLog.scrollTop = algoLog.scrollHeight;
              }, j * 300);
            });

            // Update result panel and chart data
            setTimeout(() => {
              const resultPrice = document.getElementById('resultPrice');
              const ringValue = document.getElementById('ringValue');
              const ringFill = document.getElementById('ringFill');
              if (resultPrice) resultPrice.textContent = '\u00A5' + newLow + ' - ' + newHigh;
              if (ringValue) ringValue.textContent = prob + '%';
              if (ringFill) {
                const circumference = 2 * Math.PI * 40;
                const offset = circumference * (1 - prob / 100);
                ringFill.setAttribute('stroke-dasharray', circumference.toFixed(1));
                ringFill.setAttribute('stroke-dashoffset', offset.toFixed(1));
              }

              // Update drug prices based on simulation
              const midPrice = (parseFloat(newLow) + parseFloat(newHigh)) / 2;
              const range = parseFloat(newHigh) - parseFloat(newLow);
              drugData.forEach(d => {
                if (d.highlight) {
                  d.price = midPrice;
                } else if (d.win) {
                  d.price = parseFloat(newLow) + Math.random() * range * 1.5;
                } else {
                  d.price = parseFloat(newHigh) + 0.1 + Math.random() * 0.6;
                }
                d.price = Math.round(d.price * 100) / 100;
              });
              drugData.sort((a, b) => a.price - b.price);
              refreshChart();
              updateMiniTable();

              btnRun.disabled = false;
              btnRun.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2l9 5-9 5V2z" fill="currentColor"/></svg> 运行模拟';
            }, results.length * 300 + 200);
          }
        }, 350);
      });
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSection4);
  } else {
    initSection4();
  }
})();
