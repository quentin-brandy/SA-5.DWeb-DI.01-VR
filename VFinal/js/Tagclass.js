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
      ...additionalProperties,
    };
    this.scene.tags.push(tag);
    return tag; // Retourne le tag pour des manipulations supplémentaires
  }

  moveTag(name, newPosition) {
    const tag = this.tags.find((t) => t.name === name);
    if (tag) {
      tag.position = { ...newPosition };
      return tag;
    }
    return null;
  }

  rotateTag(name, newRotation) {
    const tag = this.tags.find((t) => t.name === name);
    if (tag) {
      tag.rotation = { ...newRotation };
      return tag;
    }
    return null;
  }
  scaleTag(name, newScale) {
    const tag = this.getTag(name);
    if (tag) {
      tag.scale = newScale;
      return tag;
    }
    return null;
  }
  updateTagSize(name, newSize, dimension) {
    const tag = this.getTag(name);
    if (
      tag &&
      tag.taille &&
      (dimension === "width" || dimension === "height")
    ) {
      tag.taille[dimension] = newSize;
      return tag;
    }
    return null;
  }
  getTag(name) {
    return this.tags.find((t) => t.name === name);
  }

  renameTag(oldName, newName) {
    const tag = this.getTag(oldName);
    if (tag) {
      tag.name = newName;
    }
  }

  updateTagFill(name, fill) {
    const tag = this.getTag(name);
    if (tag) {
      tag.fill = fill;
      return tag;
    }
  }
  deleteTag(name) {
    const index = this.tags.findIndex((t) => t.name === name);
    if (index !== -1) {
      this.tags.splice(index, 1);
      return true;
    }
    return false;
  }

  duplicateTag(tagName) {
    const originalTag = this.getTag(tagName);
    if (originalTag) {
      const newTagName = this.generateUniqueName(
        originalTag.name,
        originalTag.type
      );
      const newTag = {
        ...originalTag,
        name: newTagName,
        position: { ...originalTag.position },
      };
      this.scene.tags.push(newTag);
      return newTag;
    }
    return null;
  }

  generateUniqueName(baseName, type) {
    let newName = baseName;
    let count = 1;
    while (this.tags.some((tag) => tag.name === newName)) {
      newName = `${baseName}_copy${count}`;
      count++;
    }
    return newName;
  }
}

export class Door extends TagManager {
  addDoorTag(
    name,
    position,
    targetScene = "no scene",
    fill = "#FFFFFF",
    scale = { sx: 1, sy: 1, sz: 1 }
  ) {
    return this.addTag(
      "door",
      name,
      position,
      {},
      { targetScene, fill, scale }
    );
  }
}

export class Text extends TagManager {
  addTextTag(
    name,
    position,
    rotation = {},
    content = "Sample Text",
    fill = "#FFFFFF",
    scale = { sx: 1, sy: 1, sz: 1 }
  ) {
    return this.addTag("text", name, position, rotation, {
      content,
      fill,
      scale,
    });
  }
}

export class Photo extends TagManager {
  addPhotoTag(
    name,
    position,
    rotation = {},
    src = "../assets/img/image_photo.png",
    photoname = "image_photo.png",
    taille = { width: 10, height: 10 },
    scale = { sx: 1, sy: 1, sz: 1 }
  ) {
    return this.addTag("photo", name, position, rotation, {
      src,
      photoname,
      taille,
      scale,
    });
  }

  updatePhotoSrc(name, newSrc) {
    const tag = this.getTag(name);
    if (tag && tag.type === "photo") {
      tag.src = newSrc;
      return tag;
    }
    return null;
  }
}

export class InfoBulle extends TagManager {
  addInfoBulleTag(
    name,
    position,
    rotation = {},
    title = "Sample Title",
    desc = "Sample Description",
    titleColor = "#000",
    descColor = "#000",
    radius = "0.5",
    isVisible = false,
    scale = { sx: 1, sy: 1, sz: 1 }
  ) {
    return this.addTag("infoBulle", name, position, rotation, {
      title,
      desc,
      titleColor,
      descColor,
      radius,
      isVisible,
      scale,
    });
  }
}

export class Robot extends TagManager {
  addRobotTag(
    name,
    position,
    rotation = {},
    scale = { sx: 1, sy: 1, sz: 1 },
    state
  ) {
    return this.addTag("robot", name, position, rotation, {
      scale,
      state,
    });
  }
}
