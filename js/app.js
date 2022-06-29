import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.0/examples/jsm/controls/OrbitControls.js';
import { Globe } from '../js/globe.js';
import { Iss } from './iss.js';

const dataURL = 'https://api.wheretheiss.at/v1/satellites/25544';
let loadedData;

// const reloadButton = document.getElementById('btn');
const messageDiv = document.getElementById('msg');
const coordinatesDiv = document.getElementById('coord');

window.addEventListener('resize', onWindowResize);

//////////////////////////

let camera, scene, renderer, canvas;
let camPosition = new THREE.Vector3(0, 0, 10);

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
  renderer = new THREE.WebGLRenderer({ canvas, antyalias: true, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  document.body.appendChild(renderer.domElement);
}

function animate(time) {
  requestAnimationFrame(animate);
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

// lights
const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
light1.position.set(0, 200, 0);
light1.position.multiplyScalar(1.3);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light

scene.add(ambientLight);
scene.add(light1);

// controls

let controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
//controls.enableZoom = false;
controls.enableDamping = true;

loadData();

async function loadData() {
  const responce = await fetch(dataURL);
  loadedData = await responce.json();
  // messageDiv.innerHTML = JSON.stringify(loadedData, undefined, 2);
  const time = Date(loadedData.timestamp);

  messageDiv.innerHTML = time;
  const long = loadedData.longitude.toFixed(4);
  const lat = loadedData.latitude.toFixed(4);
  const alt = loadedData.altitude.toFixed(2);
  coordinatesDiv.innerHTML = `longitude: ${long}&deg;<br>latidtude: ${lat}&deg;<br>altitude: ${alt} km`;
  iss.setCoords(long, lat, alt);
}

setInterval(loadData, 1000);
