import VR from './main.js';
import { AddSceneExplorer, updateSelectedTag } from './SceneManager.js';
import { loadTag, TagPositionChange, renameTag, duplicateTag, deleteTag, toggleMove, LoadSlider, InfoBulle } from './TagManager.js';

export function addInfoBulle() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    const InfoBulleManager = new InfoBulle(selectedScene);

    var distance = -1;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const infoBulleCount = selectedScene.tags.filter(tag => tag.type === 'infoBulle').length;
    const infoBulleName = `infoBulle${infoBulleCount + 1}`;
    // var Visibility = false;
    // var rad = 0.5;

    InfoBulleManager.addInfoBulleTag(
        infoBulleName,
        { x: position.x, y: position.y, z: position.z },
        { x: 0, y: cameraEl.rotation.y, z: cameraEl.rotation.z },
        "Sample Title",
        "Sample Description",
        '#000',
        '#000',
        '0.5',
        false
    );

    var globalEntity = document.createElement('a-entity');
    globalEntity.setAttribute('id', `${infoBulleName}`);
    globalEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    globalEntity.object3D.rotation.set(cameraEl.rotation.x, cameraEl.rotation.y, cameraEl.rotation.z);

    var sphereEntity = document.createElement('a-sphere');
    sphereEntity.setAttribute('id', `${infoBulleName}-sphere`);
    sphereEntity.setAttribute('radius', 0.5);
    sphereEntity.setAttribute('color', '#EF2D5E');
    sphereEntity.setAttribute('class', 'link');

    var infoPanelEntity = document.createElement('a-entity');
    infoPanelEntity.setAttribute('id', `${infoBulleName}-info-panel`);
    infoPanelEntity.setAttribute('visible', false);

    var infoPlane = document.createElement('a-plane');
    infoPlane.setAttribute('color', '#FFF');
    infoPlane.setAttribute('width', '2');
    infoPlane.setAttribute('height', '1');

    var infoTextTitle = document.createElement('a-InfoBulle');
    infoTextTitle.setAttribute('id', `${infoBulleName}-title`);
    infoTextTitle.setAttribute('value', "Sample Title");
    infoTextTitle.setAttribute('position', '-0.95 0.25 0.01');
    infoTextTitle.setAttribute('color', "#000");
    infoTextTitle.setAttribute('opacity', '0');
    infoTextTitle.setAttribute('width', '1.9');
    infoTextTitle.setAttribute('wrap-count', '30');

    var infoTextDescription = document.createElement('a-InfoBulle');
    infoTextDescription.setAttribute('id', `${infoBulleName}-description`);
    infoTextDescription.setAttribute('value', "Sample Description");
    infoTextDescription.setAttribute('position', '-0.95 -0.25 0.01');
    infoTextDescription.setAttribute('color', "#000");
    infoTextDescription.setAttribute('width', '1.9');
    infoTextDescription.setAttribute('wrap-count', '30');

    infoPlane.appendChild(infoTextTitle);
    infoPlane.appendChild(infoTextDescription);

    infoPanelEntity.appendChild(infoPlane);

    globalEntity.appendChild(sphereEntity);
    globalEntity.appendChild(infoPanelEntity);

    document.querySelector('#infoBulle-entity').appendChild(globalEntity);

    AddSceneExplorer(infoBulleName, 'infoBulle');
    ModifyInfoBulle({ target: { id: infoBulleName } });
}


