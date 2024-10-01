import  VR  from './main.js';
import { LoadFile } from './FileManager.js';
import { LoadDoors , ModifyDoor , RouteSelect } from './DoorManager.js';
import { Loadtext , ModifyText } from './TextManager.js';
import { ModifyInfoBulle } from './InfoBulleManager.js';

export function AddScene() {
    const selectElement = document.getElementById('selectscene');
    const sceneNameInput = document.getElementById('scene-name');
const sceneCount = Object.keys(VR.scenes).length;
const newSceneName = `scene${sceneCount + 1}`;
VR.scenes[newSceneName] = {
    name: newSceneName,
    tags: [],
    image: {
        url: './assets/img/sky.jpg',
        name: 'sky.jpg'
    }
};
AddSceneSelectOption();
selectElement.selectedIndex = sceneCount;
sceneNameInput.value = newSceneName;
switchScene();
}


export function DeleteScene() {
    const selectElement = document.getElementById('selectscene');
    if(Object.keys(VR.scenes).length === 1) {
        alert('Vous ne pouvez pas supprimer la dernière scène');
        return
    }
    let templateSection = document.getElementById('template_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    let oldscene = selectElement.value;
    delete VR.scenes[oldscene];
    AddSceneSelectOption();
    switchScene();
};


export function ChangeSceneName() {
    const sceneNameInput = document.getElementById('scene-name');
    const selectElement = document.getElementById('selectscene');
    const RenameDiv = document.querySelector('.div__rename');
    const oldSceneName = selectElement.value;
    const newSceneName = sceneNameInput.value;
    for (let sceneKey in VR.scenes) {
        if (sceneKey === newSceneName) {
            let Namealert = document.createElement('p');
            Namealert.textContent = 'Ce nom de scène existe déjà';
            Namealert.className = 'name_alert';
            RenameDiv.append(Namealert);
            setTimeout(() => {
                RenameDiv.removeChild(Namealert);
            }, 5000);
            return; 
        }
    }
    VR.scenes[newSceneName] = { ...VR.scenes[oldSceneName], name: newSceneName };
    delete VR.scenes[oldSceneName];
console.log(VR);
    selectElement.options[selectElement.selectedIndex].value = newSceneName;
    selectElement.options[selectElement.selectedIndex].text = newSceneName;
    switchScene();
    RouteSelect();
}

export function DuplicateScene() {
    const selectElement = document.getElementById('selectscene');
    const SceneName = selectElement.value;
    const newSceneName = `${SceneName}-copy`;

    VR.scenes[newSceneName] = {
        ...VR.scenes[SceneName],
        name: newSceneName,
        image: { ...VR.scenes[SceneName].image } 
    };
    AddSceneSelectOption();
    selectElement.value = newSceneName;
    switchScene();
}



export function switchScene() {
    const skyElement = document.getElementById('image-360');
    const sceneselect = document.getElementById('selectscene');
    const sceneNameInput = document.getElementById('scene-name');
    
    // Mettre à jour l'image de la scène
    const selectedScene = VR.scenes[sceneselect.value];
    if (selectedScene.image.url) {
        skyElement.setAttribute('src', selectedScene.image.url);
    } else {
        skyElement.setAttribute('src', './assets/img/sky.jpg');
    }
    let templateSection = document.getElementById('template_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    // Charger les nouvelles entités et réinitialiser les événements
    sceneNameInput.value = sceneselect.options[sceneselect.selectedIndex].text;
    LoadFile();
    LoadDoors();
    SceneExplorer();
    Loadtext();
}

export function AddSceneSelectOption() {
    const selectElement = document.getElementById('selectscene');
    selectElement.innerHTML = '';
    Object.keys(VR.scenes).forEach(sceneKey => {
        const scene = VR.scenes[sceneKey];
        const option = document.createElement('option');
        option.value = scene.name;
        option.textContent = scene.name;
        selectElement.appendChild(option);
    });
}

export function SceneExplorer() {   
    const sceneExplorer = document.getElementById('scene-tags');
    const sceneSelect = document.getElementById('selectscene');
    const Scenetitle = document.getElementById('scene-title-explorer');
    Scenetitle.textContent = sceneSelect.value;
    const selectedScene = VR.scenes[sceneSelect.value];
    sceneExplorer.innerHTML = '';
    selectedScene.tags.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.textContent = tag.name;
        tagElement.id = tag.name;
        if (tag.type === 'door') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/door-closed-dark.svg")]';
        
        } else if (tag.type === 'text') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/card-text-dark.svg")]';
        } else if (tag.type === 'infbulle') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/info-circle-dark.svg")]';
        }

        sceneExplorer.appendChild(tagElement);
    });
}

export function AddSceneExplorer(newtag , type){
    // console.log(newtag);
    // console.log(type);
    // console.log('test');
    const sceneExplorer = document.getElementById('scene-tags');
    const tagElement = document.createElement('li');
        tagElement.textContent = newtag;
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
        sceneExplorer.appendChild(tagElement);
        tagElement.id = newtag;
     if (type === 'door') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/door-closed-dark.svg")]';
            document.addEventListener('click', function (event) {
                if (event.target.id === newtag) {
                    ModifyDoor(event);
                }
            });
        
        } else if (type === 'text') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/card-text-dark.svg")]';
            document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyText(event);
            }
           
        });
        } else if (type === 'infbulle') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/info-circle-dark.svg")]';
            document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyInfoBulle(event);
            }
           
        });
        }
}

