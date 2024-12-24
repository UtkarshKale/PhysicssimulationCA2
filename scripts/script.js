// script.js

// This script serves as the entry point for loading simulations and folders

// Ensure the DOM is fully loaded before initializing
window.onload = () => {
  // Load the folder structure
  const folderScript = document.createElement('script');
  folderScript.src = 'scripts/folders.js';
  document.body.appendChild(folderScript);

  // Load the simulations
  const simulationScript = document.createElement('script');
  simulationScript.src = 'scripts/simulations.js';
  document.body.appendChild(simulationScript);
};
