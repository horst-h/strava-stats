import ActivityTotals from './ActivityTotals.js';

export default class ActivitySummary {
  constructor({
    // add cureent date and time to constructor

    biggest_ride_distance,
    biggest_climb_elevation_gain,
    recent_ride_totals,
    all_ride_totals,
    recent_run_totals,
    all_run_totals,
    recent_swim_totals,
    all_swim_totals,
    ytd_ride_totals,
    ytd_run_totals,
    ytd_swim_totals
  }) {
    this.biggest_ride_distance = biggest_ride_distance;
    this.biggest_climb_elevation_gain = biggest_climb_elevation_gain;
    
    this.recent_ride_totals = new ActivityTotals(recent_ride_totals, parent=this);
    this.all_ride_totals = new ActivityTotals(all_ride_totals, this);
    this.recent_run_totals = new ActivityTotals(recent_run_totals, this);
    this.all_run_totals = new ActivityTotals(all_run_totals, this);
    this.recent_swim_totals = new ActivityTotals(recent_swim_totals, this);
    this.all_swim_totals = new ActivityTotals(all_swim_totals, this);
    this.ytd_ride_totals = new ActivityTotals(ytd_ride_totals, this);
    this.ytd_run_totals = new ActivityTotals(ytd_run_totals, parent=this);
    this.ytd_swim_totals = new ActivityTotals(ytd_swim_totals, this);

    this.createdAt = new Date(); // add current date and time
  }
}


