// section1.js — MCP diagram particle animation

document.addEventListener('DOMContentLoaded', () => {
  // MCP particles are animated via CSS keyframes (dataFlow)
  // Additional: add hover interaction to nodes
  const nodes = document.querySelectorAll('.mcp-node-icon');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.transform = 'scale(1.1)';
      node.style.boxShadow = '0 0 20px rgba(0, 200, 224, 0.5)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.transform = 'scale(1)';
      node.style.boxShadow = '';
    });
  });
});
