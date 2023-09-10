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
        ayse: {
            name: "Ayşe",
            color: "0xFF0000FF"
        },
        kubra: {
            name: "Kübra",
            avatar: "kubra.jpg"
        },
        mehmet: {
            name: "Mehmet"
        },
        ahmet: {
            name: "Ahmet"
        }
    }
};
var storyInfoComplete = false;
var storyInfoMistakes = [];

let pages = [{id:1, name:'initial', messages:[], options:[{to:1}]}];
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
function setCharacter(slug, name, color = null, avatar = null) {
    // adds new character too, if doesn't exist. 
    chatfic.characters[slug] = {};
    chatfic.characters[slug]['name'] = name;
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

}
function refreshPageOptionsList(){
    let pageOptionsList = "";
    pages.forEach(page => {
        let optionsPart = '';
        if(page.options.length == 0){
            optionsPart = `<button onclick="showPageOptionsModal(${page.id});" class="btn btn-danger btn-xs">Set<span class="d-none d-sm-inline"> options</span></button>`;
        }
        else if(page.options.length == 1){
            optionsPart = pages.find(x => x.id === page.options[0].to).name;
        }
        else{
            // multiple options
            optionPageNames = '';
            page.options.forEach(pageOption => {
                optionPageNames += ", " + pages.find(x => x.id === page.options[0].to).name;
            });
            optionsPageNames = optionsPageNames.slice(2);
            optionsPart = `<span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${optionsPageNames}" class="badge rounded-pill bg-secondary">
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
    pageOptionsTitle.innerText = page.name;
    pageOptionsTitleAlt.innerText = page.name;
    if(page.options.length == 1){
        populatePageSelect2(page.options[0].to);
    }
    else{
        populatePageSelect2();
        if(page.options.length > 1){
            page.options.forEach(pageOption => {
                let dflex = newPageOptionRow(pageOption.to);

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
function newPageOptionRow(pageTo=null){
    let newPageSelectHolder = document.createElement("div");
    newPageSelectHolder.className='input-group input-group-sm mb-2';

    newPageSelectHolder.innerHTML=`<label class="input-group-text">
        Option
    </label>`;


    
    let optionName = document.createElement("input");
    optionName.setAttribute('type','text');
    optionName.className='form-control';
    newPageSelectHolder.appendChild(optionName);

    let selectLabel = document.createElement("label");
    selectLabel.className='input-group-text';
    selectLabel.innerText='will go to page';
    newPageSelectHolder.appendChild(selectLabel);

    let selector = newPageSelect(pageTo);
    newPageSelectHolder.appendChild(selector);
    return newPageSelectHolder;
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
    newPageSelect.className='form-select form-select-sm';
    
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



// Event listener for select element change
pageSelect.addEventListener("change", () => {
    selectedPageId = parseInt(pageSelect.value);
});