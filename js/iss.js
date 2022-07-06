import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.0/examples/jsm/loaders/GLTFLoader.js';

class Iss {
  scene;
  longitude;
  latitude;
  altitude;
  container = new THREE.Object3D();
  gltfLoader = new GLTFLoader();
  positionLine = new THREE.BufferGeometry();

  lineMat = new THREE.LineBasicMaterial({
    color: 0xfceb78,
    transparent: true,
    opacity: 0.4,
    depthTest: true,
    alphaTest: 0.3,
    linewidth: 4,
    blending: THREE.AdditiveBlending,
  });

  issMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    // alphaMap: this.mapTexture,
    // map: this.mapColor,
    // bumpMap: this.mapBump,
    // bumpScale: 0.005,
    // side: THREE.FrontSide,
    // transparent: false,
    // depthTest: true,
    // alphaTest: 0.5,
    // opacity: 0.6,
  });

  constructor(sc, long, lat, alt) {
    this.scene = sc;
    this.longitude = long;
    this.latitude = lat;
    this.altitude = alt;

    this.loadMesh('./gltf/iss.glb');

    // this.issGeo = new THREE.SphereGeometry(0.05, 16, 16);
    // this.issMesh = new THREE.Mesh(this.issGeo, this.issMat);
    // this.issMesh.translateZ(2.2);
    // this.container.add(this.issMesh);
    // this.scene.add(this.container);
  }

  loadMesh(url) {
    this.gltfLoader.load(
      url,
      function (gltf) {
        this.modelMesh = gltf.scene.children[0]; // Object

        this.modelMesh.scale.x = 0.02;
        this.modelMesh.scale.y = 0.02;
        this.modelMesh.scale.z = 0.02;
        // console.log(this.modelMesh);

        this.modelMesh.translateY(2.2);
        this.modelMesh.rotation.x = Math.PI / 2;
        this.modelMesh.rotation.z = Math.PI / 2;
        this.container.add(this.modelMesh);

        // this.container.rotation.x = Math.PI / 2;

        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 2.2, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(geometry, this.lineMat);
        this.container.add(line);
        this.scene.add(this.container);
      }.bind(this),
      function (xhr) {
        //this.loadedProc = xhr.loaded / xhr.total;
      }.bind(this),
      function (error) {
        console.log('An error happened ' + error);
      }
    );
  }

  setCoords(long, lat, alt) {
    this.longitude = long;
    this.latitude = lat;
    this.altitude = alt;
    this.container.rotation.x = Math.PI / 2;
    this.container.rotation.y = 0;
    this.container.rotation.z = 0;

    this.container.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), this.deg2Rad(-lat));
    this.container.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), this.deg2Rad(long));
    //
  }

  deg2Rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export { Iss };
