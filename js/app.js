import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.0/examples/jsm/controls/OrbitControls.js';
import { Globe } from '../js/globe.js';
import { Iss } from './iss.js';

const dataURL = 'https://api.wheretheiss.at/v1/satellites/25544';
let loadedData;
let controls;
let positionOver;
let lat, lon;
let time = new Date();

// const reloadButton = document.getElementById('btn');
const dateDiv = document.getElementById('date');
const coordLongDiv = document.getElementById('long');
const coordLatDiv = document.getElementById('lat');
const coordAltDiv = document.getElementById('alt');
const visDiv = document.getElementById('visibility');
const overDiv = document.getElementById('over');
const statusDiv = document.getElementById('status');
const container = document.querySelector('.container');

container.style.visibility = 'hidden';

overDiv.style.visibility = 'hidden';

window.addEventListener('resize', onWindowResize);

//////////////////////////

let camera, scene, renderer, canvas;
let camPosition = new THREE.Vector3(0, 0, 5);

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

init();
animate();

function init() {
  scene = new THREE.Scene();

  //---------------- Camera --------------------------

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
  let c = new THREE.Vector3();
  camera.position.copy(camPosition);

  //---------------- Render --------------------------

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  document.body.appendChild(renderer.domElement);

  // --------------- Controls ----------------

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  //controls.enableZoom = false;
  controls.enableDamping = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // ---------------- lights ----------------

  const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
  light1.position.set(0, 200, 0);
  light1.position.multiplyScalar(1.3);

  var light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(0, -200, 0);
  light2.position.multiplyScalar(1.3);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light

  scene.add(ambientLight);
  scene.add(light1);
  scene.add(light2);
}

function animate(time) {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('selectstart', function (e) {
  e.preventDefault();
});

function disableSelect(event) {
  event.preventDefault();
}

//////////////////////////////////

const earth = new Globe(scene, 2);
const iss = new Iss(scene, 0, 0, 0);

loadData();

async function loadPosition() {
  if (lat && lon) {
    const url = `https://api.wheretheiss.at/v1/coordinates/${lat},${lon}`;
    const response = await fetch(url);
    if (response.status === 200) {
      overDiv.style.visibility = 'visible';
      positionOver = await response.json();
      const countryCode = positionOver.country_code === '??' ? 'unknow' : regionNames.of(positionOver.country_code);
      overDiv.innerHTML = `<h3>ISS is over:</h3><h2>${countryCode}</h2>`;
    } else {
      overDiv.style.visibility = 'hidden';
    }
  }
}

async function loadData() {
  const response = await fetch(dataURL);
  loadedData = await response.json();
  // console.log(response);

  if (response.status === 200) {
    statusDiv.innerHTML = '';
    container.style.visibility = 'visible';
    // dateDiv.innerHTML = JSON.stringify(loadedData, undefined, 2);
    time = new Date(loadedData.timestamp * 1000);

    dateDiv.innerHTML = `<h2>${time.toLocaleTimeString()}<h2><h3>${time.toDateString()}</h3>`;
    lon = loadedData.longitude.toFixed(4);
    lat = loadedData.latitude.toFixed(4);
    const alt = loadedData.altitude.toFixed(2);
    const vis = loadedData.visibility;
    coordLongDiv.innerHTML = `<h3>longitude:</h3><h2>${lon}&deg;</h2>`;
    coordLatDiv.innerHTML = `<h3>latitude:</h3><h2>${lat}&deg;</h2>`;
    coordAltDiv.innerHTML = `<h3>altitude:</h3><h2>${alt}km</h2>`;

    const txt = vis === 'eclipsed' ? 'The ISS is in shadow' : 'The ISS is in daylight';
    visDiv.innerHTML = `<h3>${txt}</h3>`;
    iss.setCoords(lon, lat, alt);
    // loadPosition(lat, lon);
  } else {
    container.style.visibility = 'hidden';
    overDiv.style.visibility = 'hidden';
    statusDiv.innerHTML = `Server sesponse: ${response.statusText}`;
  }
}

// iss.setCoords(180, 20, 500);
setInterval(loadPosition, 2500);
setInterval(loadData, 1000);
