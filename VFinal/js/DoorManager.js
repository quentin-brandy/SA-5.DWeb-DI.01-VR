import VR from "./main.js";
import { Door } from "./Tagclass.js";
import {
  AddSceneExplorer,
  switchScene,
  AddSceneSelectOption,
  updateSelectedTag,
} from "./SceneManager.js";
import {
  renameTag,
  TagPositionChange,
  duplicateTag,
  deleteTag,
  toggleMove,
  LoadSlider,
  TagColorFillChange,
  tagScaleChange,
} from "./TagManager.js";
import { LoadFile } from "./FileManager.js";
import { createEntity } from "./a-frame_entity.js";


function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}
let initialAzimuth = null;

export function addDoor() {
  // Sélection de la scène actuelle
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  if (!selectedScene) {
    console.error("Scène non trouvée");
    return;
  }

  // Instancier Door pour gérer les portes
  const doorManager = new Door(selectedScene);

  // Fixer le rayon pour la distance à laquelle placer la porte (par exemple, 3 unités devant la caméra)
  const radius = 3;

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

  // Calculer la position de la porte en utilisant la direction de la caméra inversée
  const doorPosition = new THREE.Vector3(
    cameraPosition.x + cameraDirection.x * radius,
    cameraPosition.y,
    cameraPosition.z + cameraDirection.z * radius
  );

  // Calculer l'azimut basé sur la direction de la caméra
  const azimuthRad = Math.atan2(cameraDirection.z, cameraDirection.x);
  let azimuth = radToDeg(azimuthRad);

  // Ajuster l'azimut pour qu'il soit correct par rapport à l'initial
  azimuth = (azimuth + 180) % 360 - 180;

  console.log(`Position calculée : x=${doorPosition.x}, y=${doorPosition.y}, z=${doorPosition.z}, azimuth=${azimuth}°`);

  // Créer un nom unique pour la porte
  const doorCount = selectedScene.tags.filter(tag => tag.type === "door").length;
  const doorName = `door${doorCount + 1}`;

  // Ajouter la porte via Door avec la position calculée
  doorManager.addDoorTag(
    doorName,
    { azimuth: azimuth, radius: radius, y: cameraPosition.y },
    "no scene",
    "#FF0000",
    { sx: 1, sy: 1, sz: 1 }
  );

  // Créer une nouvelle entité pour la porte
  const newEntity = createEntity(
    selectedScene.tags.find(tag => tag.name === doorName)
  );

  // Mettre à jour la position de l'entité dans la scène A-Frame
  newEntity.setAttribute("position", `${doorPosition.x} ${doorPosition.y} ${doorPosition.z}`);

  // Ajouter l'entité à la scène
  document.querySelector("#door-entity").appendChild(newEntity);

  // Ajouter la porte à l'explorateur de scène
  AddSceneExplorer(doorName, "door");
  ModifyDoor({ target: { id: doorName } });
  console.log(VR);
}

// Fonction pour convertir radians en degrés
function radToDeg(radians) {
  return radians * (180 / Math.PI);
}





export function TakeDoor(e) {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const doorName = e.target.id;
  selectedScene.tags.forEach((tag) => {
    if (
      tag.type === "door" &&
      tag.name === doorName &&
      tag.targetScene !== "no scene"
    ) {
      LoadFile();
      console.log("Téléportation vers " + tag.targetScene);

      // Change the selected scene in the select element
      sceneSelect.value = tag.targetScene;
      switchScene();
    }
  });
}

