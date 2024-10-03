import VR from './main.js';
import { AddSceneExplorer, LoadSceneExplorer } from './SceneManager.js';
import { ModifyDoor, TakeDoor } from './DoorManager.js';
import { ModifyText } from './TextManager.js';
import { ModifyInfoBulle } from './InfoBulleManager.js';
export class TagManager {
    constructor(scene) {
        this.scene = scene;
        this.tags = scene.tags;
    }

    addTag(type, name, position, rotation = {}, additionalProperties = {}) {
        const tag = {
            type,
            name,
            position,
            rotation,
            ...additionalProperties
        };
        this.scene.tags.push(tag);
        return tag;  // Retourne le tag pour des manipulations supplémentaires
    }

    moveTag(name, newPosition) {
        const tag = this.tags.find(t => t.name === name);
        if (tag) {
            tag.position = { ...newPosition };
            return tag;
        }
        return null;
    }

    getTag(name) {
        return this.tags.find(t => t.name === name);
    }

    renameTag(oldName, newName) {
        const tag = this.getTag(oldName);
        if (tag) {
            tag.name = newName;
        }
    }
    deleteTag(name) {
        const index = this.tags.findIndex(t => t.name === name);
        if (index !== -1) {
            this.tags.splice(index, 1);
            return true;
        }
        return false;
    }

    duplicateTag(tagName) {
        const originalTag = this.getTag(tagName);
        if (originalTag) {
            const newTagName = this.generateUniqueName(originalTag.name, originalTag.type);
            const newTag = { ...originalTag, name: newTagName, position: { ...originalTag.position } };
            this.scene.tags.push(newTag);
            return newTag;
        }
        return null;
    }

    generateUniqueName(baseName, type) {
        let newName = baseName;
        let count = 1;
        while (this.tags.some(tag => tag.name === newName)) {
            newName = `${baseName}_copy${count}`;
            count++;
        }
        return newName;
    }
}

export class Door extends TagManager {
    addDoorTag(name, position, targetScene = 'no scene') {
        return this.addTag('door', name, position, {}, { targetScene });
    }

}

export class Text extends TagManager {
    addTextTag(name, position, rotation = {}, content = "Sample Text", fill = '#FFFFFF') {
        return this.addTag('text', name, position, rotation, { content, fill });
    }

}

export class InfoBulle extends TagManager {
    addInfoBulleTag(name, position, rotation = {}, contentTitle = "Sample Title", contentDesc = "Sample Description", fillTitle = '#000', fillDesc = '#000', radius = '0.5', visible = false) {
        return this.addTag('infoBulle', name, position, rotation, { contentTitle, contentDesc, fillTitle, fillDesc, radius, visible });
    }

}


export function LoadSlider(e) {
    const ratio = (e.value - e.min) / (e.max - e.min) * 100;
    const activeColor = "#00C058";
    const inactiveColor = "transparent";

    e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

}


// Fonction pour générer un nom unique
function generateUniqueName(baseName, tags, type) {
    let newName = baseName;
    let count = 1;
    while (tags.some(tag => tag.name === newName)) {
        newName = `${baseName}_copy${count}`;
        count++;
    }
    return newName;
}




export function TagPositionChange(e, tagType) {
    const tagName = document.getElementById(`${tagType}-name`).textContent; // "door-name" ou "text-name"
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const axis = e.target.name; // 'x', 'y', or 'z'
    const newPosition = parseFloat(e.target.value);

    // Mettre à jour l'affichage de la valeur du slider
    document.querySelector(`#${axis}-value`).textContent = `${newPosition}`;

    // Créer une instance de TagManager pour gérer les tags
    const tagManager = new TagManager(selectedScene);

    // Mettre à jour la position en utilisant la méthode moveTag
    const updatedTag = tagManager.moveTag(tagName, { ...selectedScene.tags.find(tag => tag.type === tagType && tag.name === tagName).position, [axis]: newPosition });

    // Si le tag a été mis à jour, mettre à jour l'entité dans la scène A-Frame
    if (updatedTag) {
        const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
        if (tagElement) {
            tagElement.setAttribute('position', `${updatedTag.position.x} ${updatedTag.position.y} ${updatedTag.position.z}`);
        }

        // Mise à jour du dégradé linéaire du slider
        const ratio = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
        const activeColor = "#00C058";
        const inactiveColor = "transparent";
        e.target.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

        // Afficher la scène mise à jour dans la console
        console.log(VR);

    }
}



