import VR from './main.js';
import { AddSceneExplorer } from './SceneManager.js';
import { SceneExplorer } from './SceneManager.js';
import { LoadSlider } from "./main.js";

export function addInfoBulle() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -1;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const infoBulleCount = selectedScene.tags.filter(tag => tag.type === 'infoBulle').length;
    const infoBulleName = `infoBulle${infoBulleCount + 1}`;
    const infoBulleTitle = 'Sample Title';
    const infoBulleDesc = 'Sample Description';
    var rotation = cameraEl.rotation.clone();
    var Visibility = false;
    var rad = 0.5;
    var defaultColorText = "#000";

    selectedScene.tags.push({
        type: 'infoBulle',
        title: infoBulleTitle,
        titleColor: defaultColorText,
        desc: infoBulleDesc,
        descColor: defaultColorText,
        isVisible: Visibility,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
        name: infoBulleName,
        radius: rad
    });

    var globalEntity = document.createElement('a-entity');
    globalEntity.setAttribute('id', `${infoBulleName}-global-panel`);
    globalEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    globalEntity.object3D.rotation.set(rotation.x, rotation.y, rotation.z);

    var sphereEntity = document.createElement('a-sphere');
    sphereEntity.setAttribute('id', `${infoBulleName}-sphere`);
    sphereEntity.setAttribute('radius', rad);
    sphereEntity.setAttribute('color', '#EF2D5E');
    sphereEntity.setAttribute('class', 'link');

    var infoPanelEntity = document.createElement('a-entity');
    infoPanelEntity.setAttribute('id', `${infoBulleName}-info-panel`);
    infoPanelEntity.setAttribute('position', '0 1 -3');
    infoPanelEntity.setAttribute('visible', Visibility);

    var infoPlane = document.createElement('a-plane');
    infoPlane.setAttribute('color', '#FFF');
    infoPlane.setAttribute('width', '2');
    infoPlane.setAttribute('height', '1');

    var infoTextTitle = document.createElement('a-text');
    infoTextTitle.setAttribute('id', `${infoBulleName}-title`);
    infoTextTitle.setAttribute('value', infoBulleTitle);
    infoTextTitle.setAttribute('color', defaultColorText);
    infoTextTitle.setAttribute('opacity', '0');
    infoTextTitle.setAttribute('width', '1.9');
    infoTextTitle.setAttribute('wrap-count', '30');

    var infoTextDescription = document.createElement('a-text');
    infoTextDescription.setAttribute('id', `${infoBulleName}-description`);
    infoTextDescription.setAttribute('value', infoBulleDesc);
    infoTextDescription.setAttribute('color', defaultColorText);
    infoTextDescription.setAttribute('width', '1.9');
    infoTextDescription.setAttribute('wrap-count', '30');

    infoPlane.appendChild(infoTextTitle);
    infoPlane.appendChild(infoTextDescription);

    infoPanelEntity.appendChild(infoPlane);

    globalEntity.appendChild(sphereEntity);
    globalEntity.appendChild(infoPanelEntity);

    document.querySelector('#info-bulle-entity').appendChild(globalEntity);
    AddSceneExplorer(infoBulleName, 'infbulle');
}


function templatageInfoBulle(event) {
    let temp = document.getElementById('template__info_bulle').innerHTML;
    let recipe = document.getElementById('template_section');

    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === event.target.id);

    if (infBulle) {

        let valueVisible;
        if (infBulle.isVisible) {
            valueVisible = 'checked';
        } else {
            valueVisible = '';
        }

        temp = temp.replaceAll("{{name}}", infBulle.name);
        temp = temp.replaceAll("{{title}}", infBulle.title);
        temp = temp.replaceAll("{{description}}", infBulle.desc);
        temp = temp.replaceAll("{{rangeValueRad}}", infBulle.radius.toFixed(2));
        temp = temp.replaceAll("{{colorTitle}}", infBulle.titleColor);
        temp = temp.replaceAll("{{colorDesc}}", infBulle.descColor);
        temp = temp.replaceAll("{{rangeValueX}}", infBulle.position.x.toFixed(2));
        temp = temp.replaceAll("{{rangeValueY}}", infBulle.position.y.toFixed(2));
        temp = temp.replaceAll("{{rangeValueZ}}", infBulle.position.z.toFixed(2));
        temp = temp.replaceAll("{{rangeValueRx}}", infBulle.rotation.x.toFixed(2));
        temp = temp.replaceAll("{{rangeValueRy}}", infBulle.rotation.y.toFixed(2));
        temp = temp.replaceAll("{{rangeValueRz}}", infBulle.rotation.z.toFixed(2));
        temp = temp.replaceAll("{{checkedOrNot}}", valueVisible);
        recipe.innerHTML = temp;
        recipe.className = "fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue";
    }
}


