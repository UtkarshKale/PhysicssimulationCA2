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
        handleError('Error loading simulations:', error); // Updated to use global handleError
    }
}

/**
 * Opens a new window for a given simulation or application.
 * @param {string} simName - The name of the simulation/app to open.
 */
function openWindow(simName) {
    const simData = simulationsMap[simName];
    if (!simData) {
        handleError(`Simulation not found: ${simName}`); // This already calls global handleError
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

    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    windowElement.appendChild(resizer);
    makeResizable(windowElement, resizer);

    // Bring window to front on click
    windowElement.addEventListener('mousedown', (e) => {
        // Only bring to front if the click is not on the resizer itself
        if (e.target !== resizer) {
            windowElement.style.zIndex = ++zIndexCounter;
        }
    });
}

/**
 * Makes a window element resizable using a dedicated resizer handle.
 * @param {HTMLElement} windowElement - The window element to make resizable.
 * @param {HTMLElement} resizerElement - The resizer handle element.
 */
function makeResizable(windowElement, resizerElement) {
    let originalX, originalY, originalWidth, originalHeight;
    let currentResizer = null;

    resizerElement.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Prevent default drag behaviors
        e.stopPropagation(); // Stop click from bubbling to window mousedown for z-index

        currentResizer = windowElement;
        originalX = e.clientX;
        originalY = e.clientY;
        originalWidth = parseFloat(getComputedStyle(currentResizer, null).getPropertyValue('width').replace('px', ''));
        originalHeight = parseFloat(getComputedStyle(currentResizer, null).getPropertyValue('height').replace('px', ''));

        // Set z-index to ensure the current window is on top while resizing
        currentResizer.style.zIndex = ++zIndexCounter;

        document.addEventListener('mousemove', resizeDrag);
        document.addEventListener('mouseup', stopResizeDrag);
    });

    function resizeDrag(e) {
        if (!currentResizer) return;
        const dx = e.clientX - originalX;
        const dy = e.clientY - originalY;

        const newWidth = Math.max(150, originalWidth + dx); // Min width 150px
        const newHeight = Math.max(100, originalHeight + dy); // Min height 100px

        currentResizer.style.width = newWidth + 'px';
        currentResizer.style.height = newHeight + 'px';
    }

    function stopResizeDrag() {
        document.removeEventListener('mousemove', resizeDrag);
        document.removeEventListener('mouseup', stopResizeDrag);
        currentResizer = null; // Release the reference
    }
}

/**
 * Makes a window element draggable by its header.
 * @param {HTMLElement} element - The window element to make draggable.
 */
function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    function startDrag(e) {
        if (e.target.classList.contains('close-btn') || e.target.classList.contains('fullscreen-btn')) {
            return; // Don't drag if close or fullscreen button is clicked
        }
        if (activeDrag && e.target !== header) return; // Prevent simultaneous drags unless it's a new header
        activeDrag = true;

        mouseX = e.clientX;
        mouseY = e.clientY;

        // Get initial offset of the mouse from the top-left of the element
        const rect = element.getBoundingClientRect();
        offsetX = mouseX - rect.left;
        offsetY = mouseY - rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (!activeDrag) return;
        e.preventDefault(); // Prevent text selection during drag

        // New position is mouse position minus the initial offset
        let newTop = e.clientY - offsetY;
        let newLeft = e.clientX - offsetX;

        // Boundary checks (optional, but good for usability)
        const desktopRect = element.parentElement.getBoundingClientRect();
        newLeft = Math.max(desktopRect.left, Math.min(newLeft, desktopRect.right - element.offsetWidth));
        newTop = Math.max(desktopRect.top, Math.min(newTop, desktopRect.bottom - element.offsetHeight));

        element.style.top = `${newTop}px`;
        element.style.left = `${newLeft}px`;
    }

    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        activeDrag = false;
    }

    header.addEventListener('mousedown', startDrag);
}

// Removed the simpler toggleFullscreen function, keeping the more complex one below.
/**
 * Toggles fullscreen mode for the iframe within a window element.
 * Manages a custom exit fullscreen UI bar.
 * @param {HTMLElement} button - The button that triggered the fullscreen toggle.
 */
function toggleFullscreen(button) {
  const windowElement = button.closest('.window');
  const iframe = windowElement.querySelector('iframe');

  if (!document.fullscreenElement && !(document.webkitFullscreenElement || document.mozFullScreenElement)) {
      // Enter fullscreen
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(err => {
            handleError('Failed to enter fullscreen:', err);
        });
      } else if (iframe.webkitRequestFullscreen) { /* Safari */
        iframe.webkitRequestFullscreen().catch(err => {
            handleError('Failed to enter fullscreen:', err);
        });
      } else if (iframe.mozRequestFullScreen) { /* Firefox */
        iframe.mozRequestFullScreen().catch(err => {
            handleError('Failed to enter fullscreen:', err);
        });
      }


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
      let exitBarDisplayed = false;
      const displayExitBar = () => {
        if (!exitBarDisplayed) {
            exitBar.style.display = 'block';
            exitBarDisplayed = true;
            setTimeout(() => { // Auto-hide after a few seconds if mouse doesn't move out
                if (exitBarDisplayed) exitBar.style.display = 'none';
                exitBarDisplayed = false;
            }, 3000);
        }
      };

      const hideExitBar = () => {
        if (e.clientY > 60 && exitBarDisplayed) { // Give some leeway
            exitBar.style.display = 'none';
            exitBarDisplayed = false;
        }
      };

      const handleEsc = (e) => {
          if (e.key === 'Escape') {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
              } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
              }
          }
      };

      const fullscreenChangeHandler = () => {
          if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)) {
              document.removeEventListener('mousemove', displayExitBar);
              document.removeEventListener('mousemove', hideExitBar);
              document.removeEventListener('keydown', handleEsc);
              if (iframe.onfullscreenchange) iframe.onfullscreenchange = null;
              if (iframe.onwebkitfullscreenchange) iframe.onwebkitfullscreenchange = null; // Safari
              if (iframe.onmozfullscreenchange) iframe.onmozfullscreenchange = null; // Firefox
              if (document.getElementById('fullscreen-exit-bar')) {
                document.getElementById('fullscreen-exit-bar').remove();
              }
          }
      };

      // Show bar on hover near top
      document.addEventListener('mousemove', displayExitBar);
      // Hide bar if mouse moves away
      document.addEventListener('mousemove', hideExitBar);
      // Exit on Escape
      document.addEventListener('keydown', handleEsc);

      // Attach fullscreen change event
      if (iframe.onfullscreenchange === undefined) { // Standard
        iframe.onfullscreenchange = fullscreenChangeHandler;
      } else if (iframe.onwebkitfullscreenchange === undefined) { // Safari
        iframe.onwebkitfullscreenchange = fullscreenChangeHandler;
      } else if (iframe.onmozfullscreenchange === undefined) { // Firefox
        iframe.onmozfullscreenchange = fullscreenChangeHandler;
      }
      // Ensure the exit bar ID is set for removal
      exitBar.id = 'fullscreen-exit-bar';

  } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      }
  }
}

