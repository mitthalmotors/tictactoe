// Load a 3D kitten model
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function loadKittenModel() {
  const loader = new GLTFLoader();
  loader.load('kitten.gltf', (gltf) => {
    const kitten = gltf.scene;
    return kitten;
  });
}

export { loadKittenModel };