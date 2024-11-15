// ActivityTotals.js
import ActivityGoals from './ActivityGoals.js';
import DateUtils from './DateUtils.js';

export default class ActivityTotals {
  constructor(
    { count, distance, moving_time, elapsed_time, elevation_gain } = {}, // Destructured object with default values
    parent = null, // reference to parent object
    goals = {}
  ) {
    this.count = count;
    this.distance = distance;
    this.moving_time = moving_time;
    this.elapsed_time = elapsed_time;
    this.elevation_gain = elevation_gain;
    this.parent = parent; // Reference to parent object
    this.goals = new ActivityGoals(goals); // Add goals
  }

  setGoals(newGoals) {
    this.goals = new ActivityGoals(newGoals);
  }

  get distanceInKm() {
    return parseFloat((this.distance / 1000).toFixed(2));
  } 

  // get the avarge distance per unit in km
  get avgDistanceUnitKm() {
    return parseFloat((this.distanceInKm / this.count).toFixed(2));
  }

  get avgDistanceUnit() {
    return parseFloat((this.distance / this.count).toFixed(2));
  }

  // get the distance per week in km
  get avgDistancePerWeekKm() {
    return parseFloat((this.distanceInKm / DateUtils.weeksPassed(this.createdAt)).toFixed(2));
  }
  // get the avarage number of units per week
  get avgUnitsPerWeek() {
    return parseFloat((this.count / DateUtils.weeksPassed(this.createdAt)).toFixed(2));
  }

  // get the avarage distance per day
  get averageDailyDistance() {
    return parseFloat((this.distance / DateUtils.daysPassedInYear(this.createdAt)).toFixed(2));
  }

  // get the avarage number of units per day
  get averageDailyCount() {
    return parseFloat((this.count / DateUtils.daysPassedInYear(this.createdAt)).toFixed(2));
  }

  // check if the goals are reached if no goal is set return undefined
  get distanceGoalReached() {
    return this.goals.distance !== undefined ? this.distance/1000 >= this.goals.distance : undefined;
  }

  get countGoalReached() {
    return this.goals.count !== undefined ? this.count >= this.goals.count : undefined;
  }

  get elevationGainGoalReached() {
    return this.goals.elevation_gain !== undefined ? this.elevation_gain >= this.goals.elevation_gain : undefined;
  }

  get timeGoalReached() {
    // Goal setting is in hours (this.goals.time) convert to seconds
    const timeGoalInSeconds = this.goals.time !== undefined ? this.goals.time * 3600 : undefined;
    return timeGoalInSeconds !== undefined ? this.moving_time >= timeGoalInSeconds : undefined;
  }

  // return object for all goals if no goal is set return undefined
  get goalsReached() {
    return {
      distanceGoalReached: this.distanceGoalReached,
      countGoalReached: this.countGoalReached,
      elevationGainGoalReached: this.elevationGainGoalReached,
      timeGoalReached: this.timeGoalReached
    };
  }

  // get bool if the goals are reachable based on the current progress
  get goalsReachable() {
    return this.distanceInKm >= this.goals.distance && this.count >= this.goals.count && this.elevation_gain >= this.goals.elevation_gain && this.moving_time >= this.goals.time;
  }

  // forcasting section
  get predictedYearEndDistance() {
    const daysRemaining = DateUtils.daysRemainingInYear();
    return Math.round(this.distance + this.averageDailyDistance * daysRemaining);
  }

  get predictedYearEndDistanceKm() {
    return parseFloat(this.predictedYearEndDistance / 1000).toFixed(2);
  }

  get predictedYearEndCount() {
    const daysRemaining = DateUtils.daysRemainingInYear();
    return Math.round(this.count + this.averageDailyCount * daysRemaining);
  }

  get predictedYearEndElevationGain() {
    const daysRemaining = DateUtils.daysRemainingInYear();
    return Math.round(this.elevation_gain + this.averageDailyElevationGain * daysRemaining);
  }

  // predict number of weeks until target is reached
  get predictedWeeksToGoDistance() {
    const distanceToGo = this.goals.distance - this.distanceInKm;
    return (distanceToGo / this.avgDistancePerWeekKm).toFixed(2);
  }

  // get predicted date when the distance goal is reached
  get predictedDateDistance() {
    const weeksToGo = this.predictedWeeksToGoDistance;
    const date = this.parent.createdAt;
    date.setDate(date.getDate() + weeksToGo * 7);
    return date;
  }
}
