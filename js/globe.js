import * as THREE from 'https://cdn.skypack.dev/three@0.132.0/build/three.module.js';

class Globe {
  globeRadius = 2;
  scene;

  loader = new THREE.TextureLoader();
  mapTexture = this.loader.load('img/worldMap.png');
  mapColor = this.loader.load('img/worldMapColor.png');
  map = this.loader.load('img/worldMap.jpg');
  mapBump = this.loader.load('img/worldMap_bump.jpg');

  globeMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    // alphaMap: this.mapTexture,
    map: this.map,
    bumpMap: this.mapBump,
    bumpScale: 0.01,
    // side: THREE.FrontSide,
    // transparent: false,
    // depthTest: true,
    // alphaTest: 0.5,
    // opacity: 0.6,
  });

  constructor(sc, r) {
    this.scene = sc;
    this.globeRadius = r;

    this.globGeo = new THREE.SphereGeometry(this.globeRadius, 64, 64);
    this.globeMesh = new THREE.Mesh(this.globGeo, this.globeMat);
    this.globeMesh.rotateY(-Math.PI / 2);
    this.scene.add(this.globeMesh);
  }
}

export { Globe };
