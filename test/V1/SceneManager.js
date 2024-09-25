import  VR  from './main.js';
import { LoadFile } from './FileManager.Js';
import { LoadDoors } from './DoorManager.js';
import { Loadtext, ModifyText } from './TextManager.js';

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
    let oldscene = selectElement.value;
    delete VR.scenes[oldscene];
    console.log(VR);
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
    const selectedScene = VR.scenes[sceneselect.value];
    
    if (selectedScene.image.url) {
        skyElement.setAttribute('src', selectedScene.image.url);
    } else {
        skyElement.setAttribute('src', '/assets/img/sky.jpg');
    }
    sceneNameInput.value = sceneselect.options[sceneselect.selectedIndex].text;
    LoadFile();
    LoadDoors();
    SceneExplorer();
    Loadtext()
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
            tagElement.className = 'list__objet porte';
        
        } else if (tag.type === 'text') {
            tagElement.className = 'list__objet texte';
        }

        sceneExplorer.appendChild(tagElement);
    });
}

export function AddSceneExplorer(newtag , type){
    /* console.log(newtag);
    console.log(type);
    console.log('test'); */
    const sceneExplorer = document.getElementById('scene-tags');
    const tagElement = document.createElement('li');
        tagElement.textContent = newtag;
        tagElement.className = 'list__objet';
        sceneExplorer.appendChild(tagElement);
        tagElement.id = newtag;
     if (type === 'door') {
            tagElement.className = 'list__objet porte';
            document.addEventListener('click', function (event) {
                if (event.target.id === newtag) {
                    ModifyDoor(event);
                    console.log('test door');
                }
            });
        
        } else if (type === 'text') {
            tagElement.className = 'list__objet texte';
            document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyText(event);
                console.log('test text');
            }
        });
        }


}