export function ModifyDoor(e) {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const doorName = e.target.id;
  console.log(doorName);
  const templateSection = document.getElementById("template_section");
  templateSection.className = "";
  templateSection.innerHTML = "";
  let templateText = document.getElementById("template__porte").innerHTML;
  const recipe = document.getElementById("template_section");
  templateText = templateText.replaceAll("{{name}}", e.target.id);
  recipe.innerHTML = templateText;

  const text = selectedScene.tags.find(
    (tag) => tag.type === "door" && tag.name === doorName
  );
  templateText = templateText.replaceAll("{{name}}", text.name);
  templateText = templateText.replaceAll("{{rangeValueRadius}}", text.position.radius.toFixed(2));
  templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y.toFixed(2));
  templateText = templateText.replaceAll("{{rangeValueAzimuth}}", text.position.azimuth);
  templateText = templateText.replaceAll("{{colorFill}}", text.fill);
  templateText = templateText.replaceAll("{{scale}}", text.scale);
  recipe.innerHTML = templateText;
  recipe.className =
    "fixed h-[97%] border-4 border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2 top-2";
  let rangeInputs = document.querySelectorAll(".inputRange");
  rangeInputs.forEach((rgInput) => {
    LoadSlider(rgInput);
  });
  let slider = document.getElementById("radius-slider").value;
  let slider2 = document.getElementById("azimuth-slider").value;
  console.log(slider , slider2);
  document.getElementById("rename").value = doorName;
  let Explorer = document.getElementById(doorName);
  updateSelectedTag(Explorer);
  let Name = document.getElementById("door-name");
  Name.textContent = doorName;

  const eventListeners = [
    {
      selector: "#rename",
      event: "input",
      handler: function () {
        clearTimeout(renameTimeout);
        renameTimeout = setTimeout(() => {
          renameTag("door", doorName);
        }, 1000);
      },
    },
    {
      selector: "#dupliButton",
      event: "click",
      handler: () => duplicateTag("door"),
    },
    {
      selector: "#TrashButton",
      event: "click",
      handler: () => deleteTag("door"),
    },
    {
      selector: "#scene-route-select",
      event: "change",
      handler: RouteSelected,
    },
    {
      selector: "#close-object",
      event: "click",
      handler: function () {
        recipe.innerHTML = "";
        recipe.className = "";
        Explorer.style.backgroundColor = "";
      },
    },
    {
      selector: ".position",
      event: "input",
      handler: (event) => TagPositionChange(event, "door"),
      isMultiple: true,
    },
    {
      selector: "#scale-value",
      event: "input",
      handler: (event) => tagScaleChange(event, "door"),
    },
    {
      selector: "#fill",
      event: "input",
      handler: () => TagColorFillChange("door"),
    },
    {
      selector: "#button_move",
      event: "click",
      handler: function () {
        toggleMove(doorName);
      },
    },
    { selector: "#plus-doorscene", event: "click", handler: AddSelectScene },
  ];

  eventListeners.forEach(({ selector, event, handler, isMultiple }) => {
    if (isMultiple) {
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(event, handler);
      });
    } else {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener(event, handler);
      }
    }
  });

  RouteSelect();
}

function AddSelectScene() {
  const sceneCount = Object.keys(VR.scenes).length;
  const newSceneName = `scene${sceneCount + 1}`;
  VR.scenes[newSceneName] = {
    name: newSceneName,
    tags: [],
    image: {
      url: "../assets/img/image_360.png",
      name: "image_360.png",
    },
  };
  AddSceneSelectOption();
  RouteSelect();
}

export function RouteSelect() {
  const doorName = document.getElementById("door-name").textContent;
  const sceneSelect = document.getElementById("selectscene");
  const RouteSelect = document.getElementById("scene-route-select");
  const selectedScene = VR.scenes[sceneSelect.value];
  RouteSelect.innerHTML = "";
  console.log(VR.scenes);

  // Add "no scene" option
  var noSceneOption = document.createElement("option");
  noSceneOption.text = "no scene";
  noSceneOption.value = "no scene";
  RouteSelect.add(noSceneOption);

  Object.values(VR.scenes).forEach((scene) => {
    if (scene !== selectedScene && scene.name !== "defaultScene" && scene.name !== undefined) {
      var option = document.createElement("option");
      option.text = scene.name; // Assuming each scene has a 'name' property
      option.value = scene.name; // Assuming each scene has a 'name' property
      RouteSelect.add(option);
    }
  });
}

export function RouteSelected() {
  const doorName = document.getElementById("door-name").textContent;
  console.log(doorName);
  const RouteSelect = document.getElementById("scene-route-select");
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  selectedScene.tags.forEach((tag) => {
    if (tag.type === "door" && tag.name === doorName) {
      tag.targetScene = RouteSelect.value;
    }
  });
}
