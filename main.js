import {addDoor, LoadDoors} from './DoorManager.js';
import {AddScene, DeleteScene, ChangeSceneName , DuplicateScene , SceneExplorer , AddSceneExplorer , AddSceneSelectOption, switchScene} from './SceneManager.js';
import {LoadFile } from './FileManager.Js';
import {addText, Loadtext} from './TextManager.js';
let VR = {
    scenes: {
        scene1: {
            name: 'scene1',
            tags: [],
            image: {
                url: '/assets/img/1.jpg',
                name: '1.jpg'
            }
        }
    }
};
export default VR ;



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



AddSceneSelectOption();
switchScene();
LoadFile();
LoadDoors();
SceneExplorer();
Loadtext();