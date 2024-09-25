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

function addDoor(){


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

AddSceneSelectOption();
switchScene();
LoadFile();