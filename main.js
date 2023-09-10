function setTooltips(){
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

var defaultTitle = "My Chatfic Story";
var defaultAuthor = "/u/myself";
var defaultPatreonusername = "mypatreonusername";
var defaultDescription = "Welcome to My Chatfic Story, a story of love, lust, and several other things.";
var chatfic = {
    //globalidentifier: "a8gd56ar8d",
    //serverslug: "afterdark",
    title: defaultTitle,
    description: defaultDescription,
    author: defaultAuthor,
    patreonusername: defaultPatreonusername,
    modified: 0,
    episodes: 1,
    episode: 1,
    characters: {
        player: {
            name: "John"
        },
        jessica: {
            name: "Jessica",
            color: "black"
        },
    }
};
var storyInfoComplete = false;
var storyInfoMistakes = [];

let pages = [{id:1, name:'initial', messages:[], options:[]}];
let selectedPageId = 1;


const storyInfoCompleteLabel = document.getElementById("storyInfoComplete");

function setModified() {
    chatfic.modified = new Date().getTime();
    if(document.getElementById('cf-modified')){
        document.getElementById('cf-modified').innerText = chatfic.modified;
    }
}
function setEpisode(episode) {
    chatfic.episode = episode;
    if(document.getElementById('cf-episode')){
        document.getElementById('cf-episode').innerText = chatfic.episode;
    }
    checkChatfic();
}
function setEpisodes(episodes) {
    chatfic.episodes = episodes;
    document.getElementById('cf-episodes').innerText = chatfic.episodes;
    checkChatfic();
}
function setTitle(title) {
    chatfic.title = title;
    document.getElementById('cf-title').innerText = chatfic.title;
    checkChatfic();
}
function setDescription(description) {
    chatfic.description = description;
    if(document.getElementById('cf-description')){
        document.getElementById('cf-description').innerText = chatfic.description;
    }
    checkChatfic();
}
function setAuthor(author) {
    chatfic.author = author;
    if(document.getElementById('cf-author')){
        document.getElementById('cf-author').innerText = chatfic.author;
    }
    checkChatfic();
}
function setPatreonusername(patreonusername) {
    chatfic.patreonusername = patreonusername;
    if(document.getElementById('cf-patreonusername')){
        document.getElementById('cf-patreonusername').innerText = chatfic.patreonusername;
    }
    checkChatfic();
}
function setCharacter(slug, name, color = null, avatar = null, replace=false) {
    if(name.trim().length <3 || slug.length < 3){
        alert('character name and slug can\'t be shorter than 3 characters');
        return;
    }
    // adds new character too, if doesn't exist. 
    if(replace == false && chatfic.characters.hasOwnProperty(slug)){
        alert('Character exists already');
        return;
    }
    chatfic.characters[slug] = {};
    chatfic.characters[slug]['name'] = name.trim();
    color && color != "" ? chatfic.characters[slug]['color'] = color : null;
    avatar && avatar != "" ? chatfic.characters[slug]['avatar'] = avatar : null;
    refreshCharacters();
    checkChatfic();
}
function checkChatfic() {
    storyInfoMistakes = [];
    setModified();
    if(chatfic.title == defaultTitle) storyInfoMistakes.push('Title: you didn\'t change the default title');
    if(chatfic.description == defaultDescription) storyInfoMistakes.push('Description: you didn\'t change the default description');
    if(chatfic.author == defaultAuthor) storyInfoMistakes.push('Author: you didn\'t change the default author');
    if(chatfic.patreonusername == defaultPatreonusername) storyInfoMistakes.push('Patreon Username: you didn\'t change the default patreon username');
    if(chatfic.title.length < 3) storyInfoMistakes.push('Title: should be at least 3 characters long.');
    if(chatfic.description.length < 3) storyInfoMistakes.push('Description: should be at least 3 characters long.');
    if(chatfic.author.length < 3) storyInfoMistakes.push('Author: should be at least 3 characters long.');
    if(chatfic.patreonusername.length < 3) storyInfoMistakes.push('Patreon Username: should be at least 3 characters long.');


    document.getElementById('missingInfo').innerHTML='';
    if (storyInfoMistakes.length == 0) {
        storyInfoComplete = true;
        storyInfoCompleteLabel.innerHTML='complete';
        storyInfoCompleteLabel.className='text-success';
        document.getElementById('whatsmissingbutton').style.display='none';
    }
    else{
        storyInfoComplete = false;
        storyInfoCompleteLabel.innerHTML='incomplete';
        storyInfoCompleteLabel.className='text-danger';
        let listText ='';
        storyInfoMistakes.forEach(mistakeText => {
            listText = listText+`<li class="small">${mistakeText}</li>`;
        });
        document.getElementById('missingInfo').innerHTML=listText;
        document.getElementById('whatsmissingbutton').style.display='inline-block';
    }
}
function refreshCharacters() {
    const charactersListInModal = document.getElementById('charactersListInModal');
    charactersListInModal.innerHTML='';
    for (let key in chatfic.characters) {
        const character = chatfic.characters[key];

        const characterCard = document.createElement("li");
        characterCard.className = "list-group-item small";

        const characterRow = document.createElement('div');
        characterRow.className='d-flex';
        if(key != "player"){
            const saveOverCell = document.createElement('div');
            saveOverCell.className='flex-grow-0';
            saveOverCell.innerHTML=`<button onclick="setCharacter('${key}', document.getElementById('newCharacterNameInput').value, document.getElementById('newCharacterColorInput').value, null, true)" class="btn btn-xs btn-success me-2 mt-1 mb-1">Save over this</button>`;
            characterRow.appendChild(saveOverCell);
        }
        const infoCell = document.createElement('div');
        infoCell.className='flex-grow-1 mt-1 mb-1';
        infoCell.innerHTML=`<span class="d-sm-inline d-block"><b>Slug:</b> ${key}, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Name:</b> ${character.name}, </span><span class="d-sm-inline d-block"><b class="ms-sm-2">Color:</b> ${character.color ?? 'Not set'}</span>`;
        characterRow.appendChild(infoCell);
        if(key != "player"){
            const removeCell = document.createElement('div');
            removeCell.className='flex-grow-0';
            removeCell.innerHTML=`<button onclick="deleteCharacter('${key}')" class="btn btn-xs btn-danger pb-1 mt-1 mb-1">
            <svg width="16" height="16" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
            <use xlink:href="#delete"/>
          </svg>
            </button>`;
            characterRow.appendChild(removeCell);
        }
        else{
            const renameCell = document.createElement('div');
            renameCell.className='flex-grow-0';
            renameCell.innerHTML=`<button onclick="renamePlayer()" class="btn btn-xs btn-primary  mt-1 mb-1">Rename</button>`;
            characterRow.appendChild(renameCell);
        }
        characterCard.appendChild(characterRow);
        charactersListInModal.appendChild(characterCard);
      }

      const characterSelect = document.getElementById('characterSelectMain');
      const oldSlug = characterSelect.value;
      characterSelect.innerHTML='';
      
      for (let key in chatfic.characters) {
          const character = chatfic.characters[key];
          const newOption = document.createElement('option');
          newOption.value=key;
          if(key == 'player'){
            newOption.innerText=character.name + " (player)";
          }
          else{
            newOption.innerText=character.name;
          }
          characterSelect.appendChild(newOption);
          if(key == oldSlug){
            newOption.selected=true;
            characterSelect.value=key;
          }
      }
      
      

}
function renamePlayer(){
    let newName = prompt("Please enter new name for the player").trim();
    if (newName != null && newName.length > 1){
    chatfic.characters.player.name=newName;
    refreshCharacters();
    }
}
function deleteCharacter(slug){
    const canI = checkCurrentMessagesForCharacter(slug);
    if(!canI){
        alert('You can\'t delete a character without removing all messages from that character first');
        return false;
    }
    delete chatfic.characters[slug];
    refreshCharacters();
}
function checkCurrentMessagesForCharacter(slug){
    // TODO: check
    alert("check current characters TODO");
    return true;
}
function refreshPageOptionsList(){
    let pageOptionsList = "";
    pages.forEach(page => {
        let optionsPart = '';
        if(page.options.length == 0){
            optionsPart = `<button onclick="showPageOptionsModal(${page.id});" class="btn btn-danger btn-xs">Set<span class="d-none d-sm-inline"> next</span></button>`;
        }
        else if(page.options.length == 1){
            optionsPart = `<span onclick="showPageOptionsModal(${page.id});" class="badge rounded-pill bg-success">'${pages.find(x => x.id == page.options[0].to).name}'</span>`;
        }
        else{
            // multiple options
            let optionsPageNames = '';
            page.options.forEach(pageOption => {
                optionsPageNames += ", " + pages.find(x => x.id == pageOption.to).name;
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
  let pageOptionsLister = document.getElementById('page-options-lister');
  pageOptionsLister.innerHTML=pageOptionsList;
}

const pageOptionsModal = new bootstrap.Modal(document.getElementById("pageOptionsModal"));
const pageOptionsTitle = document.getElementById('optionspagetitle');
const pageOptionsTitleAlt = document.getElementById('optionspagetitlealt');
const saveOptionsButton = document.getElementById('saveOptionsButton');

function pageOptionsMultiple(isMultiple){
    if(isMultiple){
        document.getElementById('pagedirect').style.display='none';
        document.getElementById('pagemultiple').style.display='block';
    }
    else{
        document.getElementById('pagedirect').style.display='block';
        document.getElementById('pagemultiple').style.display='none';
    }
}

function showPageOptionsModal(pageId){
    // get page by id:
    let page = pages.find(x => x.id == pageId);
    saveOptionsButton.setAttribute('data-pageId',page.id);
    pageOptionsTitle.innerText = page.name;
    pageOptionsTitleAlt.innerText = page.name;
    if(page.options.length == 1){
        populatePageSelect2(page.options[0].to);
    }
    else{
        document.getElementById('pageoptionslist').innerHTML='';
        populatePageSelect2();
        if(page.options.length > 1){
            page.options.forEach(pageOption => {
                let dflex = null;
                if(pageOption.hasOwnProperty('message')){
                    dflex = newPageOptionRow(pageOption.to, pageOption.message);
                }
                else{
                    dflex = newPageOptionRow(pageOption.to);
                }

                document.getElementById('pageoptionslist').appendChild(dflex);
            });
        }
        if(page.options.length < 4){
            for (let i = 0; i < (4-page.options.length); i++) {
                const xdflex = newPageOptionRow();
                document.getElementById('pageoptionslist').appendChild(xdflex);
            }
        }
    }
    // show modal
    pageOptionsModal.show();
}

function savePageOptions(){
    let page = pages.find(x => x.id == saveOptionsButton.getAttribute('data-pageId'));
    
    page.options = [];
    if(document.getElementById('btnradio1').checked){
        // single option logic
        page.options.push({to: parseInt(pageSelect2.value)});
    }
    else{
        // multiple options logic
        var inputGroups = document.querySelectorAll('#pageoptionslist .input-group');
        [].forEach.call(inputGroups, function(inputGroup) {
            let optionName = inputGroup.querySelector('input').value;
            let optionPageId = inputGroup.querySelector('select').value;
            if(optionName && optionName.length>1 && optionPageId !== null && optionPageId != 0){
                page.options.push({to: parseInt(optionPageId), message: optionName});
            }
        });        
    }
    refreshPageOptionsList();
    pageOptionsModal.hide();
    setTooltips();
}

function newPageOptionRow(pageTo=null, optionMessage=null){
    let newPageSelectHolder = document.createElement("div");
    newPageSelectHolder.className='input-group input-group-sm mb-2';

    newPageSelectHolder.innerHTML=`<label class="input-group-text">
        Option
    </label>`;


    
    let optionName = document.createElement("input");
    optionName.setAttribute('type','text');
    optionName.className='form-control me-4 me-sm-0';
    if(optionMessage){
        optionName.value=optionMessage;
    }
    newPageSelectHolder.appendChild(optionName);


    let mobileBreaker = document.createElement("div");
    mobileBreaker.className='flex-fill w-100 d-sm-none d-block';
    newPageSelectHolder.appendChild(mobileBreaker);

    let mobileFloater = document.createElement("div");
    mobileFloater.className='flex-grow-1 d-sm-none d-block';
    mobileFloater.innerHTML='&nbsp;';
    newPageSelectHolder.appendChild(mobileFloater);
    
    let selectLabel = document.createElement("label");
    selectLabel.className='input-group-text small ms-3 ms-sm-0';
    selectLabel.innerHTML='<sup class="mt-2">will go to page:</sup>';
    newPageSelectHolder.appendChild(selectLabel);

    let selector = newPageSelect(pageTo);
    newPageSelectHolder.appendChild(selector);
    return newPageSelectHolder;
}



const charactersModal = new bootstrap.Modal(document.getElementById("charactersModal"));
function showCharactersModal(){
    charactersModal.show();
}


function addMessage() {
    // Fetch input values
    var chatroom = document.getElementById("chatroom").value;
    var character = document.getElementById("character").value;
    var message = document.getElementById("message").value;
    var side = document.getElementById("side").value;
    var position = parseInt(document.getElementById("position").value);

    // Create message object
    var newMessage = {
        chatroom: chatroom,
        character: character,
        message: message,
        side: side
    };

    // Add message to JSON result
    // ...

    // Refresh JSON preview
    // ...

    // Refresh preview of messages on left side
    // ...
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



editInfoButton.addEventListener("click", () => {
    infoModalShow();
});
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

function newPageSelect(selectId=null){


    let newPageSelect = document.createElement("select");
    newPageSelect.className='form-select form-select-sm wslc flex-grow-0';
    
    const option = document.createElement("option");
    option.value = 0;
    option.text = "";
    newPageSelect.appendChild(option);
    for (let i = 0; i < pages.length; i++) {
        const option = document.createElement("option");
        option.value = pages[i].id;
        option.text = pages[i].name;
        newPageSelect.appendChild(option);
        if(selectId && selectId==pages[i].id){
            option.selected=true;
            newPageSelect.value=option.value;
        }
    }
    
    return newPageSelect;
}
function populatePageSelect2(selectId=null) {
    pageSelect2.innerHTML = "";
    for (let i = 0; i < pages.length; i++) {
        const option = document.createElement("option");
        option.value = pages[i].id;
        option.text = pages[i].name;
        pageSelect2.appendChild(option);
        if(selectId && selectId==pages[i].id){
            option.selected=true;
            pageSelect2.value=option.value;
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

function pagesModalShow() {

    // Populate the modal with pages for editing
    pageList.innerHTML = "";
    for (let i = 0; i < pages.length; i++) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        if(i!=0){
            li.innerHTML = `
                <span class="align-middle">${pages[i].name}</span>
                <button class="btn btn-primary btn-xs float-end mt-1 ms-2 rename-page-btn">Rename</button>
                <button class="btn btn-danger btn-xs float-end mt-1 ms-2 me-2 remove-page-btn">Remove</button>
            `;
        }
        else{
        li.innerHTML = `
        <span class="align-middle">${pages[i].name}</span>
            <button class="btn btn-primary btn-xs float-end mt-1 ms-2 rename-page-btn">Rename</button>
        `;
        }
        pageList.appendChild(li);

        if(i!=0){
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
        const newPage = { id: pages[pages.length-1].id + 1, name: newPageName, messages: [], options: [] };
        pages.push(newPage);
        newPageInput.value = "";
        updatePageSelect();
        refreshPageOptionsList();
        //pageModal.hide();
        pagesModalShow();
    }
});

function setCursor(cursorEl){
if(cursorEl.className.indexOf('active') === -1){
    // remove all cursors first
    var cursors = document.querySelectorAll('cursor');
    [].forEach.call(cursors, function(cursor) {
    cursor.classList.remove('active');
    });

    // get message index
    let messageEl = cursorEl.nextElementSibling;
    document.getElementById("position").value = messageEl.getAttribute('data-index');
}
else{
    document.getElementById("position").value=0;
}
cursorEl.classList.toggle('active');
}

// Initial population of the select element
populatePageSelect();
// initial tooltip setup
setTooltips();

function toggleMultiplePages(){
    var stff = document.querySelectorAll('.only-if-multiple-pages'), i;

    for (i = 0; i < stff.length; ++i) {
        stff[i].classList.toggle('multiple');
    }
}


// Event listener for select element change
pageSelect.addEventListener("change", () => {
    selectedPageId = parseInt(pageSelect.value);
});