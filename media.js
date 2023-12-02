const mediaFiles = [];
var addMediaCounter = 0;
const mediaFileSrcList = {};
const mediaFileVideoThumbnailList = {};
let addMediaModal = null;
function showAddMedia() {
    addMediaModal.show();
}

function generateVideoThumbnail(file){
    // function from:
    // https://stackoverflow.com/a/69183556/2754871

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
  };

function loadFiles(files){
    if(files && files.length>0){
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const file = files[fileIndex];
            if (file) {
                mediaFiles.push(file);
                if (
                    file.name.toLowerCase().endsWith(".mp4") == false &&
                    file.name.toLowerCase().endsWith(".webm") == false
                ) {
                    var fr = new FileReader();
                    fr.onload = function (e) {
                        mediaFileSrcList[file.name] = this.result;
                    };
                    fr.readAsDataURL(file);
                }
                else{
                    handleVideoThumbnail(file);
                }
                updateMediaLibrary();
            }
        }
    }
}

function updateMediaLibrary() {
    const mediaList = document.querySelector("#mediaList");

    // Clear the existing list
    mediaList.innerHTML = "";

    // Iterate over the mediaFiles array and add items to the list
    mediaFiles.forEach((mediaItem, index) => {
        const listItem = document.createElement("li");
        listItem.className =
            "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            ${mediaItem.name}
            <button type="button" class="btn btn-danger btn-sm remove-button" data-index="${index}">Remove</button>
        `;
        mediaList.appendChild(listItem);
    });

    // Attach event listeners to the remove buttons
    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const indexToRemove = parseInt(button.getAttribute("data-index"));
            // Remove the item from the mediaFiles array
            mediaFiles.splice(indexToRemove, 1);
            // Update the media library
            updateMediaLibrary();
            refreshMediaList();
        });
    });
    refreshMediaList();
}
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the mediaFiles array to store media items
    addMediaModal = new bootstrap.Modal(document.getElementById("addMediaModal"));


    // Handle media upload form submission
    document.getElementById("mediaForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const fileInput = document.getElementById("mediaFile");
        const files = fileInput.files;
        loadFiles(files);
        fileInput.value = null;
        addMediaModal.hide();
    });

    // Update the media library initially (empty)
    updateMediaLibrary();
    setDropToAdd();
});

function setDropToAdd(){
    const fileDropZone = document.querySelector('#chatscroll');
    // Prevent the default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropZone.addEventListener(eventName, function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    fileDropZone.addEventListener('click', function () {
        addMediaCounter=0;
        fileDropZone.classList.remove('highlight');
    });


    fileDropZone.addEventListener('dragenter', function () {
        addMediaCounter++;
        fileDropZone.classList.add('highlight');
    });

    fileDropZone.addEventListener('dragleave', function () {
        addMediaCounter--;
        if (addMediaCounter === 0) {
        fileDropZone.classList.remove('highlight');
        }
    });

    // Handle file drop event
    fileDropZone.addEventListener('drop', function (e) {
        addMediaCounter = 0;
        fileDropZone.classList.remove('highlight');
        loadFiles(e.dataTransfer.files);
    });
}
// Function to access media files by name
function getMediaByName(name) {
    return mediaFiles.find((mediaItem) => mediaItem.name === name);
}
// Function to access media files by name
function refreshMediaList() {
    const selectMediaList = document.getElementById("selectMediaList");
    selectMediaList.innerHTML = "";
    mediaFiles.forEach((mediaItem, index) => {
        const listItem = document.createElement("li");
        listItem.className =
            "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            ${mediaItem.name}
            <button type="button" class="btn btn-primary btn-sm send-media-button" data-index="${index}">Send</button>
        `;
        selectMediaList.appendChild(listItem);
    });
    const sendButtons = document.querySelectorAll(".send-media-button");
    sendButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const indexToSend = parseInt(button.getAttribute("data-index"));
            sendMedia(mediaFiles[indexToSend].name);
        });
    });
}

function showImage(fileObj, imageEl) {
    var fr = new FileReader();
    // when image is loaded, set the src of the image where you want to display it
    fr.onload = function (e) {
        imageEl.src = this.result;
    };
    fr.readAsDataURL(fileObj);
}

async function handleVideoThumbnail(file){
    try{
        const thumbnail =  await generateVideoThumbnail(file);
        console.log(thumbnail)
        mediaFileVideoThumbnailList[file.name] = thumbnail;
    }
    catch(err){
        console.log(err);
    }
  }