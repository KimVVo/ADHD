import React, { useState, useEffect } from 'react';

const FocusMode = () => {
    const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(false);

    const EXTENSION_ID = "kilbgoalbeoffipibcgnmfigjkhcdhkn"; 

    // Check the current state of Focus Mode when the component loads
    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(["focusModeEnabled"], (result) => {
                setIsFocusModeEnabled(result.focusModeEnabled || false);
            });
        } else {
            console.warn("Chrome storage API is not available.");
        }
    }, []);

    const toggleFocusMode = () => {
        const newStatus = !isFocusModeEnabled;

        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
            // Send a message to the Chrome Extension using the extension ID
            chrome.runtime.sendMessage(
                EXTENSION_ID,
                { block: newStatus },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error communicating with the extension:", chrome.runtime.lastError.message);
                        alert("Failed to communicate with the Chrome Extension.");
                    } else {
                        console.log(response?.status || "No response from background script.");
                        setIsFocusModeEnabled(newStatus);
                        if (chrome.storage && chrome.storage.local) {
                            chrome.storage.local.set({ focusModeEnabled: newStatus }); // Store state in Chrome storage
                        }
                    }
                }
            );
        } else {
            console.warn("Chrome runtime API is not available.");
            alert("Focus Mode can only be toggled in the Chrome Extension environment.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Focus Mode</h1>
            <button
                onClick={toggleFocusMode}
                className={`px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                    isFocusModeEnabled
                        ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                        : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
                }`}
            >
                {isFocusModeEnabled ? 'Disable Focus Mode' : 'Enable Focus Mode'}
            </button>
        </div>
    );
};

export default FocusMode;
