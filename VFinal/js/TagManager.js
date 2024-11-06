import VR from "./main.js";
import { AddSceneExplorer, LoadSceneExplorer } from "./SceneManager.js";
import { ModifyDoor } from "./DoorManager.js";
import { ModifyText } from "./TextManager.js";
import { TagManager, Door, Text, Photo, InfoBulle } from "./Tagclass.js";
import { ModifyPhoto } from "./PhotoManager.js";
import { createEntity } from "./a-frame_entity.js";
import { ModifyInfoBulle } from "./InfoBulleManager.js";

export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function LoadSlider(e) {
  const ratio = ((e.value - e.min) / (e.max - e.min)) * 100;
  const activeColor = "#00C058";
  const inactiveColor = "transparent";

  e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
}

// Fonction pour générer un nom unique
function generateUniqueName(baseName, tags, type) {
  let newName = baseName;
  let count = 1;
  while (tags.some((tag) => tag.name === newName)) {
    newName = `${baseName}_copy${count}`;
    count++;
  }
  return newName;
}

export function TagPositionChange(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent; // "door-name" ou "text-name"
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  // On récupère l'axe modifié (azimuth ou radius)
  const axis = e.target.name; // 'azimuth' ou 'radius'
  let newPosition = parseFloat(e.target.value);
  newPosition = parseFloat(newPosition.toFixed(1));

  // Mettre à jour l'affichage de la valeur du slider
  document.getElementById(`${axis}-value`).value = newPosition;

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // On récupère les informations existantes sur le tag
  const tag = selectedScene.tags.find((tag) => tag.type === tagType && tag.name === tagName);

  // Calculer la position de la porte en fonction de azimuth et radius
  let updatedPosition;
  if (axis === 'azimuth' || axis === 'radius') {
    // Si l'axe est 'azimuth', on met à jour l'angle autour de la caméra
    const azimuth = axis === 'azimuth' ? newPosition : tag.position.azimuth;
    // Si l'axe est 'radius', on met à jour la distance (profondeur) par rapport à la caméra
    const radius = axis === 'radius' ? newPosition : tag.position.radius;

    // Calcul des coordonnées sphériques : x, y, z
    const x = radius * Math.sin(degToRad(azimuth));
    const z = -radius * Math.cos(degToRad(azimuth));
    const y = tag.position.y || 0;  // Garder la hauteur actuelle si disponible

    updatedPosition = { x, y, z, azimuth, radius };
  } else {
    // Si l'axe est x, y ou z, on garde les coordonnées cartésiennes
    updatedPosition = { ...tag.position, [axis]: newPosition };
  }

  // Mettre à jour la position en utilisant la méthode moveTag
  const updatedTag = tagManager.moveTag(tagName, updatedPosition);

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(
        "position",
        `${updatedTag.position.x} ${updatedTag.position.y} ${updatedTag.position.z}`
      );
    }

    // Mise à jour du dégradé linéaire du slider
    LoadSlider(e.target);
  }
}

export function TagPositionChangeValue(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent; // "door-name" ou "text-name"
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const axis = e.target.name; // 'radius', 'azimuth', or 'y'

  let newPosition = parseFloat(document.getElementById(`${axis}-value`).value);
  newPosition = parseFloat(newPosition.toFixed(1));

  // Si l'axe est 'radius', 'azimuth' ou 'y'
  if (axis === "radius") {
    // Récupérer les valeurs actuelles de x, y, z
    const currentPosition = selectedScene.tags.find(
      (tag) => tag.type === tagType && tag.name === tagName
    ).position;

    // Calculer la nouvelle position cartésienne à partir de la position sphérique
    const radius = newPosition;
    const azimuth = parseFloat(document.getElementById("azimuth-value").value);
    const height = parseFloat(document.getElementById("y-value").value);

    const azimuthRad = degToRad(azimuth); // Convertir azimuth de degrés à radians
    const x = radius * Math.cos(azimuthRad);
    const z = radius * Math.sin(azimuthRad);

    // Mettre à jour la position avec les nouvelles coordonnées calculées
    newPosition = { x, y: height, z };
  }

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Mettre à jour la position en utilisant la méthode moveTag
  const updatedTag = tagManager.moveTag(tagName, {
    ...selectedScene.tags.find(
      (tag) => tag.type === tagType && tag.name === tagName
    ).position,
    [axis]: newPosition,
  });

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(
        "position",
        `${updatedTag.position.x} ${updatedTag.position.y} ${updatedTag.position.z}`
      );
    }
  }

  // Mettre à jour la valeur du slider
  const slider = document.getElementById(`${axis}-slider`);
  slider.value = newPosition;
  LoadSlider(slider);
}


