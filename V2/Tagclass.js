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

    rotateTag(name, newRotation) {
        const tag = this.tags.find(t => t.name === name);
        if (tag) {
            tag.rotation = { ...newRotation };
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

export class Photo extends TagManager {
    addPhotoTag(name, position, rotation = {}, src = './assets/img/sky.jpg') {
        return this.addTag('photo', name, position, rotation, { src });
    }
    
}