import  VR  from './main.js';
import { LoadFile } from './FileManager.js';
import {  ModifyDoor , RouteSelect } from './DoorManager.js';
import {  ModifyText  } from './TextManager.js';
import { loadTag } from './TagManager.js';
import { ModifyPhoto } from './PhotoManager.js';
import { ModifyInfoBulle } from './InfoBulleManager.js';
import { ModifyRobot } from './RobotManager.js';


export function checkAndSpawnDefaultScene() {
    if (VR && VR.scenes && VR.scenes.defaultScene) {
      const defaultScene = VR.scenes.defaultScene;
      const skyElement = document.getElementById("image-360");
      const sceneselect = document.getElementById("selectscene");
      const sceneNameInput = document.getElementById("scene-name");
      const defaultSceneCheckbox = document.getElementById(
        "default-scene-checkbox"
      );
      sceneselect.value = defaultScene;
      defaultSceneCheckbox.checked = defaultScene === VR.scenes.defaultScene;
      // Mettre à jour l'image de la scène
  
      let templateSection = document.getElementById("template_section");
      templateSection.className = "";
      templateSection.innerHTML = "";
      // Charger les nouvelles entités et réinitialiser les événements
      console.log(sceneselect.options);
      sceneNameInput.value = sceneselect.options[sceneselect.selectedIndex].text;
      LoadFile();
      loadTag();
      LoadSceneExplorer();
    }
  }


export function AddScene() {
    const selectElement = document.getElementById('selectscene');
    const sceneNameInput = document.getElementById('scene-name');
    const sceneCount = Object.keys(VR.scenes).length - 1; // Ignore 'defaultScene'
    const newSceneName = `scene${sceneCount + 1}`;
    VR.scenes[newSceneName] = {
        name: newSceneName,
        tags: [],
        image: {
            url: '../assets/img/image_360.png',
            name: 'image_360.png',
        }
    };
    AddSceneSelectOption();
    selectElement.selectedIndex = sceneCount;
    sceneNameInput.value = newSceneName;
    switchScene();
}

export function DeleteScene() {
    const selectElement = document.getElementById("selectscene");
    const oldScene = selectElement.value;

    if (Object.keys(VR.scenes).length === 1) {
        alert("Vous ne pouvez pas supprimer la dernière scène");
        return;
    }

    if (oldScene === VR.scenes.defaultScene) {
        alert("Vous ne pouvez pas supprimer la scène par défaut. Veuillez d'abord changer la scène par défaut.");
        return;
    }

    let templateSection = document.getElementById("template_section");
    templateSection.className = "";
    templateSection.innerHTML = "";

    delete VR.scenes[oldScene];
    console.log(VR);
    AddSceneSelectOption();
    switchScene();
}


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

export function setDefaultScene() {
    const sceneSelect = document.getElementById('selectscene');
    const defaultScene = sceneSelect.value;
    VR.scenes.defaultScene = defaultScene;
    console.log(VR);
}