export function renameTag(type, nom) {
    const sceneName = document.getElementById('selectscene').value;
    const scene = VR.scenes[sceneName];
    const inputRename = document.getElementById('rename').value;
    const spanError = document.getElementById('span__error');

    // Utiliser TagManager pour la gestion des tags
    const tagManager = new TagManager(scene);

    // Vérifier si le nouveau nom existe déjà
    if (tagManager.getTag(inputRename)) {
        spanError.innerHTML = "Ce nom existe déjà !";
        return;
    }

    spanError.innerHTML = "";

    // Récupérer et renommer le tag via TagManager
    const tag = tagManager.getTag(nom);
    let tagScene = document.querySelector(`#${type}-entity #${nom}`);

    if (tag) {
        tagManager.renameTag(nom, inputRename);  // Utiliser la méthode renameTag

        // Mettre à jour l'ID de l'entité dans la scène A-Frame
        tagScene.setAttribute('id', inputRename);

        // Appel des fonctions spécifiques au type
        AddSceneExplorer(inputRename, type);
        LoadSceneExplorer();
        if (type === 'door') {
            ModifyDoor({ target: { id: inputRename } });
        } else if (type === 'text') {
            ModifyText({ target: { id: inputRename } });
        } else if (type === 'infoBulle') {
            ModifyInfoBulle({ target: { id: inputRename } });
        }
    }
}
export function duplicateTag(tagType) {
    const tagName = document.getElementById(`${tagType}-name`).textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    const tagManager = new TagManager(selectedScene);

    // Récupérer le tag original
    const originalTag = tagManager.getTag(tagName);

    if (originalTag) {
        const newTagName = generateUniqueName(originalTag.name, selectedScene.tags, tagType);
        const newPosition = { ...originalTag.position };

        let clonedTag;

        // Créer une nouvelle instance basée sur le type de tag
        if (tagType === 'text') {
            clonedTag = new Text(selectedScene).addTextTag(newTagName, newPosition, originalTag.rotation, originalTag.content, originalTag.fill);
        } else if (tagType === 'door') {
            clonedTag = new Door(selectedScene).addDoorTag(newTagName, newPosition, originalTag.targetScene);
        } else if (tagType === 'infoBulle') {
            clonedTag = new InfoBulle(selectedScene).addInfoBulleTag(newTagName, newPosition, originalTag.targetScene, originalTag.contentTitle, originalTag.contentDesc, originalTag.fillTitle, originalTag.fillDesc, originalTag.radius);
        }

        // Ajouter le tag cloné à la scène
        tagManager.addTag(clonedTag);

        // Créer l'entité correspondante dans A-Frame
        createEntity(tagType, clonedTag);

        console.log(VR);
        AddSceneExplorer(newTagName, tagType);
        loadTag();
        console.log(`Tag dupliqué: ${newTagName}`);

        if (tagType === 'door') {
            ModifyDoor({ target: { id: newTagName } });
        } else if (tagType === 'text') {
            ModifyText({ target: { id: newTagName } });
        } else if (tagType === 'infoBulle') {
            ModifyInfoBulle({ target: { id: newTagName } });
        }
    }
}


export function deleteTag(tagType) {
    const tagName = document.getElementById(`${tagType}-name`).textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    // Initialisation du TagManager avec la scène sélectionnée
    const tagManager = new TagManager(selectedScene);

    // Supprimer le tag via TagManager
    const tagElement = document.querySelector(`#${tagType}-entity #${tagName}`);
    const deletedTag = tagManager.getTag(tagName);

    if (deletedTag) {
        tagManager.deleteTag(tagName);  // Supprime le tag de la scène via TagManager
        tagElement.remove();  // Supprime l'élément de la scène A-Frame

        console.log(`Tag supprimé: ${tagName}`);
        let templateSection = document.getElementById('template_section');
        templateSection.className = '';
        templateSection.innerHTML = '';
        LoadSceneExplorer();  // Recharge la scène
    } else {
        console.log("Tag non trouvé");
    }
}


