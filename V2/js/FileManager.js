import VR from "./main.js";

export function AddFile() {
  const fileInput = document.getElementById("file-upload");
  const skyElement = document.getElementById("image-360");
  const assetsContainer = document.getElementById("assets-container");
  const sceneSelect = document.getElementById("selectscene");
  const Filename = document.getElementById("name_import");

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileUrl = `../assets/${file.type.startsWith("image/") ? "img" : "video"}/${fileName}`;

      // Clear previous media and filename
      assetsContainer.innerHTML = "";
      Filename.innerHTML = "";

      if (file.type.startsWith("image/")) {
        // Replace videosphere with sky for image
        const videoSphere = document.getElementById("video-360");
        if (videoSphere) {
          videoSphere.remove(); // Remove videosphere if it exists
        }

        // Restore the sky element if it was replaced
        const newSkyElement = document.createElement("a-sky");
        newSkyElement.setAttribute("id", "image-360");
        newSkyElement.setAttribute("src", fileUrl);
        newSkyElement.setAttribute("rotation", "0 0 0");
        if (!skyElement) {
          assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
        } else {
          skyElement.parentNode.replaceChild(newSkyElement, skyElement);
        }
      } else if (file.type.startsWith("video/")) {
        // Video handling
        const videoElement = document.createElement("video");
        videoElement.setAttribute("id", fileName); // Set video ID as filename
        videoElement.setAttribute("src", fileUrl);
        videoElement.setAttribute("loop", "true");
        assetsContainer.appendChild(videoElement); // Add video to assets

        // Create a-videosphere and reference video by ID
        const videoSphere = document.createElement("a-videosphere");
        videoSphere.setAttribute("id", "video-360");
        videoSphere.setAttribute("src", `#${fileName}`); // Use video ID as src

        // Replace the sky element with videosphere
        if (skyElement) {
          skyElement.parentNode.replaceChild(videoSphere, skyElement);
        }
      }

      // Update VR object with the media details
      let Scene = sceneSelect.value;
      VR.scenes[Scene].image.url = fileUrl;
      VR.scenes[Scene].image.name = fileName;

      if (file.type.startsWith("video/")) {
        const playPauseButton = document.createElement("button");
        playPauseButton.className = "btn__icon";
        playPauseButton.innerHTML =
          '<div class="flex gap-2"><li class="flex items-center gap-2">Pause/Play the video</li><img class="w-5" src="../assets/svg/play-and-pause-button-svgrepo-com.svg" alt="Play/Pause icon"></div>';
        playPauseButton.addEventListener("click", function () {
          const videoElement = document.getElementById(fileName);
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
        Filename.appendChild(playPauseButton);
      }

      // Display the filename
      const AddFileName = document.createElement("li");
      AddFileName.textContent = fileName;
      AddFileName.className = "flex items-center gap-2";
      Filename.appendChild(AddFileName);

      // Add delete button
      if (Filename !== "image_360.png") {
        const btn = document.createElement("button");
        btn.className = "btn__icon";
        btn.addEventListener("click", DeleteFile);
        btn.innerHTML =
          '<img class="icon__scene" src="../assets/svg/trash3.svg" alt="Trash icon">';
        AddFileName.appendChild(btn);
      }
    }
  });
}
export function LoadFile() {
  const skyElement = document.getElementById("image-360");
  const assetsContainer = document.getElementById("assets-container");
  const sceneSelect = document.getElementById("selectscene");
  const Filename = document.getElementById("name_import");

  // Clear previous media and filenames
  assetsContainer.innerHTML = "";
  Filename.innerHTML = "";

  const selectedScene = VR.scenes[sceneSelect.value];
  if (selectedScene && selectedScene.image.url) {
    let mediaElement;
    if (
      selectedScene.image.url.endsWith(".jpg") ||
      selectedScene.image.url.endsWith(".JPG") ||
      selectedScene.image.url.endsWith(".png")
    ) {
      // Load image
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("id", "uploaded-image");
      mediaElement.setAttribute("src", selectedScene.image.url);
      // Add media element to assets
      assetsContainer.appendChild(mediaElement);

      const videoSphere = document.getElementById("video-360");
      if (videoSphere) {
        videoSphere.remove(); // Remove videosphere if it exists
      }

      // Restore sky element if it was replaced
      const newSkyElement = document.createElement("a-sky");
      newSkyElement.setAttribute("id", "image-360");
      newSkyElement.setAttribute("src", selectedScene.image.url);
      newSkyElement.setAttribute("rotation", "0 -100 0");
      if (!skyElement) {
        assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
      } else {
        skyElement.parentNode.replaceChild(newSkyElement, skyElement);
      }
    } else if (selectedScene.image.url.endsWith(".mp4")) {
      // Remove previous video from assets if it exists
      let existingVideoElement = document.getElementById(
        selectedScene.image.name
      );
      if (existingVideoElement) {
        existingVideoElement.pause();
        existingVideoElement.src = ""; // Clear the source
        existingVideoElement.load(); // Reset the video element
        existingVideoElement.remove(); // Remove the element from the DOM
      }

      // Create a new video element and add it to the assets
      const newVideoElement = document.createElement("video");
      newVideoElement.setAttribute("id", selectedScene.image.name); // Use video name as ID
      newVideoElement.setAttribute("src", selectedScene.image.url);
      newVideoElement.setAttribute("loop", "true");
      newVideoElement.setAttribute("crossorigin", "anonymous"); // Add crossorigin to prevent CORS issues
      assetsContainer.appendChild(newVideoElement);

      // Create or update a-videosphere and reference the video by its ID
      let videoSphere = document.getElementById("video-360");
      if (!videoSphere) {
        videoSphere = document.createElement("a-videosphere");
        videoSphere.setAttribute("id", "video-360");
        videoSphere.setAttribute("src", `#${selectedScene.image.name}`);
        skyElement.parentNode.replaceChild(videoSphere, skyElement); // Replace sky with videosphere
      } else {
        videoSphere.setAttribute("src", `#${selectedScene.image.name}`); // Update the source of the videosphere
      }

      // Add play/pause button
      const playPauseButton = document.createElement("button");
      playPauseButton.className = "btn__icon";
      playPauseButton.innerHTML =
        '<div class="flex gap-2"><li class="flex items-center gap-2">Pause/Play </li><img class="w-5" src="../assets/svg/play-and-pause-button-svgrepo-com.svg" alt="Play/Pause icon"></div>';
      playPauseButton.addEventListener("click", function () {
        if (newVideoElement.paused) {
          newVideoElement.play();
        } else {
          newVideoElement.pause();
        }
      });
      Filename.appendChild(playPauseButton);

      // Automatically play the video once it's loaded
      newVideoElement.addEventListener("loadeddata", function () {
        newVideoElement.play();
      });
    }

    // Display the filename
    const AddFileName = document.createElement("li");
    AddFileName.textContent = selectedScene.image.name;
    AddFileName.className = "flex items-center gap-2";
    Filename.appendChild(AddFileName);

    // Add delete button
    if (selectedScene.image.name !== "image_360.png") {
      const btn = document.createElement("button");
      btn.className = "btn__icon";
      btn.addEventListener("click", DeleteFile);
      btn.innerHTML =
        '<img class="icon__scene" src="../assets/svg/trash3.svg" alt="Trash icon">';
      AddFileName.appendChild(btn);
    }
  }

  AddFile();
}
export function DeleteFile() {
  let li = document.querySelector(".imported_file_name");
  const sceneSelect = document.getElementById("selectscene");
  const skyElement = document.getElementById("image-360");
  const assetsContainer = document.getElementById("assets-container");
  const Filename = document.getElementById("name_import");

  if (li) {
    li.remove();
  }

  // Reset to default sky image
  VR.scenes[sceneSelect.value].image.url = "../assets/img/image_360.png";
  VR.scenes[sceneSelect.value].image.name = "image_360.png";

  // Clear assets and restore default image
  const videoSphere = document.getElementById("video-360");
  if (videoSphere) {
    videoSphere.remove(); // Remove videosphere if it exists
  }

  const newSkyElement = document.createElement("a-sky");
  newSkyElement.setAttribute("id", "image-360");
  newSkyElement.setAttribute("src", "../assets/img/image_360.png");
  newSkyElement.setAttribute("rotation", "0 -100 0");

  if (!skyElement) {
    assetsContainer.parentNode.appendChild(newSkyElement); // Append if missing
  } else {
    skyElement.parentNode.replaceChild(newSkyElement, skyElement); // Replace videosphere with sky
  }

  LoadFile(); // Re-load default file
}
