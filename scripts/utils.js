/**
 * Handles errors by logging a formatted message to the console.
 * @param {string} message - The message to log.
 * @param {Error} [error] - The error object (optional).
 */
function handleError(message, error) {
    if (error) {
        console.error(message, error);
    } else {
        console.error(message);
    }
}
