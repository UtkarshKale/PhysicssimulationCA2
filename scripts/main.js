// Utility function to dynamically load scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Load all scripts in order
async function initialize() {
    try {
        await loadScript('scripts/resize.js');
        await loadScript('scripts/docking.js');
        await loadScript('scripts/shortcuts.js');
        await loadScript('scripts/folders.js');
        await loadScript('scripts/simulations.js');
        console.log('All scripts loaded successfully!');
    } catch (error) {
        console.error('Error loading scripts:', error);
    }
}

// Start initialization
initialize();
