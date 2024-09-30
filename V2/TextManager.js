import { LoadSceneExplorer } from '../SceneManager.js';
import VR from './main.js';
import { AddSceneExplorer } from './SceneManager.js';
import { SceneExplorer , handleMove ,  } from './SceneManager.js';


let isMoving = false; // Variable pour suivre savoir si le déplacement est activé

export function addText() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -5;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const textCount = selectedScene.tags.filter(tag => tag.type === 'text').length;
    const textName = `text${textCount + 1}`;

    const textContent = 'Sample Text';
    const textFill = '#00C058';
    var rotation = cameraEl.rotation.clone();

    selectedScene.tags.push({
        type: 'text',
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: 0, y: rotation.y, z: rotation.z },
        content: textContent,
        fill: textFill,
        name: textName
    });

    var newEntity = document.createElement('a-text');
    newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    newEntity.setAttribute('value', textContent);
    newEntity.setAttribute('color', textFill);
    newEntity.setAttribute('align', 'center');
    newEntity.setAttribute('scale', '5 5 5');
    newEntity.setAttribute('id', textName);
    newEntity.object3D.rotation.set(0, rotation.y, rotation.z);

    document.querySelector('#text-entity').appendChild(newEntity);
    AddSceneExplorer(textName, 'text');
}

export function Loadtext() {
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
            newEntity.setAttribute('value', tag.content);
            newEntity.setAttribute('color', tag.fill);
            newEntity.setAttribute('align', 'center');
            newEntity.setAttribute('scale', '5 5 5');
            newEntity.setAttribute('id', tag.name);
            newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);



            document.querySelector('#text-entity').appendChild(newEntity);
        }
    });
}


function Loadobject(event) {
    let templateText = document.getElementById('template__texte').innerHTML;
    const recipe = document.getElementById('template_section');
    templateText = templateText.replaceAll("{{name}}", event.target.innerText);
    recipe.innerHTML = templateText;

    const textName = event.target.innerText;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);

    templateText = templateText.replaceAll("{{name}}", textName);
    templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
    templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y);
    templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
    templateText = templateText.replaceAll("{{rangeValueRx}}", text.rotation.x);
    templateText = templateText.replaceAll("{{rangeValueRy}}", text.rotation.y);
    templateText = templateText.replaceAll("{{rangeValueRz}}", text.rotation.z);
    templateText = templateText.replaceAll("{{colorFill}}", text.fill);
    recipe.innerHTML = templateText;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';

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
}

function LoadSlider(e) {
    const ratio = (e.value - e.min) / (e.max - e.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

}


export function ModifyText(event) {
    Loadobject(event);

    document.getElementById('RenameButton').addEventListener('click', function () {
        renameText(event.target.id);
    });

    document.getElementById('LegendButton').addEventListener('click', function () {
        LegendText(event.target.id);
    });

    document.getElementById('dupliButton').addEventListener('click', function () {
        duplicateText();
    });

    document.getElementById('TrashButton').addEventListener('click', function () {
        deleteText();
    });

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', TextPositionChange);
    });

    let inputRangesRotation = document.querySelectorAll('.rotation')
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', TextRotationChange);
    });

    document.getElementById('fillText').addEventListener('input', TextCouleurFillChange);
}

function renameText(nom) {
    const sceneName = document.getElementById('selectscene').value;
    const scene = VR.scenes[sceneName];
    const inputRename = document.getElementById('rename').value;
    const spanError = document.getElementById('span__error');
    if (scene.tags.some(tag => tag.name === inputRename)) {
        spanError.innerHTML = "Ce nom existe déjà !";
        return;
    }

    spanError.innerHTML = "";
    const tag = scene.tags.find(tag => tag.name === nom);
    let textScene = document.querySelector(`#text-entity #${nom}`);
    console.log(nom);
    if (tag) {
        tag.name = inputRename;
        const fakeEvent = {target: { id: tag.name}}
        textScene.setAttribute('id', tag.name);
        AddSceneExplorer(tag.name, 'text');
        LoadSceneExplorer();
        ModifyText(fakeEvent);
    }
}



function duplicateText() {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    let text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);

    const textCount = selectedScene.tags.filter(tag => tag.type === 'text').length;

    let cloneText = JSON.parse(JSON.stringify(text));
    cloneText.name = `${cloneText.name}_copy${textCount+1}`;
    selectedScene.tags.push(cloneText);

    AddSceneExplorer(cloneText.name, 'text');
    Loadtext();
}


function deleteText() {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    const textIndex = selectedScene.tags.findIndex(tag => tag.type === 'text' && tag.name === textName);

    if (textIndex !== -1) {
        selectedScene.tags.splice(textIndex, 1);

        console.log(`Tag supprimé à l'index ${textIndex}`);
        console.log(selectedScene.tags);

        SceneExplorer();
        Loadtext();
    } else {
        console.log("Tag non trouvé");
    }
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

    Loadtext();
}


export function TextPositionChange(e) {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const textPosition = parseFloat(e.target.value);

    document.querySelector(`#${axis}-value`).textContent = `${textPosition}`;

    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);
    if (text) {
        text.position = { ...text.position, [axis]: textPosition };

        const textElement = document.querySelector(`#text-entity #${textName}`);
        if (textElement) {
            textElement.setAttribute('position', `${text.position.x} ${text.position.y} ${text.position.z}`);
        }
    }
    LoadSlider(e.target);
    Loadtext();
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
    Loadtext();
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

    Loadtext();
}
function toggleMove(textName) {
    const sceneEl = document.querySelector('a-scene'); // Assurez-vous que la scène est correctement sélectionnée
    const Name = textName;
    const Type = 'text';

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