export function loadInfoBulle() {
    const infoBulleEntities = document.querySelector('#info-bulle-entity');
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    while (infoBulleEntities.firstChild) {
        infoBulleEntities.removeChild(infoBulleEntities.firstChild);
    }

    selectedScene.tags.forEach(tag => {
        if (tag.type === 'infoBulle') {
            var globalEntity = document.createElement('a-entity');
            globalEntity.setAttribute('id', `${tag.name}-global-panel`);
            globalEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            globalEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);

            var sphereEntity = document.createElement('a-sphere');

            sphereEntity.setAttribute('radius', tag.radius);
            sphereEntity.setAttribute('color', '#EF2D5E');
            sphereEntity.setAttribute('class', 'link');
            sphereEntity.setAttribute('id', `${tag.name}-sphere`);

            var infoPanelEntity = document.createElement('a-entity');
            infoPanelEntity.setAttribute('id', `${tag.name}-info-panel`);
            infoPanelEntity.setAttribute('visible', tag.isVisible);

            var infoPlane = document.createElement('a-plane');
            infoPlane.setAttribute('color', '#FFF');
            infoPlane.setAttribute('height', '1');
            infoPlane.setAttribute('width', '2');
            infoPlane.setAttribute('height', '1');

            var infoTextTitle = document.createElement('a-text');
            infoTextTitle.setAttribute('id', `${tag.name}-title`);
            infoTextTitle.setAttribute('value', tag.title);
            infoTextTitle.setAttribute('color', tag.titleColor);
            infoTextTitle.setAttribute('position', '-0.95 0.25 0.01');
            infoTextTitle.setAttribute('width', '1.9');
            infoTextTitle.setAttribute('wrap-count', '30');

            
            var infoTextDescription = document.createElement('a-text');
            infoTextDescription.setAttribute('id', `${tag.name}-description`);
            infoTextDescription.setAttribute('value', tag.desc);
            infoTextDescription.setAttribute('color', tag.descColor);
            infoTextDescription.setAttribute('position', '-0.95 -0.25 0.01');
            infoTextDescription.setAttribute('width', '1.9');
            infoTextDescription.setAttribute('wrap-count', '30');

            infoPlane.appendChild(infoTextTitle);
            infoPlane.appendChild(infoTextDescription);

            infoPanelEntity.appendChild(infoPlane);

            globalEntity.appendChild(sphereEntity);
            globalEntity.appendChild(infoPanelEntity);

            infoBulleEntities.appendChild(globalEntity);

            sphereEntity.addEventListener('click', function (event) {
                switchAnimInfoBulle(event);
            });
        }
    });
}


function switchAnimInfoBulle(ev) {
    let baseId = ev.target.id.split('-')[0];
    var panel = document.querySelector(`#${baseId}-info-panel`);
    var sphere = document.querySelector(`#${baseId}-sphere`);
    var title = document.querySelector(`#${baseId}-title`);
    var desc = document.querySelector(`#${baseId}-description`);

    var isVisible = panel.getAttribute('visible');
    panel.setAttribute('visible', !isVisible);

    if (!isVisible) {
        title.setAttribute('animation', 'property: opacity; to: 1; dur: 500');
        desc.setAttribute('animation', 'property: opacity; to: 1; dur: 500');
        sphere.setAttribute('animation', 'property: radius; to: 0.2; dur: 1000');
        sphere.setAttribute('animation__pos', `property: position; to: 1 0.45 0; dur: 1000`); //1 1.5 -3
    } else {

        title.setAttribute('animation', 'property: opacity; to: 0; dur: 500');
        desc.setAttribute('animation', 'property: opacity; to: 0; dur: 500');
        sphere.setAttribute('animation', 'property: radius; to: 0.5; dur: 1000');
        sphere.setAttribute('animation__pos', `property: position; to: 0 0 0; dur: 1000`); //0 1.25 -3
    }
}


