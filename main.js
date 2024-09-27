// Function to save VR object to localStorage
function saveVRToLocalStorage() {
    localStorage.setItem('VR', JSON.stringify(VR));
}

// Function to load VR object from localStorage
function loadVRFromLocalStorage() {
    const savedVR = localStorage.getItem('VR');
    if (savedVR) {
        VR = JSON.parse(savedVR);
    } else {
        VR = {
            scenes: {
                scene1: {
                    name: 'scene1',
                    tags: [],
                    image: {
                        url: './assets/img/1.jpg',
                        name: '1.jpg'
                    }
                }
            }
        };
    }
}

// Declare VR variable
let VR;

// Call loadVRFromLocalStorage when the page loads
loadVRFromLocalStorage();

export default VR;

import {addDoor, LoadDoors} from './DoorManager.js';
import {AddScene, DeleteScene, ChangeSceneName , DuplicateScene , SceneExplorer , AddSceneSelectOption, switchScene} from './SceneManager.js';
import {LoadFile } from './FileManager.js';
import {addText, Loadtext, LegendText } from './TextManager.js';



let Addscene = document.getElementById('plus-scene');
Addscene.addEventListener('click', AddScene);

let Deletescene = document.getElementById('minus-scene');
Deletescene.addEventListener('click', DeleteScene);

let SceneSelect= document.getElementById('selectscene');
SceneSelect.addEventListener('change', switchScene);

let SceneName = document.getElementById('switchscenename');
SceneName.addEventListener('click', ChangeSceneName);

let Duplicatescene = document.getElementById('duplicate-scene');
Duplicatescene.addEventListener('click', DuplicateScene);

let AddDoor = document.getElementById('plus-door');
AddDoor.addEventListener('click', addDoor);

let AddText = document.getElementById('plus-text');
AddText.addEventListener('click', addText);

// Add event listener to the save button
let saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', saveVRToLocalStorage);



AddSceneSelectOption();
switchScene();

