import VR from './main.js';

export function AddFile() {
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
                AddFileName.className = 'imported_file_name flex items-center gap-2';
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

export function LoadFile() { 
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
        AddFileName.className = 'imported_file_name flex items-center gap-2';
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


export function DeleteFile () {
let li = document.querySelector('.imported_file_name');
const sceneSelect = document.getElementById('selectscene');
const skyElement = document.getElementById('image-360');
const Filename = document.getElementById('name_import');
li.remove();

VR.scenes[sceneSelect.value].image.url = './assets/img/sky.jpg';
VR.scenes[sceneSelect.value].image.name = 'sky.jpg';

skyElement.setAttribute('src', './assets/img/sky.jpg');
LoadFile();
console.log(li);

}