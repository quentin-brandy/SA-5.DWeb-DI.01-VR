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

    selectedScene.tags.push({
        type: 'infoBulle',
        title: infoBulleTitle,
        desc: infoBulleDesc,
        isVisible: Visibility,
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: 0, y: rotation.y, z: rotation.z },
        name: infoBulleName
    });

    var globalEntity = document.createElement('a-entity');
    globalEntity.setAttribute('id', `${infoBulleName}-global-panel`);
    globalEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    globalEntity.object3D.rotation.set(0, rotation.y, rotation.z);

    var sphereEntity = document.createElement('a-sphere');
    sphereEntity.setAttribute('radius', '0.5');
    sphereEntity.setAttribute('color', '#EF2D5E');
    sphereEntity.setAttribute('class', 'link');
    sphereEntity.setAttribute('id', `${infoBulleName}-sphere`);

    var infoPanelEntity = document.createElement('a-entity');
    infoPanelEntity.setAttribute('id', `${infoBulleName}-info-panel`);
    infoPanelEntity.setAttribute('position', '0 1 -3');
    infoPanelEntity.setAttribute('visible', Visibility);

    var infoPlane = document.createElement('a-plane');
    infoPlane.setAttribute('color', '#FFF');
    infoPlane.setAttribute('height', '1');
    infoPlane.setAttribute('width', '2');

    var infoTextTitle = document.createElement('a-text');
    infoTextTitle.setAttribute('id', `${infoBulleName}-title`);
    infoTextTitle.setAttribute('value', infoBulleTitle);
    infoTextTitle.setAttribute('color', '#000');
    infoTextTitle.setAttribute('opacity', '0');
    infoTextTitle.setAttribute('width', '2');
    infoTextTitle.setAttribute('wrap-count', '30');

    var infoTextDescription = document.createElement('a-text');
    infoTextDescription.setAttribute('id', `${infoBulleName}-description`);
    infoTextDescription.setAttribute('value', infoBulleDesc);
    infoTextDescription.setAttribute('color', '#000');
    infoTextDescription.setAttribute('width', '2');
    infoTextDescription.setAttribute('wrap-count', '30');

    infoPlane.appendChild(infoTextTitle);
    infoPlane.appendChild(infoTextDescription);

    infoPanelEntity.appendChild(infoPlane);

    globalEntity.appendChild(sphereEntity);
    globalEntity.appendChild(infoPanelEntity);

    document.querySelector('#info-bulle-entity').appendChild(globalEntity);
    // document.querySelector('#info-bulle-entity').appendChild(sphereEntity);
    // document.querySelector('#info-bulle-entity').appendChild(infoPanelEntity);
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
        temp = temp.replaceAll("{{rangeValueX}}", infBulle.position.x);
        temp = temp.replaceAll("{{rangeValueY}}", infBulle.position.y);
        temp = temp.replaceAll("{{rangeValueZ}}", infBulle.position.z);
        temp = temp.replaceAll("{{rangeValueRx}}", infBulle.rotation.x);
        temp = temp.replaceAll("{{rangeValueRy}}", infBulle.rotation.y);
        temp = temp.replaceAll("{{rangeValueRz}}", infBulle.rotation.z);
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
            globalEntity.object3D.rotation.set(0, tag.rotation.y, tag.rotation.z);

            var sphereEntity = document.createElement('a-sphere');
            console.log(tag);

            sphereEntity.setAttribute('radius', '0.5');
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

            var infoTextTitle = document.createElement('a-text');
            infoTextTitle.setAttribute('id', `${tag.name}-title`);
            infoTextTitle.setAttribute('value', tag.title);
            infoTextTitle.setAttribute('color', '#000');
            infoTextTitle.setAttribute('position', '-0.95 0.25 0.01');
            infoTextTitle.setAttribute('width', '2');
            infoTextTitle.setAttribute('wrap-count', '30');

            var infoTextDescription = document.createElement('a-text');
            infoTextDescription.setAttribute('id', `${tag.name}-description`);
            infoTextDescription.setAttribute('value', tag.desc);
            infoTextDescription.setAttribute('color', '#000');
            infoTextDescription.setAttribute('position', '-0.95 -0.25 0.01');
            infoTextDescription.setAttribute('width', '2');
            infoTextDescription.setAttribute('wrap-count', '30');

            infoPlane.appendChild(infoTextTitle);
            infoPlane.appendChild(infoTextDescription);

            infoPanelEntity.appendChild(infoPlane);

            globalEntity.appendChild(sphereEntity);
            globalEntity.appendChild(infoPanelEntity);

            infoBulleEntities.appendChild(globalEntity);

            // infoBulleEntities.appendChild(sphereEntity);
            // infoBulleEntities.appendChild(infoPanelEntity);

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

    console.dir(sphere);
    

    var isVisible = panel.getAttribute('visible');
    panel.setAttribute('visible', !isVisible);

    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === baseId);
    console.log(infBulle);
    

    if (!isVisible) {
        title.setAttribute('animation', 'property: opacity; to: 1; dur: 500');
        desc.setAttribute('animation', 'property: opacity; to: 1; dur: 500');
        sphere.setAttribute('animation', 'property: radius; to: 0.2; dur: 1000');
        sphere.setAttribute('animation__pos', `property: position; to: ${infBulle.position.x + 0.5} ${infBulle.position.y + 0.5} ${infBulle.position.z}; dur: 1000`); //1 1.5 -3
    } else {

        title.setAttribute('animation', 'property: opacity; to: 0; dur: 500');
        desc.setAttribute('animation', 'property: opacity; to: 0; dur: 500');
        sphere.setAttribute('animation', 'property: radius; to: 0.5; dur: 1000');
        sphere.setAttribute('animation__pos', `property: position; to: ${infBulle.position.x} ${infBulle.position.y} ${infBulle.position.z}; dur: 1000`); //0 1.25 -3
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
        InfBulleTitle(e.target.id);
    });

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', InfBullePositionChange);
    });

    let inputRangesRotation = document.querySelectorAll('.rotation')
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', InfBulleRotationChange);
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


export function InfBulleTitle(nom) {
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


function InfBulleVisibleOrNot(e) {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === e.target.id);
    let InputChecked = document.getElementById('checkboxOpen').checked;

    infBulle.isVisible = InputChecked;
    loadInfoBulle();
}