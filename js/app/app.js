import { createActivitySummary, displayData } from './dataProcessing.js';
import {saveDataToFile} from '../utils/storage.js';
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

  document.getElementById('config-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const clientId = document.getElementById('clientId').value;
    const clientSecret = document.getElementById('clientSecret').value;
    const refreshToken = document.getElementById('refreshToken').value;

    saveOAuthConfig(clientId, clientSecret, refreshToken);

    document.getElementById('config-form-container').style.display = 'none';
    document.getElementById('get-protected-data').style.display = 'block';
  });

  // add event listener to the button with id "save-data-to-file"
  document.getElementById('save-data-to-file').addEventListener('click', () => {
    saveDataToFile(processedData);
  });

  // Event Listener for the "Get Protected Data" button
  document
    .getElementById('get-protected-data')
    .addEventListener('click', async () => {
      let accessToken = loadAccessToken();

      if (!accessToken || isAccessTokenExpired()) {
        accessToken = await refreshAccessToken();
      }

      console.log('Access Token:', accessToken);

      await fetchProtectedData(accessToken);
    });
});
let processedData;

async function fetchProtectedData(accessToken) {
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
      // set click action to save the data to a file
      saveButton.onclick = () => saveDataToFile(processedData);
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
