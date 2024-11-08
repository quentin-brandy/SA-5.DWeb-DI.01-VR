import VR from "./main.js";
import {  Door, Text, Photo, InfoBulle , Robot } from "./Tagclass.js";
import { createEntity } from "./a-frame_entity.js";

// Fonction générique pour charger et instancier les tags (door, text, et photo)
export function loadTag() {
  const sceneSelect = document.getElementById("selectscene");
  const selectedScene = VR.scenes[sceneSelect.value];

  // Vide les entités existantes
  const doorEntities = document.querySelector("#door-entity");
  const textEntities = document.querySelector("#text-entity");
  const photoEntities = document.querySelector("#photo-entity");
  const infoBulleEntities = document.querySelector("#infoBulle-entity");
  const robotEntities = document.querySelector("#robot-entity");

  [doorEntities, textEntities, infoBulleEntities, photoEntities , robotEntities].forEach(
    (entityContainer) => {
      if (entityContainer) {
        while (entityContainer.firstChild) {
          entityContainer.removeChild(entityContainer.firstChild);
        }
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
    } else if (tag.type === "robot") {
      tagInstance = new Robot(tag.name, selectedScene);
    }

    // Crée l'entité correspondante à partir du tag et la classe
    const newEntity = createEntity(tag);

    // Ajoute l'entité à la scène en fonction du type
    if (tag.type === "door" && doorEntities) {
      doorEntities.appendChild(newEntity);
    } else if (tag.type === "text" && textEntities) {
      textEntities.appendChild(newEntity);
    } else if (tag.type === "infoBulle" && infoBulleEntities) {
      infoBulleEntities.appendChild(newEntity);
    } else if (tag.type === "photo" && photoEntities) {
      photoEntities.appendChild(newEntity);
    } else if (tag.type === "robot" && robotEntities) {
      robotEntities.appendChild(newEntity);
    }
  });
}
