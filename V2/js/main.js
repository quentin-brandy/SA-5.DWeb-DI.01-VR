// Function to save VR object to localStorage
function saveVRToLocalStorage() {
  localStorage.setItem("VR", JSON.stringify(VR));
}

// Function to load VR object from localStorage
function loadVRFromLocalStorage() {
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

// Declare VR variable
let VR;

// Call loadVRFromLocalStorage when the page loads
loadVRFromLocalStorage();

// Set an interval to call saveVRToLocalStorage every 120 seconds (120000 milliseconds)
setInterval(saveVRToLocalStorage, 1000);

export default VR;

import { addDoor } from "./DoorManager.js";
import {
  AddScene,
  DeleteScene,
  ChangeSceneName,
  DuplicateScene,
  AddSceneSelectOption,
  switchScene,
  setDefaultScene,
  checkAndSpawnDefaultScene,
} from "./SceneManager.js";
import { addText } from "./TextManager.js";
import { addPhoto } from "./PhotoManager.js";
import { addInfoBulle } from "./InfoBulleManager.js";
const actions = {
  "plus-scene": AddScene,
  "minus-scene": DeleteScene,
  switchscenename: ChangeSceneName,
  "duplicate-scene": DuplicateScene,
  "plus-door": addDoor,
  "plus-text": addText,
  "plus-photo": addPhoto,
  "plus-infoBulle": addInfoBulle,
  "export-button": saveVRToJSON,
  "delete-save": ResetAll,
  "save-button": saveVRToLocalStorage,
  "default-scene-checkbox": setDefaultScene,
};
Object.keys(actions).forEach((id) => {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", actions[id]);
  }
});

document.getElementById("selectscene").addEventListener("change", switchScene);

function saveVRToJSON() {
  let VRString = JSON.stringify(VR);
  let blob = new Blob([VRString], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "VR.json";
  a.click();
}

function ResetAll() {
  localStorage.clear();
  location.reload();
}

let rightController = document.getElementById("rightController");
rightController.addEventListener("abuttondown", () => {
  let selectedScene = document.querySelector("sceneselect");
  selectedScene.value = VR.scenes.defaultScene;
  switchScene();
});

AddSceneSelectOption();
checkAndSpawnDefaultScene();
