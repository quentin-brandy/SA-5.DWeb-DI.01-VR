let VR = {
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
export default VR ;

import {addDoor, LoadDoors } from './DoorManager.js';
import {AddScene, DeleteScene, ChangeSceneName , DuplicateScene , SceneExplorer , AddSceneSelectOption, switchScene} from './SceneManager.js';
import {LoadFile } from './FileManager.js';
import {addText, Loadtext} from './TextManager.js';
import { addInfoBulle } from "./InfoBulleManager.js";



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

let AddInfoBulle = document.getElementById('plus-infbulle');
AddInfoBulle.addEventListener('click', addInfoBulle);


export function LoadSlider(e) {
    const ratio = (e.value - e.min) / (e.max - e.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
}


AddSceneSelectOption();
switchScene();
LoadFile();
LoadDoors();
Loadtext();
SceneExplorer();