function createEntity(tag) {
    let newEntity;
    if (tag.type === 'door') {
        newEntity = document.createElement('a-sphere');
        newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
        newEntity.setAttribute('radius', '1');
        newEntity.setAttribute('color', '#FF0000');
        newEntity.setAttribute('class', 'link clickable');
        newEntity.setAttribute('scale', '0.5 0.5 0.5');
        newEntity.setAttribute('id', tag.name);
        newEntity.addEventListener('click', function (event) {
            TakeDoor(event);
        });
        document.querySelector('#rightController').addEventListener('triggerdown', function (event) {
            if (event.target === newEntity) {
                TakeDoor(event);
            }
        });
    }
    else if (tag.type === 'text') {
        newEntity = document.createElement('a-text');
        newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
        newEntity.setAttribute('value', tag.content);
        newEntity.setAttribute('color', tag.fill);
        newEntity.setAttribute('align', 'center');
        newEntity.setAttribute('scale', '5 5 5');
        newEntity.setAttribute('id', tag.name);
        newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);
    }
    else if (tag.type === 'infoBulle') {
        newEntity = document.createElement('a-entity');
        newEntity.setAttribute('id', `${tag.name}`);
        newEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
        newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);

        var sphereEntity = document.createElement('a-sphere');
        sphereEntity.setAttribute('id', `${tag.name}-sphere`);
        sphereEntity.setAttribute('radius', tag.radius);
        sphereEntity.setAttribute('color', '#EF2D5E');
        sphereEntity.setAttribute('class', 'link');

        var infoPanelEntity = document.createElement('a-entity');
        infoPanelEntity.setAttribute('id', `${tag.name}-info-panel`);
        infoPanelEntity.setAttribute('visible', false);

        var infoPlane = document.createElement('a-plane');
        infoPlane.setAttribute('color', '#FFF');
        infoPlane.setAttribute('width', '2');
        infoPlane.setAttribute('height', '1');

        var infoTextTitle = document.createElement('a-text');
        infoTextTitle.setAttribute('id', `${tag.name}-title`);
        infoTextTitle.setAttribute('value', "Sample Title");
        infoTextTitle.setAttribute('color', "#000");
        infoTextTitle.setAttribute('opacity', '0');
        infoTextTitle.setAttribute('width', '1.9');
        infoTextTitle.setAttribute('wrap-count', '30');

        var infoTextDescription = document.createElement('a-text');
        infoTextDescription.setAttribute('id', `${tag.name}-description`);
        infoTextDescription.setAttribute('value', "Sample Description");
        infoTextDescription.setAttribute('color', "#000");
        infoTextDescription.setAttribute('width', '1.9');
        infoTextDescription.setAttribute('wrap-count', '30');

        infoPlane.appendChild(infoTextTitle);
        infoPlane.appendChild(infoTextDescription);

        infoPanelEntity.appendChild(infoPlane);

        newEntity.appendChild(sphereEntity);
        newEntity.appendChild(infoPanelEntity);
    }

    return newEntity;
}



// déplacement 


let isMoving = false; // Assurez-vous que cette variable est en dehors de la fonction pour garder son état

export function toggleMove(Name) {
    const sceneEl = document.querySelector('a-scene'); // Assurez-vous que la scène est correctement sélectionnée

    function handleSceneClick(event) {
        // Trouver l'élément sur lequel on a cliqué en utilisant `event.target`
        const clickedElement = document.querySelector(`#${Name}`);
        console.log(clickedElement);
        // Si l'élément a une classe ou un attribut indiquant son type, récupérons-le
        let Type = clickedElement.getAttribute('data-type') || clickedElement.classList.contains('door') ? 'door' : 'text'; // Remplace 'data-type' par l'attribut qui te convient si besoin

        // Appeler `handleMove` avec le nom de l'élément et le type récupéré dynamiquement
        handleMove(event, Name, Type);

        // Désactiver le mouvement après un clic
        isMoving = false;
        sceneEl.removeEventListener('click', handleSceneClick);
    }

    // Si nous venons d'activer le mouvement
    if (!isMoving) {
        isMoving = true; // Marquer comme en mouvement

        // Ajouter un listener pour le clic sur la scène
        sceneEl.addEventListener('click', handleSceneClick);
    } else {
        isMoving = false; // Désactiver le mouvement

        // Supprimer le listener lorsque le mouvement est désactivé
        sceneEl.removeEventListener('click', handleSceneClick);
    }
}

