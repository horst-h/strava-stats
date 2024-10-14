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
      // console.log('Endpoint:', oauthConfig.apiEndpoint);

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
      // document.getElementById('api-response').innerText = `Protected Data: ${JSON.stringify(data, null, 2)}`;

      // show the div with id athelete-stats
      document.getElementById('athleteStats').style.display = 'block';

      // hide the div with id token-info
      document.getElementById('token-info').style.display = 'none';

      // call function to display data
      console.log('Protected Data:', data);
      // process and display the data
      processData(data).then((object) => {displayData(object)});
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

async function processData(data) {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((endOfYear - today) / oneDay));
    const weeksToGo = Math.ceil(diffDays / 7);

    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffDaysStart = Math.round(Math.abs((today - startOfYear) / oneDay));
    const weeksPassed = Math.ceil(diffDaysStart / 7);

    const distance = data.ytd_run_totals.distance;
    const numRuns = data.ytd_run_totals.count;
    const distanceInKm = (distance / 1000).toFixed(2);

    const avgDistance = (distance / weeksPassed / 1000).toFixed(2);
    const avgRuns = (numRuns / weeksPassed).toFixed(2);
    const avgDistancePerRun = (distance / numRuns / 1000).toFixed(2);

    const targetDistance = 1000;
    const targetReachable =
        avgDistance * avgRuns * weeksToGo >= targetDistance - distanceInKm;

    const targetDifference = targetDistance - distanceInKm;

    // forcast on wich date the target distance will be reached
    const avgDistancePerWeek = distanceInKm / weeksPassed;
    const avgRunsPerWeek = numRuns / weeksPassed;
    // const avgDistancePerRun = distance / numRuns;
    const weeksToTarget = parseFloat(((targetDistance - distanceInKm) / (avgDistancePerRun * avgRunsPerWeek)).toFixed(2));

    // add weeksToTarget to the current date and get the date
    const targetDate = new Date(today.getTime() + weeksToTarget * 7 * oneDay);
    console.log(`weeksToTarget: ${weeksToTarget}`);
    console.log(`target date: ${targetDate}`);

    
    const forecastDistance = (
        parseFloat(distanceInKm) +
        avgDistancePerRun * (weeksToGo - 1) * Math.floor(avgRuns)
    ).toFixed(2);

    const runsForecast = numRuns + Math.floor(avgRuns) * (weeksToGo - 1);

    const processedData = {
        distanceInKm: distanceInKm,
        numRuns: numRuns,
        weeksToGo: weeksToGo,
        avgDistance: avgDistance,
        avgRuns: avgRuns,
        avgDistancePerRun: avgDistancePerRun,
        targetReachable: targetReachable,
        targetDifference: targetDifference,
        weeksToTarget: weeksToTarget,
        targetDate: targetDate,
        forecastDistance: forecastDistance,
        runsForecast: runsForecast
    };

    // return processed data
    return processedData;
}

function displayData(data) {

    console.log('Data:', data);
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
    ).innerText = `${data.distanceInKm} km`;
    document.getElementById('run_ytd_run_count').innerText = `${data.numRuns}`;
    document.getElementById('weeks_left').innerText = `${data.weeksToGo}`;
    document.getElementById('avg_dist_per_week').innerText = `${data.avgDistance} km`;
    document.getElementById('avg_runs_per_week').innerText = `${data.avgRuns}`;
    document.getElementById(
      'avg_dist_per_run'
    ).innerText = `${data.avgDistancePerRun} km`;;
    document.getElementById('target_reachable').innerText = data.targetReachable
      ? 'Yes'
      : 'No';
    document.getElementById('target_differnce').innerText = `${data.targetDifference.toFixed(2)} km`;
    document.getElementById('weeksToTarget').innerText = `${data.weeksToTarget}`;
    document.getElementById('targetDate').innerText = `${data.targetDate.toDateString()}`;
    document.getElementById(
      'forecast_distance'
    ).innerText = `${data.forecastDistance} km`;
    document.getElementById('floor_avg_runs_per_week').innerText = `${Math.floor(
      data.avgRuns
    )} `;
    document.getElementById('floor_avg_dist_per_run').innerText = `${
      Math.floor(data.avgRuns) * data.avgDistancePerRun
    } km`;
    document.getElementById('runs_till_eoy').innerText = `${data.runsForecast} `;
  
    // append the div to the api-response element
    document.getElementById('api-response').appendChild(div);
  }
  

