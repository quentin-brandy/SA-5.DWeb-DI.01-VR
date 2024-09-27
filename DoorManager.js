import  VR from './main.js';
import { AddSceneExplorer , LoadSceneExplorer, switchScene } from './SceneManager.js';


export function addDoor() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -1;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const doorCount = selectedScene.tags.filter(tag => tag.type === 'door').length;
    const doorName = `door${doorCount + 1}`;
    selectedScene.tags.push({
        type: 'door',
        position: { x: position.x, y: position.y, z: position.z },
        targetScene: "no scene",
        name: doorName
    });

    var newEntity = document.createElement('a-sphere');
    newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    newEntity.setAttribute('radius', '1');
    newEntity.setAttribute('color', '#FF0000');
    newEntity.setAttribute('class', 'link clickable'); 
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
            newEntity.setAttribute('class', 'link clickable'); 
            newEntity.setAttribute('scale', '0.5 0.5 0.5');
            newEntity.setAttribute('id', tag.name);
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
    const StartPosition = document.getElementById('door-position');
    const selectedScene = VR.scenes[sceneSelect.value];
    const doorName = e.target.id;
    console.log(doorName);
    const templateSection = document.getElementById('tempalte_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'door' && tag.name === doorName) {
            const template = document.getElementById('template__porte');
            let templatesection = document.querySelector('#tempalte_section');
            templatesection.className = 'fixed__section objet';
            const clone = document.importNode(template.content, true);
            templatesection.appendChild(clone);

            // Set initial values for the sliders
            document.getElementById('x-slider').value = tag.position.x.toFixed(1);
            document.getElementById('y-slider').value = tag.position.y.toFixed(1);
            document.getElementById('z-slider').value = tag.position.z.toFixed(1);

            // Update the text content for the slider values
            document.getElementById('x-value').textContent = tag.position.x.toFixed(1);
            document.getElementById('y-value').textContent = tag.position.y.toFixed(1);
            document.getElementById('z-value').textContent = tag.position.z.toFixed(1);

            // Update the gradient for each slider
            ['x', 'y', 'z'].forEach(axis => {
                const slider = document.getElementById(`${axis}-slider`);
                const ratio = (slider.value - slider.min) / (slider.max - slider.min) * 100;
                const activeColor = "#00C058";
                const inactiveColor = "transparent";
                slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
            });
        }
    });

    if (templateSection.innerHTML === '') {
    } else {
        let Name = document.getElementById('door-name');
        Name.textContent = doorName;

        let CopyDoor = document.getElementById('duplicate-porte');
        CopyDoor.addEventListener('click', DuplicateDoor);

        let DeleteDoor = document.getElementById('delete-porte');
        DeleteDoor.addEventListener('click', deleteDoor);

        let Route = document.getElementById('scene-route-select');
        Route.addEventListener('change', RouteSelected);

        let DoorPosition = document.getElementById('door-position');
        DoorPosition.addEventListener('change', function (e) {
            DoorPositionChange(e);
        });

        RouteSelect();
    }
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

export function deleteDoor() {
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
    let templateSection = document.getElementById('tempalte_section');
    templateSection.className = '';
    templateSection.innerHTML = '';
    LoadSceneExplorer();
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

export function DoorPositionChange(e) {
    const doorName = document.getElementById('door-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const doorPosition = parseFloat(e.target.value);
    
    // Mise à jour du texte de la valeur du slider
    document.querySelector(`#${axis}-value`).textContent = `${doorPosition}`;

    // Mise à jour de la position de la porte dans la scène VR
    const door = selectedScene.tags.find(tag => tag.type === 'door' && tag.name === doorName);
    if (door) {
        door.position = { ...door.position, [axis]: doorPosition };
        
        const doorElement = document.querySelector(`#door-entity #${doorName}`);
        if (doorElement) {
        doorElement.setAttribute('position', `${door.position.x} ${door.position.y} ${door.position.z}`);
    }

    // Mise à jour du dégradé linéaire du slider
    const ratio = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";
    
    e.target.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
    
    console.log(VR);
    LoadDoors();
}
}
