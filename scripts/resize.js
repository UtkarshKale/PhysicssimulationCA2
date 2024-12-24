function makeResizable(element) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    element.addEventListener('mousedown', e => {
        if (!e.target.classList.contains('resize-handle')) return;

        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (!isResizing) return;

        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);

        element.style.width = `${Math.max(200, width)}px`; // Minimum width
        element.style.height = `${Math.max(150, height)}px`; // Minimum height

        showResizeFeedback(element, width, height);
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        hideResizeFeedback();
    }
}

function showResizeFeedback(element, width, height) {
    let feedback = document.querySelector('.resize-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'resize-feedback';
        document.body.appendChild(feedback);
    }
    feedback.textContent = `${width}px x ${height}px`;
    feedback.style.left = `${element.offsetLeft + 10}px`;
    feedback.style.top = `${element.offsetTop + 10}px`;
    feedback.style.opacity = 1;
}

function hideResizeFeedback() {
    const feedback = document.querySelector('.resize-feedback');
    if (feedback) {
        feedback.style.opacity = 0;
        setTimeout(() => feedback.remove(), 300);
    }
}
