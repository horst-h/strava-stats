import { saveDataToFile } from '../utils/storage.js';
import { createActivitySummary, displayData } from './dataProcessing.js';
import { loadAccessToken, refreshAccessToken } from '../oauth/oauth.js';
import { fetchProtectedData, checkAccessToken, processedData } from './app.js';

let eventListenersInitialized = false;

export function setupEventListeners() {

    if (eventListenersInitialized) {
        console.warn("Event listeners are already initialized.");
        return;
    }

    console.log('Setting up event listeners');

    eventListenersInitialized = true;

    document.getElementById('config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // store config data and hide the form
        const clientId = document.getElementById('clientId').value;
        const clientSecret = document.getElementById('clientSecret').value;
        const refreshToken = document.getElementById('refreshToken').value;
    
        saveOAuthConfig(clientId, clientSecret, refreshToken);
    
        document.getElementById('config-form-container').style.display = 'none';
        document.getElementById('get-protected-data').style.display = 'block';
    });

    document.getElementById('get-protected-data').addEventListener('click', async () => {
        checkAccessToken().then((accessToken) => {
            console.log('Access Token:', accessToken);
            fetchProtectedData(accessToken);
        }); 
    });

    document.getElementById('save-data-to-file').addEventListener('click', () => {
        saveDataToFile(processedData);
    });
}