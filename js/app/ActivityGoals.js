// ActivityGoals.js
export default class ActivityGoals {
    constructor({ distance = 0, count = 0, elevation_gain = 0, time = 0 }) {
      this.distance = distance;       // Ziel für die Distanz
      this.count = count;             // Ziel für die Anzahl der Einheiten
      this.elevation_gain = elevation_gain;  // Ziel für Höhenmeter
      this.time = time; // Ziel für Zeit in Stunden
    }
  }
  