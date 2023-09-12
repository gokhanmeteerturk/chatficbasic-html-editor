const mediaFiles = [];
const mediaFileSrcList = {};
let addMediaModal = null;
function showAddMedia(){
    addMediaModal.show();
}
function showImportCodeModal(){
    importCodeModal.show();
}
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the mediaFiles array to store media items
    addMediaModal = new bootstrap.Modal(document.getElementById("addMediaModal"));

    // Function to update the media library in the modal
    function updateMediaLibrary() {
        const mediaList = document.querySelector("#mediaList");

        // Clear the existing list
        mediaList.innerHTML = "";

        // Iterate over the mediaFiles array and add items to the list
        mediaFiles.forEach((mediaItem, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
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

    // Handle media upload form submission
    document.getElementById("mediaForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const fileInput = document.getElementById("mediaFile");
        const file = fileInput.files[0];
        console.log("1");
        if (file) {
            // Add the file to the mediaFiles array
            mediaFiles.push(file);
            if(file.name.toLowerCase().endsWith('.mp4') == false && file.name.toLowerCase().endsWith('.webm') == false){
                var fr=new FileReader();
                fr.onload = function(e) { mediaFileSrcList[file.name] = this.result; };
                fr.readAsDataURL(file);
            }

            updateMediaLibrary();
        }
        fileInput.value=null;
        addMediaModal.hide();
    });

    // Update the media library initially (empty)
    updateMediaLibrary();
});
// Function to access media files by name
function getMediaByName(name) {
    return mediaFiles.find((mediaItem) => mediaItem.name === name);
}
// Function to access media files by name
function refreshMediaList() {
    const selectMediaList = document.getElementById("selectMediaList");
    selectMediaList.innerHTML='';
    mediaFiles.forEach((mediaItem, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
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

function showImage(fileObj,imageEl) {
    var fr=new FileReader();
    // when image is loaded, set the src of the image where you want to display it
    fr.onload = function(e) { imageEl.src = this.result; };
    fr.readAsDataURL(fileObj);
  }