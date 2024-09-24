let VR = {
    scenes: {
        scene1: {
            name: 'scene1',
            tags: [],
            image: ''
        },
        scene2: {
            name: 'scene2',
            tags: [],
            image: './assets/img/2.jpg'
        }
    }
};

function AddFile() {
    // files
    const fileInput = document.getElementById('file-input');
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');

    // Listener pour détecter la sélection d'un fichier
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            // Lorsque le fichier est chargé, on l'ajoute dans les assets et dans le sky
            reader.onload = function (e) {
                const imageUrl = e.target.result;

                // Création dynamique d'une balise <img> dans les assets
                const imgElement = document.createElement('img');
                imgElement.setAttribute('id', 'uploaded-image');
                imgElement.setAttribute('src', imageUrl);
                assetsContainer.appendChild(imgElement);

                // Mise à jour de l'élément <a-sky> avec la nouvelle image
                skyElement.setAttribute('src', '#uploaded-image');

                // Mise à jour de l'objet VR avec l'image de la scène1
                VR.scenes.scene1.image = imageUrl;
            };

            // Lire le fichier sélectionné en tant qu'URL de données
            reader.readAsDataURL(file);
            console.log(VR);
        }
    });
}

AddFile();
const skyElement = document.getElementById('image-360');
// switch scène
let sceneselect = document.getElementById('selectscene');
sceneselect.addEventListener('change', function () {
    skyElement.setAttribute('src', VR.scenes[sceneselect.value].image);
});

const selectElement = document.getElementById('selectscene');
Object.keys(VR.scenes).forEach(sceneKey => {
    const scene = VR.scenes[sceneKey];
    const option = document.createElement('option');
    option.value = scene.name;
    option.textContent = scene.name;
    selectElement.appendChild(option);
});