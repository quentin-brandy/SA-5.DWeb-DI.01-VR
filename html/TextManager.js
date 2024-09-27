import VR from './main.js';
import { AddSceneExplorer } from './SceneManager.js';
import { SceneExplorer } from './SceneManager.js';

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
            newEntity.setAttribute('position', parseFloat(tag.position.x) + ' ' + parseFloat(tag.position.y) + ' ' + parseFloat(tag.position.z));
            newEntity.setAttribute('value', tag.content);
            newEntity.setAttribute('color', tag.fill);
            newEntity.setAttribute('align', 'center');
            newEntity.setAttribute('scale', '5 5 5');
            newEntity.setAttribute('id', tag.textName);
            newEntity.object3D.rotation.set(parseFloat(tag.rotation.x), parseFloat(tag.rotation.y), parseFloat(tag.rotation.z));



            document.querySelector('#text-entity').appendChild(newEntity);
        }
    });
}


function Loadobject(event) {
    let templateText = document.getElementById('template__texte').innerHTML;
    const recipe = document.getElementById('tempalte_section');
    templateText = templateText.replaceAll("{{name}}", event.target.innerText);
    recipe.innerHTML = templateText;
    
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);

    templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
    templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y);
    templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
    templateText = templateText.replaceAll("{{rangeValueRx}}", text.rotation.x);
    templateText = templateText.replaceAll("{{rangeValueRy}}", text.rotation.y);
    templateText = templateText.replaceAll("{{rangeValueRz}}", text.rotation.z);
    templateText = templateText.replaceAll("{{colorFill}}", text.fill);
    recipe.innerHTML = templateText;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';

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
    let sceneName = document.getElementById('selectscene').value;
    let scene = VR.scenes[sceneName];
    let tags = scene.tags;
    let tag = tags.find(isGoodText);

    if (tag) {
        let inputRename = document.getElementById('rename').value;
        tag.name = inputRename;
    }

    function isGoodText(text) {
        return text.name === nom;
    }

    SceneExplorer();
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