export function renameTag(type, nom) {
  const sceneName = document.getElementById("selectscene").value;
  const scene = VR.scenes[sceneName];
  const inputRename = document.getElementById("rename").value;
  const spanError = document.getElementById("span__error");

  const tagManager = new TagManager(scene);

  // Vérifier si le nouveau nom existe déjà
  if (tagManager.getTag(inputRename)) {
    spanError.innerHTML = "Ce nom existe déjà !";
    return;
  }

  if (inputRename === "") {
    spanError.innerHTML = "Le champ ne peut pas être vide";
    return;
  }

  spanError.innerHTML = ""; // Clear the error message

  const tag = tagManager.getTag(nom);
  let tagScene = document.querySelector(`#${type}-entity #${nom}`);

  if (tag) {
    tagManager.renameTag(nom, inputRename);

    // Mettre à jour l'ID de l'entité dans A-Frame
    if (tagScene) {
      tagScene.setAttribute("id", inputRename);
    }

    AddSceneExplorer(inputRename, type);
    LoadSceneExplorer();

    if (type === "door") {
      ModifyDoor({ target: { id: inputRename } });
    } else if (type === "text") {
      ModifyText({ target: { id: inputRename } });
    } else if (type === "photo") {
      ModifyPhoto({ target: { id: inputRename } });
    } else if (type === "infoBulle") {
      ModifyInfoBulle({ target: { id: inputRename } });
    }
  }
}

export function duplicateTag(tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag original
  const originalTag = tagManager.getTag(tagName);

  if (originalTag) {
    const newTagName = generateUniqueName(
      originalTag.name,
      selectedScene.tags,
      tagType
    );
    const newPosition = { ...originalTag.position };

    let clonedTag;

    // Créer une nouvelle instance basée sur le type de tag
    if (tagType === "text") {
      clonedTag = new Text(selectedScene).addTextTag(
        newTagName,
        newPosition,
        originalTag.rotation,
        originalTag.content,
        originalTag.fill
      );
    } else if (tagType === "door") {
      clonedTag = new Door(selectedScene).addDoorTag(
        newTagName,
        newPosition,
        originalTag.targetScene
      );
    } else if (tagType === "photo") {
      clonedTag = new Photo(selectedScene).addPhotoTag(newTagName, newPosition);
    } else if (tagType === "infoBulle") {
      clonedTag = new InfoBulle(selectedScene).addInfoBulleTag(
        newTagName,
        newPosition,
        originalTag.rotation,
        originalTag.title,
        originalTag.desc,
        originalTag.titleColor,
        originalTag.descColor,
        originalTag.radius,
        originalTag.isVisible,
        originalTag.scale
      );
    }

    // Ajouter le tag cloné à la scène
    tagManager.addTag(clonedTag);

    // Créer l'entité correspondante dans A-Frame
    createEntity(tagType, clonedTag);

    console.log(VR);
    AddSceneExplorer(newTagName, tagType);
    loadTag();
    console.log(`Tag dupliqué: ${newTagName}`);

    if (tagType === "door") {
      ModifyDoor({ target: { id: newTagName } });
    } else if (tagType === "text") {
      ModifyText({ target: { id: newTagName } });
    } else if (tagType === "photo") {
      ModifyPhoto({ target: { id: newTagName } });
    } else if (tagType === "infoBulle") {
      ModifyInfoBulle({ target: { id: newTagName } });
    }
  }
}

