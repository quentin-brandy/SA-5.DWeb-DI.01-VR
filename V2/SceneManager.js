import  VR  from './main.js';
import { LoadFile } from './FileManager.js';
import { LoadDoors , ModifyDoor , RouteSelect } from './DoorManager.js';
import { Loadtext , ModifyText  } from './TextManager.js';

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
    LoadSceneExplorer()
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
            tagElement.className = 'list__objet porte';
        
        } else if (tag.type === 'text') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/card-text-dark.svg")]';
        }

        sceneExplorer.appendChild(tagElement);
    });
}

export function AddSceneExplorer(newtag , type){
    console.log(newtag);
    console.log(type);
    console.log('test');
    const sceneExplorer = document.getElementById('scene-tags');
    const tagElement = document.createElement('li');
        tagElement.textContent = newtag;
        tagElement.className = 'list__objet';
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
        }
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
        if (tag.type === 'door') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/door-closed-dark.svg")]';
            tagElement.addEventListener('click', function (event) {
                ModifyDoor(event);
            });
        } else if (tag.type === 'text') {
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer before:content-[url("./assets/svg/card-text-dark.svg")]';
            tagElement.addEventListener('click', function (event) {
                ModifyText(event);
            });
        }
        sceneExplorer.appendChild(tagElement);
    });
}



export function handleMove(event , Name , Type) {
    console.log(Name);
    const cameraEl = document.querySelector('[camera]'); // Sélectionner la caméra A-Frame 
    const currentTag = Name;
    const screenPosition = new THREE.Vector2();
    screenPosition.x = (event.clientX / window.innerWidth) * 2 - 1; // Normaliser X
    screenPosition.y = - (event.clientY / window.innerHeight) * 2 + 1; // Normaliser Y

    // Créer un rayon à partir de la caméra dans la direction du clic
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(screenPosition, cameraEl.getObject3D('camera')); // Utiliser l'objet caméra

    // Calculer l'intersection avec un plan qui représente le champ de vision de la caméra
    const distance = 3; // Distance à laquelle vous souhaitez placer la boîte
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.at(distance, intersectionPoint); // Obtenir le point sur le rayon à la distance spécifiée

    // Déplacer la porte actuelle à l'endroit où le clic a été détecté
    const door = document.querySelector(`#${Type}-entity #${currentTag}`);
    if (door) {
        door.setAttribute('position', {
            x: intersectionPoint.x,
            y: intersectionPoint.y,
            z: intersectionPoint.z,
        });

        // Mettre à jour la position dans le tableau de la scène
        const sceneSelect = document.getElementById('selectscene');
        const selectedScene = VR.scenes[sceneSelect.value];
        const doorTag = selectedScene.tags.find(tag => tag.name === currentTag);
        if (doorTag) {
            doorTag.position = {
                x: intersectionPoint.x,
                y: intersectionPoint.y,
                z: intersectionPoint.z,
            };
        }

        // Mettre à jour la position dans la porte de la scène
        if (Type === 'door') {
            const doorEntity = selectedScene.tags.find(door => door.name === currentTag);
            if (doorEntity) {
                doorEntity.position = {
                    x: intersectionPoint.x,
                    y: intersectionPoint.y,
                    z: intersectionPoint.z,
                };
            }
        }

        document.getElementById('x-slider').value = doorTag.position.x.toFixed(1);
        document.getElementById('y-slider').value = doorTag.position.y.toFixed(1);
        document.getElementById('z-slider').value = doorTag.position.z.toFixed(1);

        // Update the text content for the slider values
        document.getElementById('x-value').textContent = doorTag.position.x.toFixed(1);
        document.getElementById('y-value').textContent = doorTag.position.y.toFixed(1);
        document.getElementById('z-value').textContent = doorTag.position.z.toFixed(1);

        // Update the gradient for each slider
        ['x', 'y', 'z'].forEach(axis => {
            const slider = document.getElementById(`${axis}-slider`);
            const ratio = (slider.value - slider.min) / (slider.max - slider.min) * 100;
            const activeColor = "#00C058";
            const inactiveColor = "transparent";
            slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
        });

        console.log(`Porte déplacée à la position : ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`);
    }
}
