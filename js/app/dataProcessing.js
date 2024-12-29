import ActivitySummary from './ActivitySummary.js';
import DateUtils from '../utils/DateUtils.js';

export async function createActivitySummary(activityData) {
    const activitySummary = new ActivitySummary(activityData);
    // check if goals are set and set them
    if (activitySummary.ytd_run_totals.goals.distance === 0) {
        //activitySummary.ytd_run_totals.setGoals(activitySummary.ytd_run_totals.goals);
        activitySummary.ytd_run_totals.setGoals({ distance: 1000, count: 100 });
    }
    return activitySummary;
}

// display the data in the HTML-page
export function displayData(data) {
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
    document.getElementById(
      'run_ytd_run_count'
    ).innerText = `${data.ytd_run_totals.count}`;
    document.getElementById('weeks_left').innerText = `${DateUtils.weeksToGo()}`;
    document.getElementById(
      'avg_dist_per_week'
    ).innerText = `${data.ytd_run_totals.avgDistancePerWeekKm} km`;
    document.getElementById(
      'avg_runs_per_week'
    ).innerText = `${data.ytd_run_totals.avgUnitsPerWeek}`;
    document.getElementById(
      'avg_dist_per_run'
    ).innerText = `${data.ytd_run_totals.avgDistanceUnitKm} km`;
  
    // check if distance goal is reachable
    const goalStatus = data.ytd_run_totals.getGoalReachability().distance;
  
    document.getElementById('target_reachable').innerText =
      goalStatus === true ? 'Yes' : 'No';
  
    // get distance for each target
    document.getElementById(
      'target_differnce'
    ).innerText = `${data.ytd_run_totals.getDistanceToGoal('distance')} km`;
    document.getElementById(
      'weeksToTarget'
    ).innerText = `${data.ytd_run_totals.predictedWeeksToGoDistance}`;
    document.getElementById(
      'targetDate'
    ).innerText = `${data.ytd_run_totals.predictedDateDistance.toDateString()}`;
    document.getElementById(
      'forecast_distance'
    ).innerText = `${data.ytd_run_totals.predictedYearEndDistanceKm} km`;
    document.getElementById(
      'floor_avg_runs_per_week'
    ).innerText = `${data.ytd_run_totals.avgUnitsPerWeek} `;
    document.getElementById(
      'floor_avg_dist_per_week'
    ).innerText = `${data.ytd_run_totals.avgDistancePerWeekKm} km`;
    document.getElementById(
      'runs_till_eoy'
    ).innerText = `${data.ytd_run_totals.predictedYearEndCount} `;
  
    // append the div to the api-response element
    document.getElementById('api-response').appendChild(div);
  }
  
