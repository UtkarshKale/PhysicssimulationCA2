// folders.js

let openFolderId = null; // Tracks the currently open folder

/**
 * Loads the folder structure from 'data/folders.json' and populates the desktop.
 */
async function loadFolderStructure() {
    try {
        const response = await fetch('data/folders.json');
        const folderData = await response.json();
        const desktop = document.getElementById('desktop');

        folderData.folders.forEach(folder => {
            createFolder(folder, desktop);
        });

        // Close folders on desktop click
        document.addEventListener('click', closeAllFolders);
    } catch (error) {
        handleError('Error loading folders:', error); // Updated to use the new global handleError
    }
}

/**
 * Creates a folder or subfolder icon and its corresponding content container.
 * @param {object} folder - The folder data object.
 * @param {HTMLElement} parentElement - The HTML element to append the folder to.
 */
function createFolder(folder, parentElement) {
    const folderElement = document.createElement('div');
    folderElement.className = 'icon';
    folderElement.innerHTML = `
        <img src="icons/foldericon.png" alt="${folder.name}">
        <span>${folder.name}</span>
    `;
    parentElement.appendChild(folderElement);

    const subfolderContainer = document.createElement('div');
    subfolderContainer.className = 'folder hidden';
    parentElement.appendChild(subfolderContainer);

    folder.subfolders.forEach(subfolder => createFolder(subfolder, subfolderContainer));
    folder.simulations.forEach(simName => {
        const simElement = document.createElement('div');
        simElement.className = 'icon';
        const simData = simulationsMap[simName];
        simElement.innerHTML = `
            <img src="icons/${simData.icon}" alt="${simName}">
            <span>${simName}</span>
        `;
        simElement.onclick = e => {
            e.stopPropagation();
            openWindow(simName);
        };
        subfolderContainer.appendChild(simElement);
    });

    folderElement.onclick = e => {
        e.stopPropagation();
        toggleFolder(folder.name, subfolderContainer);
    };
}

function toggleFolder(folderName, folderElement) {
    if (openFolderId && openFolderId !== folderName) {
        closeAllFolders();
    }
    openFolderId = folderName;
    folderElement.classList.toggle('hidden');
}

function closeAllFolders() {
    const allFolders = document.querySelectorAll('.folder');
    allFolders.forEach(folder => folder.classList.add('hidden'));
    openFolderId = null;
}
