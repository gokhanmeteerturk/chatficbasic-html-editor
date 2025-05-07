let viewCodeModal = null;
let importCodeModal = null;
let importMarkdownModal = null;
let whatisanappModal = null;

function showImportCodeModal() {
    importCodeModal.show();
}
function showImportMarkdownModal() {
    importMarkdownModal.show();
}
function showWhatisanappModal() {
    whatisanappModal.show();
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
        if(chatficFromJson.hasOwnProperty("variables") && Object.keys(chatficFromJson.variables).length > 0){
            storyVariablesToInclude = JSON.parse(JSON.stringify(chatficFromJson["variables"]));
            chatficFromJson["variables"] = {};
        }
        else{
            chatficFromJson["variables"] = {};
            storyVariablesToInclude = defaultStoryVariablesToInclude;
        }
        if(chatficFromJson.hasOwnProperty("apps")){
            let hasChatApp = false;
            let hasPhotoFeedApp = false;
            for (let key in chatficFromJson.apps){
                if(key == "home"){delete chatficFromJson.apps["home"];}
                if(key == "chat"){hasChatApp = true;}
                if(key == "photofeed"){hasPhotoFeedApp = true;}
            }
            if(!hasChatApp){
                chatficFromJson.apps["chat"] = {"name": "Messages"};
            }
            if(!hasPhotoFeedApp){
                chatficFromJson.apps["photofeed"] = {"name": "InstaPic"};
            }
            chatficFromJson.apps["home"] = {"name": "Home"};
        }
        else{
            chatficFromJson.apps = defaultApps;
        }
        pages = JSON.parse(JSON.stringify(chatficFromJson.pages));
        delete chatficFromJson.format;
        delete chatficFromJson.pages;
        chatfic = chatficFromJson;
        importMarkdownModal.hide();
        checkChatfic();
        refreshChat();
        updateAppSelector();
        refreshCharacters();
        refreshPageOptionsList();
        updatePageSelect();
    } catch (error) {
        pages = oldPages;
        chatfic = oldChatfic;
        checkChatfic();
        refreshChat();
        updateAppSelector();
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
        chatficFromJson.version = "1.1";
        if(chatficFromJson.hasOwnProperty("variables") && Object.keys(chatficFromJson.variables).length > 0){
            storyVariablesToInclude = JSON.parse(JSON.stringify(chatficFromJson["variables"]));
            chatficFromJson["variables"] = {};
        }
        else{
            chatficFromJson["variables"] = {};
            storyVariablesToInclude = defaultStoryVariablesToInclude;
        }

        if(chatficFromJson.hasOwnProperty("apps")){
            let hasChatApp = false;
            let hasPhotoFeedApp = false;
            for (let key in chatficFromJson.apps){
                if(key == "home"){delete chatficFromJson.apps["home"];}
                if(key == "chat"){hasChatApp = true;}
                if(key == "photofeed"){hasPhotoFeedApp = true;}
            }
            if(!hasChatApp){
                chatficFromJson.apps["chat"] = {"name": "Messages"};
            }
            if(!hasPhotoFeedApp){
                chatficFromJson.apps["photofeed"] = {"name": "InstaPic"};
            }
            chatficFromJson.apps["home"] = {"name": "Home"};
        }
        else{
            chatficFromJson.apps = defaultApps;
        }

        pages = JSON.parse(JSON.stringify(chatficFromJson.pages));

        delete chatficFromJson.format;
        delete chatficFromJson.pages;
        chatfic = chatficFromJson;
        let anyMissingMedia = false;
        try{
            // check each pages's .messages array if there is a message with a multimedia, if there is, remove "media/" from beginning of it:
            pages.forEach((page) => {
                page.messages.forEach((singleMessage) => {
                    if (!singleMessage.hasOwnProperty("chatroom")){singleMessage.chatroom = "-";}
                    if (singleMessage.hasOwnProperty("app") && singleMessage.app == "photofeed"){singleMessage.side = "1";}
                    if (singleMessage.multimedia && singleMessage.multimedia.length > 6) {
                        singleMessage.multimedia = singleMessage.multimedia.replace("media/", "");
                        if (!mediaFileSrcList.hasOwnProperty(singleMessage.multimedia)) {
                            anyMissingMedia = true;
                        }
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
        updateAppSelector();
        refreshCharacters();
        refreshPageOptionsList();
        updatePageSelect();
        if (anyMissingMedia) {
            alertMissingMedia();
        }
        fixLeftCharacterAfterLoad();
    } catch (error) {
        pages = oldPages;
        chatfic = oldChatfic;
        checkChatfic();
        refreshChat();
        updateAppSelector();
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
    whatisanappModal = new bootstrap.Modal(
        document.getElementById("whatisanappModal")
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
    localStorage.setItem("storyVariablesToInclude", JSON.stringify(storyVariablesToInclude));
    deactivateSaveToBrowser();
    const alertSave = document.getElementById("alertSave");
    alertSave.classList.remove("d-none");
    setTimeout(() => {
        alertSave.classList.add("d-none");
    }, 2000);
}
function loadFromLocal() {
    loadFromLocalCustom(true);
}
function loadFromLocalNoPages() {
    loadFromLocalCustom(false);
}

function loadFromLocalCustom(loadPages=false) {
    if (confirm("Load the story back from last time?") == false) {
        return;
    }
    if (localStorage.getItem("chatfic") && localStorage.getItem("pages")) {
        chatfic = JSON.parse(localStorage.getItem("chatfic"));
        chatfic.version = "1.1";
        if(!chatfic.hasOwnProperty("apps")){
            chatfic.apps = defaultApps;
        }
        if(loadPages){
            pages = JSON.parse(localStorage.getItem("pages"));
        }
        else{
            pages = [
                        {
                            id: 1,
                            name: "initial",
                            messages: [],
                            options: [],
                        },
                    ];
        }
        updateMetaUI(chatfic);
        try{
            storyVariablesToInclude = JSON.parse(localStorage.getItem("storyVariablesToInclude"));
        }
        catch(err){
            storyVariablesToInclude = defaultStoryVariablesToInclude;
        }

        let anyMissingMedia = false;
            try{
                // check each pages's .messages array if there is a message with a multimedia, if there is, remove "media/" from beginning of it:
                pages.forEach((page) => {
                    page.messages.forEach((singleMessage) => {
                        if (!mediaFileSrcList.hasOwnProperty(singleMessage.multimedia)) {
                            anyMissingMedia = true;
                        }
                    });
                });
            }
            catch(err){

            }
        if (anyMissingMedia) {
            alertMissingMedia();
        }

    } else {
        alert("No story found in local storage!");
    }
    checkChatfic();
    updateAppSelector();
    refreshChat();
    updateAppSelector();
    refreshCharacters();
    refreshPageOptionsList();
    updatePageSelect();
    updateVariablesUI();
    fixLeftCharacterAfterLoad();
}
function saveZip() {
    if (!storyInfoComplete) {
        alert("Complete story info first.");
        return;
    }
    const mediaFilesList = [];
    Object.values(chatfic.apps).forEach((app) => {
        if (app.hasOwnProperty("background") && app.background != null && app.background.length > 1) {
            const mediaFile = getMediaByName(app.background.replace("media/",""));
            if (!mediaFile) {
                alert("Background Media File Not In Library: " + app.background);
                return false;
            } else {
                mediaFilesList.push(mediaFile);
            }
        }
    });
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

    const chatficBasicJson = generateChatficBasicJson(true);

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

function generateChatficBasicJson(filterUnusedVariables = false) {
    //create deep copy first:
    const chatficForJson = JSON.parse(JSON.stringify(chatfic));
    chatficForJson.format = "chatficbasicjson";
    chatficForJson.version = "1.1";
    chatficForJson.pages = pages;
    let isPhotofeedUsed = false;
    chatficForJson.pages.forEach((page) => {
        page.messages.forEach((message) => {
            // if(message.hasOwnProperty("app") && message.app !== "chat" && message.hasOwnProperty("chatroom")){delete message["chatroom"];}
            if(message.hasOwnProperty("isCleaned")){delete message["isCleaned"];}
            if(message.hasOwnProperty("app") && message.app === "photofeed"){isPhotofeedUsed = true;}
            if(message.hasOwnProperty("app") && message.app === "chat"){delete message["app"];}
            if(message.multimedia && message.multimedia.length>1){
                message.multimedia = "media/" + message.multimedia.replaceAll("media/","");
            }
        });
    });

    if(chatficForJson.apps.hasOwnProperty("home")){
        delete chatficForJson.apps["home"];
    }
    if(chatficForJson.apps.hasOwnProperty("photofeed") && !isPhotofeedUsed){
        delete chatficForJson.apps["photofeed"];
    }
    Object.values(chatficForJson.apps).forEach((app) => {
        if(app.hasOwnProperty("background") && app.background != null && app.background.length > 1){
            app.background = "media/" + app.background.replaceAll("media/","");
        }
    });
    let tempVariables = {...storyVariablesToInclude};
    if(filterUnusedVariables){
        try{
            let keysToKeep = [];
            const detectRegex = getExistingVariablesCheckerRegex();
            const allMessagesString = chatficForJson.pages.map((page) => page.messages.map((message) => message.hasOwnProperty("message") && message.message ? message.message : "").join(" ")).join(" ");

            let m;
            while ((m = detectRegex.exec(allMessagesString)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === detectRegex.lastIndex) {
                    detectRegex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                    if(groupIndex === 1 && tempVariables.hasOwnProperty(match.slice(1))){
                        keysToKeep.push(match.slice(1));
                    }
                });
            }

            for(let key in tempVariables){
                if(!keysToKeep.includes(key)){
                    delete tempVariables[key];
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }

    chatficForJson.variables = tempVariables;
    return JSON.stringify(chatficForJson, null, 2);
}

function generateChatficBasic(chatficBasicJson) {
    const fic = JSON.parse(chatficBasicJson);
    let chatficbasic = "";
    chatficbasic += `> format: chatficbasic
> version: 1.1
> title: ${fic.title}
> description: ${fic.description}
> author: ${fic.author}
> modified: ${fic.modified}
> episode: ${fic.episode}
`;
    for (let key in fic.handles){
        const handle = fic.handles[key];
        chatficbasic += "> handles/" + key + ": " + handle + "\n";
    }
    chatficbasic += "\n";
    for (let key in fic.apps){
        const app = fic.apps[key];
        if(app.hasOwnProperty("name") && app.name != null && app.name.length > 1){
            chatficbasic += "> apps/" + key + "/name: " + app.name + "\n";
        }
        if(app.hasOwnProperty("background") && app.background != null && app.background.length > 1){
            chatficbasic += "> apps/" + key + "/background: " + app.background.replaceAll("media/","") + "\n";
        }
    }
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
            character.hasOwnProperty("gender") &&
            character.gender &&
            character.gender.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/gender : " + character.gender + "\n";
        }
        if (
            character.hasOwnProperty("skin") &&
            character.skin &&
            character.skin.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/skin : " + character.skin + "\n";
        }
        if (
            character.hasOwnProperty("eyes") &&
            character.eyes &&
            character.eyes.hasOwnProperty("color") &&
            character.eyes.color &&
            character.eyes.color.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/eyes/color : " + character.eyes.color + "\n";
        }
        if (
            character.hasOwnProperty("hair") &&
            character.hair &&
            character.hair.hasOwnProperty("color") &&
            character.hair.color &&
            character.hair.color.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/hair/color : " + character.hair.color + "\n";
        }
        if (
            character.hasOwnProperty("hair") &&
            character.hair &&
            character.hair.hasOwnProperty("style") &&
            character.hair.style &&
            character.hair.style.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/hair/style : " + character.hair.style + "\n";
        }
        if (
            character.hasOwnProperty("dress") &&
            character.dress &&
            character.dress.hasOwnProperty("size") &&
            character.dress.size &&
            character.dress.size.length > 1
        ) {
            chatficbasic +=
                "> characters/" + key + "/dress/size : " + character.dress.size + "\n";
        }
    }

    fic.pages.forEach((page) => {
        chatficbasic += "\n";
        chatficbasic += "# " + page.name + "\n";

        let latestChatroom = "";
        let latestApp = "chat";
        page.messages.forEach((message) => {
            if (message.hasOwnProperty("app")) {
                if(message.app != latestApp){
                    chatficbasic += "*app: " + message.app + "\n";
                    latestApp = message.app;
                }
            }
            if(message.hasOwnProperty("isCleaned")){delete message["isCleaned"];}
            const povText =
                message.from != "player" && message.side == 2 ? "(pov)" : "";
            const chatroomText = (message.hasOwnProperty("app") && message.app != "chat" && message.app != null) ? "" : message.chatroom != latestChatroom &&
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
            if(message.hasOwnProperty("type") && message.type === "thought"){
                chatficbasic += "_" + `${message.from
                }${chatroomText}${povText}: ${imageText}${videoText}${message.message ? " " + message.message.replace("\n", " ") : ""
                }` + "_\n";
            }
            else{
                chatficbasic += `${message.from
                    }${chatroomText}${povText}: ${imageText}${videoText}${message.message ? " " + message.message.replace("\n", " ") : ""
                    }\n`;
            }

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

function trimTrailingSlash(str){
  return str.replace(/^\/*$/g, '');
}
function convertChatficFromMdToJSON(chatficbasicCode) {
    chatficConversionResult = {
        format: "chatficbasicjson",
    };
    chatficToAdd = {
        pages: [],
        handles: {},
        characters: {},
        variables: {},
        apps: {
            "chat": {"name": "Messages"},
            "photofeed": {"name": "InstaPic"},
            "home": {"name": "Home"}
        },
    };
    const metadataKeys = [
        "title",
        "description",
        "author",
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
             if (trimmedLine.startsWith("> patreonusername:")){
                 let myValue = trimTrailingSlash(trimmedLine.slice(18).trim()).split("/");
                 myValue = myValue[myValue.length-1];
                 chatficToAdd.handles["patreon"] = myValue;
                 console.log("handles");
                 console.log(chatficToAdd.handles);
             }
             if (trimmedLine.startsWith("> handles/")) {
                const parts = trimmedLine
                    .slice(10)
                    .replace(" : ", ":")
                    .replace(" :", ":")
                    .replace(": ", ":")
                    .replace(":", "/")
                    .split("/");
                if (parts.length === 2) {
                    const handleType = parts[0].trim();
                    const handleValue = parts[1].trim();

                    chatficToAdd.handles[handleType] = handleValue;
                }
            }
            if (trimmedLine.startsWith("> apps/")) {
                const parts = trimmedLine
                    .slice(7)
                    .replace(" : ", ":")
                    .replace(" :", ":")
                    .replace(": ", ":")
                    .replace(":", "/")
                    .split("/");
                if (parts.length >= 3) {
                    const app_key = parts[0].trim();
                    const attribute = parts[1].trim();
                    const value = parts[2].trim();
                    if (!chatficToAdd.apps.hasOwnProperty(app_key)) {
                        chatficToAdd.apps[app_key] = {};
                    }
                    chatficToAdd.apps[app_key][attribute] = value;
                }
            }
            if (trimmedLine.startsWith("> variables/")) {
                const parts = trimmedLine
                    .slice(12)
                    .replace(" : ", ":")
                    .replace(" :", ":")
                    .replace(": ", ":")
                    .replace(":", "/")
                    .split("/");
                if (parts.length >= 3) {
                    const variable = parts[0].trim();
                    const attribute = parts[1].trim();
                    const value = parts[2].trim();
                    if (!chatficToAdd.variables.hasOwnProperty(variable)) {
                        chatficToAdd.variables[variable] = {};
                    }
                    chatficToAdd.variables[variable][attribute] = value;
                }
            }
            if (trimmedLine.startsWith("> characters/")) {
                const parts = trimmedLine
                    .slice(13)
                    .replace(" : ", ":")
                    .replace(" :", ":")
                    .replace(": ", ":")
                    .replace(":", "/")
                    .split("/");

                        console.log("parts");
                        console.log(parts);
                const partsCount = parts.length;
                if (partsCount >= 3) {
                    const character = parts[0].trim();
                    const attribute = parts[1].trim();

                    if (partsCount >= 4 && attribute === "model") {
                        const modelAttribute = parts[2].trim();
                        if (!chatficToAdd.characters[character].hasOwnProperty("model")) {
                            chatficToAdd.characters[character]["model"] = {};
                        }
                        if (partsCount === 4 && modelAttribute !== "handles") {
                            const value = parts[3].trim();
                            chatficToAdd.characters[character].model[modelAttribute] = value;
                        } else if (partsCount === 5 && modelAttribute === "handles") {
                            const handleAttribute = parts[3].trim();
                            const value = parts[4].trim();

                            if (!chatficToAdd.characters[character].model.hasOwnProperty("handles")) {
                                chatficToAdd.characters[character].model["handles"] = {};
                            }

                            chatficToAdd.characters[character].model["handles"][handleAttribute] = value;
                        }
                    }
                    else if(partsCount >= 4) {
                        const innerKey = parts[2].trim();
                        const innerValue = parts[3].trim();
                        if (!chatficToAdd.characters.hasOwnProperty(character)) {
                            chatficToAdd.characters[character] = {};
                        }
                        if (!chatficToAdd.characters[character].hasOwnProperty(attribute)) {
                            chatficToAdd.characters[character][attribute] = {};
                        }
                        chatficToAdd.characters[character][attribute][innerKey] = innerValue;
                    }
                    else {
                        const value = parts[2].trim();
                        if (!chatficToAdd.characters.hasOwnProperty(character)) {
                            chatficToAdd.characters[character] = {};
                        }
                        chatficToAdd.characters[character][attribute] = value;
                    }
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

    chatficConversionResult.handles = chatficToAdd.handles;
    chatficConversionResult.version = "1.1";
    chatficConversionResult.variables = chatficToAdd.variables;
    chatficConversionResult.apps = chatficToAdd.apps;
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
    let currentApp = "chat";
    for (const lineUntrimmed of pageLines) {
        const line = lineUntrimmed.trim();
        let isThought = false;
        if (line.startsWith("_") && line.endsWith("_")) {
            isThought = true;
            line = line.slice(1, -1).trim();
        }
        if (line.startsWith("//")) {
            continue;
        } else if(line.startsWith("*app:")){
            currentApp = line.slice(5).trim();
            if(currentApp.length < 1){
                currentApp = "chat";
            }
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
                result.app = currentApp;
                result.multimedia = multimedia;
                result.chatroom = matchWithChatroomAndPov[2];
                if(currentApp !== "chat"){result.chatroom = "-"}
                if(currentApp === "photofeed"){result.side = 1}
                if(isThought){result.type = "thought"}
                page.messages.push(result);
                continue;
            }
            const matchWithPov = line.match(textWithPov);
            if (matchWithPov) {
                result.from = matchWithPov[1];
                result.side = 2;
                const [message, multimedia] = extractMultimedia(matchWithPov[2]);
                result.message = message;
                result.app = currentApp;
                result.multimedia = multimedia;
                if (previousChatroom) {
                    result.chatroom = previousChatroom;
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                } else if (
                    result.from !== "player" &&
                    chatficToAdd.characters[result.from]
                ) {
                    previousChatroom = chatficToAdd.characters[result.from].name;
                    result.chatroom = previousChatroom;
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                } else {
                    result.chatroom = "Unknown";
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                }
                if(isThought){result.type = "thought"}
                page.messages.push(result);
                continue;
            }
            const matchWithChatroom = line.match(textWithChatroom);
            if (matchWithChatroom) {
                result.from = matchWithChatroom[1];
                const [message, multimedia] = extractMultimedia(matchWithChatroom[3]);
                result.message = message;
                result.app = currentApp;
                result.multimedia = multimedia;
                result.side =
                    result.from === "player" ? 2 : result.from === "app" ? 1 : 0;
                previousChatroom = matchWithChatroom[2];
                result.chatroom = previousChatroom;
                if(currentApp !== "chat"){result.chatroom = "-"}
                if(currentApp === "photofeed"){result.side = 1}
                if(isThought){result.type = "thought"}
                page.messages.push(result);
                continue;
            }
            const matchWithNothing = line.match(textWithNothing);
            if (matchWithNothing) {
                result.from = matchWithNothing[1];
                const [message, multimedia] = extractMultimedia(matchWithNothing[2]);
                result.message = message;
                result.app = currentApp;
                result.multimedia = multimedia;
                result.side =
                    result.from === "player" ? 2 : result.from === "app" ? 1 : 0;
                if (previousChatroom) {
                    result.chatroom = previousChatroom;
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                } else if (
                    result.from !== "player" &&
                    chatficToAdd.characters[result.from]
                ) {
                    previousChatroom = chatficToAdd.characters[result.from].name;
                    result.chatroom = previousChatroom;
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                } else {
                    result.chatroom = "Unknown";
                    if(currentApp !== "chat"){result.chatroom = "-"}
                    if(currentApp === "photofeed"){result.side = 1}
                }
                if(isThought){result.type = "thought"}
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

