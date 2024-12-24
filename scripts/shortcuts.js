let shortcuts = {};

fetch('data/shortcuts.json')
    .then(response => response.json())
    .then(data => {
        shortcuts = data;
        initializeShortcuts();
    })
    .catch(err => console.error('Failed to load shortcuts:', err));

function initializeShortcuts() {
    document.addEventListener('keydown', e => {
        const keyCombo = `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.key}`;
        
        switch (keyCombo) {
            case shortcuts.openFolder:
                openFolderShortcut();
                break;
            case shortcuts.closeAllWindows:
                closeAllWindowsShortcut();
                break;
            case shortcuts.focusNextWindow:
                focusNextWindowShortcut();
                break;
            case shortcuts.fullscreen:
                toggleFullscreenShortcut();
                break;
        }
    });
}

function openFolderShortcut() {
    // Implement folder opening logic
}

function closeAllWindowsShortcut() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => win.remove());
}

function focusNextWindowShortcut() {
    // Implement window focusing logic
}

function toggleFullscreenShortcut() {
    const activeWindow = document.querySelector('.window.focused');
    if (activeWindow) {
        toggleFullscreen(activeWindow.querySelector('iframe'));
    }
}
