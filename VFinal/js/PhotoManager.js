import VR from "./main.js";
import { Photo } from "./Tagclass.js";
import { AddSceneExplorer, updateSelectedTag } from "./SceneManager.js";
import { createEntity } from "./a-frame_entity.js";
import {
  renameTag,
  TagPositionChange,
  TagPositionChangeValue,
  duplicateTag,
  deleteTag,
  toggleMove,
  LoadSlider,
  tagRotationChange,
  tagRotationChangeValue,
  tagScaleChange,
  tagDimensionChange,
  tagDimensionChangeValue,
  radToDeg,
} from "./TagManager.js";

export function addPhoto() {
  // Sélection de la scène actuelle
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  if (!selectedScene) {
    console.error("Scène non trouvée");
    return;
  }

  // Instancier Photo pour gérer les photos
  const photoManager = new Photo(selectedScene);

  // Obtenir la caméra et la direction
  const cameraEl = document.querySelector("#camera").object3D;
  const direction = new THREE.Vector3();
  cameraEl.getWorldDirection(direction);

  // Calculer la position en fonction de la caméra
  const distance = -3;
  const position = cameraEl.position
    .clone()
    .add(direction.multiplyScalar(distance));

  // Créer un nom unique pour la photo
  const photoCount = selectedScene.tags.filter(
    (tag) => tag.type === "photo"
  ).length;
  const photoName = `photo${photoCount + 1}`;

  // Ajouter la photo via Photo
  photoManager.addPhotoTag(
    photoName,
    { x: position.x, y: position.y, z: position.z },
    { rx: 0, ry: radToDeg(cameraEl.rotation.y), rz: cameraEl.rotation.z },
    "../assets/img/image_photo.png",
    "image_photo.png",
    { width: 1, height: 1 },
    { sx: 1, sy: 1, sz: 1 }
  );

  const newEntity = createEntity(
    selectedScene.tags.find((tag) => tag.name === photoName)
  );

  document
    .querySelector("#rightController")
    .addEventListener("grip-down", function (event) {
      if (event.target === newEntity) {
        // Logique pour déplacer la photo
        console.log(`Photo ${photoName} moved`);
      }
    });

  // Ajouter l'entité à la scène
  document.querySelector("#photo-entity").appendChild(newEntity);

  // Ajouter la photo à l'explorateur de scène
  AddSceneExplorer(photoName, "photo");
  ModifyPhoto({ target: { id: photoName } });
}

