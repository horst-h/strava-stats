

// file handling functions
export function saveDataToFile(data, filename) {
    if (!filename) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Monat auf 2 Stellen formatieren
      const day = String(date.getDate()).padStart(2, '0'); // Tag auf 2 Stellen formatieren
      filename = `strava_data_${year}_${month}_${day}.json`;
    }

    // add current date and time to data
    data.createdAt = new Date();
    
    // Remove circular references
    const sanitizedData = removeCircularReferences(data); 
    
    // Save the cleaned object
    const json = JSON.stringify(sanitizedData, null, 2); // Formatierte JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeCircularReferences(obj) {
    const seen = new WeakSet();

    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return undefined; // Remove circular reference
                }
                seen.add(value);
            }
            return value;
        })
    );
}

// load data from file 
function loadDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      console.log('Loaded data:', data);
      createActivitySummary(data).then((object) => {
        displayData(object);
      });
    };
    reader.readAsText(file);
  }
