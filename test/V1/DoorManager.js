import  VR from './main.js';
import { AddSceneExplorer , switchScene } from './SceneManager.js';


export function addDoor() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -5;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const doorCount = selectedScene.tags.filter(tag => tag.type === 'door').length;
    const doorName = `door${doorCount + 1}`;
    selectedScene.tags.push({
        type: 'door',
        position: { x: position.x, y: position.y, z: position.z },
        targetScene: 'scene1',
        name: doorName
    });


    var newEntity = document.createElement('a-sphere');
    newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    newEntity.setAttribute('radius', '1');
    newEntity.setAttribute('color', '#FF0000');
    newEntity.setAttribute('class', 'link'); 
    newEntity.setAttribute('scale', '0.5 0.5 0.5');
    newEntity.setAttribute('id', doorName);
    newEntity.addEventListener('click', function (event) { 
        TakeDoor(event);
    });
    document.querySelector('#door-entity').appendChild(newEntity);
    console.log(VR);
    AddSceneExplorer(doorName , 'door');
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
            newEntity.setAttribute('class', 'link'); 
            newEntity.setAttribute('scale', '0.5 0.5 0.5');
            newEntity.setAttribute('id', tag.name);
            newEntity.addEventListener('click', function (event) { 
                TakeDoor(event);
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
        if (tag.type === 'door' && tag.name === doorName) {
            var skyElement = document.getElementById('image-360');
            skyElement.setAttribute('src', VR.scenes[tag.targetScene].image.url); 
            console.log('Téléportation vers ' + tag.targetScene);

            // Change the selected scene in the select element
            sceneSelect.value = tag.targetScene;
            switchScene();
        }
    });
}
