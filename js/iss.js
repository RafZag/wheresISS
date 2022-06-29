import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';

class Iss {
  scene;
  longitude;
  latitude;
  altitude;
  container = new THREE.Object3D();

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

    this.issGeo = new THREE.SphereGeometry(0.05, 16, 16);
    this.issMesh = new THREE.Mesh(this.issGeo, this.issMat);
    this.issMesh.translateZ(2.2);
    // this.globeMesh.rotateY(-Math.PI / 2);
    this.container.add(this.issMesh);
    this.scene.add(this.container);
  }

  setCoords(long, lat, alt) {
    this.longitude = long;
    this.latitude = lat;
    this.altitude = alt;

    this.container.rotation.y = this.deg2Rad(long);
    this.container.rotation.x = this.deg2Rad(lat);
  }

  deg2Rad(deg) {
    return (deg * Math.PI) / 180;
  }
}

export { Iss };