export function deleteTag(tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  // Initialisation du TagManager avec la scène sélectionnée
  const tagManager = new TagManager(selectedScene);

  // Supprimer le tag via TagManager
  const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
  const deletedTag = tagManager.getTag(tagName);

  if (deletedTag) {
    tagManager.deleteTag(tagName); // Supprime le tag de la scène via TagManager
    tagElement.remove(); // Supprime l'élément de la scène A-Frame

    console.log(`Tag supprimé: ${tagName}`);
    let templateSection = document.getElementById("template_section");
    templateSection.className = "";
    templateSection.innerHTML = "";
    LoadSceneExplorer(); // Recharge la scène
  } else {
    console.log("Tag non trouvé");
  }
}

// déplacement

let isMoving = false; // Assurez-vous que cette variable est en dehors de la fonction pour garder son état

export function toggleMove(Name) {
  const sceneEl = document.querySelector("a-scene"); // Assurez-vous que la scène est correctement sélectionnée

  function handleSceneClick(event) {
    // Trouver l'élément sur lequel on a cliqué en utilisant `event.target`
    const clickedElement = document.querySelector(`#${Name}`);
    console.log(clickedElement);
    // Si l'élément a une classe ou un attribut indiquant son type, récupérons-le
    let Type =
      clickedElement.getAttribute("data-type") ||
      (clickedElement.classList.contains("door")
        ? "door"
        : clickedElement.classList.contains("text")
          ? "text"
          : clickedElement.classList.contains("photo")
            ? "photo"
            : clickedElement.classList.contains("infoBulle")
              ? "infoBulle"
              : null); // Remplace 'data-type' par l'attribut qui te convient si besoin

    // Appeler `handleMove` avec le nom de l'élément et le type récupéré dynamiquement
    handleMove(event, Name, Type);

    // Désactiver le mouvement après un clic
    isMoving = false;
    sceneEl.removeEventListener("click", handleSceneClick);
  }

  // Si nous venons d'activer le mouvement
  if (!isMoving) {
    isMoving = true; // Marquer comme en mouvement

    // Ajouter un listener pour le clic sur la scène
    sceneEl.addEventListener("click", handleSceneClick);
  } else {
    isMoving = false; // Désactiver le mouvement

    // Supprimer le listener lorsque le mouvement est désactivé
    sceneEl.removeEventListener("click", handleSceneClick);
  }
}

export function handleMove(event, Name, Type) {
  console.log(Name);

  if (!event.clientX || !event.clientY) {
    console.error(
      "Les coordonnées de l'écran ne sont pas disponibles. Assurez-vous que l'événement est un 'click' ou similaire."
    );
    return;
  }

  const cameraEl = document.querySelector("[camera]");
  const screenPosition = new THREE.Vector2();
  screenPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  screenPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log("screenPosition:", screenPosition);

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(screenPosition, cameraEl.getObject3D("camera"));

  const distance = 3;
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.at(distance, intersectionPoint);

  const tagElement = document.querySelector(`#${Type}-entity #${Name}`);
  if (!tagElement) {
    console.error(`Élément avec ID #${Type}-entity #${Name} non trouvé.`);
    return;
  }

  tagElement.setAttribute("position", {
    x: intersectionPoint.x,
    y: intersectionPoint.y,
    z: intersectionPoint.z,
  });
  console.log(
    `Position mise à jour : ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`
  );

  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  // Vérifier si une instance de tag existe déjà dans VR, sinon créer une nouvelle instance
  let tagInstance = VR.scenes[sceneSelect.value].tags.find(
    (tag) => tag.name === Name
  );

  if (!tagInstance) {
    // Créer une nouvelle instance si elle n'existe pas déjà
    if (Type === "door") {
      tagInstance = new Door(Name, selectedScene);
    } else if (Type === "text") {
      tagInstance = new Text(Name, selectedScene);
    } else if (Type === "photo") {
      tagInstance = new Photo(Name, selectedScene);
    } else if (Type === "infoBulle") {
      tagInstance = new InfoBulle(Name, selectedScene);
    } else {
      console.error("Type de tag non reconnu.");
      return;
    }
  }

  // Mettre à jour la position dans l'instance du tag
  tagInstance.position = {
    x: intersectionPoint.x,
    y: intersectionPoint.y,
    z: intersectionPoint.z,
  };

  // Mettre à jour les sliders avec la nouvelle position
  document.getElementById("x-slider").value = tagInstance.position.x.toFixed(1);
  document.getElementById("y-slider").value = tagInstance.position.y.toFixed(1);
  document.getElementById("z-slider").value = tagInstance.position.z.toFixed(1);

  // Mettre à jour les valeurs des sliders affichées
  document.getElementById("x-value").textContent =
    tagInstance.position.x.toFixed(1);
  document.getElementById("y-value").textContent =
    tagInstance.position.y.toFixed(1);
  document.getElementById("z-value").textContent =
    tagInstance.position.z.toFixed(1);

  // Mettre à jour le dégradé des sliders
  ["x", "y", "z"].forEach((axis) => {
    const slider = document.getElementById(`${axis}-slider`);
    const ratio =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";
    slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
  });

  console.log(
    `Tag déplacé à la position : ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`
  );
}

