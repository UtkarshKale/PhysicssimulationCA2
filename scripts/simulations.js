// simulations.js

const simulationsMap = {};
let activeDrag = false; // Tracks whether a window is being dragged
let zIndexCounter = 1000; // Tracks the z-index for window stacking

async function loadSimulations() {
    try {
        const response = await fetch('data/simulations.json');
        const simulationData = await response.json();
        simulationData.simulations.forEach(sim => {
            simulationsMap[sim.name] = sim;
        });
    } catch (error) {
        handleError('Error loading simulations', error);
    }
}

function openWindow(simName) {
    const simData = simulationsMap[simName];
    if (!simData) {
        handleError(`Simulation not found: ${simName}`);
        return;
    }

    const desktop = document.getElementById('desktop');
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.style.zIndex = ++zIndexCounter; // Bring window to front
    windowElement.innerHTML = `
        <div class="window-header">
            <span>${simName}</span>
            <div>
                <button class="fullscreen-btn" onclick="toggleFullscreen(this)" >🔳</button>
                <button class="close-btn" onclick="this.closest('.window').remove()">X</button>
            </div>
        </div>
        <div class="window-body">
            <iframe src="${simData.url}" frameborder="0"></iframe>
        </div>
    `;

    desktop.appendChild(windowElement);
    makeDraggable(windowElement);

    // Bring window to front on click
    windowElement.addEventListener('mousedown', () => {
        windowElement.style.zIndex = ++zIndexCounter;
    });
}


function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    header.onmousedown = e => {
        if (activeDrag) return; // Prevent simultaneous drags
        activeDrag = true;

        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmousemove = drag;
        document.onmouseup = stopDrag;
    };

    function drag(e) {
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        element.style.top = `${element.offsetTop - offsetY}px`;
        element.style.left = `${element.offsetLeft - offsetX}px`;
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
        activeDrag = false;
    }
}

function toggleFullscreen(button) {
    const windowElement = button.closest('.window');
    windowElement.classList.toggle('fullscreen');
}
function toggleFullscreen(button) {
  const windowElement = button.closest('.window');
  const iframe = windowElement.querySelector('iframe');

  if (!document.fullscreenElement) {
      // Enter fullscreen
      iframe.requestFullscreen().catch(err => {
          handleError("Failed to enter fullscreen", err);
      });

      // Create an exit bar
      const exitBar = document.createElement('div');
      exitBar.className = 'fullscreen-exit-bar';
      exitBar.innerHTML = `<button class="exit-fullscreen">Exit Fullscreen</button>`;
      exitBar.style.position = 'fixed';
      exitBar.style.top = '0';
      exitBar.style.left = '0';
      exitBar.style.width = '100%';
      exitBar.style.background = '#333';
      exitBar.style.color = '#fff';
      exitBar.style.padding = '10px';
      exitBar.style.textAlign = 'right';
      exitBar.style.display = 'none';
      document.body.appendChild(exitBar);

      exitBar.querySelector('.exit-fullscreen').onclick = () => {
          document.exitFullscreen();
      };

      // Show bar on hover
      document.addEventListener('mousemove', e => {
          if (e.clientY < 50) {
              exitBar.style.display = 'block';
          } else {
              exitBar.style.display = 'none';
          }
      });

      // Exit on Escape
      document.addEventListener('keydown', e => {
          if (e.key === 'Escape') {
              document.exitFullscreen();
          }
      });

      iframe.onfullscreenchange = () => {
          if (!document.fullscreenElement) {
              document.removeEventListener('mousemove', null);
              document.removeEventListener('keydown', null);
              exitBar.remove();
          }
      };
  } else {
      document.exitFullscreen();
  }
}

