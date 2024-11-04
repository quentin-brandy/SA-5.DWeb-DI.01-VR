import VR from "./main.js";
import {
  switchScene,
} from "./SceneManager.js";

import { LoadFile } from "./FileManager.js";

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

