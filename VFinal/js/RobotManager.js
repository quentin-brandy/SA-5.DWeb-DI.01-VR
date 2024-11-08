import VR from "./main.js";
import { Robot } from "./Tagclass.js";
import { AddSceneExplorer, updateSelectedTag } from "./SceneManager.js";
import {
  loadTag,
  TagPositionChange,
  TagPositionChangeValue,
  renameTag,
  duplicateTag,
  deleteTag,
  toggleMove,
  LoadSlider,
  tagRotationChange,
  tagRotationChangeValue,
  TagColorFillChange,
  tagScaleChange,
  radToDeg,
} from "./TagManager.js";
import { createEntity } from "./a-frame_entity.js";
let initialAzimuth = null;

export function addRobot() {
  // Sélection de la scène actuelle
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  if (!selectedScene) {
    console.error("Scène non trouvée");
    return;
  }

  // Instancier la classe robot pour gérer les tags
  const robotManager = new Robot(selectedScene);

  // Fixer le rayon pour la distance à laquelle placer le robot (par exemple, 50 unités devant la caméra)
  const radius = 5;

  // Récupérer la position et l'orientation de la caméra
  const cameraEl = document.querySelector("#camera").object3D;
  const cameraPosition = new THREE.Vector3();
  cameraEl.getWorldPosition(cameraPosition);
  
  // Utiliser getWorldDirection pour obtenir la direction de la caméra
  const cameraDirection = new THREE.Vector3();
  cameraEl.getWorldDirection(cameraDirection);

  // Calculer l'azimut initial si ce n'est pas déjà fait
  if (initialAzimuth === null) {
    initialAzimuth = Math.atan2(cameraDirection.x, cameraDirection.z);
  }

  // Inverser la direction pour obtenir la bonne position
  cameraDirection.multiplyScalar(-1);

  // Calculer la position du robot en utilisant la direction de la caméra inversée
  const robotPosition = new THREE.Vector3(
    cameraPosition.x + cameraDirection.x * radius,
    cameraPosition.y,
    cameraPosition.z + cameraDirection.z * radius
  );

  // Calculer l'azimut basé sur la direction de la caméra
  const azimuthRad = Math.atan2(cameraDirection.z, cameraDirection.x);
  let azimuth = radToDeg(azimuthRad);

  // Ajuster l'azimut pour qu'il soit correct par rapport à l'initial
  azimuth = (azimuth + 180) % 360 - 180;

  console.log(`Position calculée : x=${robotPosition.x}, y=${robotPosition.y}, z=${robotPosition.z}, azimuth=${azimuth}°`);

  // Créer un nom unique pour le robot
  const robotCount = selectedScene.tags.filter(tag => tag.type === 'robot').length;
  const robotName = `robot${robotCount + 1}`;
  const state = "none";

  // Ajouter le robot via robotManager avec la position calculée
  robotManager.addRobotTag(
    robotName,
    { x: robotPosition.x, y: robotPosition.y, z: robotPosition.z, azimuth: azimuth, radius: radius },
    { rx: 0, ry: radToDeg(cameraEl.rotation.y), rz: cameraEl.rotation.z },
    { sx: 0.5, sy: 0.5, sz: 0.5 },
    state
  );

  // Créer l'entité pour le robot
  const newEntity = createEntity(selectedScene.tags.find(tag => tag.name === robotName));

  // Ajouter l'entité à la scène
  document.querySelector("#robot-entity").appendChild(newEntity);

  // Ajouter le robot à l'explorateur de scène
  AddSceneExplorer(robotName, "robot");
  ModifyRobot({ target: { id: robotName } });
}

function selectOptionByValue(selectElement, value) {
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === value) {
      selectElement.selectedIndex = i;
      break;
    }
  }
}




