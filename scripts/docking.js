function enableWindowDocking(element) {
    const snapThreshold = 20; // Pixels from edge to snap

    element.addEventListener('dragend', () => {
        const { left, top, width, height } = element.getBoundingClientRect();

        // Check edges and snap
        if (Math.abs(left) < snapThreshold) element.style.left = '0px'; // Snap to left
        if (Math.abs(window.innerWidth - (left + width)) < snapThreshold) {
            element.style.left = `${window.innerWidth - width}px`; // Snap to right
        }
        if (Math.abs(top) < snapThreshold) element.style.top = '0px'; // Snap to top
        if (Math.abs(window.innerHeight - (top + height)) < snapThreshold) {
            element.style.top = `${window.innerHeight - height}px`; // Snap to bottom
        }
    });
}
