import VR from './main.js';
import { AddSceneExplorer, updateSelectedTag } from './SceneManager.js';
import { loadTag, TagPositionChange, renameTag, duplicateTag, deleteTag, toggleMove, LoadSlider, tagRotationChange , tagRotationChangeValue , TagPositionChangeValue , tagScaleChange , radToDeg } from './TagManager.js';
import { InfoBulle } from "./Tagclass.js";
import { createEntity } from './a-frame_entity.js';


export function addInfoBulle() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    const InfoBulleManager = new InfoBulle(selectedScene);

    var distance = -3;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const infoBulleCount = selectedScene.tags.filter(tag => tag.type === 'infoBulle').length;
    const infoBulleName = `infoBulle${infoBulleCount + 1}`;
    // var Visibility = false;
    // var rad = 0.5;
    InfoBulleManager.addInfoBulleTag(
        infoBulleName,
        { x: position.x, y: position.y, z: position.z },
        { rx: 0, ry: radToDeg(cameraEl.rotation.y), rz: cameraEl.rotation.z },
        "Sample Title",
        "Sample Description",
        '#000',
        '#000',
        '0.5',
        false
    );

  let globalEntity = createEntity(selectedScene.tags.find(tag => tag.name === infoBulleName));

    document.querySelector('#infoBulle-entity').appendChild(globalEntity);

    AddSceneExplorer(infoBulleName, 'infoBulle');
    ModifyInfoBulle({ target: { id: infoBulleName } });
}


export function ModifyInfoBulle(event) {
    let templateInfBulle = document.getElementById('template__info_bulle').innerHTML;
    const recipe = document.getElementById('template_section');
    templateInfBulle = templateInfBulle.replaceAll("{{name}}", event.target.id);
    recipe.innerHTML = templateInfBulle;

    const textInfoBulle = event.target.id;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const InfoBulle = selectedScene.tags.find(tag => tag.type === 'infoBulle' && tag.name === textInfoBulle);
    console.log(InfoBulle);
    
    templateInfBulle = templateInfBulle.replaceAll("{{name}}", textInfoBulle.name);
    templateInfBulle = templateInfBulle.replaceAll("{{title}}", InfoBulle.title);
    templateInfBulle = templateInfBulle.replaceAll("{{description}}", InfoBulle.desc);
    templateInfBulle = templateInfBulle.replaceAll("{{colorTitle}}", InfoBulle.titleColor);
    templateInfBulle = templateInfBulle.replaceAll("{{colorDesc}}", InfoBulle.descColor);
    templateInfBulle = templateInfBulle.replaceAll("{{checkedOrNot}}", InfoBulle.visible);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRad}}", InfoBulle.radius);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueX}}", InfoBulle.position.x);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueY}}", InfoBulle.position.y);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueZ}}", InfoBulle.position.z -4);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRx}}", InfoBulle.rotation.rx);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRy}}", InfoBulle.rotation.ry);
    templateInfBulle = templateInfBulle.replaceAll("{{rangeValueRz}}", InfoBulle.rotation.rz);
    recipe.innerHTML = templateInfBulle;
    recipe.className = "fixed h-[97%] border-4 border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2 top-2";
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
    let renameTimeout;
    document.getElementById('rename').addEventListener('input', function () {
        clearTimeout(renameTimeout);
        renameTimeout = setTimeout(() => {
            renameTag('infoBulle', event.target.id);  // Utilise la valeur de l'input
        }, 1000);
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
        inputRange.addEventListener('input', (event) => tagRotationChange(event, 'infoBulle'));
    });


    const inputEvents = [
        { selector: '#x-value', handler: (event) => TagPositionChangeValue(event, 'infoBulle') },
        { selector: '#y-value', handler: (event) => TagPositionChangeValue(event, 'infoBulle') },
        { selector: '#z-value', handler: (event) => TagPositionChangeValue(event, 'infoBulle') },
        { selector: '#rx-value', handler: (event) => tagRotationChangeValue(event, 'infoBulle') },
        { selector: '#ry-value', handler: (event) => tagRotationChangeValue(event, 'infoBulle') },
        { selector: '#rz-value', handler: (event) => tagRotationChangeValue(event, 'infoBulle') },
        { selector: '#scale-value', handler: (event) => tagScaleChange(event, 'infoBulle') },
    ];

    inputEvents.forEach(event => {
        const element = document.querySelector(event.selector);
        if (element) {
            element.addEventListener('input', event.handler);
        }
    });
    



    let inputClrs = document.querySelectorAll('.colorText')
    inputClrs.forEach(inputClr => {
        inputClr.addEventListener('input', InfBulleClrsChange);
    });
}