// Fonction générique pour charger et instancier les tags (door, text, et photo)
export function loadTag() {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  // Vide les entités existantes
  const doorEntities = document.querySelector("#door-entity");
  const textEntities = document.querySelector("#text-entity");
  const photoEntities = document.querySelector("#photo-entity");
  const infoBulleEntities = document.querySelector("#infoBulle-entity");

  [doorEntities, textEntities, infoBulleEntities, photoEntities].forEach(
    (entityContainer) => {
      while (entityContainer.firstChild) {
        entityContainer.removeChild(entityContainer.firstChild);
      }
    }
  );

  // Parcourt tous les tags de la scène sélectionnée
  selectedScene.tags.forEach((tag) => {
    // Instancie la classe appropriée selon le type de tag
    let tagInstance;
    if (tag.type === "door") {
      tagInstance = new Door(tag.name, selectedScene);
    } else if (tag.type === "text") {
      tagInstance = new Text(tag.name, selectedScene);
    } else if (tag.type === "infoBulle") {
      tagInstance = new InfoBulle(tag.name, selectedScene);
      tagInstance.isVisible = tag.isVisible = false;
    } else if (tag.type === "photo") {
      tagInstance = new Photo(tag.name, selectedScene);
    }

    // Crée l'entité correspondante à partir du tag et la classe
    const newEntity = createEntity(tag);

    // Ajoute l'entité à la scène en fonction du type
    if (tag.type === "door") {
      doorEntities.appendChild(newEntity);
    } else if (tag.type === "text") {
      textEntities.appendChild(newEntity);
    } else if (tag.type === "infoBulle" && infoBulleEntities) {
      infoBulleEntities.appendChild(newEntity);
    } else if (tag.type === "photo") {
      photoEntities.appendChild(newEntity);
    }
  });
}

export function tagRotationChange(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent; // "door-name" ou "text-name"
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const axis = e.target.name; // 'x', 'y', or 'z'
  let newRotation = parseFloat(e.target.value);

  // Limiter la valeur à un chiffre après la virgule
  newRotation = parseFloat(newRotation.toFixed(1));

  // Mettre à jour l'affichage de la valeur du slider
  document.getElementById(`${axis}-value`).value = newRotation;

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag actuel dans la scène
  const currentTag = selectedScene.tags.find(
    (tag) => tag.type === tagType && tag.name === tagName
  );
  if (!currentTag) return;

  // Mettre à jour seulement la rotation
  const updatedTag = tagManager.rotateTag(tagName, {
    ...currentTag.rotation,
    [axis]: newRotation,
  });

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(
        "rotation",
        `${updatedTag.rotation.rx} ${updatedTag.rotation.ry} ${updatedTag.rotation.rz}`
      );
    }

    // Mise à jour du dégradé linéaire du slider
    LoadSlider(e.target);
  }
  console.log(VR);
}

