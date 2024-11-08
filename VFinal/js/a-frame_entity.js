import { TakeDoor } from "./DoorManager.js";
import { switchAnimInfoBulle } from "./InfoBulleManager.js";
import { applyAnimation } from "./RobotManager.js";


export function createEntity(tag) {
    let newEntity;

    if (tag.type === "door") {
        newEntity = document.createElement("a-sphere");
        newEntity.setAttribute(
            "position",
            `${tag.position.x} ${tag.position.y} ${tag.position.z}`
        );
        newEntity.setAttribute("radius", "1");
        newEntity.setAttribute("color", tag.fill);
        newEntity.setAttribute("opacity", "0.5"); // Lower the opacity
        newEntity.setAttribute("class", "link clickable");
        newEntity.setAttribute(
            "scale",
            `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`
        );
        newEntity.setAttribute("id", tag.name);
        newEntity.addEventListener("click", function (event) {
            TakeDoor(event);
        });

        // Add 3D object inside the sphere
        var modelEntity = document.createElement("a-entity");
        modelEntity.setAttribute("obj-model", "obj: url(../assets/3d/door/model.obj); mtl: url(../assets/3d/door/materials.mtl)");
        modelEntity.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear");
        modelEntity.setAttribute("scale", "1 1 1 "); // Adjust scale as needed
        modelEntity.setAttribute("position", "0 0 0"); // Adjust position as needed
        modelEntity.setAttribute("rotation", "0 0 0"); // Adjust rotation as needed

        newEntity.appendChild(modelEntity);
    } else if (tag.type === "text") {
        newEntity = document.createElement("a-text");
        newEntity.setAttribute(
            "position",
            `${tag.position.x} ${tag.position.y} ${tag.position.z}`
        );
        newEntity.setAttribute("value", tag.content);
        newEntity.setAttribute("color", tag.fill);
        newEntity.setAttribute("align", "center");
        newEntity.setAttribute(
            "scale",
            `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`
        );
        newEntity.setAttribute("id", tag.name);
        newEntity.setAttribute("rotation", {
            x: tag.rotation.rx,
            y: tag.rotation.ry,
            z: tag.rotation.rz,
        });
    } else if (tag.type === "photo") {
        newEntity = document.createElement("a-image");
        newEntity.setAttribute(
            "position",
            `${tag.position.x} ${tag.position.y} ${tag.position.z}`
        );
        newEntity.setAttribute("src", tag.src);
        newEntity.setAttribute(
            "scale",
            `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`
        );
        newEntity.setAttribute("id", tag.name);
        newEntity.setAttribute("width", tag.taille.width);
        newEntity.setAttribute("height", tag.taille.height);
        newEntity.setAttribute("rotation", {
            x: tag.rotation.rx,
            y: tag.rotation.ry,
            z: tag.rotation.rz,
        });
    } else if (tag.type === "infoBulle") {
        newEntity = document.createElement("a-entity");
        newEntity.setAttribute("id", `${tag.name}`);
        newEntity.setAttribute(
            "position",
            tag.position.x + " " + tag.position.y + " " + tag.position.z
        );
        console.log(tag);

        newEntity.setAttribute("rotation", {
            x: tag.rotation.rx,
            y: tag.rotation.ry,
            z: tag.rotation.rz,
        });
        newEntity.setAttribute("scale", `${tag.scale.sx} ${tag.scale.sy} ${tag.scale.sz}`);
        var sphereEntity = document.createElement("a-sphere");
        sphereEntity.setAttribute("id", `${tag.name}-sphere`);
        sphereEntity.setAttribute("radius", tag.radius);
        sphereEntity.setAttribute("color", "#EF2D5E");
        sphereEntity.setAttribute("opacity", "0.1");
        sphereEntity.setAttribute("class", "link clickable movableBox");
        sphereEntity.addEventListener("click", function (event) {
            switchAnimInfoBulle(event);
        });

        var modelEntity = document.createElement("a-entity");
        modelEntity.setAttribute("id", `${tag.name}-model`);
        modelEntity.setAttribute("obj-model", "obj: url(../assets/3d/info/model.obj); mtl: url(../assets/3d/info/materials.mtl)");
        modelEntity.setAttribute("scale", "1 1 1"); // Adjust scale as needed
        modelEntity.setAttribute("position", "0 0 0"); // Adjust position as needed
        modelEntity.setAttribute("rotation", "0 -90 0"); // Adjust rotation as needed
        modelEntity.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"); // Add animation
        var infoPanelEntity = document.createElement("a-entity");
        infoPanelEntity.setAttribute("id", `${tag.name}-info-panel`);
        infoPanelEntity.setAttribute("visible", tag.isVisible);

        var infoPlane = document.createElement("a-plane");
        infoPlane.setAttribute("color", "#FFF");
        infoPlane.setAttribute("width", "2");
        infoPlane.setAttribute("height", "1");

        var infoTextTitle = document.createElement("a-text");
        infoTextTitle.setAttribute("id", `${tag.name}-title`);
        infoTextTitle.setAttribute("value", tag.title);
        infoTextTitle.setAttribute("position", "-0.95 0.25 0.01");
        infoTextTitle.setAttribute("color", tag.titleColor);
        infoTextTitle.setAttribute("opacity", "0");
        infoTextTitle.setAttribute("width", "1.9");
        infoTextTitle.setAttribute("wrap-count", "30");

        var infoTextDescription = document.createElement("a-text");
        infoTextDescription.setAttribute("id", `${tag.name}-description`);
        infoTextDescription.setAttribute("value", tag.desc);
        infoTextDescription.setAttribute("position", "-0.95 -0.25 0.01");
        infoTextDescription.setAttribute("color", tag.descColor);
        infoTextDescription.setAttribute("width", "1.9");
        infoTextDescription.setAttribute("wrap-count", "30");

        infoPlane.appendChild(infoTextTitle);
        infoPlane.appendChild(infoTextDescription);

        infoPanelEntity.appendChild(infoPlane);

        newEntity.appendChild(sphereEntity);
        newEntity.appendChild(modelEntity);
        newEntity.appendChild(infoPanelEntity);
    }
    else if (tag.type === "robot") {
        newEntity = document.createElement("a-entity");
        newEntity.setAttribute("id", `${tag.name}-3Drobot`);
        newEntity.setAttribute("gltf-model", "../assets/3d/robot/grosbot3.gltf");
        // newEntity.setAttribute("gltf-model", "../assets/3d/robot/grosbot3.gltf");
        applyAnimation(newEntity, tag);
        newEntity.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            timeScale: 1
        });
        newEntity.setAttribute(
            "position",
            tag.position.x + " " + tag.position.y + " " + tag.position.z
        );
        
        newEntity.setAttribute("rotation", {
            x: tag.rotation.rx,
            y: tag.rotation.ry,
            z: tag.rotation.rz,
        });
        newEntity.setAttribute("scale", `${tag.scale.sx} ${tag.scale.sy} ${tag.scale.sz}`);
        newEntity.setAttribute("opacity", "1");
        
        var boxEntity = document.createElement("a-box");
        boxEntity.setAttribute("id", `${tag.name}-box`);
        boxEntity.setAttribute("width", `6.5`);
        boxEntity.setAttribute("height", `4.5`);
        boxEntity.setAttribute("color", "#EF2D5E");
        boxEntity.setAttribute("opacity", "0");
        boxEntity.setAttribute("class", "link clickable movableBox");
        boxEntity.setAttribute("position", "0 2.25 0");
        boxEntity.addEventListener("click", function () {
            console.log("Hello World!");
        });

        newEntity.appendChild(boxEntity);
    }
    return newEntity;
}