// create function to display data
function displayData2(data) {
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

  // Extract the YTD running distance (in meters)
  const distance = data.ytd_run_totals.distance;
  const numRuns = data.ytd_run_totals.count;

  // Convert distance from meters to kilometers
  const distanceInKm = (distance / 1000).toFixed(2);

  // Display the distance in the HTML div with id "run_ytd_run_totals"
  document.getElementById(
    'run_ytd_run_totals'
  ).innerText = `${distanceInKm} km`;
  document.getElementById('run_ytd_run_count').innerText = `${numRuns}`;

  // calucualte the number of weeks till the end of the year
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((endOfYear - today) / oneDay));
  const weeksToGo = Math.ceil(diffDays / 7);
  document.getElementById('weeks_left').innerText = `${weeksToGo}`;

  // calculate the number of weeks since the start of the year
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const diffDaysStart = Math.round(Math.abs((today - startOfYear) / oneDay));
  const weeksPassed = Math.ceil(diffDaysStart / 7);

  // calculate the average distance per week
  const avgDistance = (distance / weeksPassed / 1000).toFixed(2);
  document.getElementById('avg_dist_per_week').innerText = `${avgDistance} km`;

  // calculate the average number of runs per week
  const avgRuns = (numRuns / weeksPassed).toFixed(2);
  document.getElementById('avg_runs_per_week').innerText = `${avgRuns}`;

  // calcualte the avg distance per run
  const avgDistancePerRun = (distance / numRuns / 1000).toFixed(2);
  document.getElementById(
    'avg_dist_per_run'
  ).innerText = `${avgDistancePerRun} km`;

  // set target distance for the year
  const targetDistance = 1000;

  // check if the number of runs per week and the average distance per run are
  // able to reach the target distanceInKm
  const targetReachable =
    avgDistance * avgRuns * weeksToGo >= targetDistance - distanceInKm;
  document.getElementById('target_reachable').innerText = targetReachable
    ? 'Yes'
    : 'No';

  // forecast the distance by the end of the year
  const forecastDistance = (
    parseFloat(distanceInKm) +
    avgDistancePerRun * (weeksToGo - 1) * Math.floor(avgRuns)
  ).toFixed(2);
  console.log(forecastDistance);
  document.getElementById(
    'forecast_distance'
  ).innerText = `${forecastDistance} km`;
  document.getElementById('floor_avg_runs_per_week').innerText = `${Math.floor(
    avgRuns
  )} `;
  document.getElementById('floor_avg_dist_per_run').innerText = `${
    Math.floor(avgRuns) * avgDistancePerRun
  } km`;
  // calcualte the number of runs until end of year
  const runsForecast = numRuns + Math.floor(avgRuns) * (weeksToGo - 1);
  document.getElementById('runs_till_eoy').innerText = `${runsForecast} `;

  // append the div to the api-response element
  document.getElementById('api-response').appendChild(div);
}
``;

// create function to display data
function displayData2(data) {
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

  // Extract the YTD running distance (in meters)
  const distance = data.ytd_run_totals.distance;
  const numRuns = data.ytd_run_totals.count;

  // Convert distance from meters to kilometers
  const distanceInKm = (distance / 1000).toFixed(2);

  // Display the distance in the HTML div with id "run_ytd_run_totals"
  document.getElementById(
    'run_ytd_run_totals'
  ).innerText = `${distanceInKm} km`;
  document.getElementById('run_ytd_run_count').innerText = `${numRuns}`;

  // calucualte the number of weeks till the end of the year
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((endOfYear - today) / oneDay));
  const weeksToGo = Math.ceil(diffDays / 7);
  document.getElementById('weeks_left').innerText = `${weeksToGo}`;

  // calculate the number of weeks since the start of the year
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const diffDaysStart = Math.round(Math.abs((today - startOfYear) / oneDay));
  const weeksPassed = Math.ceil(diffDaysStart / 7);

  // calculate the average distance per week
  const avgDistance = (distance / weeksPassed / 1000).toFixed(2);
  document.getElementById('avg_dist_per_week').innerText = `${avgDistance} km`;

  // calculate the average number of runs per week
  const avgRuns = (numRuns / weeksPassed).toFixed(2);
  document.getElementById('avg_runs_per_week').innerText = `${avgRuns}`;

  // calcualte the avg distance per run
  const avgDistancePerRun = (distance / numRuns / 1000).toFixed(2);
  document.getElementById(
    'avg_dist_per_run'
  ).innerText = `${avgDistancePerRun} km`;

  // set target distance for the year
  const targetDistance = 1000;

  // check if the number of runs per week and the average distance per run are
  // able to reach the target distanceInKm
  const targetReachable =
    avgDistance * avgRuns * weeksToGo >= targetDistance - distanceInKm;
  document.getElementById('target_reachable').innerText = targetReachable
    ? 'Yes'
    : 'No';

  // forecast the distance by the end of the year
  const forecastDistance = (
    parseFloat(distanceInKm) +
    avgDistancePerRun * (weeksToGo - 1) * Math.floor(avgRuns)
  ).toFixed(2);
  console.log(forecastDistance);
  document.getElementById(
    'forecast_distance'
  ).innerText = `${forecastDistance} km`;
  document.getElementById('floor_avg_runs_per_week').innerText = `${Math.floor(
    avgRuns
  )} `;
  document.getElementById('floor_avg_dist_per_run').innerText = `${
    Math.floor(avgRuns) * avgDistancePerRun
  } km`;
  // calcualte the number of runs until end of year
  const runsForecast = numRuns + Math.floor(avgRuns) * (weeksToGo - 1);
  document.getElementById('runs_till_eoy').innerText = `${runsForecast} `;

  // append the div to the api-response element
  document.getElementById('api-response').appendChild(div);
}
