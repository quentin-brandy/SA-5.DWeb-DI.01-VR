import VR from "./main.js";

export function LoadFile() {
  const skyElement = document.getElementById("image-360");
  const assetsContainer = document.getElementById("assets-container");
  const sceneSelect = document.getElementById("selectscene");
  const Filename = document.getElementById("name_import");
  
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

    }
  }
}
