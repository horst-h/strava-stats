// functions
function multiplyArray(numbers, factor) {
  return numbers.map(number => number * factor);
}

// Beispiel-Daten und Labels
const DATA_COUNT = 12;
const runsArray = [3, 5, 9, 10, 9, 11, 10, 8, 15, 11, 9, 8];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const randomNumbers = (count, min, max) => Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);

// cumulate all values of the array in a new array
const cumulativeSum = runsArray.reduce((accumulator, currentValue, index) => {
  // Für den ersten Wert bleibt der aktuelle Wert gleich
  if (index === 0) {
    accumulator.push(currentValue);
  } else {
    // Für alle folgenden Werte: addiere den aktuellen Wert zur Summe des vorherigen Werts
    accumulator.push(accumulator[index - 1] + currentValue);
  }
  return accumulator;
}, []);
// Datensätze
const data = {
  labels: labels,
  datasets: [
    // {
    //   label: 'Unfilled',
    //   fill: false,
    //   backgroundColor: 'blue',
    //   borderColor: 'blue',
    //   data: randomNumbers(DATA_COUNT, 0, 100),
    // },
    {
      label: 'Dashed',
      fill: false,
      backgroundColor: 'lightgreen',
      borderColor: 'red',
      data: multiplyArray(cumulativeSum,0.8),
      //data: randomNumbers(DATA_COUNT, 0, 45),
      fill: +1,
    },
    {
      label: 'Filled',
      backgroundColor: 'lightgrey',
      borderColor: 'green',
      borderDash: [5, 5],
      // data: randomNumbers(DATA_COUNT, 50, 100),
      data: multiplyArray(cumulativeSum,1.2),
      fill: false,
    },
  ]
};

// Chart-Konfiguration
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
    },
    // interaction: {
    //   mode: 'index',
    //   intersect: false
    // },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  },
  plugins: [
    {
      id: 'customIconPlugin',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const xPosition = chart.scales.x.getPixelForValue(10); // Beispiel: März als x-Position
        const yPosition = chart.scales.y.getPixelForValue(95); // Beispiel: 50 als y-Position
        
        const icon = new Image();
        icon.src = 'images/logo.png'; // URL zum Icon oder Pfad zu einem lokalen Bild

        // Icon zeichnen, wenn das Bild geladen ist
        icon.onload = () => {
          const iconSize = 24; // Beispiel: Größe des Icons in Pixeln
          ctx.drawImage(icon, xPosition - iconSize / 2, yPosition - iconSize / 2, iconSize, iconSize);
        };
      }
    }
  ]
};

// Chart erstellen
window.onload = () => {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, config);
};
