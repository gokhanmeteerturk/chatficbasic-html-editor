function setTooltips() {
    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
}

function setCaretPosition(elem, caretPos) {
    // Mark Pieszak - https://stackoverflow.com/a/12518737
    // Plus a one line change
    var el = elem;

    if (el !== null) {
        el.value = el.value;
        // ^ this is used to not only get "focus", but
        // to make sure we don't have it everything -selected-
        // (it causes an issue in chrome, and having it doesn't hurt any other browser)

        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move('character', caretPos);
            range.select();
            return true;
        }

        else {
            // (el.selectionStart === 0 added for Firefox bug)
            if (el.selectionStart || el.selectionStart === 0) {
                el.focus();
                el.setSelectionRange(caretPos, caretPos);
                return true;
            }

            else  { // fail city, fortunately this never happens (as far as I've tested) :)
                el.focus();
                return false;
            }
        }
    }
}

var defaultTitle = "My Chatfic Story";
var defaultAuthor = "/u/myself";
var defaultHandles = {};
var defaultVariables = {};
var defaultStoryVariablesToInclude = {
    "roommateFemale":{"value":"roommate"},
    "roommateFemaleShort":{"value":"roomie"},
    "roommateMale":{"value":"roommate"},
    "roommateMaleShort":{"value":"roomie"},
    "landlady":{"value":"landlady"},
    "landladyShort":{"value":"landlady"},
    "landladyCute":{"value":"m'lady"},
    "landlord":{"value":"landlord"},
    "landlordShort":{"value":"landlord"},
    "landlordCute":{"value":"m'lord"},
    "tenantFemale":{"value":"tenant"},
    "tenantMale":{"value":"tenant"},
    "familyFriendOldLady":{"value":"mrs"},
};
var defaultDescription =
    "Welcome to My Chatfic Story, a story of love, lust, and several other things.";
var chatfic = {
    //globalidentifier: "a8gd56ar8d",
    //serverslug: "afterdark",
    title: defaultTitle,
    description: defaultDescription,
    author: defaultAuthor,
    handles: defaultHandles,
    variables: defaultVariables,
    modified: 0,
    episode: 1,
    characters: {
        player: {
            name: "John",
        },
        app: {
            name: "app",
        },
        jessica: {
            name: "Jessica",
            color: "black",
        },
    },
};
var storyVariablesToInclude = defaultStoryVariablesToInclude;

var variableSuggestions = {
    "sister":{"slug":"roommateFemale"},
    "sis":{"slug":"roommateFemaleShort"},
    "brother":{"slug":"roommateMale"},
    "bro":{"slug":"roommateMaleShort"},
    "mother":{"slug":"landlady"},
    "mom":{"slug":"landladyShort"},
    "mommy":{"slug":"landladyCute"},
    "father":{"slug":"landlord"},
    "dad":{"slug":"landlordShort"},
    "daddy":{"slug":"landlordCute"},
    "daughter":{"slug":"tenantFemale"},
    "son":{"slug":"tenantMale"},
    "aunt":{"slug":"familyFriendOldLady"},
}
function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
function getExistingVariablesCheckerRegex(){
    return RegExp("(" + Object.keys(storyVariablesToInclude).map(u => "\\\$"+escapeRegex(u)).join('|') + ")\\b", "gm");
}
function getSuggestionCheckerRegex(){
    return RegExp("\\b(" + Object.values(Object.entries(variableSuggestions).filter(([key, obj]) => storyVariablesToInclude.hasOwnProperty(obj.slug))).map(u => escapeRegex(u[0])).join('|') + ")\\b", "gmi");
}
function getExistingVariableSuggestions(){
    return Object.fromEntries(Object.entries(variableSuggestions).filter(([key, obj]) => storyVariablesToInclude.hasOwnProperty(obj.slug)).map(([key, obj]) => [key, { reg: new RegExp("\\b" + escapeRegex(key) + "\\b", "gmi"), slug:obj.slug, value:storyVariablesToInclude[obj.slug].value }]));
}
function getVariableSuggestions(){
    return Object.fromEntries(Object.entries(stuff).map(([key, value]) => [key + "abc", { name: new RegExp("\\b" + wordForRegex + "\\b", "gm") }]));
}
updateVariablesUI();
var storyInfoComplete = false;
var storyInfoMistakes = [];
let pages = [
    {
        id: 1,
        name: "initial",
        messages: [
            {
                message: "Hi John!",
                from: "jessica",
                side: 0,
                multimedia: null,
                chatroom: "Jessica",
            },
            {
                message: "Hi.",
                from: "player",
                side: 2,
                multimedia: null,
                chatroom: "Jessica",
            },
            {
                message:
                    "You can remove these messages\n after hovering over or clicking on them.",
                from: "app",
                side: 1,
                multimedia: null,
                chatroom: "Jessica",
            },
        ],
        options: [],
    },
];
let selectedPageId = 1;

const storyInfoCompleteLabel = document.getElementById("storyInfoComplete");

function setModified() {
    chatfic.modified = new Date().getTime();
    if (document.getElementById("cf-modified")) {
        document.getElementById("cf-modified").innerText = chatfic.modified;
    }
}
function setEpisode(episode) {
    chatfic.episode = episode;
    if (document.getElementById("cf-episode")) {
        document.getElementById("cf-episode").innerText = chatfic.episode;
    }
    checkChatfic();
}

