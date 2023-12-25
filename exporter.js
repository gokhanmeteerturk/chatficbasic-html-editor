let viewCodeModal = null;
let importCodeModal = null;
let importMarkdownModal = null;

function showImportCodeModal() {
    importCodeModal.show();
}
function showImportMarkdownModal() {
    importMarkdownModal.show();
}
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
function importChatficMarkdown(){
    const importMarkdownModalTextarea = document.getElementById(
        "importMarkdownModalTextarea"
    );
    const oldPages = pages;
    const oldChatfic = chatfic;
    const basic = importMarkdownModalTextarea.value;
    if(basic.length < 100){
        return;
    }
    try {
        const importCode = convertChatficFromMdToJSON(basic);
        let chatficFromJson = importCode;
        pages = JSON.parse(JSON.stringify(chatficFromJson.pages));
        delete chatficFromJson.format;
        delete chatficFromJson.pages;
        chatfic = chatficFromJson;
        importMarkdownModal.hide();
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
        try{
            // check each pages's .messages array if there is a message with a multimedia, if there is, remove "media/" from beginning of it:
            pages.forEach((page) => {
                page.messages.forEach((singleMessage) => {
                    if (singleMessage.multimedia && singleMessage.multimedia.length > 6) {
                        singleMessage.multimedia = singleMessage.multimedia.replace("media/", "");
                    }
                }
                );
            });
        }
        catch(err){

        }
        importCodeModal.hide();
        checkChatfic();
        updateMetaUI(chatfic);
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
    importMarkdownModal = new bootstrap.Modal(
        document.getElementById("importMarkdownModal")
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
                const mediaFile = getMediaByName(singleMessage.multimedia.replace("media/",""));
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
        try{
            if(chatfic.title.length < 2){
                throw new Error("NO TITLE!");
            }
            const filename = chatfic.title.replace(/[^a-z0-9 ]/gi, '_').replace(/_{2,}/g, '_');
            saveAs(content, filename + ".zip");
        }
        catch (e){
            saveAs(content, "example.zip");
        }
    });
}

function generateChatficBasicJson() {
    //create deep copy first:
    const chatficForJson = JSON.parse(JSON.stringify(chatfic));
    chatficForJson.format = "chatficbasicjson";
    chatficForJson.pages = pages;

    chatficForJson.pages.forEach((page) => {
        page.messages.forEach((message) => {
            if(message.multimedia && message.multimedia.length>1){
                message.multimedia = "media/" + message.multimedia.replaceAll("media/","");
            }
        });
    });
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

var chatficConversionResult = {
    format: "chatficbasicjson",
};

var chatficToAdd = {
    pages: [],
    characters: {},
};

function convertChatficFromMdToJSON(chatficbasicCode) {
    chatficConversionResult = {
        format: "chatficbasicjson",
    };
    chatficToAdd = {
        pages: [],
        characters: {},
    };
    const metadataKeys = [
        "title",
        "description",
        "author",
        "patreonusername",
        "modified",
        "episode",
    ];
    let currentPageId = 0;
    let currentPageName = null;
    let currentLines = [];

    const lines = chatficbasicCode.split("\n");

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            continue;
        }
        if (trimmedLine.startsWith("> ")) {
            if (trimmedLine.startsWith("> characters/")) {
                const parts = trimmedLine
                    .slice(13)
                    .replace(" : ", "/")
                    .replace(" :", "/")
                    .replace(": ", "/")
                    .split("/");
                if (parts.length >= 3) {
                    const character = parts[0];
                    const attribute = parts[1];
                    const value = parts[2];
                    if (!chatficToAdd.characters[character]) {
                        chatficToAdd.characters[character] = {};
                    }
                    chatficToAdd.characters[character][attribute] = value;
                }
            }
            for (const metadataKey of metadataKeys) {
                if (trimmedLine.startsWith(`> ${metadataKey}: `)) {
                    const value = trimmedLine.slice(`> ${metadataKey}: `.length);
                    if (metadataKey in chatficConversionResult) {
                        break;
                    }
                    chatficConversionResult[metadataKey] = value;
                    break;
                }
            }
        } else if (trimmedLine.startsWith("#")) {
            if (currentPageName) {
                chatficToAdd.pages.push(
                    parsePage(currentPageId, currentPageName, currentLines)
                );
            }
            currentPageId++;
            currentPageName = trimmedLine.slice(1).trim();
            currentLines = [];
        } else {
            currentLines.push(trimmedLine);
        }
    }

    if (currentPageName) {
        chatficToAdd.pages.push(
            parsePage(currentPageId, currentPageName, currentLines)
        );
    }

    for (const page of chatficToAdd.pages) {
        for (const option of page.options) {
            const pageFound = chatficToAdd.pages.find((p) => p.name === option.to);
            option.to = pageFound ? pageFound.id : page.id;
        }
    }

    chatficConversionResult.characters = chatficToAdd.characters;
    chatficConversionResult.pages = chatficToAdd.pages;

    return chatficConversionResult;
}