export function tagRotationChangeValue(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent; // "door-name" ou "text-name"
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const axis = e.target.name; // 'x', 'y', or 'z'
  console.log(axis);
  let newRotation = parseFloat(document.getElementById(`${axis}-value`).value);

  // Limiter la valeur à un chiffre après la virgule
  newRotation = parseFloat(newRotation.toFixed(1));

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag actuel dans la scène
  const currentTag = selectedScene.tags.find(
    (tag) => tag.type === tagType && tag.name === tagName
  );
  if (!currentTag) return;

  // Mettre à jour seulement la rotation
  const updatedTag = tagManager.rotateTag(tagName, {
    ...currentTag.rotation,
    [axis]: newRotation,
  });

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(
        "rotation",
        `${updatedTag.rotation.rx} ${updatedTag.rotation.ry} ${updatedTag.rotation.rz}`
      );
    }
  }

  const slider = document.getElementById(`${axis}-slider`);
  slider.value = newRotation;
  LoadSlider(slider);
  console.log(VR);
}

export function TagColorFillChange(tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const colorValue = document.getElementById("textColorFill");
  const selectedScene = VR.scenes[sceneSelect.value];
  console.log(colorValue);
  const tagManager = new TagManager(selectedScene);

  let inputColor = document.getElementById(`fill`).value;
  console.log(inputColor);
  const updatedTag = tagManager.updateTagFill(tagName, inputColor);
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      colorValue.textContent = inputColor;
      tagElement.setAttribute("color", inputColor);
    }
  } else {
    console.error(`Tag ${tagName} non trouvé ou mise à jour échouée.`);
  }
}

export function tagScaleChange(e, tagType) {
  console.log(tagType);
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const newScale = parseFloat(e.target.value);
  // Mettre à jour l'affichage de la valeur du slider
  document.querySelector(`#scale-value`).textContent = `${newScale}`;

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag actuel dans la scène
  const currentTag = selectedScene.tags.find(
    (tag) => tag.type === tagType && tag.name === tagName
  );
  if (!currentTag) return;

  // Mettre à jour le scale uniformément sur les trois axes
  const updatedTag = tagManager.scaleTag(tagName, {
    sx: newScale,
    sy: newScale,
    sz: newScale,
  });

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
    }

    // Mise à jour du dégradé linéaire du slider
    LoadSlider(e.target);
  }
  console.log(VR);
}

export function tagDimensionChange(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const newValue = parseFloat(e.target.value);
  const dimension = e.target.name;
  // Mettre à jour l'affichage de la valeur du slider
  document.querySelector(`#${dimension}-value`).value = `${newValue}`;
  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag actuel dans la scène
  const currentTag = selectedScene.tags.find(
    (tag) => tag.type === tagType && tag.name === tagName
  );
  if (!currentTag) return;

  // Mettre à jour la dimension
  let updatedTag;
  updatedTag = tagManager.updateTagSize(tagName, newValue, dimension);
  document.querySelector(`#${dimension}-value`).textContent = `${newValue}`;
  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(dimension, `${newValue}`);
    }

    LoadSlider(e.target);
  }
  console.log(VR);
}

export function tagDimensionChangeValue(e, tagType) {
  const tagName = document.getElementById(`${tagType}-name`).textContent;
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];
  const dimension = e.target.name; // 'width' or 'height'
  console.log(dimension);
  let newValue = parseFloat(
    document.getElementById(`${dimension}-value`).value
  );

  // Créer une instance de TagManager pour gérer les tags
  const tagManager = new TagManager(selectedScene);

  // Récupérer le tag actuel dans la scène
  const currentTag = selectedScene.tags.find(
    (tag) => tag.type === tagType && tag.name === tagName
  );
  if (!currentTag) return;

  // Mettre à jour seulement la dimension
  const updatedTag = tagManager.updateTagSize(tagName, newValue, dimension);

  // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
  if (updatedTag) {
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    if (tagElement) {
      tagElement.setAttribute(dimension, `${newValue}`);
    }
  }

  const slider = document.getElementById(`${dimension}-slider`);
  slider.value = newValue;
  console.log(slider);
  LoadSlider(slider);
  console.log(VR);
}
