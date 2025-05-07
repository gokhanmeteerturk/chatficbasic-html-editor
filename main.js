function setTooltips() {
    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
}
var previousAppSelection = "chat"; // only for decorative use.
var clickCount = 0;

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

function setCharacterPickersBasedOnApp(){

    const selectedAppSlug = document.getElementById("messageAppSelector").value;

    if(selectedAppSlug === "photofeed"){
        sideleft.checked=true;
        // document.getElementById("leftCharacterPickerButton").style.display = "none";
        // document.getElementById("sideleft").style.display = "none";
        // document.getElementById("leftCharacterLabel").style.display = "none";
        document.getElementById("leftCharacterPickerButton").classList.add("flex-grow-1");
        document.getElementById("leftCharacterPickerButton").classList.remove("flex-grow-0");
        document.getElementById("sidemiddle").style.display = "none";
        document.getElementById("middleCharacterLabel").style.display = "none";
        document.getElementById("sideright").style.display = "none";
        document.getElementById("rightCharacterLabel").style.display = "none";
        document.getElementById("rightCharacterPickerButton").style.display = "none";
    }
    else{
        // document.getElementById("leftCharacterLabel").style.display = "block";
        document.getElementById("leftCharacterPickerButton").classList.add("flex-grow-0");
        document.getElementById("leftCharacterPickerButton").classList.remove("flex-grow-1");
        document.getElementById("sidemiddle").style.display = "block";
        document.getElementById("middleCharacterLabel").style.display = "block";
        document.getElementById("sideright").style.display = "block";
        document.getElementById("rightCharacterLabel").style.display = "block";
        document.getElementById("rightCharacterPickerButton").style.display = "block";
    }

}

function checkMessageApp(select) {
    const selectedValue = select.value;
  
    if (selectedValue === 'what-is-this') {
      select.value = previousAppSelection;
      showWhatisanappModal();
    } else {
      previousAppSelection = selectedValue;
    }
    setCharacterPickersBasedOnApp();
  }

