import VR from './main.js';
import { AddSceneExplorer } from './SceneManager.js';
export function addText() {
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    var cameraEl = document.querySelector('#camera').object3D;
    var direction = new THREE.Vector3();
    cameraEl.getWorldDirection(direction);

    var distance = -5;
    var position = cameraEl.position.clone().add(direction.multiplyScalar(distance));

    const textCount = selectedScene.tags.filter(tag => tag.type === 'text').length;
    const textName = `text${textCount + 1}`;
    
    var rotation = cameraEl.rotation.clone();
    
    selectedScene.tags.push({
        type: 'text',
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: 0, y: rotation.y, z: rotation.z },
        targetScene: 'scene1',
        name: textName
    });

    var newEntity = document.createElement('a-text');
    newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    newEntity.setAttribute('value', 'Sample Text');
    newEntity.setAttribute('color', '#FFFFFF');
    newEntity.setAttribute('align', 'center');
    newEntity.setAttribute('scale', '5 5 5');
    newEntity.setAttribute('id', textName);
    newEntity.object3D.rotation.set(0, rotation.y, rotation.z);

    document.querySelector('#text-entity').appendChild(newEntity);
    console.log(VR);
    AddSceneExplorer(textName, 'text');
}

export function Loadtext() {
    const textEntities = document.querySelector('#text-entity');
    const sceneSelect = document.getElementById('selectscene');
    const selectedScene = VR.scenes[sceneSelect.value];
    while (textEntities.firstChild) {
        textEntities.removeChild(textEntities.firstChild);
    }
    selectedScene.tags.forEach(tag => {
        if (tag.type === 'text') {
            var newEntity = document.createElement('a-text');
            newEntity.setAttribute('position', tag.position.x + ' ' + tag.position.y + ' ' + tag.position.z);
            newEntity.setAttribute('value', 'Sample Text');
            newEntity.setAttribute('color', '#FFFFFF');
            newEntity.setAttribute('align', 'center');
            newEntity.setAttribute('scale', '5 5 5');
            newEntity.setAttribute('id', tag.textName);
            newEntity.object3D.rotation.set(tag.rotation.x, tag.rotation.y, tag.rotation.z);
           
          
        
            document.querySelector('#text-entity').appendChild(newEntity);
        }
    });
}


export function ModifyText(event) {
    let templateText = document.getElementById('template__texte').innerHTML;
    const recipe = document.getElementById('fixedSectionObjet');

    templateText = templateText.replaceAll("{{name}}", event.target.innerText);

    recipe.innerHTML = templateText;
    recipe.classList.add('fixed__section', 'objet');

    document.getElementById('RenameButton').addEventListener('click', renameText(event.target.id));
}


function renameText( nom ) {
    let sceneName = document.getElementById('selectscene').value;
    let fil = VR.scenes[sceneName].tags;
    let result = fil.find(isGoodText);
    console.log(nom);
    
    console.log(result.name);

    function isGoodText(text) {
        return text.name === nom;
    }
}