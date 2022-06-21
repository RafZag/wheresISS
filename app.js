const dataURL = 'https://api.wheretheiss.at/v1/satellites/25544';
let loadedData;

const reloadButton = document.getElementById('btn');
const messageDiv = document.getElementById('msg');

loadData();

reloadButton.addEventListener('click', () => {
  loadData();
});

function loadData() {
  fetch(dataURL)
    .then((response) => response.json())
    .then((data) => {
      loadedData = data;
      messageDiv.innerHTML = JSON.stringify(data, undefined, 2);
    });
}
