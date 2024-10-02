import  VR  from './main.js';
import { Photo } from './Tagclass.js';
import { AddSceneExplorer , updateSelectedTag } from './SceneManager.js';

import { renameTag , TagPositionChange , duplicateTag , deleteTag , toggleMove , LoadSlider , tagRotationChange} from './TagManager.js';


export function addPhoto() {
    // Sélection de la scène actuelle
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    if (!selectedScene) {
        console.error('Scène non trouvée');
        return;
    }

    // Instancier Photo pour gérer les photos
    const photoManager = new Photo(selectedScene);

    // Obtenir la caméra et la direction
    const cameraEl = document.querySelector('#camera').object3D;
    const direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    // Calculer la position en fonction de la caméra
    const distance = -3;
    const position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    // Créer un nom unique pour la photo
    const photoCount = selectedScene.tags.filter(tag => tag.type === 'photo').length;
    const photoName = `photo${photoCount + 1}`;

    // Ajouter la photo via Photo
    photoManager.addPhotoTag(photoName, { x: position.x, y: position.y, z: position.z });

    // Créer l'entité pour la photo
    const newEntity = document.createElement('a-image');
    newEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    newEntity.setAttribute('src', './assets/img/sky.jpg');
  
    newEntity.setAttribute('scale', '1 1 1');
    newEntity.setAttribute('id', photoName);
    newEntity.object3D.rotation.set(0, cameraEl.rotation.y, cameraEl.rotation.z);

  

    document.querySelector('#rightController').addEventListener('grip-down', function (event) {
        if (event.target === newEntity) {
            // Logique pour déplacer la photo
            console.log(`Photo ${photoName} moved`);
        }
    });

    // Ajouter l'entité à la scène
    document.querySelector('#photo-entity').appendChild(newEntity);

    // Ajouter la photo à l'explorateur de scène
    AddSceneExplorer(photoName, 'photo');
    ModifyPhoto({ target: { id: photoName } });
    console.log(VR);
}


export function ModifyPhoto(event) {
    console.log(event.target.innerText);
    let templatePhoto = document.getElementById('template__photo').innerHTML;
    const recipe = document.getElementById('template_section');
    templatePhoto = templatePhoto.replaceAll("{{name}}", event.target.id);
    recipe.innerHTML = templatePhoto;

    const photoName = event.target.id;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const photo = selectedScene.tags.find(tag => tag.type === 'photo' && tag.name === photoName);
    console.log(photo);
    templatePhoto = templatePhoto.replaceAll("{{name}}", photoName);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueX}}", photo.position.x);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueY}}", photo.position.y);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueZ}}", photo.position.z);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueRx}}", photo.rotation.x);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueRy}}", photo.rotation.y);
    templatePhoto = templatePhoto.replaceAll("{{rangeValueRz}}", photo.rotation.z);
    recipe.innerHTML = templatePhoto;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';
    let Explorer = document.getElementById(photoName);
    updateSelectedTag(Explorer);
    const moveButton = document.getElementById('button_move');
    if (moveButton) {
        moveButton.addEventListener('click', function() {
            toggleMove(photoName);
        });
    }
    let rangeInputs = document.querySelectorAll('.inputRange');
    rangeInputs.forEach(rgInput => {
        LoadSlider(rgInput);
    });

    let renameTimeout;
    document.getElementById('rename').addEventListener('input', function (event) {
        clearTimeout(renameTimeout);
        renameTimeout = setTimeout(() => {
            renameTag('photo', photoName);
        }, 1000);
    });

    document.getElementById('close-object').addEventListener('click', function () {
        recipe.innerHTML = '';
        recipe.className = '';
        Explorer.style.backgroundColor = '';
    });

    let CopyDoor = document.getElementById('dupliButton');
    CopyDoor.addEventListener('click', () => duplicateTag('photo'));


    document.getElementById('TrashButton').addEventListener('click', function () {
        deleteTag('photo');
    });

    let inputRangesPosition = document.querySelectorAll('.position');
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', (event) => TagPositionChange(event, 'photo'));
    });

    let inputRangesRotation = document.querySelectorAll('.rotation');
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', (event) => tagRotationChange(event, 'photo'));
    });
}