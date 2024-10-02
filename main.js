
       let VR = 
            {"scenes":{"scene1":{"name":"scene1","tags":[{"type":"door","name":"door1","position":{"x":-3.7,"y":0.2,"z":-8.2},"rotation":{},"targetScene":"scene2"},{"type":"text","name":"textporte","position":{"x":-4.3,"y":-1.3,"z":-10},"rotation":{"x":0,"y":1.1,"z":0},"content":"porte studio","fill":"#06fe7a"}],"image":{"url":"./assets/img/1.jpg","name":"1.jpg"}},"scene2":{"name":"scene2","tags":[{"type":"door","name":"door1","position":{"x":-9.6,"y":-0.8,"z":10},"rotation":{},"targetScene":"scene1"},{"type":"text","name":"text1","position":{"x":-9.4,"y":-2.8,"z":9},"rotation":{"x":0,"y":2.398000000000004,"z":0},"content":"Porte sortie","fill":"#00eeff"},{"type":"text","name":"text2","position":{"x":10,"y":0,"z":-10},"rotation":{"x":0,"y":-0.9239999999999959,"z":0},"content":"Suite du studio \nProchainement\n","fill":"#0fff7f"}],"image":{"url":"./assets/img/2.jpg","name":"2.jpg"}}}}





export default VR;

import {addDoor } from './DoorManager.js';
import {AddScene, DeleteScene, ChangeSceneName , DuplicateScene , SceneExplorer , AddSceneSelectOption, switchScene} from './SceneManager.js';
import {LoadFile } from './FileManager.js';
import {addText,  LegendText } from './TextManager.js';




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