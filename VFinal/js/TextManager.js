import VR from "./main.js";
import { Text } from "./Tagclass.js";
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
  sphericalToCartesian,
} from "./TagManager.js";
import { createEntity } from "./a-frame_entity.js";

export function addText() {
  // Sélection de la scène actuelle
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  if (!selectedScene) {
    console.error("Scène non trouvée");
    return;
  }

  // Instancier la classe Text pour gérer les tags
  const textManager = new Text(selectedScene);

  // Obtenir la caméra et la direction
  const cameraEl = document.querySelector("#camera").object3D;
  const direction = new THREE.Vector3();
  cameraEl.getWorldDirection(direction);

  // Calculer la position en fonction de la caméra
  const radius = -5;
  const position = cameraEl.position
  .clone()
  .add(direction.multiplyScalar(radius));

  // Créer un nom unique pour le texte
  const textCount = selectedScene.tags.filter(
    (tag) => tag.type === "text"
  ).length;
  const textName = `text${textCount + 1}`;

  // Ajouter le texte via TextManager
  textManager.addTextTag(
    textName,
    { x: position.x, y: position.y, z: position.z },
    { rx: 0, ry: radToDeg(cameraEl.rotation.y), rz: cameraEl.rotation.z },
    "Sample Text",
    "#00C058",
    { sx: 5, sy: 5, sz: 5 }
  );

  // Créer l'entité pour le texte
  const newEntity = createEntity(
    selectedScene.tags.find((tag) => tag.name === textName)
  );
  // Ajouter l'entité à la scène
  document.querySelector("#text-entity").appendChild(newEntity);

  // Ajouter le texte à l'explorateur de scène
  AddSceneExplorer(textName, "text");
  ModifyText({ target: { id: textName } });
}

export function ModifyText(event) {
  let templateText = document.getElementById("template__texte").innerHTML;
  const recipe = document.getElementById("template_section");
  templateText = templateText.replaceAll("{{name}}", event.target.id);
  recipe.innerHTML = templateText;

  const textName = event.target.id;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const text = selectedScene.tags.find(
    (tag) => tag.type === "text" && tag.name === textName
  );
  templateText = templateText.replaceAll("{{name}}", textName);
  templateText = templateText.replaceAll("{{Text}}", text.content);
  templateText = templateText.replaceAll("{{rangeValueX}}", text.position.x);
  templateText = templateText.replaceAll("{{rangeValueY}}", text.position.y);
  templateText = templateText.replaceAll("{{rangeValueZ}}", text.position.z);
  templateText = templateText.replaceAll("{{rangeValueRx}}", text.rotation.rx);
  templateText = templateText.replaceAll("{{rangeValueRy}}", text.rotation.ry);
  templateText = templateText.replaceAll("{{rangeValueRz}}", text.rotation.rz);
  templateText = templateText.replaceAll("{{colorFill}}", text.fill);
  templateText = templateText.replaceAll("{{scale}}", text.scale.sx);
  recipe.innerHTML = templateText;
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
          renameTag("text", textName); // Utilise la valeur de l'input
        }, 1000);
      },
    },
    {
      selector: "#x-value",
      handler: (event) => TagPositionChangeValue(event, "text"),
    },
    {
      selector: "#y-value",
      handler: (event) => TagPositionChangeValue(event, "text"),
    },
    {
      selector: "#z-value",
      handler: (event) => TagPositionChangeValue(event, "text"),
    },
    {
      selector: "#rx-value",
      handler: (event) => tagRotationChangeValue(event, "text"),
    },
    {
      selector: "#ry-value",
      handler: (event) => tagRotationChangeValue(event, "text"),
    },
    {
      selector: "#rz-value",
      handler: (event) => tagRotationChangeValue(event, "text"),
    },
    {
      selector: "#scale-value",
      handler: (event) => tagScaleChange(event, "text"),
    },
    { selector: "#fill", handler: () => TagColorFillChange("text") },
  ];

  // Liste des événements 'click'
  const clickEvents = [
    {
      selector: "#LegendButton",
      handler: function () {
        LegendText(event.target.id);
      },
    },
    {
      selector: "#close-object",
      handler: function () {
        recipe.innerHTML = "";
        recipe.className = "";
        Explorer.style.backgroundColor = "";
      },
    },
    { selector: "#dupliButton", handler: () => duplicateTag("text") },
    {
      selector: "#TrashButton",
      handler: function () {
        deleteTag("text");
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
      TagPositionChange(event, "text")
    );
  });

  // Liste des événements 'input' pour les sliders de rotation
  const rotationSliders = document.querySelectorAll(".rotation");
  rotationSliders.forEach((inputRange) => {
    inputRange.addEventListener("input", (event) =>
      tagRotationChange(event, "text")
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

export function LegendText(nom) {
  let sceneName = document.getElementById("selectscene").value;
  let scene = VR.scenes[sceneName];
  let tags = scene.tags;
  let tag = tags.find(isGoodText);

  let valueInput = document.getElementById("text_legend").value;
  tag.content = valueInput;

  function isGoodText(text) {
    return text.name === nom;
  }

  loadTag();
}
