// folders.js

let openFolderId = null; // Tracks the currently open folder

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
        handleError('Error loading folders', error);
    }
}

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