export function handleMove(event, Name, Type) {
    console.log(Name);

    if (!event.clientX || !event.clientY) {
        console.error("Les coordonnées de l'écran ne sont pas disponibles. Assurez-vous que l'événement est un 'click' ou similaire.");
        return;
    }

    const cameraEl = document.querySelector('[camera]');
    const screenPosition = new THREE.Vector2();
    screenPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    screenPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log("screenPosition:", screenPosition);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(screenPosition, cameraEl.getObject3D('camera'));

    const distance = 3;
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.at(distance, intersectionPoint);

    const tagElement = document.querySelector(`#${Type}-entity #${Name}`);
    if (!tagElement) {
        console.error(`Élément avec ID #${Type}-entity #${Name} non trouvé.`);
        return;
    }

    tagElement.setAttribute('position', {
        x: intersectionPoint.x,
        y: intersectionPoint.y,
        z: intersectionPoint.z,
    });
    console.log(`Position mise à jour : ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`);

    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    // Vérifier si une instance de tag existe déjà dans VR, sinon créer une nouvelle instance
    let tagInstance = VR.scenes[sceneSelect.value].tags.find(tag => tag.name === Name);

    if (!tagInstance) {
        // Créer une nouvelle instance si elle n'existe pas déjà
        if (Type === 'door') {
            tagInstance = new Door(Name, selectedScene);
        } else if (Type === 'text') {
            tagInstance = new Text(Name, selectedScene);
        } else if (Type === 'infoBulle') {
            tagInstance = new InfoBulle(Name, selectedScene);
        } else {
            console.error('Type de tag non reconnu.');
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
    document.getElementById('x-slider').value = tagInstance.position.x.toFixed(1);
    document.getElementById('y-slider').value = tagInstance.position.y.toFixed(1);
    document.getElementById('z-slider').value = tagInstance.position.z.toFixed(1);

    // Mettre à jour les valeurs des sliders affichées
    document.getElementById('x-value').textContent = tagInstance.position.x.toFixed(1);
    document.getElementById('y-value').textContent = tagInstance.position.y.toFixed(1);
    document.getElementById('z-value').textContent = tagInstance.position.z.toFixed(1);

    // Mettre à jour le dégradé des sliders
    ['x', 'y', 'z'].forEach(axis => {
        const slider = document.getElementById(`${axis}-slider`);
        const ratio = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        const activeColor = "#00C058";
        const inactiveColor = "transparent";
        slider.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
    });

    console.log(`Tag déplacé à la position : ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`);
}


// Fonction générique pour charger et instancier les tags (door et text et infoBulle)
export function loadTag() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];

    // Vide les entités existantes
    const doorEntities = document.querySelector('#door-entity');
    const textEntities = document.querySelector('#text-entity');
    const infoBulleEntities = document.querySelector('#infoBulle-entity');

    [doorEntities, textEntities, infoBulleEntities].forEach(entityContainer => {
        while (entityContainer.firstChild) {
            entityContainer.removeChild(entityContainer.firstChild);
        }
    });

    // Parcourt tous les tags de la scène sélectionnée
    selectedScene.tags.forEach(tag => {
        // Instancie la classe appropriée selon le type de tag
        let tagInstance;
        if (tag.type === 'door') {
            tagInstance = new Door(tag.name, selectedScene);
        } else if (tag.type === 'text') {
            tagInstance = new Text(tag.name, selectedScene);
        } else if (tag.type === 'infoBulle') {
            tagInstance = new InfoBulle(tag.name, selectedScene);
        }

        // Crée l'entité correspondante à partir du tag et la classe
        const newEntity = createEntity(tag);

        // Ajoute l'entité à la scène en fonction du type
        if (tag.type === 'door') {
            doorEntities.appendChild(newEntity);
        } else if (tag.type === 'text') {
            textEntities.appendChild(newEntity);
        } else if (tag.type === 'infoBulle') {
            infoBulleEntities.appendChild(newEntity);
        }
    });
}

