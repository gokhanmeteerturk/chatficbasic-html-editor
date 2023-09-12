let viewCodeModal = null;
let importCodeModal = null;
function showViewCodeModal(type = "md") {
    if (!storyInfoComplete) {
        alert("Complete story info first.");
        return;
    }
    viewCodeModal.show();
    let element = document.getElementById("viewCodeModalTextarea");
    let cfbasic = "";
    if (type == "md") {
        cfbasic = generateChatficBasic(generateChatficBasicJson());
        document.getElementById("showCodeModalLabelFormat").innerHTML = "";
    } else {
        cfbasic = generateChatficBasicJson();
        document.getElementById("showCodeModalLabelFormat").innerHTML = " JSON(v1)";
    }
    element.value = cfbasic;
    element.style.height = "1px";
    setTimeout(() => {
        element.style.height = 25 + element.scrollHeight + "px";
    }, 300);
}
function importChatficJson() {
    const importCodeModalTextarea = document.getElementById(
        "importCodeModalTextarea"
    );
    if (importCodeModalTextarea.className.indexOf("is-invalid") !== -1) {
        alert("Not a valid JSON!");
        return;
    }
    const importCode = importCodeModalTextarea.value;
    const oldPages = pages;
    const oldChatfic = chatfic;
    try {
        let chatficFromJson = JSON.parse(importCode);
        pages = JSON.parse(JSON.stringify(chatficFromJson.pages));

        delete chatficFromJson.format;
        delete chatficFromJson.pages;
        chatfic = chatficFromJson;
        importCodeModal.hide();
        checkChatfic();
        refreshChat();
        refreshCharacters();
        refreshPageOptionsList();
        updatePageSelect();
    } catch (error) {
        pages = oldPages;
        chatfic = oldChatfic;
        checkChatfic();
        refreshChat();
        refreshCharacters();
        refreshPageOptionsList();
        updatePageSelect();
        alert("Error during import! Check your file!");
        console.log(error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the mediaFiles array to store media items
    viewCodeModal = new bootstrap.Modal(document.getElementById("viewCodeModal"));
    importCodeModal = new bootstrap.Modal(
        document.getElementById("importCodeModal")
    );
});

function deactivateSaveToBrowser() {
    const sbb = document.getElementById("saveToBrowserButton");
    sbb.classList.add("btn-secondary");
    sbb.classList.remove("btn-warning");
    sbb.setAttribute("disabled", "disabled");
}
function saveLocally() {
    if (!storyInfoComplete) {
        alert("Complete story info first.");
        return;
    }
    localStorage.setItem("chatfic", JSON.stringify(chatfic));
    localStorage.setItem("pages", JSON.stringify(pages));
    deactivateSaveToBrowser();
    const alertSave = document.getElementById("alertSave");
    alertSave.classList.remove("d-none");
    setTimeout(() => {
        alertSave.classList.add("d-none");
    }, 2000);
}
function loadFromLocal() {
    if (confirm("Load the story back from last time?") == false) {
        return;
    }
    if (localStorage.getItem("chatfic") && localStorage.getItem("pages")) {
        chatfic = JSON.parse(localStorage.getItem("chatfic"));
        pages = JSON.parse(localStorage.getItem("pages"));
    } else {
        alert("No story found in local storage!");
    }
    checkChatfic();
    refreshChat();
    refreshCharacters();
    refreshPageOptionsList();
    updatePageSelect();
}

function saveZip() {
    if (!storyInfoComplete) {
        alert("Complete story info first.");
        return;
    }
    const mediaFilesList = [];
    pages.forEach((page) => {
        page.messages.forEach((singleMessage) => {
            if (singleMessage.multimedia) {
                const mediaFile = getMediaByName(singleMessage.multimedia);
                if (!mediaFile) {
                    alert("Media File Not In Library: " + singleMessage.multimedia);
                    return false;
                } else {
                    mediaFilesList.push(mediaFile);
                }
            }
        });
    });

    const chatficBasicJson = generateChatficBasicJson();
    var zip = new JSZip();
    zip.file("storybasic.json", chatficBasicJson);
    zip.file("storybasic.md", generateChatficBasic(chatficBasicJson));
    var media = zip.folder("media");
    mediaFilesList.forEach((mediaFile) => {
        media.file(mediaFile.name, mediaFile, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "example.zip");
    });
}

function generateChatficBasicJson() {
    //create deep copy first:
    const chatficForJson = JSON.parse(JSON.stringify(chatfic));
    chatficForJson.format = "chatficbasicjson";
    chatficForJson.pages = pages;
    return JSON.stringify(chatficForJson, null, 2);
}

function generateChatficBasic(chatficBasicJson) {
    const fic = JSON.parse(chatficBasicJson);
    let chatficbasic = "";
    chatficbasic += `> format: chatficbasic
> version: 1
> title: ${fic.title}
> description: ${fic.description}
> author: ${fic.author}
> patreonusername: ${fic.patreonusername}
> modified: ${fic.modified}
> episode: ${fic.episode}
> description: ${fic.description}
`;
    for (let key in fic.characters) {
        const character = fic.characters[key];
        chatficbasic += "> characters/" + key + "/name : " + character.name + "\n";
        if (
            character.hasOwnProperty("color") &&
            character.color &&
            character.color.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/color : " + character.color + "\n";
        }
        if (
            character.hasOwnProperty("avatar") &&
            character.avatar &&
            character.avatar.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/avatar : " + character.avatar + "\n";
        }
    }

    fic.pages.forEach((page) => {
        chatficbasic += "\n";
        chatficbasic += "# " + page.name + "\n";

        let latestChatroom = "";
        page.messages.forEach((message) => {
            const povText =
                message.from != "player" && message.side == 2 ? "(pov)" : "";
            const chatroomText =
                message.chatroom != latestChatroom &&
                    message.chatroom != fic.characters[message.from].name
                    ? "(" + message.chatroom + ")"
                    : "";
            const imageText =
                message.multimedia &&
                    !message.multimedia.toLowerCase().endsWith(".mp4") &&
                    !message.multimedia.toLowerCase().endsWith(".webm")
                    ? " ![IMAGE](" + message.multimedia + ")"
                    : "";
            const videoText =
                message.multimedia &&
                    (message.multimedia.toLowerCase().endsWith(".mp4") ||
                        message.multimedia.toLowerCase().endsWith(".webm"))
                    ? " ![VIDEO](" + message.multimedia + ")"
                    : "";
            chatficbasic += `${message.from
                }${chatroomText}${povText}: ${imageText}${videoText}${message.message ? " " + message.message.replace("\n", " ") : ""
                }\n`;

            latestChatroom = message.chatroom;
        });
        chatficbasic += "\n";
        page.options.forEach((pageOption) => {
            const toName = fic.pages.find((x) => x.id == pageOption.to).name;
            let toMessage = "next";
            if (pageOption.hasOwnProperty("message")) {
                toMessage = pageOption.message;
            }
            chatficbasic += `[${toMessage}](#${toName})\n`;
        });
    });
    return chatficbasic;
}
