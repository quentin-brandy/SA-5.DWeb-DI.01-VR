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
  TagPositionChangeValue,
  duplicateTag,
  deleteTag,
  toggleMove,
  LoadSlider,
  TagColorFillChange,
  tagScaleChange,
} from "./TagManager.js";
import { LoadFile } from "./FileManager.js";
import { createEntity } from "./a-frame_entity.js";

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

  // Obtenir la caméra et la direction
  const cameraEl = document.querySelector("#camera").object3D;
  const direction = new THREE.Vector3();
  cameraEl.getWorldDirection(direction);

  // Calculer la position en fonction de la caméra
  const distance = -3;
  const position = cameraEl.position
    .clone()
    .add(direction.multiplyScalar(distance));

  // Créer un nom unique pour la porte
  const doorCount = selectedScene.tags.filter(
    (tag) => tag.type === "door"
  ).length;
  const doorName = `door${doorCount + 1}`;

  // Ajouter la porte via Door
  doorManager.addDoorTag(
    doorName,
    { x: position.x, y: position.y, z: position.z },
    "no scene",
    "#FF0000",
    { sx: 0.5, sy: 0.5, sz: 0.5 }
  );

  const newEntity = createEntity(
    selectedScene.tags.find((tag) => tag.name === doorName)
  );

  // Ajouter l'entité à la scène
  document.querySelector("#door-entity").appendChild(newEntity);

  // Ajouter la porte à l'explorateur de scène
  AddSceneExplorer(doorName, "door");
  ModifyDoor({ target: { id: doorName } });
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
  templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
  templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y);
  templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
  templateText = templateText.replaceAll("{{colorFill}}", text.fill);
  templateText = templateText.replaceAll("{{scale}}", text.scale);
  recipe.innerHTML = templateText;
  recipe.className =
    "fixed h-[97%] border-4 border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2 top-2";
  let rangeInputs = document.querySelectorAll(".inputRange");
  rangeInputs.forEach((rgInput) => {
    LoadSlider(rgInput);
  });
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
      selector: "#x-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "door"),
    },
    {
      selector: "#y-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "door"),
    },
    {
      selector: "#z-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "door"),
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
  const RouteSelect = document.getElementById("scene-route-select");
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  selectedScene.tags.forEach((tag) => {
    if (tag.type === "door" && tag.name === doorName) {
      tag.targetScene = RouteSelect.value;
    }
  });
}