export function ModifyInfoBulle(event) {
    console.log(event.target.innerText);
    let templateInfBulle = document.getElementById('template__info_bulle').innerHTML;
    const recipe = document.getElementById('template_section');
    templateInfBulle = templateInfBulle.replaceAll("{{name}}", event.target.id);
    recipe.innerHTML = templateInfBulle;

    const textInfoBulle = event.target.id;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const InfoBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === textInfoBulle);
    console.log(InfoBulle);
    templateInfBulle = templateInfBulle.replaceAll("{{name}}", textInfoBulle);
    templateInfBulle = templateInfBulle.replaceAll("{{title}}", InfoBulle.contentTitle);
    templateInfBulle = templateInfBulle.replaceAll("{{description}}", InfoBulle.contentDesc);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueX}}", InfoBulle.position.x);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueY}}", InfoBulle.position.y);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueZ}}", InfoBulle.position.z);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRx}}", InfoBulle.rotation.x);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRy}}", InfoBulle.rotation.y);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRz}}", InfoBulle.rotation.z);
    templateInfBulle = templateInfBulle.replaceAll("{{colorTitle}}", InfoBulle.fillTitle);
    templateInfBulle = templateInfBulle.replaceAll("{{colorDesc}}", InfoBulle.fillDesc);
    templateInfBulle = templateInfBulle.replaceAll("{{checkedOrNot}}", InfoBulle.visible);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRad}}", InfoBulle.radius);
    recipe.innerHTML = templateInfBulle;
    recipe.className = 'fixed h-[97%] border-solid border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2.5 top-2.5 border-2 border-custom-blue';
    let Explorer = document.getElementById(textInfoBulle);
    updateSelectedTag(Explorer);
    const moveButton = document.getElementById('button_move');
    if (moveButton) {
        moveButton.addEventListener('click', function () {
            // Si vous avez besoin de désactiver un précédent listener, vous pouvez le faire ici
            toggleMove(textInfoBulle); // Remplacez cela par la fonction de déplacement
        });
    }
    let rangeInputs = document.querySelectorAll('.inputRange');
    rangeInputs.forEach(rgInput => {
        LoadSlider(rgInput);
    });

    let CheckboxOpen = document.getElementById('checkboxOpen');
    CheckboxOpen.addEventListener('click', function () {
        InfBulleVisibleOrNot(event);
    });

    document.getElementById('RenameButton').addEventListener('click', function () {
        renameTag('infoBulle', event.target.id);
    });

    document.getElementById('NameButton').addEventListener('click', function () {
        InfBulleText(event.target.id);
    });
    document.getElementById('close-object').addEventListener('click', function () {
        recipe.innerHTML = '';
        recipe.className = '';
        Explorer.style.backgroundColor = '';
    });
    let CopyDoor = document.getElementById('dupliButton');
    CopyDoor.addEventListener('click', () => duplicateTag('infoBulle'));

    document.getElementById('TrashButton').addEventListener('click', function () {
        deleteTag('infoBulle');
    });

    let inputRangesRad = document.querySelectorAll('.radius')
    inputRangesRad.forEach(inputRange => {
        inputRange.addEventListener('input', InfBulleRadiusChange);
    });

    let inputRangesPosition = document.querySelectorAll('.position')
    inputRangesPosition.forEach(inputRange => {
        inputRange.addEventListener('input', (event) => TagPositionChange(event, 'infoBulle'))
    });

    let inputRangesRotation = document.querySelectorAll('.rotation')
    inputRangesRotation.forEach(inputRange => {
        inputRange.addEventListener('input', InfBulleRotationChange);
    });

    // document.getElementById('fillText').addEventListener('input', InfBulleClrsChange);
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

    loadTag();
}


export function InfBulleRotationChange(e) {
    const infBulleName = document.getElementById('infoBulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const infBullePosition = parseFloat(e.target.value);
    let axisAlone = axis.slice(1);


    document.querySelector(`#${axis}-value`).textContent = `${infBullePosition}`;

    const infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    if (infBulle) {
        infBulle.rotation = { ...infBulle.rotation, [axisAlone]: infBullePosition };

        const infBulleGlobal = document.querySelector(`#${infBulleName}`);
        if (infBulleGlobal) {
            infBulleGlobal.setAttribute('rotation', `${infBulle.rotation.x} ${infBulle.rotation.y} ${infBulle.rotation.z}`);
        }
    }
    LoadSlider(e.target);
    loadTag();
}


export function InfBulleRadiusChange(e) {
    const infBulleName = document.getElementById('infoBulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulleRadius = parseFloat(e.target.value);

    document.querySelector(`#rad-value`).textContent = `${infBulleRadius}`;
    const infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    console.log(infBulle);
    
    if (infBulle) {
        infBulle.radius = infBulleRadius;
    }
    LoadSlider(e.target);
    loadTag();
}


export function InfBulleClrsChange(e) {
    const infBulleName = document.getElementById('infoBulle-name').textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    let infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === infBulleName);
    let inputColor = document.getElementById(`${e.target.id}`).value;

    if (e.target.id === 'colorInputTitle') {
        infBulle.titleColor = inputColor;
    } else if (e.target.id === 'colorInputDesc') {
        infBulle.descColor = inputColor;
    }

    loadTag();
}

function switchAnimInfoBulle(ev) {
    let baseId = ev.target.id.split('-')[0];
    var panel = document.querySelector(`#${baseId}-info-panel`);
    var sphere = document.querySelector(`#${baseId}-sphere`);
    var title = document.querySelector(`#${baseId}-title`);
    var desc = document.querySelector(`#${baseId}-description`);

    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    let infBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === baseId);
    console.log(infBulle);

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
        sphere.setAttribute('animation', `property: radius; to: ${infBulle.radius}; dur: 1000`);
        sphere.setAttribute('animation__pos', `property: position; to: 0 0 0; dur: 1000`); //0 1.25 -3
    }
}

function InfBulleVisibleOrNot(e) {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const infBulle = selectedScene.tags.find(tag => tag.type === "infoBulle" && tag.name === e.target.id);
    let InputChecked = document.getElementById('checkboxOpen').checked;

    infBulle.isVisible = InputChecked;
    switchAnimInfoBulle(e)
}