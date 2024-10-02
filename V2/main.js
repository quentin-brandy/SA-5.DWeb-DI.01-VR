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


const actions = {
    'plus-scene': AddScene,
    'minus-scene': DeleteScene,
    'switchscenename': ChangeSceneName,
    'duplicate-scene': DuplicateScene,
    'plus-door': addDoor,
    'plus-text': addText,
    'export-button': saveVRToJSON,
    'delete-save': ResetAll,
    'save-button': saveVRToLocalStorage
};
Object.keys(actions).forEach(id => {
    let element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', actions[id]);
    }
});

document.getElementById('selectscene').addEventListener('change', switchScene);


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