var defaultTitle = "My Chatfic Story";
var defaultAuthor = "/u/myself";
var defaultHandles = {};
var defaultVariables = {};
var defaultApps = {
    "chat": {"name": "Messages"},
    "photofeed": {"name": "InstaPic"},
    "home": {"name": "Home"} // normally "home" shouldn't be here, we will remove it during output
};
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
    apps: defaultApps,
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
            gender: "female",
            skin: "white",
            hair: {
                color: "black"
            }
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
                app: "chat"
            },
            {
                message: "Hi.",
                from: "player",
                side: 2,
                multimedia: null,
                chatroom: "Jessica",
                app: "chat"
            },
            {
                message:
                    "You can remove these messages\n after hovering over or clicking on them.",
                from: "app",
                side: 1,
                multimedia: null,
                chatroom: "Jessica",
                app: "chat"
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
    gender = null,
    skin = null,
    hairColor = null,
    hairStyle = null,
    eyesColor = null,
    dressSize = null,
    replace = false
) {
    if(hairColor == "") hairColor = null;
    if(hairStyle == "") hairStyle = null;

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
    color && color !== "" ? (chatfic.characters[slug]["color"] = color) : null;
    gender && gender !== "" ? (chatfic.characters[slug]["gender"] = gender) : null;
    skin && skin !== "" ? (chatfic.characters[slug]["skin"] = skin) : null;
    eyesColor && eyesColor !== "" ? (chatfic.characters[slug]["eyes"] = {"color": eyesColor}) : null;
    dressSize && dressSize !== "" ? (chatfic.characters[slug]["dress"] = {"size": dressSize}) : null;

    if(hairColor || hairStyle){
        chatfic.characters[slug]["hair"] = {};
        hairColor && hairColor !== "" ? (chatfic.characters[slug]["hair"]["color"] = hairColor) : null;
        hairStyle && hairStyle !== "" ? (chatfic.characters[slug]["hair"]["style"] = hairStyle) : null;
    }

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
            saveOverCell.innerHTML = `<button onclick="setCharacter('${key}', document.getElementById('newCharacterNameInput').value, document.getElementById('newCharacterColorInput').value, document.getElementById('newCharacterGenderInput').value, document.getElementById('newCharacterSkinInput').value, document.getElementById('newCharacterHairColorInput').value, document.getElementById('newCharacterHairStyleInput').value, document.getElementById('newCharacterEyesInput').value, document.getElementById('newCharacterDressSizeInput').value, true)" class="btn btn-xs btn-success me-2 mt-1 mb-1">Save over this</button>`;
            characterRow.appendChild(saveOverCell);
        }
        const infoCell = document.createElement("div");
        infoCell.className = "flex-grow-1 mt-1 mb-1";
        infoCell.innerHTML = `<span class="d-sm-inline d-block"><b>Slug:</b> ${key}, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Name:</b> ${character.name
        }, </span>`;
        characterRow.appendChild(infoCell);
        if (key != "player" && key != "app") {
            const moreButtonCell = document.createElement("div");
            moreButtonCell.className = "flex-grow-0";
            moreButtonCell.innerHTML = `<button class="btn btn-xs btn-outline-secondary me-2 mt-1 mb-1"
                    type="button" data-bs-toggle="collapse"
                    data-bs-target="#moreInfo${key}" aria-expanded="false"
                    aria-controls="moreInfo${key}">
                show more</button>`;
            characterRow.appendChild(moreButtonCell);
        }
        const moreInfoCell = document.createElement("div");
        if (key != "player" && key != "app") {
        moreInfoCell.className = "collapse good";
        moreInfoCell.id = `moreInfo${key}`;
        moreInfoCell.innerHTML = `<span class="d-sm-inline d-block"><b>Gender:</b> ${character.gender ?? "Not set"}</span>
        <span class="d-sm-inline d-block"><b class="ms-sm-2">Skin:</b> ${character.skin ?? "Not set"}</span>
        <span class="d-sm-inline d-block"><b class="ms-sm-2">Hair Color:</b> ${character.hair ? character.hair.color ?? "Not set" : "Not set"}</span>
        <span class="d-sm-inline d-block"><b class="ms-sm-2">Hair Style:</b> ${character.hair ? character.hair.style ?? "Not set" : "Not set"}</span>
        <span class="d-sm-inline d-block"><b class="ms-sm-2">Eyes:</b> ${character.eyes ? character.eyes.color ?? "Not set" : "Not set"}</span>
        <span class="d-sm-inline d-block"><b class="ms-sm-2">Chest:</b> ${character.dress ? character.dress.size ?? "Not set" : "Not set"}</span>`;}
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
        if (key != "player" && key != "app") {
            characterCard.appendChild(moreInfoCell);
        }
        charactersListInModal.appendChild(characterCard);

        if (key !== "app") {
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


function addMessageCustom(side = 0, message= "", cleaned = false, refresh= false, multimedia = null, app="chat") {
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
                            ? chatfic.characters.hasOwnProperty(characterSlugRight) ?  chatfic.characters[characterSlugRight].name : chatfic.characters[Object.keys(chatfic.characters)[2]].name
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
        app:app,
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
    let appSlug = document.getElementById("messageAppSelector").value;
    if(appSlug == "what-is-this"){appSlug = "chat";}
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
                            ? chatfic.characters.hasOwnProperty(characterSlugRight) ?  chatfic.characters[characterSlugRight].name : chatfic.characters[Object.keys(chatfic.characters)[2]].name
                            : "Jessica"
                    );
                    if (chatroom == null || chatroom == "") {
                        chatroom = "Unknown";
                    }
                }
            }
        }
    }

    if(appSlug != "chat"){
        chatroom = "-";
    }

    // Create message object
    var newMessage = {
        message: message,
        from: characterSlug,
        side: side,
        multimedia: multimedia,
        chatroom: chatroom,
        app: appSlug
    };
    if(appSlug == "photofeed"){
        newMessage.extra = {};
        newMessage.side = 1;
    }
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
function changeMessageText(newText,messageIndex){
    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    page.messages[parseInt(messageIndex)].message=newText;
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

    let pageId = document.getElementById("pageSelect").value;
    let page = pages.find((x) => x.id == pageId);
    let oldMessage = page.messages[parseInt(editMessageIndex)];
    if(oldMessage.app != "chat"){
        newChatroom = "-";
    }

    let updatedMessage = {
        message: newMessage || null,
        from: newFrom || null,
        side: newSide || null,
        multimedia: newMultimedia || null,
        chatroom: newChatroom || null,
        app: oldMessage.app || "chat",
    };
    if(oldMessage.app == "photofeed"){
        const extra = getExtra();
        updatedMessage.extra = extra;
        updatedMessage.side = 1;
    }
    if(document.getElementById('thoughttype').checked){
        updatedMessage.type = "thought";
    }
    // Update the page.messages array with the updated message
    page.messages[parseInt(editMessageIndex)] = updatedMessage;
    // Step 5: Run the refreshChat function
    refreshChat();
    // Hide the modal after saving
    editMessageModal.hide();
}
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }
  function buildUsingExtra(extra) {
    const likesInput = document.getElementById('likesInput');
    const commentsContainer = document.getElementById('commentsContainer');

    // 1. Update Likes
    if (likesInput) {
      if (extra && typeof extra.likes === 'number') {
        likesInput.value = extra.likes;
      } else {
        likesInput.value = 0; // Default to 0 if likes is not provided or not a number
      }
    }

    // 2. Recreate Comments
    if (commentsContainer) {
      commentsContainer.innerHTML = ''; // Clear any existing comments

      if (extra && Array.isArray(extra.comments)) {
        extra.comments.forEach(commentObject => {
          if (typeof commentObject === 'object' && commentObject !== null) {
            const usernames = Object.keys(commentObject);
            if (usernames.length > 0) {
              const username = usernames[0]; // Takes the first key as username
              const commentText = commentObject[username];

              const newCommentRow = document.createElement('div');
              newCommentRow.className = 'input-group input-group-sm mb-2 comment-row';
              newCommentRow.innerHTML = `
                <input type="text" class="form-control form-control-sm comment-username" placeholder="Username" value="${escapeHTML(username)}">
                <input type="text" class="form-control form-control-sm comment-text" placeholder="Comment text" value="${escapeHTML(commentText)}">
                <button class="btn btn-danger btn-sm delete-comment-btn" type="button" onclick="deleteComment(this)">Delete</button>
              `;
              commentsContainer.appendChild(newCommentRow);
            }
          }
        });
      }
      // If extra.comments is not an array or is empty, the commentsContainer will remain empty.
      // The user can then use the "Add Comment" button to add new comments if desired.
    }
  }
