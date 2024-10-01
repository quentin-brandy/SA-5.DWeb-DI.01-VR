import  VR  from './main.js';
import { AddSceneExplorer, LoadSceneExplorer } from './SceneManager.js';
import { ModifyDoor } from './DoorManager.js';
import { ModifyText } from './TextManager.js';
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
            rotation,  // rotation est maintenant une propriété par défaut
            ...additionalProperties  // Gère les autres propriétés supplémentaires
        };
        this.scene.tags.push(tag);
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

    deleteTag(name) {
        const index = this.tags.findIndex(t => t.name === name);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }
}

export class Door extends TagManager {
    constructor(scene) {
        super(scene);
    }

    addDoorTag(name, position, targetScene = 'no scene') {
        this.addTag('door', name, position, {}, { targetScene });
    }
}

export class Text extends TagManager {
    constructor(scene) {
        super(scene);
    }

    addTextTag(name, position, rotation = {}, content = "Sample Text", fill = '#FFFFFF') {
        this.addTag('text', name, position, rotation, { content, fill });
    }
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
    
    // Vérifier si le nom existe déjà
    if (scene.tags.some(tag => tag.name === inputRename)) {
        spanError.innerHTML = "Ce nom existe déjà !";
        return;
    }

    spanError.innerHTML = "";
    const tag = scene.tags.find(tag => tag.name === nom);
    let tagScene = document.querySelector(`#${type}-entity #${nom}`);
    console.log(nom);

    // Renommer le tag
    if (tag) {
        tag.name = inputRename;
        const fakeEvent = { target: { id: tag.name } };
        tagScene.setAttribute('id', tag.name);
        
        // Appel des fonctions spécifiques au type
        AddSceneExplorer(tag.name, type);
        LoadSceneExplorer();
        if (type === 'door') {
            ModifyDoor(fakeEvent);
        } else if (type === 'text') {
            ModifyText(fakeEvent);
        }
    }
}



export function duplicateTag(tagType) {
    const tagName = document.getElementById(`${tagType}-name`).textContent;
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    const originalTag = selectedScene.tags.find(tag => tag.type === tagType && tag.name === tagName);

    if (originalTag) {
        const newTagName = generateUniqueName(originalTag.name, selectedScene.tags, tagType);
        const newPosition = { ...originalTag.position };

        // Dupliquer le tag
        const clonedTag = { ...originalTag, name: newTagName, position: newPosition };
        selectedScene.tags.push(clonedTag);

        // Créer l'entité correspondante
        createEntity(tagType, clonedTag);

        console.log(VR);
        AddSceneExplorer(newTagName, tagType);
    }
}

function createEntity(tagType, tag) {
    let newEntity;
    if (tagType === 'door') {
        newEntity = document.createElement('a-sphere');
        newEntity.setAttribute('radius', '1');
        newEntity.setAttribute('color', '#FF0000');
        newEntity.setAttribute('class', 'link');
        newEntity.setAttribute('scale', '0.5 0.5 0.5');
    } else if (tagType === 'text') {
        newEntity = document.createElement('a-text'); // Assurez-vous d'utiliser le bon élément pour le texte
        newEntity.setAttribute('value', tag.content); // Utilisez le contenu du texte
        newEntity.setAttribute('color', tag.fill); // Assurez-vous d'utiliser les propriétés spécifiques au texte
    }

    newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
    newEntity.setAttribute('id', tag.name);
    newEntity.addEventListener('click', function (event) {
        if (tagType === 'door') {
            TakeDoor(event);
        } else if (tagType === 'text') {
            // Appel pour gérer l'événement du texte
            handleTextClick(event);
        }
    });

    document.querySelector(`#${tagType}-entity`).appendChild(newEntity);
}
