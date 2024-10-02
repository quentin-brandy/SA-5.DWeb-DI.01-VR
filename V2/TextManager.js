import VR from './main.js';
import { Text } from './Tagclass.js';
import { AddSceneExplorer , updateSelectedTag } from './SceneManager.js';
import { loadTag , TagPositionChange , renameTag ,  duplicateTag , deleteTag , toggleMove , LoadSlider , tagRotationChange} from './TagManager.js';




export function addText() {
    // Sélection de la scène actuelle
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    if (!selectedScene) {
        console.error('Scène non trouvée');
        return;
    }

    // Instancier la classe Text pour gérer les tags
    const textManager = new Text(selectedScene);

    // Obtenir la caméra et la direction
    const cameraEl = document.querySelector('#camera').object3D;
    const direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    // Calculer la position en fonction de la caméra
    const distance = -5;
    const position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    // Créer un nom unique pour le texte
    const textCount = selectedScene.tags.filter(tag => tag.type === 'text').length;
    const textName = `text${textCount + 1}`;

    // Ajouter le texte via TextManager
    textManager.addTextTag(
        textName,
        { x: position.x, y: position.y, z: position.z },
        { rx: 0, ry: cameraEl.rotation.y, rz: cameraEl.rotation.z },
        "Sample Text",
        '#00C058'
    );

    // Créer l'entité pour le texte
    const newEntity = document.createElement('a-text');
    newEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    newEntity.setAttribute('value', 'Sample Text');
    newEntity.setAttribute('color', '#00C058');
    newEntity.setAttribute('align', 'center');
    newEntity.setAttribute('scale', '5 5 5');
    newEntity.setAttribute('id', textName);
    newEntity.object3D.rotation.set(0, cameraEl.rotation.y, cameraEl.rotation.z);

    // Ajouter l'entité à la scène
    document.querySelector('#text-entity').appendChild(newEntity);

    // Ajouter le texte à l'explorateur de scène
    AddSceneExplorer(textName, 'text');
    ModifyText({ target: { id: textName } });
    console.log(VR);
}



export function ModifyText(event) {
    console.log(event.target.innerText);
    let templateText = document.getElementById('template__texte').innerHTML;
    const recipe = document.getElementById('template_section');
    templateText = templateText.replaceAll("{{name}}", event.target.id);
    recipe.innerHTML = templateText;

    const textName = event.target.id;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);
console.log(text);
    templateText = templateText.replaceAll("{{name}}", textName);
    templateText = templateText.replaceAll("{{Text}}", text.content);
    templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
    templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y);
    templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
    templateText = templateText.replaceAll("{{rangeValueRx}}", text.rotation.rx);
    templateText = templateText.replaceAll("{{rangeValueRy}}", text.rotation.ry);
    templateText = templateText.replaceAll("{{rangeValueRz}}", text.rotation.rz);
    templateText = templateText.replaceAll("{{colorFill}}", text.fill);
    recipe.innerHTML = templateText;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';
    let Explorer = document.getElementById(textName);
    updateSelectedTag(Explorer);
    const moveButton = document.getElementById('button_move');
    if (moveButton) {
        moveButton.addEventListener('click', function() {
            // Si vous avez besoin de désactiver un précédent listener, vous pouvez le faire ici
            toggleMove(textName); // Remplacez cela par la fonction de déplacement
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
            renameTag('text', textName);  // Utilise la valeur de l'input
        }, 1000);
    });

    document.getElementById('LegendButton').addEventListener('click', function () {
        LegendText(event.target.id);
    });
    document.getElementById('close-object').addEventListener('click', function () {
        recipe.innerHTML = '';
        recipe.className = '';
        Explorer.style.backgroundColor = '';
    });
    let CopyDoor = document.getElementById('dupliButton');
    CopyDoor.addEventListener('click', () => duplicateTag('text'));

    document.getElementById('TrashButton').addEventListener('click', function () {
        deleteTag('text');
    });

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', (event) => TagPositionChange(event, 'text'))
    });

    let inputRangesRotation = document.querySelectorAll('.rotation')
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', (event) => tagRotationChange(event , 'text'));
    });

    document.getElementById('fillText').addEventListener('input', TextCouleurFillChange);
}



export function LegendText(nom) {
    let sceneName = document.getElementById('selectscene').value;
    let scene = VR.scenes[sceneName];
    let tags = scene.tags;
    let tag = tags.find(isGoodText);

    let valueInput = document.getElementById('text_legend').value;
    tag.content = valueInput;

    function isGoodText(text) {
        return text.name === nom;
    }

    loadTag();
}


export function TextRotationChange(e) {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const textRotation = parseFloat(e.target.value);
    let axisAlone = axis.slice(1);


    document.querySelector(`#${axis}-value`).textContent = `${textRotation}`;

    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);
    if (text) {
        text.rotation = { ...text.rotation, [axisAlone]: textRotation };

        const textElement = document.querySelector(`#text-entity #${textName}`);
        if (textElement) {
            textElement.setAttribute('rotation', `${text.rotation.x} ${text.rotation.y} ${text.rotation.z}`);
        }
    }
    LoadSlider(e.target);
    loadTag();
}


export function TextCouleurFillChange(e) {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const colorValue = document.getElementById('textColorFill');
    const selectedScene = VR.scenes[sceneSelect.value];

    let text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);
    let inputColor = document.getElementById('fillText').value;
    text.fill = inputColor;
    colorValue.textContent = inputColor;

    loadTag();
}

