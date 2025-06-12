// bootmanager.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Create the boot screen
    const bootScreen = document.createElement('div');
    bootScreen.id = 'boot-screen';

    bootScreen.innerHTML = `
        <div class="log-window">
            <pre id="boot-log"></pre>
        </div>
        <div class="progress-container">
            <div class="progress-bar"></div>
            <div class="progress-text">0%</div>
        </div>
    `;

    body.appendChild(bootScreen);

    const log = document.getElementById('boot-log');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    // Logs for the typing effect
    const logs = [
        '[INFO] Initializing system...',
        '[INFO] Loading core modules...',
        '[INFO] Bootstrapping interface...',
        '[SUCCESS] Environment ready!',
        '[System] Welcome',
    ];

    const typingSpeed = 15; // Typing speed for logs
    const totalDuration = 2500; // Total duration for progress bar (5 seconds)

    let logIndex = 0;

    // Typing effect for logs
    const typeLog = (text, callback) => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                log.textContent += text[charIndex++];
            } else {
                clearInterval(typeInterval);
                log.textContent += '\n';
                if (callback) callback();
            }
        }, typingSpeed);
    };

    // Update logs one by one
    const updateLog = () => {
        if (logIndex < logs.length) {
            typeLog(logs[logIndex], () => {
                logIndex++;
                setTimeout(updateLog, 15); // Delay between logs
            });
        }
    };

    // Smooth progress bar animation
    const animateProgressBar = () => {
        const startTime = performance.now();

        const updateProgress = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const percentage = Math.min((elapsedTime / totalDuration) * 100, 100);

            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${Math.floor(percentage)}%`;

            if (percentage < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                fadeOutBootScreen();
            }
        };

        requestAnimationFrame(updateProgress);
    };

    // Fade out boot screen after completion
    const fadeOutBootScreen = () => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.remove();
        }, 1000); // Fade out duration
    };

    // Start the bootloader sequence
    updateLog();
    animateProgressBar();
});
