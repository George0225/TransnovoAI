// section3.js — Customer 360 profile (radar chart)

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  // Wait for Chart.js to load
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['学术方向契合', '临床需求匹配', '地域优势', '专利重叠度', '历史合作'],
      datasets: [{
        label: '薛武军教授',
        data: [95, 88, 72, 85, 60],
        backgroundColor: 'rgba(0, 200, 224, 0.15)',
        borderColor: '#00C8E0',
        borderWidth: 2,
        pointBackgroundColor: '#00C8E0',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: { family: 'JetBrains Mono', size: 10 },
            color: '#8FA0B4',
            backdropColor: 'transparent',
          },
          grid: {
            color: 'rgba(221, 227, 236, 0.6)',
          },
          angleLines: {
            color: 'rgba(221, 227, 236, 0.6)',
          },
          pointLabels: {
            font: { family: 'Inter', size: 12, weight: 500 },
            color: '#5A6D80',
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1A2332',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'JetBrains Mono', size: 11 },
          padding: 10,
          cornerRadius: 8,
        }
      }
    }
  });
});