export function InfBulleText(nom) {
  let sceneName = document.getElementById("selectscene").value;
  let scene = VR.scenes[sceneName];
  let tags = scene.tags;
  let tag = tags.find(isGoodInfBulle);
  console.log(tag);

  let valueInputTitle = document.getElementById("textInfoBulleTitle").value;
  let valueInputDesc = document.getElementById("textInfoBulleDesc").value;

  tag.title = valueInputTitle;
  tag.desc = valueInputDesc;

  function isGoodInfBulle(text) {
    return text.name === nom;
  }

  loadTag();
}

export function InfBulleRadiusChange(e) {
  const infBulleName = document.getElementById("infoBulle-name").textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  console.log(e);
  const infBulleRadius = parseFloat(e.target.value);

  document.querySelector(`#rad-value`).textContent = `${infBulleRadius}`;
  const infBulle = selectedScene.tags.find(
    (tag) => tag.type === "infoBulle" && tag.name === infBulleName
  );
  console.log(infBulle);

  if (infBulle) {
    infBulle.radius = infBulleRadius;
  }
  LoadSlider(e.target);
  loadTag();
}

export function InfBulleClrsChange(e) {
  const infBulleName = document.getElementById("infoBulle-name").textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  let infBulle = selectedScene.tags.find(
    (tag) => tag.type === "infoBulle" && tag.name === infBulleName
  );
  let inputColor = document.getElementById(`${e.target.id}`).value;

  if (e.target.id === "colorInputTitle") {
    infBulle.titleColor = inputColor;
  } else if (e.target.id === "colorInputDesc") {
    infBulle.descColor = inputColor;
  }

  loadTag();
}

export function switchAnimInfoBulle(ev) {
  let baseId = ev.target.id.split("-")[0];
  var panel = document.querySelector(`#${baseId}-info-panel`);
  var sphere = document.querySelector(`#${baseId}-sphere`);
  var model = document.querySelector(`#${baseId}-model`);
  var title = document.querySelector(`#${baseId}-title`);
  var desc = document.querySelector(`#${baseId}-description`);

  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  let infBulle = selectedScene.tags.find(
    (tag) => tag.type === "infoBulle" && tag.name === baseId
  );
  console.log(infBulle);

  var isVisible = panel.getAttribute("visible");
  panel.setAttribute("visible", !isVisible);

  if (!isVisible) {
    title.setAttribute("animation", "property: opacity; to: 1; dur: 500");
    desc.setAttribute("animation", "property: opacity; to: 1; dur: 500");
    model.setAttribute("animation", "property: radius; to: 0.2; dur: 1000");
    model.setAttribute(
      "animation__pos",
      `property: position; to: 1 0.45 0; dur: 1000`
    ); //1 1.5 -3
    sphere.setAttribute("animation", "property: radius; to: 0.2; dur: 1000");
    sphere.setAttribute(
      "animation__pos",
      `property: position; to: 1 0.45 0; dur: 1000`
    ); //1 1.5 -3
  } else {
    title.setAttribute("animation", "property: opacity; to: 0; dur: 500");
    desc.setAttribute("animation", "property: opacity; to: 0; dur: 500");
    model.setAttribute(
      "animation",
      `property: radius; to: ${infBulle.radius}; dur: 1000`
    );
    model.setAttribute(
      "animation__pos",
      `property: position; to: 0 0 0; dur: 1000`
    ); //0 1.25 -3
    sphere.setAttribute(
        "animation",
        `property: radius; to: ${infBulle.radius}; dur: 1000`
      );
      sphere.setAttribute(
        "animation__pos",
        `property: position; to: 0 0 0; dur: 1000`
      ); //0 1.25 -3
  }
}

function InfBulleVisibleOrNot(e) {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const infBulle = selectedScene.tags.find(
    (tag) => tag.type === "infoBulle" && tag.name === e.target.id
  );
  let InputChecked = document.getElementById("checkboxOpen").checked;

  infBulle.isVisible = InputChecked;
  switchAnimInfoBulle(e);
}