// functions
function multiplyArray(numbers, factor) {
  return numbers.map(number => number * factor);
}

// Beispiel-Daten und Labels
const DATA_COUNT = 12;
const runsArray = [3, 5, 9, 10, 9, 11, 10, 8, 15, 11, 9, 8];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

// configure the chart
const chartData = {
  labels: labels,
  datasets: [
    {
      label: 'Dashed',
      fill: false,
      backgroundColor: 'lightgreen',
      borderColor: 'red',
      data: multiplyArray(cumulativeSum,0.8),
      fill: +1,
    },
    {
      label: 'Filled',
      backgroundColor: 'lightgrey',
      borderColor: 'green',
      borderDash: [5, 5],
      data: multiplyArray(cumulativeSum,1.2),
      fill: false,
    },
  ]
};

// Chart-Konfiguration
const config = {
  type: 'line',
  data: chartData,
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
        icon.src = 'images/logo.png'; // path to local file

        // draw icon once it's loaded
        icon.onload = () => {
          const iconSize = 24; // Beispiel: Größe des Icons in Pixeln
          ctx.drawImage(icon, xPosition - iconSize / 2, yPosition - iconSize / 2, iconSize, iconSize);
        };
      }
    }
  ]
};

let chart;  // Variable zum Speichern der Chart-Instanz

function createChart() {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Überprüfen, ob bereits eine Chart-Instanz existiert, und diese zerstören
  if (chart) {
    chart.destroy();
  }

  // Neue Chart-Instanz erstellen und in der `chart`-Variable speichern
  chart = new Chart(ctx, config);
}

// Chart erstellen
window.onload = createChart;

// redraw onve the resolution changed
window.onresize = createChart;
window.addEventListener("orientationchange", createChart);