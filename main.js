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
    document.getElementById('cf-episode').innerText = chatfic.episode;
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
    document.getElementById('cf-description').innerText = chatfic.description;
    checkChatfic();
}
function setAuthor(author) {
    chatfic.author = author;
    document.getElementById('cf-author').innerText = chatfic.author;
    checkChatfic();
}
function setPatreonusername(patreonusername) {
    chatfic.patreonusername = patreonusername;
    document.getElementById('cf-patreonusername').innerText = chatfic.patreonusername;
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
            listText = listText+`<li>${mistakeText}</li>`;
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
            optionsPart = `<button class="btn btn-danger btn-xs">Set<span class="d-none d-sm-inline"> options</span></button>`;
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
                <button class="btn btn-danger btn-sm float-end remove-page-btn">Remove</button>
                <button class="btn btn-primary btn-sm float-end mx-2 rename-page-btn">Rename</button>
            `;
        }
        else{
        li.innerHTML = `
        <span class="align-middle">${pages[i].name}</span>
            <button class="btn btn-primary btn-sm float-end mx-2 rename-page-btn">Rename</button>
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
        updatePageSelect()
        //pageModal.hide();
        pagesModalShow();
    }
});

// Initial population of the select element
populatePageSelect();
// initial tooltip setup
setTooltips();


// Event listener for select element change
pageSelect.addEventListener("change", () => {
    selectedPageId = parseInt(pageSelect.value);
});