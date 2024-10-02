import VR from './main.js';

export function AddFile() {
    const fileInput = document.getElementById('file-upload');
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');
    const sceneSelect = document.getElementById('selectscene');
    const Filename = document.getElementById('name_import');

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const fileName = file.name;
            const fileUrl = `./assets/${file.type.startsWith('image/') ? 'img' : 'video'}/${fileName}`;
            
            // Clear previous media and filename
            assetsContainer.innerHTML = '';
            Filename.innerHTML = '';

            let mediaElement;
            if (file.type.startsWith('image/')) {
                // Replace videosphere with sky for image
                const videoSphere = document.getElementById('video-360');
                if (videoSphere) {
                    videoSphere.remove(); // Remove videosphere if it exists
                }

                // Restore the sky element if it was replaced
                const newSkyElement = document.createElement('a-sky');
                newSkyElement.setAttribute('id', 'image-360');
                newSkyElement.setAttribute('src', fileUrl);
                if (!skyElement) {
                    assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
                } else {
                    skyElement.parentNode.replaceChild(newSkyElement, skyElement);
                }
            } else if (file.type.startsWith('video/')) {
                // Video handling
                const videoElement = document.createElement('video');
                videoElement.setAttribute('id', fileName); // Set video ID as filename
                videoElement.setAttribute('src', fileUrl);
                videoElement.setAttribute('autoplay', 'true');
                videoElement.setAttribute('loop', 'true');
                assetsContainer.appendChild(videoElement); // Add video to assets

                // Create a-videosphere and reference video by ID
                const videoSphere = document.createElement('a-videosphere');
                videoSphere.setAttribute('id', 'video-360');
                videoSphere.setAttribute('src', `#${fileName}`); // Use video ID as src

                // Replace the sky element with videosphere
                if (skyElement) {
                    skyElement.parentNode.replaceChild(videoSphere, skyElement);
                }
            }

            // Update VR object with the media details
            let Scene = sceneSelect.value;
            VR.scenes[Scene].image.url = fileUrl;
            VR.scenes[Scene].image.name = fileName;

            // Add file name and delete button
            const AddFileName = document.createElement('li');
            AddFileName.className = 'imported_file_name flex items-center gap-2';
            AddFileName.textContent = fileName;
            Filename.appendChild(AddFileName);

            const btn = document.createElement('button');
            btn.className = 'btn__icon';
            btn.innerHTML = '<img class="icon__scene" src="./assets/svg/trash3.svg" alt="Trash icon">';
            btn.addEventListener('click', DeleteFile);
            AddFileName.appendChild(btn);
        }
    });
}
export function LoadFile() { 
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');
    const sceneSelect = document.getElementById('selectscene');
    const Filename = document.getElementById('name_import');
    
    // Clear previous media and filenames
    assetsContainer.innerHTML = '';
    Filename.innerHTML = '';

    const selectedScene = VR.scenes[sceneSelect.value];
    if (selectedScene && selectedScene.image.url) {
        let mediaElement;
        if (selectedScene.image.url.endsWith('.jpg') || selectedScene.image.url.endsWith('.png')) {
            // Load image
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('id', 'uploaded-image');
            mediaElement.setAttribute('src', selectedScene.image.url);
            // Add media element to assets
            assetsContainer.appendChild(mediaElement);
            
            const videoSphere = document.getElementById('video-360');
            if (videoSphere) {
                videoSphere.remove(); // Remove videosphere if it exists
            }

            // Restore sky element if it was replaced
            const newSkyElement = document.createElement('a-sky');
            newSkyElement.setAttribute('id', 'image-360');
            newSkyElement.setAttribute('src', selectedScene.image.url);
            if (!skyElement) {
                assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
            } else {
                skyElement.parentNode.replaceChild(newSkyElement, skyElement);
            }

        } else if (selectedScene.image.url.endsWith('.mp4')) {
            // Remove previous video from assets if it exists
            let existingVideoElement = document.getElementById(selectedScene.image.name);
            if (existingVideoElement) {
                existingVideoElement.remove();
            }

            // Create a new video element and add it to the assets
            const videoElement = document.createElement('video');
            videoElement.setAttribute('id', selectedScene.image.name); // Use video name as ID
            videoElement.setAttribute('src', selectedScene.image.url);
            videoElement.setAttribute('autoplay', 'true');  // Ensure video autoplays
            videoElement.setAttribute('loop', 'true');
            assetsContainer.appendChild(videoElement);

            // Create or update a-videosphere and reference the video by its ID
            let videoSphere = document.getElementById('video-360');
            if (!videoSphere) {
                videoSphere = document.createElement('a-videosphere');
                videoSphere.setAttribute('id', 'video-360');
                videoSphere.setAttribute('src', `#${selectedScene.image.name}`);
                videoSphere.setAttribute('autoplay', 'true');  // Ensure a-videosphere autoplays
                skyElement.parentNode.replaceChild(videoSphere, skyElement); // Replace sky with videosphere
            } else {
                videoSphere.setAttribute('src', `#${selectedScene.image.name}`); // Update the source of the videosphere
            }
        }

        // Display the filename
        const AddFileName = document.createElement('li');
        AddFileName.textContent = selectedScene.image.name;
        AddFileName.className = 'flex items-center gap-2';
        Filename.appendChild(AddFileName);

        // Add delete button
        if (selectedScene.image.name !== 'sky.jpg') {
            const btn = document.createElement('button');
            btn.className = 'btn__icon';
            btn.addEventListener('click', DeleteFile);
            btn.innerHTML = '<img class="icon__scene" src="./assets/svg/trash3.svg" alt="Trash icon">';
            AddFileName.appendChild(btn);
        }
    }

    AddFile();
}
export function DeleteFile () {
    let li = document.querySelector('.imported_file_name');
    const sceneSelect = document.getElementById('selectscene');
    const skyElement = document.getElementById('image-360');
    const assetsContainer = document.getElementById('assets-container');
    const Filename = document.getElementById('name_import');

    if (li) {
        li.remove();
    }

    // Reset to default sky image
    VR.scenes[sceneSelect.value].image.url = './assets/img/sky.jpg';
    VR.scenes[sceneSelect.value].image.name = 'sky.jpg';

    // Clear assets and restore default image
    const videoSphere = document.getElementById('video-360');
    if (videoSphere) {
        videoSphere.remove(); // Remove videosphere if it exists
    }

    const newSkyElement = document.createElement('a-sky');
    newSkyElement.setAttribute('id', 'image-360');
    newSkyElement.setAttribute('src', './assets/img/sky.jpg');

    if (!skyElement) {
        assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
    } else {
        skyElement.parentNode.replaceChild(newSkyElement, skyElement); // Replace videosphere with sky
    }

    LoadFile(); // Re-load default file
}