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
    console.log(VR);
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
            newEntity.setAttribute('id', tag.textName);
            newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);



            document.querySelector('#text-entity').appendChild(newEntity);
        }
    });
}


function Loadobject() {
    let templateText = document.getElementById('template__texte').innerHTML;
    const recipe = document.getElementById('tempalte_section');
    templateText = templateText.replaceAll("{{name}}", event.target.innerText);
    recipe.innerHTML = templateText;
    recipe.classList.add('fixed__section', 'objet');
    
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);  
     // Set initial values for the sliders
     document.getElementById('rx-slider').value = text.rotation.x.toFixed(1);
     document.getElementById('ry-slider').value = text.rotation.y.toFixed(1);
     document.getElementById('rz-slider').value = text.rotation.z.toFixed(1);

     // Update the text content for the slider values
     document.getElementById('rx-value').textContent = text.rotation.x.toFixed(1);
     document.getElementById('ry-value').textContent = text.rotation.y.toFixed(1);
     document.getElementById('rz-value').textContent = text.rotation.z.toFixed(1);

     // Update the gradient for each slider
     ['rx', 'ry', 'rz'].forEach(axis => {
         const slider = document.getElementById(`${axis}-slider`);
         const ratio = (slider.value - slider.min) / (slider.max - slider.min) * 100;
         const activeColor = "#00C058";
         const inactiveColor = "transparent";
         slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
     });

     document.getElementById('x-slider').value = text.position.x.toFixed(1);
     document.getElementById('y-slider').value = text.position.y.toFixed(1);
     document.getElementById('z-slider').value = text.position.z.toFixed(1);

     // Update the text content for the slider values
     document.getElementById('x-value').textContent = text.position.x.toFixed(1);
     document.getElementById('y-value').textContent = text.position.y.toFixed(1);
     document.getElementById('z-value').textContent = text.position.z.toFixed(1);

     // Update the gradient for each slider
     ['x', 'y', 'z'].forEach(axis => {
         const slider = document.getElementById(`${axis}-slider`);
         const ratio = (slider.value - slider.min) / (slider.max - slider.min) * 100;
         const activeColor = "#00C058";
         const inactiveColor = "transparent";
         slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
     });


 } 


export function ModifyText(event) {
    Loadobject();

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

    const ratio = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.target.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

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

    const ratio = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.target.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
    console.log(VR.scenes);
    
    Loadtext();
}


export function TextCouleurFillChange(e) {
    const textName = document.getElementById('text-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    let text = selectedScene.tags.find(tag => tag.type === 'text' && tag.name === textName);
    let inputColor = document.getElementById('fillText').value;
    text.fill = inputColor;
    
    Loadtext();
}