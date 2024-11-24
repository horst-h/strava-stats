// impoort activity classes fromo file ActivitySummary.js
import ActivitySummary from './ActivitySummary.js';
import DateUtils from './DateUtils.js';


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

async function fetchProtectedData(accessToken) {
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
      // processData(data).then((object) => {displayData(object)});
      createActivitySummary(data).then((object) => {displayData(object)});
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

async function createActivitySummary(activityData) {
  const activitySummary = new ActivitySummary(activityData);
  activitySummary.ytd_run_totals.setGoals({ distance: 1000, count: 100 });
  console.log(activitySummary);
  return activitySummary;
}

// display the data in the HTML-page
function displayData(data) {
    // clear previous data
    document.getElementById('api-response').innerHTML = '';
  
    // create a new div element
    const div = document.createElement('div');
  
    // add class to the div
    div.classList.add('data-container');
  
    // create a heading element
    const heading = document.createElement('h2');
    heading.innerText = 'Athlete Stats';
    // display date and time below
    const date = new Date();
    const dateString = date.toDateString();
    const timeString = date.toLocaleTimeString();
    const dateTime = document.createElement('p');
    dateTime.innerText = `Data retrieved on ${dateString} at ${timeString}`;
    // append date and time to the div
    div.appendChild(dateTime);
  
    // append heading to the div
    div.appendChild(heading);
  
    // Display the distance in the HTML div with id "run_ytd_run_totals"
    document.getElementById(
      'run_ytd_run_totals'
    ).innerText = `${data.ytd_run_totals.distanceInKm} km`;
    document.getElementById('run_ytd_run_count').innerText = `${data.ytd_run_totals.count}`;
    document.getElementById('weeks_left').innerText = `${DateUtils.weeksToGo()}`;
    document.getElementById('avg_dist_per_week').innerText = `${data.ytd_run_totals.avgDistancePerWeekKm} km`;
    document.getElementById('avg_runs_per_week').innerText = `${data.ytd_run_totals.avgUnitsPerWeek}`;
    document.getElementById(
      'avg_dist_per_run'
    ).innerText = `${data.ytd_run_totals.avgDistanceUnitKm} km`;;
    // TODO: crrect this and adapt to specific goal
    document.getElementById('target_reachable').innerText = data.ytd_run_totals.goalsReachable
      ? 'Yes'
      : 'No';

      const goalStatus = data.ytd_run_totals.getGoalReachability();
      console.log(goalStatus);

    // get distance for each target
    document.getElementById('target_differnce').innerText = `${data.ytd_run_totals.getDistanceToGoal("distance")} km`;
    document.getElementById('weeksToTarget').innerText = `${data.ytd_run_totals.predictedWeeksToGoDistance}`;
    document.getElementById('targetDate').innerText = `${data.ytd_run_totals.predictedDateDistance.toDateString()}`;
    document.getElementById(
      'forecast_distance'
    ).innerText = `${data.ytd_run_totals.predictedYearEndDistanceKm} km`;
    document.getElementById('floor_avg_runs_per_week').innerText = `${data.ytd_run_totals.avgUnitsPerWeek} `;
    document.getElementById('floor_avg_dist_per_run').innerText = `${data.ytd_run_totals.avgDistanceUnitKm} km`;
    document.getElementById('runs_till_eoy').innerText = `${data.ytd_run_totals.predictedYearEndCount} `;
  
    // append the div to the api-response element
    document.getElementById('api-response').appendChild(div);
  }
  