function setTitle(title) {
    chatfic.title = title;
    document.getElementById("cf-title").innerText = chatfic.title;
    checkChatfic();
}
function setDescription(description) {
    chatfic.description = description;
    if (document.getElementById("cf-description")) {
        document.getElementById("cf-description").innerText = chatfic.description;
    }
    checkChatfic();
}
function setAuthor(author) {
    chatfic.author = author;
    if (document.getElementById("cf-author")) {
        document.getElementById("cf-author").innerText = chatfic.author;
    }
    checkChatfic();
}
function trimTrailingSlash(str){
  return str.replace(/^\/*$/g, '');
}

function deleteVariable(key, value) {
    if (!confirm("Are you sure you want to delete this variable?\n\nWe will replace every '$" + String(key) + "'\nwith the default value '" + String(value) + "'.")) {
        return;
    }
    delete storyVariablesToInclude[key];
    try {
        pages.forEach((page) => {
            page.messages.forEach((singleMessage) => {
                if (singleMessage.message && typeof singleMessage.message == "string" && singleMessage.message.includes("$" + String(key))) {
                    singleMessage.message = singleMessage.message.replace("$" + String(key), String(value));
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
    updateVariablesUI();
}

function updateVariablesUI(){
    document.getElementById("insertVariablesUI").innerHTML='';
    let containerDiv = document.createElement("div");
    containerDiv.className = "variablesContainer";
    // loop through Object.entries for storyVariablesToInclude object:
    Object.entries(storyVariablesToInclude).forEach(([key, value]) => {
        let rowDiv = document.createElement("div");
        rowDiv.className = "variableRow d-flex";
        let keyDiv = document.createElement("div");
        keyDiv.className = "keyDiv flex-fill w-50 text-miny";

        let keySpan = document.createElement("span");
        keySpan.className = "align-top fake-input";
        keySpan.innerText = "Hi ";
        let keySpanBold = document.createElement("b");
        keySpanBold.innerText = "$"+key;
        keySpan.appendChild(keySpanBold);
        keySpan.appendChild(document.createTextNode(" !"));
        let keyEditButton = document.createElement("a");
        keyEditButton.innerHTML = "<svg class=\"me-2\" width=\"24\" height=\"24\"><use xlink:href=\"#edit\" /></svg>";
        keyEditButton.className = "edit-key ms-2 align-middle float-end";
        keyEditButton.onclick = function(){
            let newKey = prompt("Enter new name for $"+String(key), key);
            if(newKey && newKey !== key && newKey !== "$"+key){
                if(newKey.slice(0,1)==="$"){
                    newKey = newKey.slice(1);
                }
                try{
                    pages.forEach((page) => {
                        page.messages.forEach((singleMessage) => {
                            if (singleMessage.message && typeof singleMessage.message == "string" && singleMessage.message.includes("$" + String(key))) {
                                singleMessage.message = singleMessage.message.replace("$" + String(key), "$" + String(newKey));
                            }
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
        keyDiv.appendChild(keyEditButton);
        keyDiv.appendChild(keySpan);

        const actualValue = value.value;
        let valueDiv = document.createElement("div");
        valueDiv.className = "valueDiv flex-fill w-50 text-miny position-relative";
        let valueEditButton = document.createElement("a");
        valueEditButton.innerHTML = "<svg class=\"me-2\" width=\"24\" height=\"24\"><use xlink:href=\"#edit\" /></svg>";
        valueEditButton.className = "edit-val align-middle mt-1";
        valueEditButton.onclick = function(){
            let newValue = prompt("Enter new value for $"+String(key), actualValue);
            if(newValue && newValue !== actualValue){
                setVariable(key, newValue);
            }
        }
        let valueSpan = document.createElement("span");
        valueSpan.className = "align-top fake-message";
        valueSpan.innerText = "Hi " + actualValue + " !";
        valueDiv.appendChild(valueEditButton);
        valueDiv.appendChild(valueSpan);
        rowDiv.appendChild(keyDiv);
        rowDiv.appendChild(valueDiv);

        let deleteDiv = document.createElement("div");
        deleteDiv.className = "deleteDiv flex-grow ms-2";
        let deleteVariableButton = document.createElement("a");
        deleteVariableButton.innerHTML = "<svg width=\"15\" height=\"17\"><use xlink:href=\"#delete\" /></svg>";
        deleteVariableButton.className = "delete-val btn btn-xs btn-danger align-middle";
        deleteVariableButton.onclick = function(){
            deleteVariable(key, value);
        }
        rowDiv.appendChild(deleteVariableButton);
        rowDiv.appendChild(deleteDiv);

        containerDiv.appendChild(rowDiv);
        const clearDiv = document.createElement("div");
        clearDiv.className = "clearfix";
        containerDiv.appendChild(clearDiv);
        const myHr = document.createElement("hr");
        containerDiv.appendChild(myHr);
        document.getElementById("insertVariablesUI").appendChild(containerDiv);

    });
}
function validateVariableKeyInput(inputEl){
    const oldValue = inputEl.value;
    const newValue = oldValue.replace(/[\W]+/g,"");
    if(newValue !== oldValue){
        inputEl.value = newValue;
    }
}
function variableNameIsSus(variableName){
    const susNames = [
        "mother","mom","mommy","father","dad","daddy","bro","brother","sis","sister","aunt","son","daughter"
    ];
    return susNames.includes(variableName) || susNames.includes("step " + variableName) || susNames.includes("step-" + variableName);
}
function addNewVariable(){
    const variableName = document.getElementById("variablekeyinput").value;
    const variableValue = document.getElementById("variablevalueinput").value;
    if(!variableName || variableName.length < 3){
        alert("Please enter a name that is at least 3 characters.");
        return;
    }
    if(!variableValue || variableValue.length < 2){
        alert("Please enter a value that is at least 2 characters.");
        return;
    }
    if(storyVariablesToInclude.hasOwnProperty(variableName)){
        alert("Variable with same name already exists");
        return;
    }
    if(variableNameIsSus(variableValue)){
        alert("If your story is NSFW, using this value can be illegal in some jurisdictions. \nIt is still added, but we recommend using a different default value. Remember, readers can always change it to this value if they want to.");
    }
    storyVariablesToInclude[variableName] = {"value": variableValue};
    document.getElementById("variablekeyinput").value = "";
    document.getElementById("variablevalueinput").value = "";
    updateVariablesUI();
}
function setVariable(variableSlug, variableDefaultValue){
    /**
     * Add or Remove a global variable
     *
     * @param {string} variableSlug - The slug of the variable
     * @param {string} variableDefaultValue - Leave "" to remove
     * @return {void}
     */
    if(variableSlug === ""){
        // invalid operation
        return;
    }
    if(variableDefaultValue === ""){
        if(storyVariablesToInclude.hasOwnProperty(variableSlug)){
            delete storyVariablesToInclude[variableSlug];
        }
        checkChatfic();
        return;
    }
    storyVariablesToInclude[variableSlug] = {"value": variableDefaultValue};
    checkChatfic();
    updateVariablesUI();
    refreshChat();
}
function setHandle(value, handleSlug){
    if(value === undefined || value === null || value === ""){
        if(chatfic.handles.hasOwnProperty(handleSlug)) {
            delete chatfic.handles[handleSlug];
            checkChatfic();
        }
        return;
    }
    value = trimTrailingSlash(value);
    value = value.split("/").pop();
    chatfic.handles[handleSlug] = value;
    checkChatfic();
}
function updateMetaUI(chatfic){
    try {
    document.getElementById("cf-title").innerText = chatfic.title;
    } catch (e){}
    try {
    document.getElementById("newTitleInput").value = chatfic.title;
    } catch (e){}
    try {
    document.getElementById("cf-description").innerText = chatfic.description;
    } catch (e){}
    try {
    document.getElementById("newDescriptionInput").value = chatfic.description;
    } catch (e){}
    try {
    document.getElementById("cf-author").innerText = chatfic.author;
    } catch (e){}
    try {
    document.getElementById("newAuthorInput").value = chatfic.author;
    } catch (e){}
}
function setCharacter(
    slug,
    name,
    color = null,
    avatar = null,
    replace = false
) {
    if (name.trim().length < 3 || slug.length < 3) {
        alert("character name and slug can't be shorter than 3 characters");
        return;
    }
    // adds new character too, if doesn't exist.
    if (replace == false && chatfic.characters.hasOwnProperty(slug)) {
        alert("Character exists already");
        return;
    }
    const oldName = chatfic.characters.hasOwnProperty(slug) ? chatfic.characters[slug]["name"] : "";
    chatfic.characters[slug] = {};
    chatfic.characters[slug]["name"] = name.trim();
    color && color != "" ? (chatfic.characters[slug]["color"] = color) : null;
    avatar && avatar != "" ? (chatfic.characters[slug]["avatar"] = avatar) : null;
    refreshCharacters();
    checkChatfic();

    try {
        pages.forEach((page) => {
            page.messages.forEach((singleMessage) => {
                if (singleMessage.chatroom == oldName) {
                    singleMessage.chatroom = name.trim();
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
    refreshChat();
}
function checkChatfic() {
    storyInfoMistakes = [];
    setModified();
    if (chatfic.title == defaultTitle)
        storyInfoMistakes.push("Title: you didn't change the default title");
    if (chatfic.description == defaultDescription)
        storyInfoMistakes.push(
            "Description: you didn't change the default description"
        );
    if (chatfic.author == defaultAuthor)
        storyInfoMistakes.push("Author: you didn't change the default author");

    if (chatfic.title.length < 3)
        storyInfoMistakes.push("Title: should be at least 3 characters long.");
    if (chatfic.description.length < 3)
        storyInfoMistakes.push(
            "Description: should be at least 3 characters long."
        );
    if (chatfic.author.length < 3)
        storyInfoMistakes.push("Author: should be at least 3 characters long.");


    document.getElementById("missingInfo").innerHTML = "";
    if (storyInfoMistakes.length == 0) {
        storyInfoComplete = true;
        storyInfoCompleteLabel.innerHTML = "complete";
        storyInfoCompleteLabel.className = "text-success";
        document.getElementById("whatsmissingbutton").style.display = "none";
    } else {
        storyInfoComplete = false;
        storyInfoCompleteLabel.innerHTML = "incomplete";
        storyInfoCompleteLabel.className = "text-danger";
        let listText = "";
        storyInfoMistakes.forEach((mistakeText) => {
            listText = listText + `<li class="small">${mistakeText}</li>`;
        });
        document.getElementById("missingInfo").innerHTML = listText;
        document.getElementById("whatsmissingbutton").style.display =
            "inline-block";
    }
    activateSaveToBrowser();
}
function setLeftCharacter(slug) {
    document.getElementById("leftCharacterSlug").value = slug;
    document.getElementById("leftCharacterLabel").innerText =
        chatfic.characters[slug].name;
}
function setRightCharacter(slug) {
    document.getElementById("rightCharacterSlug").value = slug;
    document.getElementById("rightCharacterLabel").innerText =
        chatfic.characters[slug].name;
}
function setModelName(slug){
    let tempModelName = '';
    if(chatfic.characters.hasOwnProperty(slug)){
        if(chatfic.characters[slug].hasOwnProperty('model')){
            if(chatfic.characters[slug]['model'].hasOwnProperty('name')){
                const currentModelName = chatfic.characters[slug]['model']['name'];
                if(currentModelName && currentModelName.length > 0){
                    tempModelName = currentModelName;
                }
            }
        }
        else{
            chatfic.characters[slug]['model'] = {};
        }
        // show prompt
        const newModelName = window.prompt(`Enter model name for ${String(slug)}`, tempModelName);
        if(newModelName && newModelName.length > 0){
            chatfic.characters[slug]['model']['name'] = newModelName;
            refreshCharacters();
        }
        else{
            delete chatfic.characters[slug]['model']['name'];
            refreshCharacters();
        }
    }
}
function refreshCharacters() {
    const charactersListInModal = document.getElementById(
        "charactersListInModal"
    );
    charactersListInModal.innerHTML = "";
    const charactersListAttributionInModal = document.getElementById(
        "charactersListAttributionInModal"
    );
    charactersListAttributionInModal.innerHTML = "";
    const fromInput = document.getElementById(
        "fromInput"
    );
    fromInput.innerHTML = "";

    for (let key in chatfic.characters) {
        const character = chatfic.characters[key];

        const option = document.createElement("option");
        option.innerText = character.name;
        option.value = key;
        fromInput.appendChild(option);

        const characterCard = document.createElement("li");
        characterCard.className = "list-group-item small";

        const characterRow = document.createElement("div");
        characterRow.className = "d-flex";
        if (key != "player" && key != "app") {
            const saveOverCell = document.createElement("div");
            saveOverCell.className = "flex-grow-0";
            saveOverCell.innerHTML = `<button onclick="setCharacter('${key}', document.getElementById('newCharacterNameInput').value, document.getElementById('newCharacterColorInput').value, null, true)" class="btn btn-xs btn-success me-2 mt-1 mb-1">Save over this</button>`;
            characterRow.appendChild(saveOverCell);
        }
        const infoCell = document.createElement("div");
        infoCell.className = "flex-grow-1 mt-1 mb-1";
        infoCell.innerHTML = `<span class="d-sm-inline d-block"><b>Slug:</b> ${key}, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Name:</b> ${character.name
        }, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Color:</b> ${character.color ?? "Not set"
        }</span>`;
        characterRow.appendChild(infoCell);
        if (key != "player" && key != "app") {
            const removeCell = document.createElement("div");
            removeCell.className = "flex-grow-0";
            removeCell.innerHTML = `<button onclick="deleteCharacter('${key}')" class="btn btn-xs btn-danger pb-1 mt-1 mb-1">
            <svg width="16" height="16" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
            <use xlink:href="#delete"/>
          </svg>
            </button>`;
            characterRow.appendChild(removeCell);
        } else {
            const renameCell = document.createElement("div");
            renameCell.className = "flex-grow-0";
            renameCell.innerHTML = `<button onclick="renamePlayer()" class="btn btn-xs btn-primary  mt-1 mb-1">Rename</button>`;
            characterRow.appendChild(renameCell);
        }
        characterCard.appendChild(characterRow);
        charactersListInModal.appendChild(characterCard);

        if(key !== "app"){
            const characterCardForAttribution = document.createElement("li");
            characterCardForAttribution.className = "list-group-item small";

            const characterRowAttribution = document.createElement("div");
            characterRowAttribution.className = "d-flex";

            const infoCellAttribution = document.createElement("div");
            infoCellAttribution.className = "flex-grow-1 mt-1 mb-1";
            infoCellAttribution.innerHTML = `<span class="d-sm-inline d-block"><b>Slug:</b> ${key}, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Name:</b> ${character.name
            }, </span><br/>
            <span class="d-sm-inline d-block"><b>Model Name:</b> ${character.model?.name ?? "Not set"}</span>`;
            characterRowAttribution.appendChild(infoCellAttribution);

            const modelNameCell = document.createElement("div");
            modelNameCell.className = "flex-grow-0";
            modelNameCell.innerHTML = `<button onclick="setModelName('${String(key.replace(/'/g, '').replace(/"/g, ''))}')" class="btn btn-xs btn-primary  mt-1 mb-1">Edit Model Name</button><br/><button onclick="alert('Work in progress');" class="btn btn-xs btn-primary  mt-1 mb-1">Edit Model Handles</button>`;
            characterRowAttribution.appendChild(modelNameCell);

            characterCardForAttribution.appendChild(characterRowAttribution);
            charactersListAttributionInModal.appendChild(characterCardForAttribution);
        }

    }

    const weirdCharacterSelectLeft = document.getElementById(
        "weirdCharacterSelectLeft"
    );
    const leftCharacterSlug = document.getElementById("leftCharacterSlug");
    const oldLeftSlug = leftCharacterSlug.value;
    weirdCharacterSelectLeft.innerHTML = "";
    for (let key in chatfic.characters) {
        if (key == "app") {
            continue;
        }
        let character = chatfic.characters[key];
        let newOption = document.createElement("li");
        let newOptionA = document.createElement("a");
        newOptionA.innerText = character.name;
        newOptionA.className = "dropdown-item small";
        newOptionA.href = "javascript:void(0)";
        newOptionA.setAttribute("onclick", "setLeftCharacter('" + key + "')");
        newOption.appendChild(newOptionA);
        weirdCharacterSelectLeft.appendChild(newOption);
        if (key == oldLeftSlug) {
            setLeftCharacter(key);
        }
    }
    const dividerLeft = document.createElement("li");
    dividerLeft.innerHTML = '<hr class="dropdown-divider"/>';
    weirdCharacterSelectLeft.appendChild(dividerLeft);
    const characterEditorLeft = document.createElement("li");
    characterEditorLeft.innerHTML =
        '<a class="dropdown-item small" href="javascript:void(0)" onclick="showCharactersModal();">Edit Characters</a>';
    weirdCharacterSelectLeft.appendChild(characterEditorLeft);

    const weirdCharacterSelectRight = document.getElementById(
        "weirdCharacterSelectRight"
    );
    const rightCharacterSlug = document.getElementById("rightCharacterSlug");
    const oldRightSlug = rightCharacterSlug.value;
    weirdCharacterSelectRight.innerHTML = "";
    for (let key in chatfic.characters) {
        if (key == "app") {
            continue;
        }
        let character = chatfic.characters[key];
        let newOption = document.createElement("li");
        let newOptionA = document.createElement("a");
        newOptionA.innerText = character.name;
        newOptionA.className = "dropdown-item small";
        newOptionA.href = "javascript:void(0)";
        newOptionA.setAttribute("onclick", "setRightCharacter('" + key + "')");
        newOption.appendChild(newOptionA);
        weirdCharacterSelectRight.appendChild(newOption);
        if (key == oldRightSlug) {
            setRightCharacter(key);
        }
    }
    const dividerRight = document.createElement("li");
    dividerRight.innerHTML = '<hr class="dropdown-divider"/>';
    weirdCharacterSelectRight.appendChild(dividerRight);
    const characterEditorRight = document.createElement("li");
    characterEditorRight.innerHTML =
        '<a class="dropdown-item small" href="javascript:void(0)" onclick="showCharactersModal();">Edit Characters</a>';
    weirdCharacterSelectRight.appendChild(characterEditorRight);

    activateSaveToBrowser();
}
function renamePlayer() {
    let newName = prompt("Please enter new name for the player").trim();
    if (newName != null && newName.length > 1) {
        chatfic.characters.player.name = newName;
        refreshCharacters();
    }
}
function deleteCharacter(slug) {
    const canI = checkCurrentMessagesForCharacter(slug);
    if (!canI) {
        alert(
            "You can't delete a character without removing all messages from that character first"
        );
        return false;
    }
    delete chatfic.characters[slug];
    refreshCharacters();
}
function checkCurrentMessagesForCharacter(slug) {
    pages.forEach((page) => {
        page.messages.forEach((singleMessage) => {
            if (singleMessage.from == slug) {
                return false;
            }
        });
    });
    return true;
}
function refreshPageOptionsList() {
    let pageOptionsList = "";
    pages.forEach((page) => {
        let optionsPart = "";
        if (page.options.length == 0) {
            optionsPart = `<button onclick="showPageOptionsModal(${page.id});" class="btn btn-danger btn-xs">Set<span class="d-none d-sm-inline"> next</span></button>`;
        } else if (page.options.length == 1) {
            optionsPart = `<span onclick="showPageOptionsModal(${page.id
                });" class="badge rounded-pill bg-success">'${pages.find((x) => x.id == page.options[0].to).name
                }'</span>`;
        } else {
            // multiple options
            let optionsPageNames = "";
            page.options.forEach((pageOption) => {
                optionsPageNames +=
                    ", " + pages.find((x) => x.id == pageOption.to).name;
            });
            optionsPageNames = optionsPageNames.slice(2);
            optionsPart = `<span onclick="showPageOptionsModal(${page.id});" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${optionsPageNames}" class="badge rounded-pill bg-secondary">
            ${page.options.length} options
            </span>`;
        }
        let status = "success";
        let fromsText = "aaa";
        let pageOption = `
            <div class="d-flex justify-content-between mt-2">
                <div class="arrow-start-text">
                <svg width="22" height="22" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${fromsText}">
                    <use xlink:href="#${status}"/>
                </svg>
                </div>
                <div class="flex-grow-1">
                <div class="arrowstart"></div>
                </div>
                <div class="arrow-middle-text">
                    ${page.name}
                </div>
                <div class="flex-grow-1">
                <div class="arrowend"></div>
                </div>
                <div class="arrow-end-text">
                ${optionsPart}
                </div>
            </div>`;
        pageOptionsList += pageOption;
    });
    let pageOptionsLister = document.getElementById("page-options-lister");
    pageOptionsLister.innerHTML = pageOptionsList;
    activateSaveToBrowser();
}

const pageOptionsModal = new bootstrap.Modal(
    document.getElementById("pageOptionsModal")
);
const pageOptionsTitle = document.getElementById("optionspagetitle");
const pageOptionsTitleAlt = document.getElementById("optionspagetitlealt");
const saveOptionsButton = document.getElementById("saveOptionsButton");

function pageOptionsMultiple(isMultiple) {
    if (isMultiple) {
        document.getElementById("pagedirect").style.display = "none";
        document.getElementById("pagemultiple").style.display = "block";
    } else {
        document.getElementById("pagedirect").style.display = "block";
        document.getElementById("pagemultiple").style.display = "none";
    }
}

function showPageOptionsModal(pageId) {
    // get page by id:
    let page = pages.find((x) => x.id == pageId);
    saveOptionsButton.setAttribute("data-pageId", page.id);
    pageOptionsTitle.innerText = page.name;
    pageOptionsTitleAlt.innerText = page.name;
    if (page.options.length == 1) {
        populatePageSelect2(page.options[0].to);
    } else {
        document.getElementById("pageoptionslist").innerHTML = "";
        populatePageSelect2();
        if (page.options.length > 1) {
            page.options.forEach((pageOption) => {
                let dflex = null;
                if (pageOption.hasOwnProperty("message")) {
                    dflex = newPageOptionRow(pageOption.to, pageOption.message);
                } else {
                    dflex = newPageOptionRow(pageOption.to);
                }

                document.getElementById("pageoptionslist").appendChild(dflex);
            });
        }
        if (page.options.length < 4) {
            for (let i = 0; i < 4 - page.options.length; i++) {
                const xdflex = newPageOptionRow();
                document.getElementById("pageoptionslist").appendChild(xdflex);
            }
        }
    }
    // show modal
    pageOptionsModal.show();
}

function savePageOptions() {
    let page = pages.find(
        (x) => x.id == saveOptionsButton.getAttribute("data-pageId")
    );

    page.options = [];
    if (document.getElementById("sideradio1").checked) {
        // single option logic
        page.options.push({ to: parseInt(pageSelect2.value) });
    } else {
        // multiple options logic
        var inputGroups = document.querySelectorAll(
            "#pageoptionslist .input-group"
        );
        [].forEach.call(inputGroups, function (inputGroup) {
            let optionName = inputGroup.querySelector("input").value;
            let optionPageId = inputGroup.querySelector("select").value;
            if (
                optionName &&
                optionName.length > 1 &&
                optionPageId !== null &&
                optionPageId != 0
            ) {
                page.options.push({ to: parseInt(optionPageId), message: optionName });
            }
        });
    }
    refreshPageOptionsList();
    pageOptionsModal.hide();
    setTooltips();
}

function newPageOptionRow(pageTo = null, optionMessage = null) {
    let newPageSelectHolder = document.createElement("div");
    newPageSelectHolder.className = "input-group input-group-sm mb-2";

    newPageSelectHolder.innerHTML = `<label class="input-group-text">
        Option
    </label>`;

    let optionName = document.createElement("input");
    optionName.setAttribute("type", "text");
    optionName.className = "form-control me-4 me-sm-0";
    if (optionMessage) {
        optionName.value = optionMessage;
    }
    newPageSelectHolder.appendChild(optionName);

    let mobileBreaker = document.createElement("div");
    mobileBreaker.className = "flex-fill w-100 d-sm-none d-block";
    newPageSelectHolder.appendChild(mobileBreaker);

    let mobileFloater = document.createElement("div");
    mobileFloater.className = "flex-grow-1 d-sm-none d-block";
    mobileFloater.innerHTML = "&nbsp;";
    newPageSelectHolder.appendChild(mobileFloater);

    let selectLabel = document.createElement("label");
    selectLabel.className = "input-group-text small ms-3 ms-sm-0";
    selectLabel.innerHTML = '<sup class="mt-2">will go to page:</sup>';
    newPageSelectHolder.appendChild(selectLabel);

    let selector = newPageSelect(pageTo);
    newPageSelectHolder.appendChild(selector);
    return newPageSelectHolder;
}

const charactersModal = new bootstrap.Modal(
    document.getElementById("charactersModal")
);
function showCharactersModal() {
    charactersModal.show();
}
const sendMediaModal = new bootstrap.Modal(
    document.getElementById("sendMediaModal")
);
function showSendMediaModal() {
    sendMediaModal.show();
}
function sendMedia(mediaName) {
    sendMediaModal.hide();
    addMessage(mediaName);
}
function deleteMessage(mi) {
    if (confirm("Delete this message?") == true) {
        let pageId = document.getElementById("pageSelect").value;
        let page = pages.find((x) => x.id == pageId);
        page.messages.splice(mi, 1);
    }
    refreshChat();
}
var data = [1,2,3,4,5];

function moveMessage(messages, from, to) {
  var f = messages.splice(from, 1)[0];
  messages.splice(to, 0, f);
  return messages;
}


function moveMessageToUp(mi) {
    if(mi < 1){return;}
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    page.messages = moveMessage(page.messages, mi, mi-1);
    refreshChat();
}
function moveMessageToDown(mi) {
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    if(mi > page.messages.length-1){return;}
    page.messages = moveMessage(page.messages, mi, mi+1);
    refreshChat();
}
function moveMessageToRight(mi) {
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    page.messages[mi]["from"]="player";
    page.messages[mi]["side"]=2;
    refreshChat();
}
function moveMessageToLeft(mi) {
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    let from = getMessageLeftFromByIndex(mi);
    if(from == null){
        editMessage(mi);
    }
    else{
        page.messages[mi]["from"]=from;
        page.messages[mi]["side"]=0;
        refreshChat();
    }
}
function getMessageLeftFromByIndex(mi){
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    const pageLength = page.messages.length;
    const isPageEmpty = pageLength == 0;
    if(isPageEmpty){
        return null;
    }
    else{
        return getLeftFromsToBackRecursive(page.messages, mi);
    }
    
}
function chatroomOwnerOrNull(message){
    let chatroom = message.chatroom;
    for (let key in chatfic.characters) {
        try{
            if(chatroom == chatfic.characters[key].name){
                return key;
            }
        }
        catch(e){

        }
    }
    return null;
}
function getLeftFromsToBackRecursive(messages, mi){
    console.log("messages[mi]");
    console.log(mi);
    try{
        if(messages[mi-1].chatroom != messages[mi].chatroom){
            return chatroomOwnerOrNull(messages[mi]);
        }

        if(messages[mi-1].from == "player"){
            return getLeftFromsToBackRecursive(messages, mi-1);
        }
        else{
            return messages[mi-1].from;
        }
    }
    catch(e){
        return chatroomOwnerOrNull(messages[mi]);
    }

}


function addMessageCustom(side = 0, message= "", cleaned = false, refresh= false, multimedia = null) {
    // Fetch input values
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);

    let chatroom = document.getElementById("customChatroomNameInput").value;
    let characterSlugLeft = document.getElementById("leftCharacterSlug").value;
    let characterSlugRight = document.getElementById("rightCharacterSlug").value;

    if (
        !chatroom &&
        characterSlugLeft != "player" &&
        characterSlugRight != "player"
    ) {
        chatroom =
            chatfic.characters[characterSlugLeft].name +
            "-" +
            chatfic.characters[characterSlugRight].name;
    }

    let characterSlug = "app";

    if ((!message || message.length < 1) && !multimedia) {
        return;
    }

    if(message && message.length > 1){
        const checker = getSuggestionCheckerRegex();
        if(checker.test(message)){
            const vars = getExistingVariableSuggestions();
            for (const [key, obj] of Object.entries(vars)) {
                if(obj.reg.test(message)){
                    if(confirm("Variable detected.\nReplace '"+key+"' with '"+obj.value+"'?")) {
                        message = message.replace(obj.reg, "$" + obj.slug);
                    }
                }
            }
        }
    }

    if (side === 0) {
        characterSlug = characterSlugLeft;
    } else if (side === 2) {
        characterSlug = characterSlugRight;
    }
    let position = parseInt(document.getElementById("position").value);

    const pageLength = page.messages.length;
    const isPageEmpty = pageLength == 0;
    let previousMessageInPage = null;
    let previousMessageIndex = -1;
    let nextMessageInPage = null;
    if (!isPageEmpty) {
        if (position != 0 && pageLength > position) {
            previousMessageInPage = page.messages[position - 1];
            previousMessageIndex = position - 1;
            if (pageLength > position + 1) {
                nextMessageInPage = page.messages[position + 1];
            }
        } else if (position == 0) {
            previousMessageIndex = pageLength - 1;
            previousMessageInPage = page.messages[pageLength - 1];
        }
    }
    if (chatroom == null || chatroom == "") {
        if (characterSlug != "player" && characterSlug != "app") {
            chatroom = chatfic.characters[characterSlug].name;
        } else if (document.getElementById("leftCharacterSlug").value != "player") {
            chatroom =
                chatfic.characters[document.getElementById("leftCharacterSlug").value]
                    .name;
        } else {
            // characterSlug == "player" or characterSlug == "app"

            if (
                previousMessageInPage &&
                previousMessageInPage.from != "player" &&
                previousMessageInPage.from != "app"
            ) {
                chatroom = chatfic.characters[previousMessageInPage.from].name;
            } else {
                let tryMessageIndex = previousMessageIndex;
                while (tryMessageIndex >= 0) {
                    if (
                        page.messages[tryMessageIndex].from != "player" &&
                        page.messages[tryMessageIndex].from != "app"
                    ) {
                        chatroom =
                            chatfic.characters[page.messages[tryMessageIndex].from].name;
                        break;
                    }
                    tryMessageIndex = tryMessageIndex - 1;
                }
            }
            if (chatroom == null || chatroom == "") {
                if (
                    nextMessageInPage &&
                    nextMessageInPage.from != "player" &&
                    nextMessageInPage.from != "app"
                ) {
                    chatroom = chatfic.characters[nextMessageInPage.from].name;
                } else {
                    chatroom = prompt(
                        "Player is sending this message to:",
                        Object.keys(chatfic.characters).length > 2
                            ? chatfic.characters[Object.keys(chatfic.characters)[2]].name
                            : "Jessica"
                    );
                    if (chatroom == null || chatroom == "") {
                        chatroom = "Unknown";
                    }
                }
            }
        }
    }

    // Create message object
    var newMessage = {
        message: message,
        from: characterSlug,
        side: side,
        multimedia: multimedia,
        chatroom: chatroom,
        isCleaned: cleaned
    };
    latestMessageAdded = message;
    document.getElementById('message').value='';
    if (position == 0) {
        page.messages.push(newMessage);
    } else {
        page.messages.splice(position, 0, newMessage);
        position = position + 1;
        document.getElementById("position").value = position;
    }
    if(refresh){
        refreshChat();
    }
}


function addMessage(multimedia = null) {
    // Fetch input values
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);

    let chatroom = document.getElementById("customChatroomNameInput").value;
    let characterSlugLeft = document.getElementById("leftCharacterSlug").value;
    let characterSlugRight = document.getElementById("rightCharacterSlug").value;

    if (
        !chatroom &&
        characterSlugLeft != "player" &&
        characterSlugRight != "player"
    ) {
        chatroom =
            chatfic.characters[characterSlugLeft].name +
            "-" +
            chatfic.characters[characterSlugRight].name;
    }

    let characterSlug = "app";
    let message = document.getElementById("message").value;
    if ((!message || message.length < 1) && !multimedia) {
        return;
    }

    if(message && message.length > 1){
        const checker = getSuggestionCheckerRegex();
        if(checker.test(message)){
            const vars = getExistingVariableSuggestions();
            for (const [key, obj] of Object.entries(vars)) {
                if(obj.reg.test(message)){
                    if(confirm("Variable detected.\nReplace '"+key+"' with '"+obj.value+"'?")) {
                        message = message.replace(obj.reg, "$" + obj.slug);
                    }
                }
            }
        }
    }


    let side = document.querySelector('input[name="sideradio"]:checked').value;
    if (side == 0) {
        characterSlug = characterSlugLeft;
    } else if (side == 2) {
        characterSlug = characterSlugRight;
    }
    let position = parseInt(document.getElementById("position").value);

    const pageLength = page.messages.length;
    const isPageEmpty = pageLength == 0;
    let previousMessageInPage = null;
    let previousMessageIndex = -1;
    let nextMessageInPage = null;
    if (!isPageEmpty) {
        if (position != 0 && pageLength > position) {
            previousMessageInPage = page.messages[position - 1];
            previousMessageIndex = position - 1;
            if (pageLength > position + 1) {
                nextMessageInPage = page.messages[position + 1];
            }
        } else if (position == 0) {
            previousMessageIndex = pageLength - 1;
            previousMessageInPage = page.messages[pageLength - 1];
        }
    }
    if (chatroom == null || chatroom == "") {
        if (characterSlug != "player" && characterSlug != "app") {
            chatroom = chatfic.characters[characterSlug].name;
        } else if (document.getElementById("leftCharacterSlug").value != "player") {
            chatroom =
                chatfic.characters[document.getElementById("leftCharacterSlug").value]
                    .name;
        } else {
            // characterSlug == "player" or characterSlug == "app"

            if (
                previousMessageInPage &&
                previousMessageInPage.from != "player" &&
                previousMessageInPage.from != "app"
            ) {
                chatroom = chatfic.characters[previousMessageInPage.from].name;
            } else {
                let tryMessageIndex = previousMessageIndex;
                while (tryMessageIndex >= 0) {
                    if (
                        page.messages[tryMessageIndex].from != "player" &&
                        page.messages[tryMessageIndex].from != "app"
                    ) {
                        chatroom =
                            chatfic.characters[page.messages[tryMessageIndex].from].name;
                        break;
                    }
                    tryMessageIndex = tryMessageIndex - 1;
                }
            }
            if (chatroom == null || chatroom == "") {
                if (
                    nextMessageInPage &&
                    nextMessageInPage.from != "player" &&
                    nextMessageInPage.from != "app"
                ) {
                    chatroom = chatfic.characters[nextMessageInPage.from].name;
                } else {
                    chatroom = prompt(
                        "Player is sending this message to:",
                        Object.keys(chatfic.characters).length > 2
                            ? chatfic.characters[Object.keys(chatfic.characters)[2]].name
                            : "Jessica"
                    );
                    if (chatroom == null || chatroom == "") {
                        chatroom = "Unknown";
                    }
                }
            }
        }
    }

    // Create message object
    var newMessage = {
        message: message,
        from: characterSlug,
        side: side,
        multimedia: multimedia,
        chatroom: chatroom,
    };
    latestMessageAdded = message;
    document.getElementById('message').value='';
    if (position == 0) {
        page.messages.push(newMessage);
    } else {
        page.messages.splice(position, 0, newMessage);
        position = position + 1;
        document.getElementById("position").value = position;
    }
    refreshChat();
}
function saveMessageFromEditModal(){
    // Get new values from the modal fields
    let editMessageIndex = document.getElementById("editMessageIndex").value;
    let newMessage = document.getElementById("messageInput").value;
    let newFrom = document.getElementById("fromInput").value;
    let newSide = null;
    let selector = document.querySelector('input[name="sideInputS"]:checked');
    if(selector){
         newSide = selector.value;
    }
    let newMultimedia = document.getElementById("multimediaInput").value;
    let newChatroom = document.getElementById("chatroomInput").value;

    let updatedMessage = {
        message: newMessage || null,
        from: newFrom || null,
        side: newSide || null,
        multimedia: newMultimedia || null,
        chatroom: newChatroom || null,
    };
    // Update the page.messages array with the updated message
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    page.messages[parseInt(editMessageIndex)] = updatedMessage;
    // Step 5: Run the refreshChat function
    refreshChat();
    // Hide the modal after saving
    editMessageModal.hide();
}
let editMessageModal;
document.addEventListener("DOMContentLoaded", function () {
    editMessageModal = new bootstrap.Modal(document.getElementById("editMessageModal"));

    document.getElementById("saveMessageButton").addEventListener("click", function () {
        saveMessageFromEditModal();
      });
});
// Function to edit a message
function editMessage(messageIndex) {
    // Step 1: Detect current page object
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    let message = page.messages[messageIndex];

    try{
        delete page.messages[messageIndex]["isCleaned"];
        refreshChat();
    }
    catch(e){
        // skip
    }

    // Show the modal
    editMessageModal.show();

    document.getElementById("editMessageIndex").value = messageIndex;
    document.getElementById("messageInput").value = message.message;
    document.getElementById("fromInput").value = message.from;
    if(message.side === 0 || message.side === "0"){
        document.getElementById("editSide0").checked = true;
    }
    else if(message.side === 1 || message.side === "1"){
        document.getElementById("editSide1").checked = true;
    }
    else if(message.side === 2 || message.side === "2"){
        document.getElementById("editSide2").checked = true;
    }
    document.getElementById("multimediaInput").value = message.multimedia;
    document.getElementById("chatroomInput").value = message.chatroom;

  }

function refreshChat() {
    const sides = ["left", "middle", "right"];
    const pageId = document.getElementById("pageSelect").value;
    const page = pages.find((x) => x.id == pageId);
    const position = parseInt(document.getElementById("position").value);

    const chatContainer = document.createElement("div");
    chatContainer.className = "chat pb-0";

    const pageMessages = page.messages;
    const pageMessagesLength = pageMessages.length;

    for (let i = 0; i < pageMessagesLength; i++) {
        const messageObject = pageMessages[i];
        const previousMessage = i == 0 ? null : pageMessages[i - 1];
        const nextMessage =
            i == pageMessagesLength - 1 ? null : pageMessages[i + 1];

        // create cursor:
        const cursor = document.createElement("cursor");
        cursor.setAttribute("onclick", "setCursor(this);");
        if (position != 0 && position == i) {
            cursor.className = "active";
        }
        chatContainer.appendChild(cursor);

        // create chatroom header if needed:
        if (
            previousMessage == null ||
            previousMessage.chatroom != messageObject.chatroom
        ) {
            const chatroomHeader = document.createElement("div");
            chatroomHeader.className = "sticky-top chatroom-header";
            chatroomHeader.innerText = messageObject.chatroom;
            chatContainer.appendChild(chatroomHeader);
        }
        /*
            Now we will create this using createElement:
            <div data-index="5" tabindex="0" class="left messages">
                <div class="message">
                    Hey!
                </div>
            </div>
            */
        const messageContainer = document.createElement("div");
        messageContainer.className = "messages";
        messageContainer.setAttribute("data-index", i);
        messageContainer.setAttribute("tabindex", 0);
        messageContainer.className = sides[messageObject.side] + " messages";

        const messageDiv = document.createElement("div");

        let setAuthor = false;
        if (
            previousMessage == null ||
            previousMessage.chatroom != messageObject.chatroom ||
            previousMessage.from != messageObject.from ||
            previousMessage.side != messageObject.side
        ) {
            setAuthor = true;
        }
        if (
            nextMessage == null ||
            nextMessage.chatroom != messageObject.chatroom ||
            nextMessage.from != messageObject.from ||
            nextMessage.side != messageObject.side
        ) {
            messageDiv.className = "message last";
        } else {
            messageDiv.className = "message";
        }
        if (
            setAuthor &&
            messageObject.side != 1 &&
            (messageObject.from != "player" || messageObject.side != 2)
        ) {
            const fromSpan = document.createElement("span");
            // console.log(messageObject);
            // console.log(messageObject.from);
            fromSpan.innerText = chatfic.characters[messageObject.from].name;
            fromSpan.className = "author";
            messageDiv.appendChild(fromSpan);
            messageDiv.className = messageDiv.className + " withAuthor";
        }

        if (messageObject.multimedia) {
            if (
                messageObject.multimedia.toLowerCase().endsWith(".mp4") ||
                messageObject.multimedia.toLowerCase().endsWith(".webm")
            ) {
                if(mediaFileVideoThumbnailList.hasOwnProperty(messageObject.multimedia)){
                    const videoContainerEl = document.createElement("div");
                    videoContainerEl.className = "video-container";
                    const videoEl = document.createElement("img");
                    const videoSpanEl = document.createElement("span");
                    videoSpanEl.innerText = `Video file: ${messageObject.multimedia}`;
                    videoEl.src = mediaFileVideoThumbnailList[messageObject.multimedia];
                    videoContainerEl.appendChild(videoEl);
                    videoContainerEl.appendChild(videoSpanEl);
                    messageDiv.appendChild(videoContainerEl);
                }
                else{
                    const videoEl = document.createElement("span");
                    videoEl.innerText = `Video file: ${messageObject.multimedia}`;
                    messageDiv.appendChild(videoEl);
                }
            } else {
                const imageEl = document.createElement("img");
                if (mediaFileSrcList.hasOwnProperty(messageObject.multimedia)) {
                    imageEl.src = mediaFileSrcList[messageObject.multimedia];
                }
                else{
                    imageEl.src = createPlaceholderSrc("Missing media:\n" + messageObject.multimedia + "\nPlease drop the\nactual media here", 15);
                }
                messageDiv.appendChild(imageEl);
            }
        }

        const messageText = document.createElement("span");
        // messageText.innerText = messageObject.message;
        messageText.className='message-text';

        const regex = /\$\w*\b/gm;

        let m;

        let previousLastIndex = 0;
        while ((m = regex.exec(messageObject.message)) !== null) {
            // console.log("m.index");
            // console.log(m.index);
            // console.log("regex.lastIndex");
            // console.log(regex.lastIndex);
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            const variableSlugWithDollar = messageObject.message.substring(m.index,regex.lastIndex); // probably m[0]

            if(m.index > previousLastIndex){
                const textNode = document.createTextNode(messageObject.message.substring(previousLastIndex, m.index));
                messageText.appendChild(textNode);
            }
            const variableSlug = variableSlugWithDollar.substring(1);
            const variableSpan = document.createElement("span");

            if(storyVariablesToInclude.hasOwnProperty(variableSlug)){
                variableSpan.className = "variable";
                variableSpan.innerText = storyVariablesToInclude[variableSlug].value;
                const infoSpan = document.createElement("span");
                infoSpan.className='info';
                infoSpan.innerText = "Variable: " + String(variableSlugWithDollar);
                variableSpan.appendChild(infoSpan);
            }
            else{
                variableSpan.className = "variable unknown";
                variableSpan.innerText = variableSlugWithDollar;
            }


            messageText.appendChild(variableSpan);
            previousLastIndex = regex.lastIndex;

        }

        if(previousLastIndex < messageObject.message.length){
            const textNode = document.createTextNode(messageObject.message.substring(previousLastIndex));
            messageText.appendChild(textNode);
        }


        messageDiv.appendChild(messageText);

        if(messageObject.hasOwnProperty("isCleaned") && messageObject.isCleaned){
            messageDiv.className = messageDiv.className + " cleaned";
        }

        const messageDel = document.createElement("span");
        messageDel.className = "delete";
        messageDel.setAttribute("onclick", "deleteMessage(" + i + ")");
        messageDiv.appendChild(messageDel);

        
        const messageToUp = document.createElement("span");
        messageToUp.className = "to-up";
        messageToUp.setAttribute("onclick", "moveMessageToUp(" + i + ")");
        messageDiv.appendChild(messageToUp);

        const messageToDown = document.createElement("span");
        messageToDown.className = "to-down";
        messageToDown.setAttribute("onclick", "moveMessageToDown(" + i + ")");
        messageDiv.appendChild(messageToDown);
        
        const messageToLeft = document.createElement("span");
        messageToLeft.className = "to-left";
        messageToLeft.setAttribute("onclick", "moveMessageToLeft(" + i + ")");
        messageDiv.appendChild(messageToLeft);

        const messageToRight = document.createElement("span");
        messageToRight.className = "to-right";
        messageToRight.setAttribute("onclick", "moveMessageToRight(" + i + ")");
        messageDiv.appendChild(messageToRight);

        const messageEdit = document.createElement("span");
        messageEdit.className = "edit";
        messageEdit.setAttribute("onclick", "editMessage(" + i + ")");
        messageDiv.appendChild(messageEdit);

        messageContainer.appendChild(messageDiv);
        chatContainer.appendChild(messageContainer);
    }
    document.getElementById("chatscreen").innerHTML = "";
    document.getElementById("chatscreen").appendChild(chatContainer);

    if (position == 0) {
        const chatscroll = document.getElementById("chatscroll");
        if(chatscroll.scrollHeight - chatscroll.scrollTop < 200){
            chatscroll.scrollTop = chatscroll.scrollHeight;
        }
    }
    activateSaveToBrowser();
}

function getSuggestedReplace(str){
    const afterLastSpace = str.split(" ").pop();
    if(afterLastSpace.length > 1 && afterLastSpace.substring(0,1) === "$"){
        const matchingKeys = Object.keys(storyVariablesToInclude).filter(key => (key.startsWith(afterLastSpace.slice(1)) && key !== afterLastSpace.slice(1)));
        if(matchingKeys.length > 0){
            return {"replaceThis":afterLastSpace,"withThis":"$"+matchingKeys[0]};
        }
        else{
            return null;
        }
    }
    return null;
}

function suggestVariable(inputEl){
    const tabHint = document.getElementById("tabHint");
    const afterLastSpace = inputEl.value.split(" ").pop();
    if(afterLastSpace.length > 1 && afterLastSpace.substring(0,1) === "$"){
        const matchingKeys = Object.keys(storyVariablesToInclude).filter(key => (key.startsWith(afterLastSpace.slice(1)) && key !== afterLastSpace.slice(1)));
        if(matchingKeys.length > 0){
            tabHint.innerText = "Press TAB or tap above to add variable: " + matchingKeys[0];
        }
        else{
            tabHint.innerText = "";
        }
    }
    else{
        tabHint.innerText = "";
    }
}

function activateSaveToBrowser() {
    const sbb = document.getElementById("saveToBrowserButton");
    sbb.classList.add("btn-warning");
    sbb.classList.remove("btn-secondary");
    sbb.removeAttribute("disabled");
}

const pageSelect = document.getElementById("pageSelect");
const pageSelect2 = document.getElementById("pageSelect2");
const editInfoButton = document.getElementById("editInfoButton");
const infoModal = new bootstrap.Modal(document.getElementById("infoModal"));

const editPagesButton = document.getElementById("editPagesButton");
const pageModal = new bootstrap.Modal(document.getElementById("pageModal"));
const pageList = document.getElementById("pageList");
const newPageInput = document.getElementById("newPageInput");
const addPageButton = document.getElementById("addPageButton");
const addPageBySplitButton = document.getElementById("addPageButtonBySplit");
let latestMessageAdded = "";
editInfoButton.addEventListener("click", () => {
    infoModalShow();
});
function checkVariableSuggestions(el, e = null){
    const res = getSuggestedReplace(el.value);
    if(res !== null){
        if(e){e.preventDefault();}
        const valList = el.value.split(" ");
        const lastOne = valList.pop().replace(res.replaceThis,res.withThis);
        valList.push(lastOne);
        el.value = valList.join(" ");
    }
}
function handleMessageKeyPress(e){
 var key=e.keyCode || e.which;
  if (key==13){
    addMessage();
  }
  else if (key==9){
    checkVariableSuggestions(e.target, e);
  }
  else if(key==38 && document.getElementById('message').value == ""){
    document.getElementById('message').value = latestMessageAdded;
  }
}
function handleEditMessageKeyPress(e){
 var key=e.keyCode || e.which;
  if (key==13){
      document.getElementById("saveMessageButton").click();
  }
}
// Function to populate the select element with options from the "pages" array
function populatePageSelect() {
    pageSelect.innerHTML = "";
    for (let i = 0; i < pages.length; i++) {
        const option = document.createElement("option");
        option.value = pages[i].id;
        option.text = pages[i].name;
        pageSelect.appendChild(option);
    }
}

function newPageSelect(selectId = null) {
    let newPageSelect = document.createElement("select");
    newPageSelect.className = "form-select form-select-sm wslc flex-grow-0";

    const option = document.createElement("option");
    option.value = 0;
    option.text = "";
    newPageSelect.appendChild(option);
    for (let i = 0; i < pages.length; i++) {
        const option = document.createElement("option");
        option.value = pages[i].id;
        option.text = pages[i].name;
        newPageSelect.appendChild(option);
        if (selectId && selectId == pages[i].id) {
            option.selected = true;
            newPageSelect.value = option.value;
        }
    }

    return newPageSelect;
}
function populatePageSelect2(selectId = null) {
    pageSelect2.innerHTML = "";
    for (let i = 0; i < pages.length; i++) {
        const option = document.createElement("option");
        option.value = pages[i].id;
        option.text = pages[i].name;
        pageSelect2.appendChild(option);
        if (selectId && selectId == pages[i].id) {
            option.selected = true;
            pageSelect2.value = option.value;
        }
    }
}

// Function to update the select element and selectedPageId
function updatePageSelect() {
    populatePageSelect();
    pageSelect.value = selectedPageId;
}

function infoModalShow() {
    infoModal.show();
}

function fixLeftCharacterAfterLoad(){
    for (let key in chatfic.characters) {
        if(key !== "app" && key !== "player"){
            setLeftCharacter(key);
            break;
        }
    }
}

function pagesModalShow() {
    // Populate the modal with pages for editing
    pageList.innerHTML = "";
    for (let i = 0; i < pages.length; i++) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        if (i != 0) {
            li.innerHTML = `
                <span class="align-middle">${pages[i].name}</span>
                <button class="btn btn-primary btn-xs float-end mt-1 ms-2 rename-page-btn">Rename</button>
                <button class="btn btn-danger btn-xs float-end mt-1 ms-2 me-2 remove-page-btn">Remove</button>
            `;
        } else {
            li.innerHTML = `
        <span class="align-middle">${pages[i].name}</span>
            <button class="btn btn-primary btn-xs float-end mt-1 ms-2 rename-page-btn">Rename</button>
        `;
        }
        pageList.appendChild(li);

        if (i != 0) {
            // Add a click event listener to the remove button for each page
            const removeButton = li.querySelector(".remove-page-btn");
            removeButton.addEventListener("click", () => {
                // Remove the page from the array and update the select element
                pages.splice(i, 1);
                selectedPageId = 1; // Reset selectedPageId to the first page
                updatePageSelect();
                // Close the modal
                //pageModal.hide();
                refreshPageOptionsList();
                pagesModalShow();
            });
        }
        const renameButton = li.querySelector(".rename-page-btn");
        renameButton.addEventListener("click", () => {
            // Use the prompt function to get a new name from the user
            const newName = prompt("Enter a new name for the page:", pages[i].name);
            if (newName !== null) {
                pages[i].name = newName;
                updatePageSelect();
                //pageModal.hide();
                refreshPageOptionsList();
                pagesModalShow();
            }
        });
    }

    pageModal.show();
}

editPagesButton.addEventListener("click", () => {
    pagesModalShow();
});
// Function to add a new page
addPageButton.addEventListener("click", () => {
    const newPageName = newPageInput.value.trim();
    if (newPageName !== "") {
        const newPage = {
            id: pages[pages.length - 1].id + 1,
            name: newPageName,
            messages: [],
            options: [],
        };
        pages.push(newPage);
        newPageInput.value = "";
        updatePageSelect();
        refreshPageOptionsList();
        //pageModal.hide();
        pagesModalShow();
    }
});


// Function to add a new page
addPageBySplitButton.addEventListener("click", () => {
    const newPageName = newPageInput.value.trim();
    if (newPageName !== "") {
        const position = parseInt(document.getElementById("position").value);
        if(!position || position < 1){
            alert("You should set a 'new messages position' first!");
            return;
        }

        const newPage = {
            id: pages[pages.length - 1].id + 1,
            name: newPageName,
            messages: [],
            options: [],
        };
        pages.push(newPage);
        newPageInput.value = "";


        let m1 = pages[pages.length - 2].messages.slice(0,position);
        let m2 = pages[pages.length - 2].messages.slice(position);
        pages[pages.length - 2].messages = m1;
        pages[pages.length - 1].messages = m2;

        updatePageSelect();
        refreshPageOptionsList();
        //pageModal.hide();
        pagesModalShow();
        refreshChat();
    }
});

function setCursor(cursorEl) {
    if (cursorEl.className.indexOf("active") === -1) {
        // remove all cursors first
        var cursors = document.querySelectorAll("cursor");
        [].forEach.call(cursors, function (cursor) {
            cursor.classList.remove("active");
        });

        // get message index
        let messageEl = cursorEl.nextElementSibling;
        document.getElementById("position").value =
            messageEl.getAttribute("data-index");
    } else {
        document.getElementById("position").value = 0;
    }
    cursorEl.classList.toggle("active");
}

// Initial population of the select element
populatePageSelect();
// initial tooltip setup
setTooltips();

function toggleMultiplePages() {
    var stff = document.querySelectorAll(".only-if-multiple-pages"),
        i;

    for (i = 0; i < stff.length; ++i) {
        stff[i].classList.toggle("multiple");
    }
    document.body.classList.toggle("multiple");
}

// Event listener for select element change
pageSelect.addEventListener("change", () => {
    selectedPageId = parseInt(pageSelect.value);
});
// window.onbeforeunload = function () {
//     return "Are you sure you want to leave?";
// };
