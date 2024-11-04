import VR from './main.js';
import { LoadFile } from './FileManager.js';
import { loadTag } from './TagManager.js';

export function checkAndSpawnDefaultScene() {
    if (VR && VR.scenes && VR.scenes.defaultScene) {
        const defaultScene = VR.scenes.defaultScene;
        const skyElement = document.getElementById("image-360");
        const sceneselect = document.getElementById("selectscene");
        const sceneNameInput = document.getElementById("scene-name");
        const defaultSceneCheckbox = document.getElementById("default-scene-checkbox");
        sceneselect.value = defaultScene;
        defaultSceneCheckbox.checked = defaultScene === VR.scenes.defaultScene;
        // Mettre à jour l'image de la scène

        LoadFile();
        loadTag();
        LoadSceneExplorer();
    }
}

export function switchScene() {
    const currentScene = localStorage.getItem('currentScene');
    const defaultSceneCheckbox = document.getElementById("default-scene-checkbox");
    defaultSceneCheckbox.checked = (currentScene === VR.scenes.defaultScene);
    // Mettre à jour l'image de la scène

    LoadFile();
    loadTag();
    LoadSceneExplorer();
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

export function LoadSceneExplorer() {
    const sceneExplorer = document.getElementById('scene-tags');
    const currentScene = localStorage.getItem('currentScene');
    const Scenetitle = document.getElementById('scene-title-explorer');
    Scenetitle.textContent = currentScene;
    const selectedScene = VR.scenes[currentScene];
    sceneExplorer.innerHTML = '';
    selectedScene.tags.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.textContent = tag.name;
        tagElement.id = tag.name;
        const icon = document.createElement('img');
        if (tag.type === 'door') {
            tagElement.setAttribute('data-type', 'door');
            icon.src = '../assets/svg/door-closed-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
                ModifyDoor(event);
                updateSelectedTag(event.target);
            });
        } else if (tag.type === 'text') {
            tagElement.setAttribute('data-type', 'text');
            icon.src = '../assets/svg/card-text-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
                ModifyText(event);
                updateSelectedTag(event.target);
            });
        } else if (tag.type === 'photo') {
            tagElement.setAttribute('data-type', 'photo');
            icon.src = '../assets/svg/file-image-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
                ModifyPhoto(event);
                updateSelectedTag(event.target);
            });
        } else if (tag.type === 'infoBulle') {
            tagElement.setAttribute('data-type', 'infoBulle');
            icon.src = '../assets/svg/info-circle-dark.svg';
            tagElement.className = 'flex items-center gap-2 border-b-custom-gray p-2 border-b border-solid cursor-pointer';
            tagElement.addEventListener('click', function (event) {
                ModifyInfoBulle(event);
                updateSelectedTag(event.target);
            });
        }
        tagElement.prepend(icon);

        sceneExplorer.appendChild(tagElement);
    });
}