export function switchScene() {
    const skyElement = document.getElementById('image-360');
    const sceneselect = document.getElementById('selectscene');
    const sceneNameInput = document.getElementById('scene-name');
    const defaultSceneCheckbox = document.getElementById('default-scene-checkbox');
    const currentScene = sceneselect.value;
    defaultSceneCheckbox.checked = (currentScene === VR.scenes.defaultScene);
    // Mettre à jour l'image de la scène
    
    let templateSection = document.getElementById('template_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    // Charger les nouvelles entités et réinitialiser les événements
    sceneNameInput.value = sceneselect.options[sceneselect.selectedIndex].text;
    LoadFile();
    loadTag();
    LoadSceneExplorer()
   
}

export function AddSceneSelectOption() {
    const selectElement = document.getElementById('selectscene');
    selectElement.innerHTML = '';
    Object.keys(VR.scenes).forEach(sceneKey => {
        if (sceneKey !== 'defaultScene') {
            const scene = VR.scenes[sceneKey];
            const option = document.createElement('option');
            option.value = scene.name;
            option.textContent = scene.name;
            selectElement.appendChild(option);
        }
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
        if (type === 'door') {
            tagElement.setAttribute('data-type', 'door');
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
           
        } else if (type === 'text') {
            tagElement.setAttribute('data-type', 'text');
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
           
        }
        else if (type === 'photo') {
            tagElement.setAttribute('data-type', 'photo');
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
           
        }
        else if (type === 'infoBulle') {
            tagElement.setAttribute('data-type', 'infoBulle');
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
        }
        else if (type === 'robot') {
            tagElement.setAttribute('data-type', 'robot');
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
        }
        sceneExplorer.appendChild(tagElement);
    });
}


export function AddSceneExplorer(newtag, type) {
    console.log(newtag);
    console.log(type);
    console.log('test');

    const sceneExplorer = document.getElementById('scene-tags');
    const tagElement = document.createElement('li');
    tagElement.textContent = newtag;
    tagElement.className = 'list__objet';
    tagElement.id = newtag;

    const iconArrow = document.createElement('img');
    const icon = document.createElement('img');

    // Utiliser le paramètre 'type' au lieu de 'tag.type'
    if (type === 'door') {
        tagElement.setAttribute('data-type', 'door');
        iconArrow.src = '../assets/svg/arrow-return-right.svg';
        icon.src = '../assets/svg/door-closed-dark.svg';
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("../assets/svg/arrow-return-right.svg")]';
        document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyDoor(event);
                updateSelectedTag(event.target);
            }
        });
    } else if (type === 'text') {
        tagElement.setAttribute('data-type', 'text');
        iconArrow.src = '../assets/svg/arrow-return-right.svg';
        icon.src = '../assets/svg/card-text-dark.svg';
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("../assets/svg/arrow-return-right.svg")]';
        document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyText(event);
                updateSelectedTag(event.target);
            }
        });
    } else if (type === 'photo') {
        tagElement.setAttribute('data-type', 'photo');
        iconArrow.src = '../assets/svg/arrow-return-right.svg';
        icon.src = '../assets/svg/file-image-dark.svg';
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("../assets/svg/arrow-return-right.svg")]';
        document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyPhoto(event);
                updateSelectedTag(event.target);
            }
        });
    } else if (type === 'infoBulle') {
        tagElement.setAttribute('data-type', 'infoBulle');
        iconArrow.src = '../assets/svg/arrow-return-right.svg';
        icon.src = '../assets/svg/info-circle-dark.svg';
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("../assets/svg/arrow-return-right.svg")]';
        document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyInfoBulle(event);
                updateSelectedTag(event.target);
            }
            
        });
    }
    else if (type === 'robot') {
        tagElement.setAttribute('data-type', 'robot');
        iconArrow.src = '../assets/svg/arrow-return-right.svg';
        icon.src = '../assets/svg/robot-dark.svg';
        tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("../assets/svg/arrow-return-right.svg")]';
        document.addEventListener('click', function (event) {
            if (event.target.id === newtag) {
                ModifyRobot(event);
                updateSelectedTag(event.target);
            }
        });
    }

    tagElement.prepend(icon);
    tagElement.prepend(iconArrow);
    sceneExplorer.appendChild(tagElement);
    updateSelectedTag(tagElement);
}

export function updateSelectedTag(selectedElement) {
    console.log(selectedElement);
    const sceneExplorer = document.getElementById('scene-tags');
    const tags = sceneExplorer.getElementsByTagName('li');
    for (let tag of tags) {
        tag.style.backgroundColor = ''; // Reset background color for all tags
    }
    selectedElement.style.backgroundColor = '#d3d3d3'; // Set background color for selected tag
}

export function LoadSceneExplorer() {
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
        const iconArrow = document.createElement('img');
        const icon = document.createElement('img');
        if (tag.type === 'door') {
            tagElement.setAttribute('data-type', 'door');
            iconArrow.src = '../assets/svg/arrow-return-right.svg';
            icon.src = '../assets/svg/door-closed-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
            ModifyDoor(event);
            updateSelectedTag(event.target);
            });
        } else if (tag.type === 'text') {
            tagElement.setAttribute('data-type', 'text');
            iconArrow.src = '../assets/svg/arrow-return-right.svg';
            icon.src = '../assets/svg/card-text-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
            ModifyText(event);
            updateSelectedTag(event.target);
            });
        } else if (tag.type === 'photo') {
            tagElement.setAttribute('data-type', 'photo');
            iconArrow.src = '../assets/svg/arrow-return-right.svg';
            icon.src = '../assets/svg/file-image-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
            ModifyPhoto(event);
            updateSelectedTag(event.target);
            });
        } else if (tag.type === 'infoBulle') {
            tagElement.setAttribute('data-type', 'infoBulle');
            iconArrow.src = '../assets/svg/arrow-return-right.svg';
            icon.src = '../assets/svg/info-circle-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
            ModifyInfoBulle(event);
            updateSelectedTag(event.target);
            });
        }
        else if (tag.type === 'robot') {
            tagElement.setAttribute('data-type', 'robot');
            iconArrow.src = '../assets/svg/arrow-return-right.svg';
            icon.src = '../assets/svg/robot-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
            ModifyRobot(event);
            updateSelectedTag(event.target);
            });
        }
        tagElement.prepend(icon);
        tagElement.prepend(iconArrow);
   
        sceneExplorer.appendChild(tagElement);
    });
}
