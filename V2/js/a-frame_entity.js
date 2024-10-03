import { TakeDoor } from "./DoorManager.js";

export function createEntity(tag) {
    let newEntity;
    if (tag.type === 'door') {
        newEntity = document.createElement('a-sphere');
        newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
        newEntity.setAttribute('radius', '1');
        newEntity.setAttribute('color', tag.fill);
        newEntity.setAttribute('class', 'link clickable');
        newEntity.setAttribute('scale', `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`);
        newEntity.setAttribute('id', tag.name);
        newEntity.addEventListener('click', function (event) {
            TakeDoor(event);
        });
    } else if (tag.type === 'text') {
        newEntity = document.createElement('a-text');
        newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
        newEntity.setAttribute('value', tag.content);
        newEntity.setAttribute('color', tag.fill);
        newEntity.setAttribute('align', 'center');
        newEntity.setAttribute('scale', `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`);
        newEntity.setAttribute('id', tag.name);
        newEntity.object3D.rotation.set(tag.rotation.rx, tag.rotation.ry, tag.rotation.rz);
    }
    if(tag.type === 'photo') {
        newEntity = document.createElement('a-image');
        newEntity.setAttribute('position', `${tag.position.x} ${tag.position.y} ${tag.position.z}`);
        newEntity.setAttribute('src', tag.src);
        newEntity.setAttribute('scale', `${tag.scale.sx}  ${tag.scale.sy}  ${tag.scale.sz}`);
        newEntity.setAttribute('id', tag.name);
        newEntity.setAttribute('width', tag.taille.width);
        newEntity.setAttribute('height', tag.taille.height);
        newEntity.object3D.rotation.set(tag.rotation.rx, tag.rotation.ry, tag.rotation.rz);
    }

    return newEntity;
}