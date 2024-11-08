export class TagManager {
  constructor(scene) {
    this.scene = scene;
    this.tags = scene.tags;
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