function extractMultimedia(text) {
    let multimedia = null;
    let message = text;
    const multimediaRegex = /!\[(?:IMAGE|VIDEO)\]\(([^\)]*)\)/;
    const matchMultimedia = text.match(multimediaRegex);
    if (matchMultimedia) {
        multimedia = matchMultimedia[1];
        message = text.replace(matchMultimedia[0], "");
    }
    return [message.trim(), multimedia];
}

function parsePage(pageId, pageName, pageLines) {
    const page = {
        id: pageId,
        name: pageName,
        messages: [],
        options: [],
    };

    const textWithChatroomAndPov = /^\s*([^\[: ]*)\(([^\(:]*)\)\(pov\):( .+)$/;
    const textWithPov = /^\s*([^\[: ]*)\(pov\):( .+)$/;
    const textWithChatroom = /^\s*([^\[: ]*)\(([^\(:]*)\):( .+)$/;
    const textWithNothing = /^\s*([^\[: ]*):( .+)$/;
    const optionSingle = /^\s*\[next\]\(\s*#\s*([^\)]*)\s*\)\s*$/;
    const optionRegular = /^\s*\[([^\]]*)\]\(\s*#\s*([^\)]*)\s*\)\s*$/;
    let previousChatroom = null;

    for (const lineUntrimmed of pageLines) {
        const line = lineUntrimmed.trim();
        if (line.startsWith("//")) {
            continue;
        } else {
            const result = {};
            const matchWithChatroomAndPov = line.match(textWithChatroomAndPov);
            if (matchWithChatroomAndPov) {
                result.from = matchWithChatroomAndPov[1];
                result.side = 2;
                const [message, multimedia] = extractMultimedia(
                    matchWithChatroomAndPov[3]
                );
                result.message = message;
                result.multimedia = multimedia;
                result.chatroom = matchWithChatroomAndPov[2];
                page.messages.push(result);
                continue;
            }
            const matchWithPov = line.match(textWithPov);
            if (matchWithPov) {
                result.from = matchWithPov[1];
                result.side = 2;
                const [message, multimedia] = extractMultimedia(matchWithPov[2]);
                result.message = message;
                result.multimedia = multimedia;
                if (previousChatroom) {
                    result.chatroom = previousChatroom;
                } else if (
                    result.from !== "player" &&
                    chatficToAdd.characters[result.from]
                ) {
                    previousChatroom = chatficToAdd.characters[result.from].name;
                    result.chatroom = previousChatroom;
                } else {
                    result.chatroom = "Unknown";
                }
                page.messages.push(result);
                continue;
            }
            const matchWithChatroom = line.match(textWithChatroom);
            if (matchWithChatroom) {
                result.from = matchWithChatroom[1];
                const [message, multimedia] = extractMultimedia(matchWithChatroom[3]);
                result.message = message;
                result.multimedia = multimedia;
                result.side =
                    result.from === "player" ? 2 : result.from === "app" ? 1 : 0;
                previousChatroom = matchWithChatroom[2];
                result.chatroom = previousChatroom;
                page.messages.push(result);
                continue;
            }
            const matchWithNothing = line.match(textWithNothing);
            if (matchWithNothing) {
                result.from = matchWithNothing[1];
                const [message, multimedia] = extractMultimedia(matchWithNothing[2]);
                result.message = message;
                result.multimedia = multimedia;
                result.side =
                    result.from === "player" ? 2 : result.from === "app" ? 1 : 0;
                if (previousChatroom) {
                    result.chatroom = previousChatroom;
                } else if (
                    result.from !== "player" &&
                    chatficToAdd.characters[result.from]
                ) {
                    previousChatroom = chatficToAdd.characters[result.from].name;
                    result.chatroom = previousChatroom;
                } else {
                    result.chatroom = "Unknown";
                }
                page.messages.push(result);
                continue;
            }
            const matchOptionSingle = line.match(optionSingle);
            if (matchOptionSingle) {
                page.options.push({ to: matchOptionSingle[1] });
                continue;
            }
            const matchOptionRegular = line.match(optionRegular);
            if (matchOptionRegular) {
                page.options.push({
                    to: matchOptionRegular[2],
                    message: matchOptionRegular[1],
                });
                continue;
            }
        }
    }

    return page;
}

