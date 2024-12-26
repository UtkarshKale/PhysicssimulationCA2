// search.js

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const body = document.body;

    // Event listener for search button click
    searchButton.addEventListener("click", () => {
        performSearch(searchBar.value.trim());
    });

    // Event listener for Enter key press in search bar
    searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            performSearch(searchBar.value.trim());
        }
    });

    // Close search results when clicking outside
    document.addEventListener("click", (e) => {
        const searchResults = document.getElementById("search-results");
        if (
            searchResults &&
            !searchResults.contains(e.target) &&
            e.target !== searchBar &&
            e.target !== searchButton
        ) {
            searchResults.remove();
        }
    });

    // Function to perform the search
    function performSearch(query) {
        if (!query) {
            showPopup("Please enter a search term.");
            return;
        }

        const searchResults = [];
        for (const simName in simulationsMap) {
            if (simName.toLowerCase().includes(query.toLowerCase())) {
                searchResults.push(simName);
            }
        }

        if (searchResults.length > 0) {
            displaySearchResults(searchResults);
        } else {
            showPopup("No simulations found.");
        }
    }

    // Function to display search results
    function displaySearchResults(results) {
        const desktop = document.getElementById("desktop");

        // Clear previous results
        const existingResultContainer = document.getElementById("search-results");
        if (existingResultContainer) {
            existingResultContainer.remove();
        }

        const resultContainer = document.createElement("div");
        resultContainer.id = "search-results";
        resultContainer.style.position = "absolute";
        resultContainer.style.top = "50px";
        resultContainer.style.right = "10px";
        resultContainer.style.background = "rgba(0, 0, 0, 0.9)";
        resultContainer.style.color = "#00ff00";
        resultContainer.style.padding = "10px";
        resultContainer.style.border = "1px solid #00ff00";
        resultContainer.style.borderRadius = "5px";
        resultContainer.style.zIndex = "1001";

        results.forEach((result) => {
            const resultItem = document.createElement("div");
            resultItem.textContent = result;
            resultItem.style.cursor = "pointer";
            resultItem.style.padding = "5px 0";

            resultItem.addEventListener("click", () => {
                openWindow(result); // Open the simulation window
            });

            resultContainer.appendChild(resultItem);
        });

        desktop.appendChild(resultContainer);
    }

    // Function to display a styled popup
    function showPopup(message) {
        const existingPopup = document.getElementById("popup-message");
        if (existingPopup) {
            existingPopup.remove(); // Remove existing popup
        }

        const popup = document.createElement("div");
        popup.id = "popup-message";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.right = "20px";
        popup.style.background = "#333";
        popup.style.color = "#fff";
        popup.style.padding = "10px 20px";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        popup.style.zIndex = "1002";
        popup.style.fontFamily = "'VT323', monospace";

        popup.textContent = message;

        body.appendChild(popup);

        // Remove the popup after 3 seconds
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }
});
