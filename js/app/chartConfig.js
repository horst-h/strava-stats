// functions
function multiplyArray(numbers, factor) {
  return numbers.map(number => number * factor);
}
// Funktion zur Berechnung der X-Position für ein beliebiges Datum
function getXPositionForDate(chart, date) {
  const xAxis = chart.scales.x;

  const targetMonth = date.getMonth(); // 0 = Januar, 11 = Dezember
  const targetDay = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), targetMonth + 1, 0).getDate();

  // Berechnung der Position des Tages im Monat (als Bruchteil)
  const positionInMonth = targetDay / daysInMonth;

  // X-Position für den Monatsanfang und Monatsende berechnen
  const startX = xAxis.getPixelForValue(labels[targetMonth]);
  const endX = xAxis.getPixelForValue(labels[targetMonth + 1] || labels[targetMonth]);

  // Interpolierte X-Position für den exakten Tag im Monat
  const xPosition = startX + positionInMonth * (endX - startX);

  return xPosition;
}

// Beispiel-Daten und Labels
const DATA_COUNT = 12;
const runsArray = [3, 5, 9, 10, 9, 11, 10, 8, 15, 11, 9, 8, 8];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan.'];


// cumulate all values of the array in a new array
const cumulativeSum = runsArray.reduce((accumulator, currentValue, index) => {
  // Für den ersten Wert bleibt der aktuelle Wert gleich
  if (index === 0) {
    accumulator.push(currentValue);
  } else {
    // Für alle folgenden Werte: addiere den aktuellen Wert zur Summe des vorherigen Werts
    accumulator.push(accumulator[index - 1] + currentValue);
  }
  // push the produkt of the accumulator to the distanceSum 
  return accumulator;
}, []);

// set the distanceSum to the product of the accumulator (number of runs) and the average distance per run
let distanceSum = cumulativeSum.map((value) => value * 9.6);
console.log('distanceSum:', distanceSum);

// configure the chart
const chartData = {
  labels: labels,
  datasets: [
    {
      label: 'Dashed',
      fill: false,
      // backgroundColor: 'lightgreen',
      borderColor: 'red',
      data: multiplyArray(cumulativeSum,0.8),
      fill: +1,
      yAxisID: 'y',
    },
    {
      label: 'Filled',
      // backgroundColor: 'lightgrey',
      borderColor: 'green',
      borderDash: [5, 5],
      data: multiplyArray(cumulativeSum,1.2),
      fill: false,
      yAxisID: 'y',
    },
    {
      // label: 'Filled',
      backgroundColor: 'lightgrey',
      borderColor: 'orange',
      data: distanceSum,
      fill: false,
      yAxisID: 'y1',
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
        text: 'Goal achievement for 1000km in 2024'
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
          text: 'Number of runs'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Distance in km'
        },
        grid: {
          drawOnChartArea: false,  // Gitterlinien für die zweite Achse ausblenden
        }
      }
    }
  },
  plugins: [
    // do not display the legend
    {
      id: 'noLegend',
      beforeInit: (chart) => {
        chart.options.plugins.legend.display = false;
      }
    },
    // add a custom icon to the chart
    {
      id: 'iconDisplay',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const today = new Date(); // 3 = April
        const xPosition = getXPositionForDate(chart, today);
        // TODO: old remove const xPosition = chart.scales.x.getPixelForValue(10.5); // Beispiel: März als x-Position
        const yPosition = chart.scales.y.getPixelForValue(95); // Beispiel: 50 als y-Position
        
        const icon = new Image();
        icon.src = 'images/logo.png'; // path to local file
        
        

        // draw icon once it's loaded
        icon.onload = () => {
          const iconSize = 24; // Beispiel: Größe des Icons in Pixeln
          ctx.drawImage(icon, xPosition - iconSize / 2, yPosition - iconSize / 2, iconSize, iconSize);
          // create a circle border around icon
          ctx.beginPath();
          ctx.arc(xPosition, yPosition, 18, 0, 2 * Math.PI);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.stroke();
        };
      }
    },
    {
      id: 'goalDateMarker',
      afterDraw: (chart) => {
        const ctx = chart.ctx;

        // Beispiel: Berechne die X-Position für ein bestimmtes Datum (z. B. 15. April)
        const specificDate = new Date(new Date().getFullYear(), 11, 6); // 3 = April
        const xPosition = getXPositionForDate(chart, specificDate);

        // Linie zeichnen
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);  // Gepunktete Linie
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        ctx.moveTo(xPosition, chart.scales.y.top);
        ctx.lineTo(xPosition, chart.scales.y.bottom);
        ctx.stroke();
        ctx.restore();
        ctx.save();

        // draw a filled dot at xPostion and yPosition 100
        ctx.beginPath();
        ctx.arc(xPosition, chart.scales.y.getPixelForValue(100), 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'grey';
        ctx.fill();
        ctx.restore();
        ctx.save();


        ctx.fillStyle = 'grey';
        ctx.textAlign = 'center';
        
        // Ursprung an die Position verschieben, an der der Text erscheinen soll
        ctx.translate(xPosition-8, chart.scales.y.bottom - 40);
        
        // Text um -90 Grad drehen
        ctx.rotate(-Math.PI / 2);
        
        // Text zeichnen
        ctx.fillText('06-Dec-2024', 0, 0);
        ctx.restore()

      }
    }
  ]
};

let chart;  // Variable zum Speichern der Chart-Instanz

function createChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  // set width of chart to 80% of window width
  ctx.canvas.width = window.innerWidth * 0.8;
  
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