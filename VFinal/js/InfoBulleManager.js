import VR from './main.js';


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

