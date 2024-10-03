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

// Set an interval to call saveVRToLocalStorage every second (10000 milliseconds)
setInterval(saveVRToLocalStorage, 120000);

export default VR;

import {addDoor } from './DoorManager.js';
import {AddScene, DeleteScene, ChangeSceneName , DuplicateScene , SceneExplorer , AddSceneSelectOption, switchScene} from './SceneManager.js';
import {LoadFile } from './FileManager.js';
import {addText,  LegendText } from './TextManager.js';
import { addInfoBulle } from './InfoBulleManager.js';



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

let AddInfoBulle = document.getElementById('plus-infoBulle');
AddInfoBulle.addEventListener('click', addInfoBulle);

// Add event listener to the save button
let exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', saveVRToJSON);

let resetButton = document.getElementById('delete-save');
resetButton.addEventListener('click', ResetAll);

let SaveButton = document.getElementById('save-button');
SaveButton.addEventListener('click', saveVRToLocalStorage);


function saveVRToJSON() {
    let VRString = JSON.stringify(VR);
    let blob = new Blob([VRString], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'VR.json';
    a.click();
}

function ResetAll() {
    localStorage.clear();
    location.reload();
}

AddSceneSelectOption();
switchScene();