// Declare VR variable
let VR;

// Function to save VR object to localStorage
function saveVRToLocalStorage() {
  localStorage.setItem("VR", JSON.stringify(VR));
}
try {
  const response = await fetch('../assets/json/VR.json');
  if (response.ok) {
    VR = await response.json();
    console.log("Loaded VR from VR.json:", VR);
  } else {
    throw new Error('VR.json not found');
  }
} catch (error) {
  const savedVR = localStorage.getItem("VR");
  if (savedVR && savedVR !== "{}") {
    VR = JSON.parse(savedVR);
    console.log("Loaded VR from localStorage:", VR);
  } else {
    VR = {
      scenes: {
        scene1: {
          name: "scene1",
          tags: [],
          image: {
            url: "../assets/img/1.jpg",
            name: "1.jpg",
          },
        },
        defaultScene: "scene1",
      },
    };
    console.log("Initialized default VR:", VR);
  }
}
// Export VR after it has been initialized
console.log(VR);
export { VR };


import {
  AddSceneSelectOption,
  switchScene,
  checkAndSpawnDefaultScene,
} from "./SceneManager.js";



let rightController = document.getElementById("rightController");
rightController.addEventListener("abuttondown", () => {
  let selectedScene = document.querySelector("sceneselect");
  selectedScene.value = VR.scenes.defaultScene;
  switchScene();
});

AddSceneSelectOption();
checkAndSpawnDefaultScene();
