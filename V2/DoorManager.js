import  VR  from './main.js';
import { AddSceneExplorer , switchScene , LoadSceneExplorer ,  handleMove , AddSceneSelectOption } from './SceneManager.js';
import { renameTag , TagPositionChange , Door , duplicateTag } from './TagManager.js';


let isMoving = false; // Variable pour suivre savoir si le déplacement est activé


export function addDoor() {
    // Sélection de la scène actuelle
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    if (!selectedScene) {
        console.error('Scène non trouvée');
        return;
    }

    // Instancier Door pour gérer les portes
    const doorManager = new Door(selectedScene);

    // Obtenir la caméra et la direction
    const cameraEl = document.querySelector('#camera').object3D;
    const direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    // Calculer la position en fonction de la caméra
    const distance = -1;
    const position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    // Créer un nom unique pour la porte
    const doorCount = selectedScene.tags.filter(tag => tag.type === 'door').length;
    const doorName = `door${doorCount + 1}`;

    // Ajouter la porte via Door
    doorManager.addDoorTag(doorName, { x: position.x, y: position.y, z: position.z });

    // Créer l'entité pour la porte
    const newEntity = document.createElement('a-sphere');
    newEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    newEntity.setAttribute('radius', '1');
    newEntity.setAttribute('color', '#FF0000');
    newEntity.setAttribute('class', 'link clickable movableBox');
    newEntity.setAttribute('scale', '0.5 0.5 0.5');
    newEntity.setAttribute('id', doorName);
    
    // Ajouter des événements de clic et de déplacement
    newEntity.addEventListener('click', function (event) {
        TakeDoor(event);
    });
    
    document.querySelector('#rightController').addEventListener('grip-down', function (event) {
        if (event.target === newEntity) {
            MoveDoor(event);
        }
    });

    // Ajouter l'entité à la scène
    document.querySelector('#door-entity').appendChild(newEntity);

    // Ajouter la porte à l'explorateur de scène
    AddSceneExplorer(doorName, 'door');

    console.log(VR);
}



export function LoadDoors() {
    const doorEntities = document.querySelector('#door-entity');
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    while (doorEntities.firstChild) {
        doorEntities.removeChild(doorEntities.firstChild);
    }
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'door') {
            var newEntity = document.createElement('a-sphere');
            newEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            newEntity.setAttribute('radius', '1');
            newEntity.setAttribute('color', '#FF0000');
            newEntity.setAttribute('class', 'link clickable'); 
            newEntity.setAttribute('scale', '0.5 0.5 0.5');
            newEntity.setAttribute('id',   tag.name , 'movableBox');
            newEntity.addEventListener('click', function (event) { 
                TakeDoor(event);
            })
            document.querySelector('#rightController').addEventListener('triggerdown', function (event) {
                if (event.target === newEntity) {
                    TakeDoor(event);
                }
            });
            document.querySelector('#door-entity').appendChild(newEntity);
        }
        
    });
}

export function TakeDoor(e) {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const doorName = e.target.id;
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'door' && tag.name === doorName && tag.targetScene !== 'no scene') {
            var skyElement = document.getElementById('image-360');
            skyElement.setAttribute('src', VR.scenes[tag.targetScene].image.url); 
            console.log('Téléportation vers ' + tag.targetScene);

            // Change the selected scene in the select element
            sceneSelect.value = tag.targetScene;
            switchScene();
        }
    });
}


export function ModifyDoor(e) {
    const sceneSelect = document.getElementById('selectscene');
    // const StartPosition = document.getElementById('door-position'); // Removed as it's not used
    const selectedScene = VR.scenes[sceneSelect.value];
    const doorName = e.target.id;
    console.log(doorName);
    const templateSection = document.getElementById('template_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    let templateText = document.getElementById('template__porte').innerHTML;
    const recipe = document.getElementById('template_section');
    templateText = templateText.replaceAll("{{name}}", e.target.innerText);
    recipe.innerHTML = templateText;

    const text = selectedScene.tags.find(tag => tag.type === 'door' && tag.name === doorName);

    templateText = templateText.replaceAll("{{name}}", text.name);
    templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
    templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y); 
    templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
    templateText = templateText.replaceAll("{{colorFill}}", text.fill);
    recipe.innerHTML = templateText;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';

    let rangeInputs = document.querySelectorAll('.inputRange');
    rangeInputs.forEach(rgInput => {
        LoadSlider(rgInput);
    });

        let Name = document.getElementById('door-name');
        Name.textContent = doorName;

        let CopyDoor = document.getElementById('dupliButton');
        CopyDoor.addEventListener('click', duplicateTag('door'));

        document.getElementById('RenameButton').addEventListener('click', function () {
            renameTag('door', e.target.id);
        });

        let DeleteDoor = document.getElementById('TrashButton');
        DeleteDoor.addEventListener('click', deleteDoor);

        let Route = document.getElementById('scene-route-select');
        Route.addEventListener('change', RouteSelected);

        let inputRangesPosition = document.querySelectorAll('.position');
        inputRangesPosition.forEach(inputRange => {
            inputRange.addEventListener('input', (event) => TagPositionChange(event, 'door'));
        });

        const moveButton = document.getElementById('button_move');
        if (moveButton) {
            moveButton.addEventListener('click', function() {
                // Si vous avez besoin de désactiver un précédent listener, vous pouvez le faire ici
                toggleMove(doorName); // Remplacez cela par la fonction de déplacement
            });
        }

        let Addscene = document.getElementById('plus-doorscene');
        Addscene.addEventListener('click',AddSelectScene);
        RouteSelect();
    } 