export function ModifyPhoto(event) {
  let templatePhoto = document.getElementById("template__photo").innerHTML;
  const recipe = document.getElementById("template_section");
  templatePhoto = templatePhoto.replaceAll("{{name}}", event.target.id);
  recipe.innerHTML = templatePhoto;

  const photoName = event.target.id;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const photo = selectedScene.tags.find(
    (tag) => tag.type === "photo" && tag.name === photoName
  );
  templatePhoto = templatePhoto.replaceAll("{{name}}", photoName);
  templatePhoto = templatePhoto.replaceAll("{{rangeValueX}}", photo.position.x);
  templatePhoto = templatePhoto.replaceAll("{{rangeValueY}}", photo.position.y);
  templatePhoto = templatePhoto.replaceAll("{{rangeValueZ}}", photo.position.z);
  templatePhoto = templatePhoto.replaceAll(
    "{{rangeValueRx}}",
    photo.rotation.rx
  );
  templatePhoto = templatePhoto.replaceAll(
    "{{rangeValueRy}}",
    photo.rotation.ry
  );
  templatePhoto = templatePhoto.replaceAll(
    "{{rangeValueRz}}",
    photo.rotation.rz
  );
  templatePhoto = templatePhoto.replaceAll("{{photoName}}", photo.photoname);
  if (photo.photoname !== "image_photo.png") {
    templatePhoto += `
            <button class="flex items-center cursor-pointer p-[5px] border-[none]">
                <img class="icon__scene" src="../assets/svg/trash3.svg" alt="Trash icon">
            </button>
        `;
  }
  templatePhoto = templatePhoto.replaceAll(
    "{{photoWidth}}",
    photo.taille.width
  );
  templatePhoto = templatePhoto.replaceAll(
    "{{photoHeight}}",
    photo.taille.height
  );
  templatePhoto = templatePhoto.replaceAll("{{scale}}", photo.scale.sx);
  recipe.innerHTML = templatePhoto;
  recipe.className =
    "fixed h-[97%] border-4 border-custom-blue z-10 bg-custom-white overflow-y-scroll px-6 py-0 rounded-lg right-2 top-2";
  let Explorer = document.getElementById(photoName);
  updateSelectedTag(Explorer);
  const moveButton = document.getElementById("button_move");
  if (moveButton) {
    moveButton.addEventListener("click", function () {
      toggleMove(photoName);
    });
  }
  let rangeInputs = document.querySelectorAll(".inputRange");
  rangeInputs.forEach((rgInput) => {
    LoadSlider(rgInput);
  });

  let renameTimeout;
  document.getElementById("rename").addEventListener("input", function () {
    clearTimeout(renameTimeout);
    renameTimeout = setTimeout(() => {
      renameTag("photo", photoName);
    }, 1000);
  });

  document
    .getElementById("dupliButton")
    .addEventListener("click", () => duplicateTag("photo"));

  document.getElementById("TrashButton").addEventListener("click", function () {
    deleteTag("photo");
  });

  document
    .getElementById("photo-upload")
    .addEventListener("change", function (e) {
      updatePhoto(e);
    });

  document
    .getElementById("close-object")
    .addEventListener("click", function () {
      recipe.innerHTML = "";
      recipe.className = "";
      Explorer.style.backgroundColor = "";
    });

  const inputRanges = [
    {
      selector: "#scale-value",
      event: "input",
      handler: (event) => tagScaleChange(event, "photo"),
    },
    {
      selector: ".position",
      event: "input",
      handler: (event) => TagPositionChange(event, "photo"),
    },
    {
      selector: "#x-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "photo"),
    },
    {
      selector: "#y-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "photo"),
    },
    {
      selector: "#z-value",
      event: "input",
      handler: (event) => TagPositionChangeValue(event, "photo"),
    },
    {
      selector: "#rx-value",
      event: "input",
      handler: (event) => tagRotationChangeValue(event, "photo"),
    },
    {
      selector: "#ry-value",
      event: "input",
      handler: (event) => tagRotationChangeValue(event, "photo"),
    },
    {
      selector: "#rz-value",
      event: "input",
      handler: (event) => tagRotationChangeValue(event, "photo"),
    },
    {
      selector: "#width-value",
      event: "input",
      handler: (event) => tagDimensionChangeValue(event, "photo"),
    },
    {
      selector: "#height-value",
      event: "input",
      handler: (event) => tagDimensionChangeValue(event, "photo"),
    },
    {
      selector: ".rotation",
      event: "input",
      handler: (event) => tagRotationChange(event, "photo"),
    },
    {
      selector: ".taille",
      event: "input",
      handler: (event) => tagDimensionChange(event, "photo"),
    },
  ];

  inputRanges.forEach(({ selector, event, handler }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.addEventListener(event, handler);
    });
  });
}
export function updatePhoto(event) {
  const file = event.target.files[0];
  if (file) {
    // Récupérer juste le nom du fichier (ou chemin)
    const newSrc = `../assets/img/${file.name}`;

    // Créer une instance de Photo pour mettre à jour la photo existante
    const sceneSelect = document.getElementById("selectscene");
    const selectedScene = VR.scenes[sceneSelect.value];
    const photoName = document.getElementById("photo-name").textContent;

    const photo = new Photo(selectedScene);
    photo.updatePhotoSrc(photoName, newSrc);

    // Mettre à jour le src dans l'élément A-Frame
    const photoElement = document.querySelector(`#photo-entity #${photoName}`);
    if (photoElement) {
      photoElement.setAttribute("src", newSrc);
    }

    // Mettre à jour le src dans le tableau VR
    const vrPhoto = selectedScene.tags.find(
      (tag) => tag.type === "photo" && tag.name === photoName
    );
    if (vrPhoto) {
      vrPhoto.src = newSrc;
    }
  }
  document.getElementById("photo_import_name").textContent = file.name;

  // Si le nom est différent de 'image_photo.png', ajouter une icône de poubelle avec un event listener pour supprimer l'image
  if (file.name !== "image_photo.png") {
    const trashButton = document.createElement("button");
    trashButton.className =
      "flex items-center cursor-pointer p-[5px] border-[none]";
    trashButton.innerHTML =
      '<img class="icon__scene" src="../assets/svg/trash3.svg" alt="Trash icon">';

    trashButton.addEventListener("click", function () {
      deletePhoto();
    });

    document.getElementById("photo_import_name").appendChild(trashButton);
  }
}

function deletePhoto() {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const photoName = document.getElementById("photo-name").textContent;

  // Créer une instance de Photo pour mettre à jour la photo existante
  const photo = new Photo(selectedScene);
  photo.updatePhotoSrc(photoName, "../assets/img/image_photo.png");

  // Mettre à jour le src dans l'élément A-Frame
  const photoElement = document.querySelector(`#photo-entity #${photoName}`);
  if (photoElement) {
    photoElement.setAttribute("src", "../assets/img/image_photo.png");
  }

  // Mettre à jour l'interface utilisateur
  document.getElementById("photo_import_name").textContent = "image_photo.png";
}
