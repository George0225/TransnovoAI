// main.js — Sidebar navigation, section switching

document.addEventListener('DOMContentLoaded', () => {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const sections = document.querySelectorAll('.section');
  const contentArea = document.getElementById('contentArea');

  function switchSection(targetId) {
    sections.forEach(s => s.classList.remove('active'));
    sidebarItems.forEach(item => item.classList.remove('active'));

    const targetSection = document.getElementById(targetId);
    const targetItem = document.querySelector(`.sidebar-item[data-target="${targetId}"]`);

    if (targetSection) {
      targetSection.classList.add('active');
      contentArea.scrollTop = 0;
    }
    if (targetItem) {
      targetItem.classList.add('active');
    }

    // Trigger chart resize for the newly visible section
    window.dispatchEvent(new Event('resize'));
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      if (target) switchSection(target);
    });
  });

  // Make section-content visible immediately (no scroll reveal needed)
  document.querySelectorAll('.section-content').forEach(el => {
    el.classList.add('visible');
  });
});