export function ModifyInfoBulle(e) {
    loadInfoBulle();
    templatageInfoBulle(e);

    let CheckboxOpen = document.getElementById('checkboxOpen');
    CheckboxOpen.addEventListener('click', function () {
        InfBulleVisibleOrNot(e);
    });

    let ButtonName = document.getElementById('NameButton');
    ButtonName.addEventListener('click', function () {
        InfBulleText(e.target.id);
    });

    let inputRangesRad = document.querySelectorAll('.radius')
    inputRangesRad.forEach(inputRange => {
        inputRange.addEventListener('input', InfBulleRadiusChange);
    });

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', InfBullePositionChange);
    });

    let inputRangesRotation = document.querySelectorAll('.rotation')
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', InfBulleRotationChange);
    });

    let inputColorsText = document.querySelectorAll('.colorText');
    inputColorsText.forEach(inputClr => {
        inputClr.addEventListener('input', InfBulleClrsChange);
    });

    let rangeInputs = document.querySelectorAll('.inputRange');
    rangeInputs.forEach(rgInput => {
        LoadSlider(rgInput);
    });
}


export function InfBullePositionChange(e) {
    const infBulleName = document.getElementById('infbulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const infBullePosition = parseFloat(e.target.value);

    document.querySelector(`#${axis}-value`).textContent = `${infBullePosition}`;

    const infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    if (infBulle) {
        infBulle.position = { ...infBulle.position, [axis]: infBullePosition };

        const infBulleGlobal = document.querySelector(`#${infBulleName}-global-panel`);

        if (infBulleGlobal) {
            const newPosition = `${infBulle.position.x} ${infBulle.position.y} ${infBulle.position.z}`;
            infBulleGlobal.setAttribute('position', newPosition);
        }
    }
    LoadSlider(e.target);
    loadInfoBulle();
}

export function InfBulleRotationChange(e) {
    const infBulleName = document.getElementById('infbulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const infBullePosition = parseFloat(e.target.value);
    let axisAlone = axis.slice(1);


    document.querySelector(`#${axis}-value`).textContent = `${infBullePosition}`;

    const infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    if (infBulle) {
        infBulle.rotation = { ...infBulle.rotation, [axisAlone]: infBullePosition };

        const infBulleGlobal = document.querySelector(`#${infBulleName}-global-panel`);
        if (infBulleGlobal) {
            infBulleGlobal.setAttribute('rotation', `${infBulle.rotation.x} ${infBulle.rotation.y} ${infBulle.rotation.z}`);
        }
    }
    LoadSlider(e.target);
    loadInfoBulle();
}


export function InfBulleRadiusChange(e) {
    const infBulleName = document.getElementById('infbulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulleRadius = parseFloat(e.target.value);

    document.querySelector(`#rad-value`).textContent = `${infBulleRadius}`;
    const infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);

    if (infBulle) {
        infBulle.radius = infBulleRadius;
    }
    LoadSlider(e.target);
    loadInfoBulle();
}


export function InfBulleText(nom) {
    let sceneName = document.getElementById('selectscene').value;
    let scene = VR.scenes[sceneName];
    let tags = scene.tags;
    let tag = tags.find(isGoodInfBulle);

    let valueInputTitle = document.getElementById('textInfoBulleTitle').value;
    let valueInputDesc = document.getElementById('textInfoBulleDesc').value;

    tag.title = valueInputTitle;
    tag.desc = valueInputDesc;

    function isGoodInfBulle(text) {
        return text.name === nom;
    }

    loadInfoBulle();
}

export function InfBulleClrsChange(e) {
    const infBulleName = document.getElementById('infbulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    let infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    let inputColor = document.getElementById(`${e.target.id}`).value;

    if (e.target.id === 'colorInputTitle') {
        infBulle.titleColor = inputColor;
    } else if (e.target.id === 'colorInputDesc') {
        infBulle.descColor = inputColor;
    }

    loadInfoBulle();
}


function InfBulleVisibleOrNot(e) {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === e.target.id);
    let InputChecked = document.getElementById('checkboxOpen').checked;

    infBulle.isVisible = InputChecked;
    // loadInfoBulle();
    switchAnimInfoBulle(e)
}