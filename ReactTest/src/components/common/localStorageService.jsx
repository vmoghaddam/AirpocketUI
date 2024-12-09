// src/localStorageService.js

const localStorageService = {
    // Save data to localStorage
    set(key, value) {
        try {
            const stringValue = JSON.stringify(value);
            localStorage.setItem(key, stringValue);
        } catch (error) {
            console.error(`Error saving to localStorage: ${error}`);
        }
    },

    // Retrieve data from localStorage
    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${error}`);
            return null;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage: ${error}`);
        }
    },

    // Clear all data from localStorage
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Error clearing localStorage: ${error}`);
        }
    },

    // Check if a key exists in localStorage
    hasKey(key) {
        return localStorage.getItem(key) !== null;
    },
};

export default localStorageService;
