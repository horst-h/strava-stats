import { createActivitySummary, displayData } from './dataProcessing.js';
import { saveDataToFile } from '../utils/storage.js';
import { oauthConfig } from '../oauth/config.js';
import {
  loadClientId,
  loadClientSecret,
  loadRefreshToken,
  saveOAuthConfig,
  isAccessTokenExpired,
  loadAccessToken,
  refreshAccessToken
} from '../oauth/oauth.js';
import { setupEventListeners } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check if configuration and tokens are stored
  const clientId = loadClientId();
  const clientSecret = loadClientSecret();
  const refreshToken = loadRefreshToken();

  if (!clientId || !clientSecret || !refreshToken) {
    // Show the configuration form
    document.getElementById('config-form-container').style.display = 'block';
  } else {
    // Show the main application buttons
    document.getElementById('get-protected-data').style.display = 'block';
  }

  setupEventListeners();
});
export let processedData;

// create a function to check for valid access token and renew id necessary
export async function checkAccessToken() {
  let accessToken = loadAccessToken();
  if (!accessToken || isAccessTokenExpired()) {
      accessToken = await refreshAccessToken();
  }
  
  return accessToken;
}

export async function fetchProtectedData(accessToken) {
  const buttonContainer = document.getElementById('buttonContainer');
  const saveButton = document.getElementById('save-data-to-file');

  if (accessToken) {
    try {
      // Replace with your protected endpoint
      const response = await fetch(oauthConfig.apiEndpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch protected data: ${response.statusText}`
        );
      }

      const data = await response.json();
      // show the div with id athelete-stats
      document.getElementById('athleteStats').style.display = 'block';

      // hide the div with id token-info
      document.getElementById('token-info').style.display = 'none';

      // call function to display data
      console.log('Received Data:', data);

      // process and display the data
      createActivitySummary(data).then((object) => {
        processedData = object;
        displayData(object);
      });

      // enable the save button by resetting the display style
      saveButton.style.display = 'block';
    } catch (error) {
      console.error('Error fetching protected data:', error);
      document.getElementById('api-response').innerText =
        'Failed to fetch protected data. Check the console for details.';
    }
  } else {
    document.getElementById('api-response').innerText =
      'No valid access token available. Please log in again.';
  }
}
