let VR = {
    scenes: {
        scene1: {
            name: 'scene1',
            tags: [],
            image: {
                url: '/assets/img/1.jpg',
                name: '1.jpg'
            }
        }
    }
};

function addDoor() {
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
    AddSceneExplorer(doorName);
}

function LoadDoors() {
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

function TakeDoor(e) {
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



function addText() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -5;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const textCount = selectedScene.tags.filter(tag => tag.type === 'text').length;
    const textName = `text${textCount + 1}`;
    
    var rotation = cameraEl.rotation.clone();
    
    selectedScene.tags.push({
        type: 'text',
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: 0, y: rotation.y, z: rotation.z },
        targetScene: 'scene1',
        name: textName
    });

    var newEntity = document.createElement('a-text');
    newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    newEntity.setAttribute('value', 'Sample Text');
    newEntity.setAttribute('color', '#FFFFFF');
    newEntity.setAttribute('align', 'center');
    newEntity.setAttribute('scale', '5 5 5');
    newEntity.setAttribute('id', textName);
    newEntity.object3D.rotation.set(0, rotation.y, rotation.z);

    document.querySelector('#text-entity').appendChild(newEntity);
    console.log(VR);
    AddSceneExplorer(textName);
}

function Loadtext() {
    const textEntities = document.querySelector('#text-entity');
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    while (textEntities.firstChild) {
        textEntities.removeChild(textEntities.firstChild);
    }
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'text') {
            var newEntity = document.createElement('a-text');
            newEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            newEntity.setAttribute('value', 'Sample Text');
            newEntity.setAttribute('color', '#FFFFFF');
            newEntity.setAttribute('align', 'center');
            newEntity.setAttribute('scale', '5 5 5');
            newEntity.setAttribute('id', tag.textName);
            newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);
           
          
        
            document.querySelector('#text-entity').appendChild(newEntity);
        }
    });
}



function AddScene() {
    const selectElement = document.getElementById('selectscene');
    const sceneNameInput = document.getElementById('scene-name');
const sceneCount = Object.keys(VR.scenes).length;
const newSceneName = `scene${sceneCount + 1}`;
VR.scenes[newSceneName] = {
    name: newSceneName,
    tags: [],
    image: {
        url: '/assets/img/sky.jpg',
        name: 'sky.jpg'
    }
};
AddSceneSelectOption();
selectElement.selectedIndex = sceneCount;
sceneNameInput.value = newSceneName;
switchScene();

}


function DeleteScene() {
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


function ChangeSceneName() {
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

function DuplicateScene() {
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


function AddFile() {
    const fileInput = document.getElementById('file-upload');
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');
    const sceneSelect = document.getElementById('selectscene');
    const Filename = document.getElementById('name_import');

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imageUrl = e.target.result;

                // Clear previous image and filename
                assetsContainer.innerHTML = '';
                Filename.innerHTML = '';

                const imgElement = document.createElement('img');
                imgElement.setAttribute('id', 'uploaded-image');
                imgElement.setAttribute('src', imageUrl);
                assetsContainer.appendChild(imgElement);

                let Scene = sceneSelect.value;
                console.log(sceneSelect.value)
                skyElement.setAttribute('src', '#uploaded-image');

                VR.scenes[Scene].image.url = imageUrl;
                VR.scenes[Scene].image.name = file.name;
            
                const AddFileName = document.createElement('li');
                AddFileName.className = 'imported_file_name';
                AddFileName.textContent = file.name;
                Filename.appendChild(AddFileName);
                
                const btn = document.createElement('button');
                btn.className = 'btn__icon';
                btn.innerHTML = '<img class="icon__scene" src="./assets/svg/trash3.svg" alt="Trash icon">';
                btn.addEventListener('click', DeleteFile);
                AddFileName.appendChild(btn);
                
            };

            reader.readAsDataURL(file);
            console.log(VR);
        }
    });
}

function LoadFile() { 
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');
    const sceneSelect = document.getElementById('selectscene');
    const Filename = document.getElementById('name_import');
    
    // Clear previous images and filenames
    assetsContainer.innerHTML = '';
    Filename.innerHTML = '';

    const selectedScene = VR.scenes[sceneSelect.value];
    if (selectedScene && selectedScene.image.url) {
        const imgElement = document.createElement('img');
        imgElement.setAttribute('id', 'uploaded-image');
        imgElement.setAttribute('src', selectedScene.image.url);
        assetsContainer.appendChild(imgElement);
        skyElement.setAttribute('src', '#uploaded-image');
        
        const AddFileName = document.createElement('li');
        AddFileName.textContent = selectedScene.image.name;
        AddFileName.className = 'imported_file_name';
        Filename.appendChild(AddFileName);
        if(selectedScene.image.name === 'sky.jpg') {
            return;
        }
        else {
        const btn = document.createElement('button');
        btn.className = 'btn__icon';
        btn.addEventListener('click', DeleteFile);
        btn.innerHTML = '<img class="icon__scene" src="./assets/svg/trash3.svg" alt="Trash icon">';
        AddFileName.appendChild(btn);
        }
    }

    AddFile();
}


function DeleteFile () {
let li = document.querySelector('.imported_file_name');
const sceneSelect = document.getElementById('selectscene');
const skyElement = document.getElementById('image-360');
const Filename = document.getElementById('name_import');
li.remove();

VR.scenes[sceneSelect.value].image.url = '/assets/img/sky.jpg';
VR.scenes[sceneSelect.value].image.name = 'sky.jpg';

skyElement.setAttribute('src', '/assets/img/sky.jpg');
LoadFile();
console.log(li);

}

function switchScene() {
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





function AddSceneSelectOption() {
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

function SceneExplorer() {
    const sceneExplorer = document.getElementById('scene-tags');
    const sceneSelect = document.getElementById('selectscene');
    const Scenetitle = document.getElementById('scene-title-explorer');
    Scenetitle.textContent = sceneSelect.value;
    const selectedScene = VR.scenes[sceneSelect.value];
    sceneExplorer.innerHTML = '';
    selectedScene.tags.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.textContent = tag.name;
        tagElement.className = 'list__objet';
        sceneExplorer.appendChild(tagElement);
    });
}

function AddSceneExplorer(newtag){
    console.log(newtag);
    console.log('test');
    const sceneExplorer = document.getElementById('scene-tags');
    const tagElement = document.createElement('li');
        tagElement.textContent = newtag;
        tagElement.className = 'list__objet';
        sceneExplorer.appendChild(tagElement);
}


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



AddSceneSelectOption();
switchScene();
LoadFile();
LoadDoors();
SceneExplorer();
Loadtext();