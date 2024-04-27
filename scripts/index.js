document.addEventListener('DOMContentLoaded', () => {
  const renderButton = document.getElementById('render-button');
  renderButton.addEventListener('click', renderChart);
});

function renderChart() {
  const chartType = document.getElementById('chart-type').value;
  const labelsInput = document.getElementById('labels').value;
  const datasetInput = document.getElementById('dataset').value;

  const errorMessage = document.getElementById('error-message');

  if (!labelsInput || !datasetInput) {
    displayErrorMessage('Please enter labels and dataset values');
    return;
  }

  const labels = labelsInput.split(',');
  const dataset = datasetInput.split(',').map(Number);

  if (!validateDataset(dataset)) {
    displayErrorMessage('Dataset values must be numeric');
    return;
  }

  const chartConfig = {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: 'Dataset',
        data: dataset
      }]
    }
  };

  const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));

  fetch(`https://quickchart.io/chart?c=${encodedConfig}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }
      return response.url;
    })
    .then(imageUrl => {
      const canvas = document.getElementById('chart');
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.style.display = 'block';
        clearErrorMessage();
      };
      img.src = imageUrl;
    })
    .catch(error => {
      console.error('Error rendering chart:', error);
      displayErrorMessage(error.message);
    });
}

function displayErrorMessage(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
}

function clearErrorMessage() {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';
}

function validateDataset(dataset) {
  return dataset.every(value => !isNaN(value));
}