function LoadSlider(e) {
    const ratio = (e.value - e.min) / (e.max - e.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

}

export function DuplicateDoor() {
    let doorName = document.getElementById('door-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const originalDoor = selectedScene.tags.find(tag => tag.type === 'door' && tag.name === doorName);

    if (originalDoor) {
        const newDoorName = `${doorName}_copy`;
        const newDoorPosition = { ...originalDoor.position, x: originalDoor.position.x + 1 }; 

        selectedScene.tags.push({
            ...originalDoor,
            name: newDoorName,
            position: newDoorPosition
        });

        var newEntity = document.createElement('a-sphere');
        newEntity.setAttribute('position', `${newDoorPosition.x} ${newDoorPosition.y} ${newDoorPosition.z}`);
        newEntity.setAttribute('radius', '1');
        newEntity.setAttribute('color', '#FF0000');
        newEntity.setAttribute('class', 'link');
        newEntity.setAttribute('scale', '0.5 0.5 0.5');
        newEntity.setAttribute('id', newDoorName);
        newEntity.addEventListener('click', function (event) {
            TakeDoor(event);
        });
        document.querySelector('#door-entity').appendChild(newEntity);
        console.log(VR);
        AddSceneExplorer(newDoorName, 'door');
    }
}

export function deleteDoor(){
    let doorName = document.getElementById('door-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const door = selectedScene.tags.find(tag => tag.type === 'door' && tag.name === doorName);
    const doorElement = document.querySelector(`#door-entity #${doorName}`);
    console.log(doorElement);
    const index = selectedScene.tags.indexOf(door);
    selectedScene.tags.splice(index, 1);
    doorElement.remove();
    console.log(VR);
    let templateSection = document.getElementById('template_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    LoadSceneExplorer();
}



function AddSelectScene(){
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
RouteSelect();
}

export function RouteSelect() {
    const doorName = document.getElementById('door-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const RouteSelect = document.getElementById("scene-route-select");
    const selectedScene = VR.scenes[sceneSelect.value];
    RouteSelect.innerHTML = '';
    console.log(VR.scenes);

    // Add "no scene" option
    var noSceneOption = document.createElement('option');
    noSceneOption.text = 'no scene';
    noSceneOption.value = 'no scene';
    RouteSelect.add(noSceneOption);

    Object.values(VR.scenes).forEach(scene => {
        if (scene !== selectedScene) {
            var option = document.createElement('option');
            option.text = scene.name; // Assuming each scene has a 'name' property
            option.value = scene.name; // Assuming each scene has a 'name' property
            RouteSelect.add(option);
        }
    });

    const doorTag = selectedScene.tags.find(tag => tag.type === 'door' && tag.name === doorName);
    RouteSelect.value = doorTag.targetScene;
}

export function RouteSelected(){
    const doorName = document.getElementById('door-name').textContent;
    console.log(doorName);
    const RouteSelect  = document.getElementById("scene-route-select");
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'door' && tag.name === doorName) {
            tag.targetScene = RouteSelect.value;
        }
    });
}

function toggleMove(doorName) {
    const sceneEl = document.querySelector('a-scene'); // Assurez-vous que la scène est correctement sélectionnée
    const Name = doorName;
    const Type = 'door';

    function handleSceneClick(event) {
        handleMove(event, Name, Type);
        // Désactiver le mouvement après un clic
        isMoving = false;
        sceneEl.removeEventListener('click', handleSceneClick);
    }

    // Si nous venons d'activer le mouvement
    if (!isMoving) {
        isMoving = true; // Marquer comme en mouvement

        // Ajouter un listener pour le clic sur la scène
        sceneEl.addEventListener('click', handleSceneClick);
    } else {
        isMoving = false; // Désactiver le mouvement

        // Supprimer le listener lorsque le mouvement est désactivé
        sceneEl.removeEventListener('click', handleSceneClick);
    }
}