export function ModifyRobot(event) {

  let templateRobot = document.getElementById("template__robot").innerHTML;
  const recipe = document.getElementById("template_section");
  templateRobot = templateRobot.replaceAll("{{name}}", event.target.id);
  recipe.innerHTML = templateRobot;

  const textName = event.target.id;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const robot = selectedScene.tags.find(
    (tag) => tag.type === "robot" && tag.name === textName
  );

  templateRobot = templateRobot.replaceAll("{{name}}", textName);
  templateRobot = templateRobot.replaceAll("{{rangeValueX}}", robot.position.x);
  templateRobot = templateRobot.replaceAll("{{rangeValueY}}", robot.position.y);
  templateRobot = templateRobot.replaceAll("{{rangeValueZ}}", robot.position.z);
  templateRobot = templateRobot.replaceAll("{{rangeValueRx}}", robot.rotation.rx);
  templateRobot = templateRobot.replaceAll("{{rangeValueRy}}", robot.rotation.ry);
  templateRobot = templateRobot.replaceAll("{{rangeValueRz}}", robot.rotation.rz);
  templateRobot = templateRobot.replaceAll("{{scale}}", robot.scale.sx);
  recipe.innerHTML = templateRobot;

  const selectEtat = document.getElementById("state");
  selectOptionByValue(selectEtat, robot.state);
  console.log(VR);

  recipe.className =
    "fixed h-[97%] border-4 border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2 top-2";
  let Explorer = document.getElementById(textName);
  updateSelectedTag(Explorer);
  let rangeInputs = document.querySelectorAll(".inputRange");
  rangeInputs.forEach((rgInput) => {
    LoadSlider(rgInput);
  });

  // Liste des événements 'input'
  let renameTimeout;
  const inputEvents = [
    {
      selector: "#rename",
      handler: function (event) {
        clearTimeout(renameTimeout);
        renameTimeout = setTimeout(() => {
          renameTag("robot", textName); // Utilise la valeur de l'input
        }, 1000);
      },
    },
    {
      selector: "#x-value",
      handler: (event) => TagPositionChangeValue(event, "robot"),
    },
    {
      selector: "#y-value",
      handler: (event) => TagPositionChangeValue(event, "robot"),
    },
    {
      selector: "#z-value",
      handler: (event) => TagPositionChangeValue(event, "robot"),
    },
    {
      selector: "#rx-value",
      handler: (event) => tagRotationChangeValue(event, "robot"),
    },
    {
      selector: "#ry-value",
      handler: (event) => tagRotationChangeValue(event, "robot"),
    },
    {
      selector: "#rz-value",
      handler: (event) => tagRotationChangeValue(event, "robot"),
    },
    {
      selector: "#scale-value",
      handler: (event) => tagScaleChange(event, "robot"),
    },
    {
      selector: "#state",
      handler: (event) => ModifyStateRobot(event),
    }
  ];

  // Liste des événements 'click'
  const clickEvents = [
    {
      selector: "#close-object",
      handler: function () {
        recipe.innerHTML = "";
        recipe.className = "";
        Explorer.style.backgroundColor = "";
      },
    },
    { selector: "#dupliButton", handler: () => duplicateTag("robot") },
    {
      selector: "#TrashButton",
      handler: function () {
        deleteTag("robot");
      },
    },
  ];

  const moveButton = document.getElementById("button_move");
  if (moveButton) {
    moveButton.addEventListener("click", function () {
      // Si vous avez besoin de désactiver un précédent listener, vous pouvez le faire ici
      toggleMove(textName); // Remplacez cela par la fonction de déplacement
    });
  }

  // Liste des événements 'input' pour les sliders de position
  const positionSliders = document.querySelectorAll(".position");
  positionSliders.forEach((inputRange) => {
    inputRange.addEventListener("input", (event) =>
      TagPositionChange(event, "robot")
    );
  });

  // Liste des événements 'input' pour les sliders de rotation
  const rotationSliders = document.querySelectorAll(".rotation");
  rotationSliders.forEach((inputRange) => {
    inputRange.addEventListener("input", (event) =>
      tagRotationChange(event, "robot")
    );
  });

  // Ajout des événements 'input'
  inputEvents.forEach((event) => {
    const element = document.querySelector(event.selector);
    if (element) {
      element.addEventListener("input", event.handler);
    }
  });

  // Ajout des événements 'click'
  clickEvents.forEach((event) => {
    const element = document.querySelector(event.selector);
    if (element) {
      element.addEventListener("click", event.handler);
    }
  });
}


export function applyAnimation(robot, rbt) {
  robot.removeAttribute('animation');

  if (rbt.state === "rotation") {
    robot.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear");
  }
  else if (rbt.state === "bump") {
    robot.setAttribute("animation", `property: scale; dir: alternate; dur: 1000; to: ${rbt.scale.sx + 1} ${rbt.scale.sy + 1} ${rbt.scale.sz + 1}; loop: true; easing: easeInOutQuad`);
  }
  else if (rbt.state === "move") {
    robot.setAttribute("animation", `property: position; from: ${rbt.position.x} ${rbt.position.y} ${rbt.position.z};  to: ${rbt.position.x + 5} ${rbt.position.y} ${rbt.position.z}; dur: 3000; dir: alternate; loop: true; easing: easeInOutSine`);
  }
}


export function switchAnimRobot() {
  const textName = document.getElementById(`robot-name`).textContent;
  const robot = document.getElementById(`${textName}-3Drobot`);
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  
  let rbt = selectedScene.tags.find(
    (tag) => tag.type === "robot" && tag.name === textName
  );

  applyAnimation(robot, rbt);
  robot.setAttribute("scale", `${rbt.scale.sx} ${rbt.scale.sy} ${rbt.scale.sz}`);
}

function ModifyStateRobot(ev) {
  var selectElement = ev.target;
  var selectedOption = selectElement.options[selectElement.selectedIndex].value;

  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const textName = document.getElementById(`robot-name`).textContent;
  
  let rbt = selectedScene.tags.find(
    (tag) => tag.type === "robot" && tag.name === textName
  );
  console.log(sceneSelect);
  
  
  if (rbt) {
    rbt.state = selectedOption;
  }

  switchAnimRobot();
}
