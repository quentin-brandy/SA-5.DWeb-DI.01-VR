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
    selectedScene.tags.push({
        type: 'infoBulle',
        position: { x: position.x, y: position.y, z: position.z },
        name: infoBulleName
    });

    var sphereEntity = document.createElement('a-sphere');
    sphereEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    sphereEntity.setAttribute('radius', '0.5');
    sphereEntity.setAttribute('color', '#EF2D5E');
    sphereEntity.setAttribute('class', 'link');
    sphereEntity.setAttribute('id', `${infoBulleName}-sphere`);

    var infoPanelEntity = document.createElement('a-entity');
    infoPanelEntity.setAttribute('id', `${infoBulleName}-info-panel`);
    infoPanelEntity.setAttribute('position', '0 1 -3');
    infoPanelEntity.setAttribute('visible', 'false');

    var infoPlane = document.createElement('a-plane');
    infoPlane.setAttribute('color', '#FFF');
    infoPlane.setAttribute('height', '1');
    infoPlane.setAttribute('width', '2');

    var infoTextTitle = document.createElement('a-text');
    infoTextTitle.setAttribute('value', 'Information Panel');
    infoTextTitle.setAttribute('color', '#000');
    infoTextTitle.setAttribute('position', '0.5 0 0');
    infoTextTitle.setAttribute('opacity', '0');

    var infoTextDescription = document.createElement('a-text');
    infoTextDescription.setAttribute('value', 'This is a sphere.');
    infoTextDescription.setAttribute('color', '#000');
    infoTextDescription.setAttribute('position', '-0.8 -0.1 0');

    infoPlane.appendChild(infoTextTitle);
    infoPlane.appendChild(infoTextDescription);

    infoPanelEntity.appendChild(infoPlane);

    document.querySelector('#info-bulle-entity').appendChild(sphereEntity);
    document.querySelector('#info-bulle-entity').appendChild(infoPanelEntity);

    sphereEntity.addEventListener('click', function (event) {
        const isVisible = infoPanelEntity.getAttribute('visible');
        infoPanelEntity.setAttribute('visible', !isVisible);
    });
    AddSceneExplorer(infoBulleName, 'infbulle');
}


function templatageInfoBulle(event) {
    let temp = document.getElementById('template__info_bulle').innerHTML;
    let recipe = document.getElementById('template_section');

    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    console.log(event);
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === event.target.id);
    console.log(infBulle);

    if (infBulle) {
        temp = temp.replaceAll("{{name}}", infBulle.name);
        temp = temp.replaceAll("{{rangeValueX}}", infBulle.position.x);
        temp = temp.replaceAll("{{rangeValueY}}", infBulle.position.y);
        temp = temp.replaceAll("{{rangeValueZ}}", infBulle.position.z);
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
        console.log(tag);
        if (tag.type === 'infoBulle') {
            var sphereEntity = document.createElement('a-sphere');
            sphereEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            sphereEntity.setAttribute('radius', '0.5');
            sphereEntity.setAttribute('color', '#EF2D5E');
            sphereEntity.setAttribute('class', 'link');
            sphereEntity.setAttribute('id', `${tag.name}-sphere`);

            var infoPanelEntity = document.createElement('a-entity');
            infoPanelEntity.setAttribute('id', `${tag.name}-info-panel`);
            infoPanelEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            infoPanelEntity.setAttribute('visible', 'false');

            var infoPlane = document.createElement('a-plane');
            infoPlane.setAttribute('color', '#FFF');
            infoPlane.setAttribute('height', '1');
            infoPlane.setAttribute('width', '2');

            var infoTextTitle = document.createElement('a-text');
            infoTextTitle.setAttribute('value', 'Information Panel');
            infoTextTitle.setAttribute('color', '#000');
            infoTextTitle.setAttribute('position', (tag.position.x + 0.5) + ' ' + tag.position.y + ' ' + tag.position.z);
            infoTextTitle.setAttribute('opacity', '0');

            var infoTextDescription = document.createElement('a-text');
            infoTextDescription.setAttribute('value', 'This is a sphere.');
            infoTextDescription.setAttribute('color', '#000');
            infoTextDescription.setAttribute('position', tag.position.x + ' ' + (tag.position.y - 1) + ' ' + (tag.position.z + 0.1)); // -0.8 -0.1 0

            infoPlane.appendChild(infoTextTitle);
            infoPlane.appendChild(infoTextDescription);

            infoPanelEntity.appendChild(infoPlane);

            infoBulleEntities.appendChild(sphereEntity);
            infoBulleEntities.appendChild(infoPanelEntity);

            sphereEntity.addEventListener('click', function (event) {
                const isVisible = infoPanelEntity.getAttribute('visible');
                infoPanelEntity.setAttribute('visible', !isVisible);
            });
        }
    });
}


function switchAnimInfoBulle(ev) {
    console.log(ev.target);
    var panel = document.querySelector('#info-panel');
    var text = document.querySelector('#info-text');
    var sphere = document.querySelector('#sphere-test');

    var isVisible = panel.getAttribute('visible');
    panel.setAttribute('visible', !isVisible);

    if (!isVisible) {
        sphere.setAttribute('animation', 'property: radius; to: 0.2; dur: 1000');
        sphere.setAttribute('animation__pos', 'property: position; to: 1 1.5 -3; dur: 1000');
    } else {
        text.setAttribute('animation', 'property: opacity; to: 0; dur: 500');
        sphere.setAttribute('animation', 'property: radius; to: 0.5; dur: 1000');
        sphere.setAttribute('animation__pos', 'property: position; to: 0 1.25 -3; dur: 1000');
    }
}


export function ModifyInfoBulle(e) {
    loadInfoBulle();
    templatageInfoBulle(e);

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', InfBullePositionChange);
    });

    /* let SwitchInfoBulle = document.getElementById(`${e.target.id}-sphere`);
    SwitchInfoBulle.addEventListener('click', function () {
        switchAnimInfoBulle(e)
        console.log('click');
    }); */
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

        const infBulleSphere = document.querySelector(`#info-bulle-entity #${infBulleName}-sphere`);
        const infBullePanel = document.querySelector(`#info-bulle-entity #${infBulleName}-info-panel`);

        if (infBulleSphere && infBullePanel) {
            const newPosition = `${infBulle.position.x} ${infBulle.position.y} ${infBulle.position.z}`;
            infBulleSphere.setAttribute('position', newPosition);
            infBullePanel.setAttribute('position', newPosition);
        }
    }

    console.log(VR.scenes);
    LoadSlider(e.target);
    loadInfoBulle();
}