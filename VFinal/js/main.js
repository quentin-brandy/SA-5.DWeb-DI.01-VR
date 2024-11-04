
// Declare VR variable with initial scenes structure
let VR = {
  scenes: {},
  defaultScene: null
};

// Function to load VR object from JSON file
async function loadVRFromJSON() {
  try {
    const response = await fetch('../assets/json/VR.json');
    const data = await response.json();
    VR = data;
    console.log("Loaded VR from JSON:", VR);
  } catch (error) {
    console.log("Using default VR structure:", VR);
  }
  return VR;
}

// Initialize VR
async function initVR() {
  const loadedVR = await loadVRFromJSON();
  return loadedVR;
}

// Initialize VR
const initializedVR = await initVR();
VR = initializedVR;
console.log("Initialized VR:", VR);
export default VR;

import {
  AddSceneSelectOption,
  checkAndSpawnDefaultScene,
} from "./SceneManager.js";



AddSceneSelectOption();
checkAndSpawnDefaultScene();