let editMessageModal;
document.addEventListener("DOMContentLoaded", function () {
    editMessageModal = new bootstrap.Modal(document.getElementById("editMessageModal"));

    document.getElementById("saveMessageButton").addEventListener("click", function () {
        saveMessageFromEditModal();
      });
});
function addComment() {
    const commentsContainer = document.getElementById('commentsContainer');
    const newCommentRow = document.createElement('div');
    newCommentRow.className = 'input-group input-group-sm mb-2 comment-row';
    newCommentRow.innerHTML = `
      <input type="text" class="form-control form-control-sm comment-username" placeholder="Username">
      <input type="text" class="form-control form-control-sm comment-text" placeholder="Comment text">
      <button class="btn btn-danger btn-sm delete-comment-btn" type="button" onclick="deleteComment(this)">Delete</button>
    `;
    commentsContainer.appendChild(newCommentRow);
  }

  function deleteComment(buttonElement) {
    const commentRow = buttonElement.closest('.comment-row');
    if (commentRow) {
      commentRow.remove();
    }
  }
  function getExtra() {
    const likes = parseInt(document.getElementById('likesInput').value) || 0;
    const comments = [];
    const commentRows = document.getElementById('commentsContainer').getElementsByClassName('comment-row');

    for (let i = 0; i < commentRows.length; i++) {
      const row = commentRows[i];
      const usernameInput = row.querySelector('.comment-username');
      const commentTextInput = row.querySelector('.comment-text');

      const username = usernameInput.value.trim();
      const commentText = commentTextInput.value.trim();

      if (username && commentText) { // Only add if both username and comment are present
        comments.push({ [username]: commentText });
      } else if (username || commentText) { // If one is filled, but not the other, you might want to handle this
        console.warn("Partial comment found, skipping:", {username, commentText});
      }
    }

    return {
      likes: likes,
      comments: comments
    };
  }
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

    document.getElementById('thoughttype').checked = message.hasOwnProperty("type") && message.type == "thought" ? true : false;

    if(message.app == "chat"){
        document.getElementById("chatroominputgroup").style.display = "flex";
        document.getElementById("quickemojipicker").style.display = "flex";
    }
    else{
        document.getElementById("chatroominputgroup").style.display = "none";
        document.getElementById("quickemojipicker").style.display = "none";
    }
    if(message.app == "photofeed"){
        document.getElementById("likesandcomments").style.display = "block";
        document.getElementById("sideinputgroup").style.display = "none";
        buildUsingExtra(message.extra);
    }
    else{
        document.getElementById("likesandcomments").style.display = "none";
        document.getElementById("sideinputgroup").style.display = "block";
    }
    

    auto_height(document.getElementById("messageInput"));
  }

  function flipMessages(messageIndex){
    const pageId = document.getElementById("pageSelect").value;
    const page = pages.find((x) => x.id == pageId);
    let chatroomName = null;

    const pageMessagesLength = page.messages.length;
    for (let i = 0; i < pageMessagesLength; i++) {
        if(i<messageIndex){
            continue;
        }
        if(i===messageIndex){
            chatroomName = page.messages[i].chatroom;
        }
        if(page.messages[i].chatroom === chatroomName){
            const currentSide = page.messages[i].side;
            const newSides = [2, currentSide, 0]; // 0->2, 1->no change, 2->0
            page.messages[i].side = newSides[currentSide];
        }
        else{
            break;
        }
    }
    refreshChat();
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
    let isChatMessage = true;
    let isPhotoFeedMessage = false;
    let isLocationMessage = false;
    let isAppMessage = false;
    let lastAdded = null;
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

        if(messageObject.hasOwnProperty("app")){
            if(messageObject.app == "chat"){
                isChatMessage = true;
                isPhotoFeedMessage = false;
                isLocationMessage = false;
                isAppMessage = false;
            }
            else if(messageObject.app == "photofeed"){
                isChatMessage = false;
                isPhotoFeedMessage = true;
                isLocationMessage = false;
                isAppMessage = true;
            }
            else if(messageObject.app == "home"){
                isChatMessage = false;
                isPhotoFeedMessage = false;
                isLocationMessage = false;
                isAppMessage = true;
            }
            else{
                isChatMessage = false;
                isPhotoFeedMessage = false;
                isLocationMessage = true;
                isAppMessage = false;
            }
        }
        else{
            isChatMessage = true;
            isPhotoFeedMessage = false;
            isLocationMessage = false;
            isAppMessage = false;
        }

        // create chatroom header if needed:
        let appName = "";
        if(!isChatMessage){
            try{
                appName = chatfic.apps[messageObject.app].name;
            }
            catch(e){
                appName = messageObject.app;
            }
            if(previousMessage == null || !previousMessage.hasOwnProperty("app") || previousMessage.app != messageObject.app){
                if(lastAdded){
                    lastAdded.classList.add("group-end");
                }
                const appHeader = document.createElement("div");
                if(isAppMessage){
                    appHeader.className = "sticky-top app-header";
                }
                else{ // isLocationMessage == true
                    appHeader.className = "sticky-top location-header";
                }
                appHeader.innerText = appName;
                appHeader.innerHTML += `&nbsp;&nbsp;&nbsp;<span style="cursor: pointer;color:red;" onclick="showWhatisanappModal();">(?)</span>`;
                chatContainer.appendChild(appHeader);
            }
        }
        else if (
            previousMessage == null ||
            previousMessage.chatroom != messageObject.chatroom
        ) {
            if(lastAdded){
                lastAdded.classList.add("group-end");
            }
            const chatroomHeader = document.createElement("div");
            chatroomHeader.className = "sticky-top chatroom-header";
            chatroomHeader.innerText = messageObject.chatroom;

            const chatroomActionsMenu = document.createElement("div");
            chatroomActionsMenu.className = "chatroom-actions-menu";
            chatroomActionsMenu.innerHTML = `<div class="dropdown">
  <button class="btn btn-light btn-sm" type="button" id="dropdownMenu${i}" data-bs-toggle="dropdown" aria-expanded="false">
    <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-three-dots-vertical">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
  </button>
  <ul class="dropdown-menu list-group-sm" aria-labelledby="dropdownMenu${i}">
    <li><button onclick="flipMessages(${i})" class="dropdown-item list-group-item" type="button">Flip message sides</button></li>
<!--    <li><button class="dropdown-item list-group-item" type="button">Another action</button></li>-->
<!--    <li><button class="dropdown-item list-group-item" type="button">Something else here</button></li>-->
  </ul>
</div>`;

            chatroomHeader.appendChild(chatroomActionsMenu);
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

        messageContainer.className += (isAppMessage ? " app" : isLocationMessage ? " location" : "");
        if(messageObject.hasOwnProperty("type") && messageObject.type == "thought"){
            messageContainer.className += " thought";
        }

        const messageDiv = document.createElement("div");

        let setAuthor = false;
        if (
            previousMessage == null ||
            previousMessage.chatroom != messageObject.chatroom ||
            previousMessage.from != messageObject.from ||
            previousMessage.side != messageObject.side ||
            ((previousMessage.hasOwnProperty("type") ? previousMessage.type : null) != (messageObject.hasOwnProperty("type") ? messageObject.type : null) )
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
        else{
            if(isPhotoFeedMessage){
                const fromSpan = document.createElement("span");
                // console.log(messageObject);
                // console.log(messageObject.from);
                fromSpan.innerText = "New " + appName + " post from " + chatfic.characters[messageObject.from].name + ":";
                fromSpan.className = "author app";
                chatContainer.appendChild(fromSpan);
            }
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

        if(messageObject.message != null){

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

        // after variable check, if message has more text after last variable, add this remaining text to the message bubble:
        if(previousLastIndex < messageObject.message.length){
            const textNode = document.createTextNode(messageObject.message.substring(previousLastIndex));
            messageText.appendChild(textNode);
        }

        }

        messageText.addEventListener('click', function(e) {
             clickCount++;
            if (clickCount === 1) {
                singleClickTimer = setTimeout(function() {
                    clickCount = 0;
                }, 400);
            } else if (clickCount === 2 && this.getAttribute('contenteditable') !== 'true') {
                clearTimeout(singleClickTimer);
                clickCount = 0;

            // Make the span contenteditable on double click
            this.setAttribute('contenteditable', 'true');
            this.setAttribute('title', 'Click enter or elsewhere to save');
            this.focus();

                    // Move the cursor to the end of the text
                try {
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(this);
                    range.collapse(false);  // Collapse the range to the end of the content
                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (error) {
                    console.error(error);
                }

                showEmojiPickerOpener(this);

                //openEmojiPicker();

            // Add event listener for keydown to detect the "enter" key
            this.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();  // Prevent the default action (inserting a newline)
                    this.removeAttribute('contenteditable');  // Disable contenteditable

                    // Get the data-index value from the grandparent element
                    let dataIndex = this.parentElement.parentElement.getAttribute('data-index');

                    // Call the updateMemoryText function with the new innerText and data-index
                    changeMessageText(this.innerText, dataIndex);
                    closeEmojiPicker();
                }
            });

             this.addEventListener('blur', function(event) {
            // Check if the new focus is on the emoji picker div or its siblings
            if (!event.relatedTarget || (!document.getElementById('emojipickerdiv').contains(event.relatedTarget) && !this.parentNode.parentNode.contains(event.relatedTarget))) {
                // If not, trigger the same actions as pressing "Enter"
                this.removeAttribute('contenteditable');  // Disable contenteditable
                // Get the data-index value from the grandparent element
                let dataIndex = this.parentElement.parentElement.getAttribute('data-index');

                // Call the updateMemoryText function with the new innerText and data-index
                changeMessageText(this.innerText, dataIndex);
                closeEmojiPicker();
            }
        });


            }

        });

        addCursorTracking(messageText);
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
        lastAdded = messageContainer;
        chatContainer.appendChild(messageContainer);
    }
    if(lastAdded){
        lastAdded.classList.add("group-end");
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
function auto_height(elem) {
    console.log(elem.value);
    const singleLine = elem.value.replace(/[\r\n]+/g," ");
    if(singleLine !== elem.value){
        elem.value = singleLine;
    }
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}
function handleEditMessageKeyPress(e){
 var key=e.keyCode || e.which;
  if (key==13){
      auto_height(e.target);
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
        if(messageEl.getAttribute("data-index") === null){
            messageEl = messageEl.nextElementSibling;
        }
        if(messageEl.getAttribute("data-index") === null){
            messageEl = messageEl.nextElementSibling;
        }
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

      function insertTextAtCursor(text) {
          const parentEl = getSelectionParentElement();
          if(!parentEl.classList.contains("message-text")){
              alert("No cursor! Remember to focus on the text when selecting emojis.")
              return;
          }
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);

    // Check if the selection is within a contenteditable element
    if (selection.rangeCount && range) {
        // Delete any selected text first
        range.deleteContents();

        // Create a text node for the text to be inserted
        let textNode = document.createTextNode(text);

        // Insert the text node at the current cursor position
        range.insertNode(textNode);

        // Move the cursor to the end of the inserted text node
        range.setStartAfter(textNode);
        range.collapse(true);

        // Update the selection to reflect the new cursor position
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
function addCursorTracking(element) {
    // Function to update the cursor position
    function updateCursorPosition() {
        if (element.selectionStart !== undefined) {
            console.log(element.selectionStart);
            // Store the current cursor position in a data attribute
            element.setAttribute('data-cursor-position', element.selectionStart);
        }
        else{
            const pos = getCaretPosition(element);
            if (pos !== undefined) {
                console.log(pos);
                element.setAttribute('data-cursor-position', pos);
            }
            else{
                console.log("undefined cursor for element");
                console.log(element);
            }
        }
    }

    // Add event listeners to track cursor position
    element.addEventListener("click", updateCursorPosition);
    element.addEventListener("keyup", updateCursorPosition);
}
function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}
function getCaretPosition(editableDiv) {
  // this function is from https://stackoverflow.com/a/397612
  // by Tim Down
  // CC BY-SA 4.0
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

let appLocationModalInstance = null;
let mediaPickerModalInstance = null;
let currentEditingLocationKey = null; 



/* start apps modal */

document.addEventListener('DOMContentLoaded', () => {
    const appLocationModalEl = document.getElementById('appLocationModal');
    if (appLocationModalEl) {
        appLocationModalInstance = new bootstrap.Modal(appLocationModalEl);
        // Update chatFicOutput when modal is closed to see changes
        appLocationModalEl.addEventListener('hidden.bs.modal', () => {
            updateChatFicOutput();
        });
    }
    const mediaPickerModalEl = document.getElementById('mediaPickerModal');
    if (mediaPickerModalEl) {
        mediaPickerModalInstance = new bootstrap.Modal(mediaPickerModalEl);
    }
    
    document.getElementById('manageAppsLocationsBtn').addEventListener('click', showAppLocationModal);
    updateChatFicOutput(); // Initial display of chatfic.apps
});

function updateChatFicOutput() {
    updateAppSelector();
}

// --- Main Modal Logic ---
function showAppLocationModal() {
    if (!appLocationModalInstance) {
        console.error("App/Location Modal not initialized.");
        return;
    }

    const modalBody = document.getElementById('appLocationModalBody');
    modalBody.innerHTML = ''; // Clear previous content to reconstruct

    // --- Apps Section ---
    const appsSection = document.createElement('div');
    appsSection.classList.add('mb-4');
    appsSection.innerHTML = `
        <h6>Core Apps</h6>
        <p class="text-muted small">Manage display names for built-in applications.</p>
    `;
    const appsContainer = document.createElement('div');
    appsContainer.classList.add('list-group');

    const coreAppKeys = ["chat", "photofeed", "home"];
    coreAppKeys.forEach(appKey => {
        if (chatfic.apps[appKey]) {
            const app = chatfic.apps[appKey];
            const appDiv = document.createElement('div');
            appDiv.classList.add('list-group-item');
            
            const isHomeApp = appKey === 'home';
            appDiv.innerHTML = `
                <div class="row align-items-center">
                   <div class="col-7 col-md-3">
                        <b>${app.name}</b>
                   </div>
                   <div class="col-5 col-md-3 order-1 order-md-5 text-end">
                        <small class="text-muted small-text text-end">Key: <code>${appKey}</code></small>
                   </div>
                   <div class="col-12 col-md-6 order-5 order-md-1">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text" style="font-size: 0.9em;">Name</span>
                            <input type="text" class="form-control form-control-sm app-name-input" value="${app.name}" 
                                data-app-key="${appKey}" ${isHomeApp ? 'readonly' : ''}>
                            ${!isHomeApp ? `<button class="btn btn-outline-primary btn-sm save-app-name-btn" data-app-key="${appKey}">Save</button>` : ''}
                        </div>
                   </div>
                </div>
            `;
            appsContainer.appendChild(appDiv);
        }
    });
    appsSection.appendChild(appsContainer);
    modalBody.appendChild(appsSection);

    // --- Locations Section ---
    const locationsSection = document.createElement('div');
    locationsSection.innerHTML = `
        <h6>Custom Locations</h6>
    `;
    const locationsContainer = document.createElement('div');
    locationsContainer.id = 'locationsContainer'; // For easy refresh
    locationsContainer.classList.add('list-group', 'mb-3');
    
    renderLocations(locationsContainer); // Populate existing locations
    locationsSection.appendChild(locationsContainer);

    // Add new location form
    const addLocationForm = document.createElement('div');
    addLocationForm.classList.add('mt-1', 'p-2', 'border', 'rounded', 'bg-light-subtle'); // Bootstrap 5.3 class
    addLocationForm.innerHTML = `
        <b>Add New Location</b>
        <div class="mb-2">
            <label for="newLocationName" class="form-label">Location Display Name</label>
            <div class="input-group input-group-sm">
                <span class="input-group-text" style="font-size: 0.9em;">Name</span>
                <input type="text" class="form-control form-control-sm" id="newLocationName" placeholder="e.g., Park, Haunted Mansion, Cafe">
        <button type="button" class="btn btn-sm btn-success" id="addNewLocationBtn">Add</button>
            </div>
        </div>
    `;
    locationsSection.appendChild(addLocationForm);
    modalBody.appendChild(locationsSection);

    attachAppLocationModalListeners(modalBody); 
    appLocationModalInstance.show();
}

function renderLocations(container) {
    container.innerHTML = ''; // Clear existing locations before rendering

    let hasCustomLocations = false;
    Object.keys(chatfic.apps).forEach(appKey => {
        if (!["chat", "photofeed", "home"].includes(appKey)) {
            hasCustomLocations = true;
            const location = chatfic.apps[appKey];
            const locationItem = document.createElement('div');
            locationItem.classList.add('list-group-item', 'location-entry');
            locationItem.dataset.locationKey = appKey;

            const bgFileName = location.background || "Not set";
            const bgImageSrc = location.background && mediaFileSrcList[location.background] 
                               ? mediaFileSrcList[location.background] 
                               : null;
            
            const bgDisplay = bgImageSrc
                ? `<img src="${bgImageSrc}" alt="${location.background}" style="max-height: 40px; max-width: 70px; margin-right: 8px;"> ${location.background}`
                : '<span class="text-muted">No background image set</span>';

            locationItem.innerHTML = `
                <div class="row align-items-center">
                   <div class="col-7 col-md-3">
                        <b>${location.name}</b>
                   </div>
                   <div class="col-5 col-md-3 order-1 order-md-5 text-end">
                    <button class="btn btn-sm ms-1 float-end btn-outline-danger delete-location-btn" data-location-key="${appKey}" title="Delete Location">&times;</button>
                       <!-- <small class="text-muted small-text text-end">Key: <code>${appKey}</code></small> -->
                   </div>
                   <div class="col-12 col-md-6 order-5 order-md-1">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text" style="font-size: 0.9em;">Name</span>
                            <input type="text" class="form-control form-control-sm location-name-input" value="${location.name}" 
                                data-location-key="${appKey}">
                            <button class="btn btn-outline-primary btn-sm save-location-name-btn" data-location-key="${appKey}">Save</button>
                        </div>
                   </div>
                </div>
                <div class="mt-2">
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1 current-background-display mb-2 p-2 border rounded bg-white d-flex align-items-center" style="min-height: 50px;">
                        ${bgDisplay}
                    </div>
                    <div class="flex-grow-0 btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-secondary set-background-btn ms-2" data-location-key="${appKey}">Set/Change</button>
                        ${location.background ? `<button type="button" class="btn btn-outline-warning remove-background-btn" data-location-key="${appKey}">Remove</button>` : ''}
                    </div>
                    </div>
                </div>
            `;
            container.appendChild(locationItem);
        }
    });
    if (!hasCustomLocations) {
        container.innerHTML = '<p class="list-group-item text-muted text-small">No custom locations added yet. Use the form below to add one.</p>';
    }
}

// --- Event Listener Management & Handlers ---
// Helper to remove and re-add listeners to avoid duplicates on dynamic content
function rebindEventListener(element, eventType, handlerFunction) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    newElement.addEventListener(eventType, handlerFunction);
    return newElement; // Return the new element in case the caller needs it
}

function attachAppLocationModalListeners(scopeElement) {
    scopeElement.querySelectorAll('.save-app-name-btn').forEach(button => {
        if(button.parentNode){
            rebindEventListener(button, 'click', handleSaveAppName);
        }
    });
    scopeElement.querySelectorAll('.save-location-name-btn').forEach(button => {
        if(button.parentNode){
        rebindEventListener(button, 'click', handleSaveLocationName);
    }
    });
    scopeElement.querySelectorAll('.delete-location-btn').forEach(button => {
        if(button.parentNode){
        rebindEventListener(button, 'click', handleDeleteLocation);
    }
    });
    scopeElement.querySelectorAll('.set-background-btn').forEach(button => {
        if(button.parentNode){
        rebindEventListener(button, 'click', handleSetBackground);
    }
    });
    scopeElement.querySelectorAll('.remove-background-btn').forEach(button => {
        if(button.parentNode){
        rebindEventListener(button, 'click', handleRemoveBackground);
    }
    });
    
    const addNewLocationBtn = scopeElement.querySelector('#addNewLocationBtn');
    if(addNewLocationBtn) {
        if(addNewLocationBtn.parentNode){
        rebindEventListener(addNewLocationBtn, 'click', handleAddNewLocation);
    }
    }
}

function handleSaveAppName(e) {
    const appKey = e.target.dataset.appKey;
    const inputElement = document.querySelector(`#appLocationModalBody .app-name-input[data-app-key="${appKey}"]`);
    const newName = inputElement.value.trim();

    if (appKey === 'home') return; // Should be caught by readonly, but defensive check

    if (newName.length > 0 && chatfic.apps[appKey]) {
        chatfic.apps[appKey].name = newName;
        chatfic.modified = Date.now();
        // Update the H5 title in the modal directly
        const h5 = inputElement.closest('.list-group-item').querySelector('h5');
        if (h5) h5.textContent = newName;
        alertToast(`App "${appKey}" name updated to "${newName}".`);
    } else {
        alertToast("App name cannot be empty.");
        inputElement.value = chatfic.apps[appKey].name; // Revert
    }
}

function handleSaveLocationName(e) {
    const locationKey = e.target.dataset.locationKey;
    const inputElement = document.querySelector(`#appLocationModalBody .location-name-input[data-location-key="${locationKey}"]`);
    const newName = inputElement.value.trim();

    if (newName.length > 1 && chatfic.apps[locationKey]) {
        chatfic.apps[locationKey].name = newName;
        chatfic.modified = Date.now();
        // Update the H5 title in the modal directly for this location
        const h5 = inputElement.closest('.location-entry').querySelector('h5.location-display-name');
        if(h5) h5.textContent = newName;
        alertToast(`Location name for key "${locationKey}" updated to "${newName}".`);
        // No full re-render needed if only name changes and is updated locally
    } else {
        alertToast("Location name must be at least 2 characters long.");
        inputElement.value = chatfic.apps[locationKey].name; // Revert
    }
}

function handleDeleteLocation(e) {
    const locationKey = e.target.dataset.locationKey;
    const locationName = chatfic.apps[locationKey]?.name || locationKey;
    let anyPageMessageHasThisApp = false;
    pages.forEach(page => {
        if(page.messages.some(message => message.app === locationKey)){
            anyPageMessageHasThisApp = true;
        }
    });
    if(anyPageMessageHasThisApp){
        alertToast(`Cannot delete location "${locationName}" (key: ${locationKey}) because it is used in one or more messages. Delete any messages using this location first.`);
        return;
    }

    if (confirm(`Are you sure you want to delete location "${locationName}" (key: ${locationKey})? This cannot be undone.`)) {
        delete chatfic.apps[locationKey];
        chatfic.modified = Date.now();
        updateAppSelector();
        alertToast(`Location "${locationName}" deleted.`);
        renderLocations(document.getElementById('locationsContainer')); // Re-render this section
        attachAppLocationModalListeners(document.getElementById('appLocationModalBody'));// Re-attach for the whole modal (or just locations part)
    }
}

function updateAppSelector(){
    const oldValue = document.getElementById("messageAppSelector").value;
    document.getElementById("messageAppSelector").innerHTML =
    Object.entries(chatfic.apps).map(([value, { name }]) =>
    `<option value="${value}">${name}</option>`
    ).join('') +
    `<option value="what-is-this">what is this?</option>`;
    if(oldValue && chatfic.apps[oldValue]){
        document.getElementById("messageAppSelector").value = oldValue;
    }
    setCharacterPickersBasedOnApp();
}

function handleSetBackground(e) {
    currentEditingLocationKey = e.target.dataset.locationKey;
    showMediaPickerModal();
}

function handleRemoveBackground(e) {
    const locationKey = e.target.dataset.locationKey;
    if (chatfic.apps[locationKey] && chatfic.apps[locationKey].background) {
        const locationName = chatfic.apps[locationKey].name;
        delete chatfic.apps[locationKey].background; 
        chatfic.modified = Date.now();
        alertToast(`Background removed for location "${locationName}".`);
        renderLocations(document.getElementById('locationsContainer'));
        attachAppLocationModalListeners(document.getElementById('appLocationModalBody'));
    }
}

function handleAddNewLocation() {
    const newLocationNameInput = document.getElementById('newLocationName');
    const newLocationName = newLocationNameInput.value.trim();

    if (newLocationName.length <= 1) {
        alertToast("New location name must be at least 2 characters long.");
        newLocationNameInput.focus();
        return;
    }
    
    // Generate a unique key: sanitize name + timestamp + fallback random string
    let baseKey = newLocationName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (!baseKey) baseKey = 'custom_location'; // Handle cases where name is all special chars

    let newLocationKey = `${baseKey}_${Date.now().toString(36)}`;
    let attempt = 0;
    while(chatfic.apps[newLocationKey] && attempt < 10) { // Prevent infinite loop
        newLocationKey = `${baseKey}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,7)}`;
        attempt++;
    }
    if (chatfic.apps[newLocationKey]) { // Extremely unlikely fallback
         newLocationKey = `location_fallback_${Date.now().toString(36)}${Math.random().toString(36).substring(2,7)}`;
    }


    chatfic.apps[newLocationKey] = { name: newLocationName }; // Background is undefined initially
    chatfic.modified = Date.now();
    newLocationNameInput.value = ''; // Clear input
    renderLocations(document.getElementById('locationsContainer'));
    attachAppLocationModalListeners(document.getElementById('appLocationModalBody'));
}
function alertToast(text) {
    // Get the modal element
    const alertModalEl = document.getElementById('alertToastModal');

    if (alertModalEl) {
        // Get the modal body element
        const modalBody = alertModalEl.querySelector('.modal-body');

        // Update the modal body content
        if (modalBody) {
            modalBody.textContent = text;
        }

        // Get or create a Bootstrap modal instance
        const alertModal = bootstrap.Modal.getOrCreateInstance(alertModalEl);

        // Show the modal
        alertModal.show();
    } else {
        console.error("Modal element with ID 'alertToastModal' not found.");
        // Fallback to the browser's built-in alert if modal element is missing
        alert(text);
    }
}
// --- Media Picker Modal Logic ---
function showMediaPickerModal() {
    if (!mediaPickerModalInstance) {
        console.error("Media Picker Modal not initialized.");
        return;
    }
    if (!currentEditingLocationKey || !chatfic.apps[currentEditingLocationKey]) {
        console.error("No valid location key set for media picking, or location does not exist.");
        alertToast("Error: Could not identify the location to set background for.");
        return;
    }

    const mediaPickerBody = document.getElementById('mediaPickerModalBody');
    mediaPickerBody.innerHTML = '<p class="text-muted p-3 text-center">Loading images...</p>'; 

    const imageGrid = document.createElement('div');
    imageGrid.className = 'row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3'; // Responsive grid

    let foundImages = false;
    mediaFiles.forEach(mediaFile => {
        // Check if a mediaFile is not a video file
        const isVideo = mediaFile.name.toLowerCase().endsWith(".mp4") ||
                        mediaFile.name.toLowerCase().endsWith(".webm");
        
        if (!isVideo && mediaFileSrcList[mediaFile.name]) {
            foundImages = true;
            const col = document.createElement('div');
            col.className = 'col';
            
            const card = document.createElement('div');
            card.className = 'card h-100 selectable-media text-center shadow-sm';
            card.style.cursor = 'pointer';
            card.dataset.fileName = mediaFile.name;

            const img = document.createElement('img');
            img.src = mediaFileSrcList[mediaFile.name];
            img.className = 'card-img-top p-2'; // Padding around image within card
            img.style.objectFit = 'contain'; 
            img.style.maxHeight = '120px'; 
            img.alt = mediaFile.name;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body p-2';
            
            const cardTitle = document.createElement('p');
            cardTitle.className = 'card-text small text-truncate m-0';
            cardTitle.textContent = mediaFile.name;
            cardTitle.title = mediaFile.name; // Show full name on hover

            cardBody.appendChild(cardTitle);
            card.appendChild(img);
            card.appendChild(cardBody);
            
            card.addEventListener('click', () => handleMediaSelection(mediaFile.name));

            col.appendChild(card);
            imageGrid.appendChild(col);
        }
    });

    if (!foundImages) {
        mediaPickerBody.innerHTML = '<p class="text-center text-muted p-3">No suitable images found in media files. Videos are excluded.</p>';
    } else {
        mediaPickerBody.innerHTML = ''; // Clear "Loading..."
        mediaPickerBody.appendChild(imageGrid);
    }
    mediaPickerModalInstance.show();
}

function handleMediaSelection(selectedFileName) {
    if (currentEditingLocationKey && chatfic.apps[currentEditingLocationKey]) {
        chatfic.apps[currentEditingLocationKey].background = selectedFileName;
        chatfic.modified = Date.now();
        mediaPickerModalInstance.hide();
        const locationName = chatfic.apps[currentEditingLocationKey].name;
        alertToast(`Background for location "${locationName}" set to "${selectedFileName}".`);
        
        renderLocations(document.getElementById('locationsContainer'));
        attachAppLocationModalListeners(document.getElementById('appLocationModalBody')); 
    } else {
        console.error("Error setting background: No location key or location not found during selection handling.");
        mediaPickerModalInstance.hide(); // Still hide picker
    }
    currentEditingLocationKey = null; // Reset after use
}


/* end apps modal */

function emojiSelected(emoji){
  insertTextAtCursor(emoji);
}

      function closeEmojiPicker(){
        document.getElementById("emojipickerdiv").style.display = "none";
      }
      function showEmojiPickerOpener(messageTextEl){
          const messageEl = messageTextEl.parentNode;
          // create an emoji picker opening button on the corner of this element, so when clicked it can run openEmojiPicker():
          const emojiPickerOpener = document.createElement("div");
          emojiPickerOpener.classList.add("emoji-picker-opener");
          emojiPickerOpener.innerHTML = "🙂";
          emojiPickerOpener.addEventListener("click", () => {


              const cursorPosition = parseInt(messageTextEl.getAttribute('data-cursor-position'), 10);
              console.log({cursorPosition})
            openEmojiPicker();
            messageTextEl.focus();

           if(cursorPosition || cursorPosition === 0){

                var range = document.createRange()
                var sel = window.getSelection()

                range.setStart(messageTextEl.childNodes[0], cursorPosition)
                range.collapse(true)

                sel.removeAllRanges()
                sel.addRange(range)

              //setCaretPosition(messageTextEl, cursorPosition);
            }
            else{
               //setCaretPosition(messageTextEl, messageTextEl.innerText.length);
            }


          });
          messageEl.appendChild(emojiPickerOpener);
      }
      function openEmojiPicker(){
        document.getElementById("emojipickerdiv").style.display = "block";
      }

