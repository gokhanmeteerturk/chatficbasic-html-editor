const genderMap = {
    "female": "g1",
    "male": "b1"
};

// Skin values directly match YAML options "white", "black"
// const skinMap = { "white": "white", "black": "black" }; // Not strictly needed if values match

const eyesMap = {
    "black": "black-eyes",
    "brown": "brown-eyes",
    "blue": "blue-eyes",
    "green": "green-eyes", // HTML options for "green" and "hazel" both have value="green"
    "amber": "amber-eyes"
};

const hairColorMap = {
    "black": "black-hair",
    "grey": "grey-hair",
    "brown": "brown-hair",
    "blonde": "blonde-hair",
    "blue": "blue-hair",    // HTML options for "blue" and "green" (text) both have value="blue"
    "ginger": "ginger-hair",
    "red": "red-hair",
    "pink": "pink-hair"
};

const hairStyleMap = {
    "straight": "straight-hair",
    "bob": "bob-hair",
    "pixie": "pixie-hair",
    "ponytail": "ponytail-hair",
    "wavy": "wavy-hair",
    "buns": "buns-hair",
    "bangs-short": "bangs-short-hair",
    "afro-short": "afro-short-hair",
    "braids": "braids-hair",
    "pony-two": "pony-two-hair",
    "pigtails": "pigtails-hair"
};

const dressSizeMap = { // For "Chest ;)"
    "small": "dress-small",
    "medium": "dress-medium",
    "big": "dress-big"
};


function _getHashCode(str) {
  let hash = 0;
  if (typeof str !== 'string' || str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    hash = (0x1fffffff & (hash + str.charCodeAt(i)));
    hash = (0x1fffffff & (hash + ((0x0007ffff & hash) << 10)));
    hash ^= (hash >> 6);
  }
  hash = (0x1fffffff & (hash + ((0x03ffffff & hash) << 3)));
  hash ^= (hash >> 11);
  hash = (0x1fffffff & (hash + ((0x00003fff & hash) << 15)));
  return hash;
}

function mapWordToNumber(word, maxIncluding) {
  const s = (typeof word === 'string') ? word : "DefaultNameForHash";
  const hashCode = _getHashCode(s);
  return Math.abs(hashCode) % (maxIncluding + 1);
}

// Constants for default value arrays
const SKINS_DEFAULT = [
    "light-cool", "light-neutral", "light-warm",
    "medium-cool", "medium-neutral", "medium-warm",
    "tan-cool", "tan-neutral", "tan-warm",
    "dark-cool", "dark-neutral", "dark-warm",
    "white", "black"
];
const EYE_COLORS_DEFAULT = ["amber", "blue", "brown", "green", "black"];
const HAIR_COLORS_DEFAULT = ["black", "blonde", "blue", "brown", "ginger", "grey", "red", "pink"];
const HAIR_STYLES_MALE_DEFAULT = ["straight", "bob", "pixie", "afro-short", "braids"];
const HAIR_STYLES_FEMALE_DEFAULT = ["straight", "bob", "pixie", "ponytail", "wavy", "buns", "bangs-short", "afro-short", "braids", "pony-two", "pigtails"];

const DRESS_SIZES_DEFAULT = ["small", "medium", "big"];

function convertToCharacterCommand(character) {
    // Ensure character is an object, even if null or undefined is passed
    const char = character || {};
    const characterName = char.name || "DefaultNameForHash"; // Used for fallbacks if name is missing

    // 1. $gender: "b1" for male, "g1" for female. Defaults to "g1".
    let genderCmd = "g1"; // Default to female
    if (char.gender === "male") {
        genderCmd = "b1";
    }

    // If char.skin is undefined or an unrecognized value, it remains "white".
    let skinCmd;
    if (char.skin && typeof char.skin === 'string' && char.skin.trim() !== "") {
        skinCmd = char.skin;
        if(skinCmd == 'white'){
            character.skin = 'light-cool';
            skinCmd = 'light-cool';
        }
        else if(skinCmd == 'black'){
            character.skin = 'dark-neutral';
            skinCmd = 'dark-neutral';
        }
    } else {
        const skinIndex = mapWordToNumber(characterName, 8);
        skinCmd = SKINS_DEFAULT[skinIndex];
    }

    // 3. $body: always "body1".
    const bodyCmd = "body1";

    // 4. $eyes: character.eyes.color + "-eyes" or fallback.
    let eyesCmd;
    if (char.eyes && typeof char.eyes.color === 'string' && char.eyes.color.trim() !== "") {
        eyesCmd = char.eyes.color + "-eyes";
    } else {
        const eyeIndex = mapWordToNumber(characterName, EYE_COLORS_DEFAULT.length - 1);
        eyesCmd = EYE_COLORS_DEFAULT[eyeIndex] + "-eyes";
    }

    // 5. $hairColor: character.hair.color + "-hair" or fallback.
    let hairColorCmd;
    if (char.hair && typeof char.hair.color === 'string' && char.hair.color.trim() !== "") {
        hairColorCmd = char.hair.color + "-hair";
    } else {
        const hairColorIndex = mapWordToNumber(characterName, HAIR_COLORS_DEFAULT.length - 1);
        hairColorCmd = HAIR_COLORS_DEFAULT[hairColorIndex] + "-hair";
    }

    // 6. $hairStyle: character.hair.style + "-hair" or fallback based on gender.
    let hairStyleCmd;
    if (char.hair && typeof char.hair.style === 'string' && char.hair.style.trim() !== "") {
        hairStyleCmd = char.hair.style + "-hair";
    } else {
        if (genderCmd === "b1") { // Male
            const hairStyleIndex = mapWordToNumber(characterName, HAIR_STYLES_MALE_DEFAULT.length - 1);
            hairStyleCmd = HAIR_STYLES_MALE_DEFAULT[hairStyleIndex] + "-hair";
        } else { // Female or default gender
            const hairStyleIndex = mapWordToNumber(characterName, HAIR_STYLES_FEMALE_DEFAULT.length - 1);
            hairStyleCmd = HAIR_STYLES_FEMALE_DEFAULT[hairStyleIndex] + "-hair";
        }
    }

    // 7. $dressSize: "dress-" + character.dress.size or fallback.
    let dressSizeCmd;
    if (char.dress && typeof char.dress.size === 'string' && char.dress.size.trim() !== "") {
        dressSizeCmd = "dress-" + char.dress.size;
    } else {
        const dressSizeIndex = mapWordToNumber(characterName, DRESS_SIZES_DEFAULT.length - 1);
        dressSizeCmd = "dress-" + DRESS_SIZES_DEFAULT[dressSizeIndex];
    }

    return `${genderCmd} ${skinCmd} ${bodyCmd} ${eyesCmd} ${hairColorCmd} ${hairStyleCmd} ${dressSizeCmd}`;
}

// REST IS YAML CHARACTER LOADING AND PARSING

// Global cache for loaded and parsed YAML data
const loadedYamlCharacters = {};
// To keep track of YAMLs currently being fetched to avoid race conditions and redundant fetches
const fetchingYamlPromises = {};

async function getImagesForCommand(commandString) {
    const parts = commandString.split(' ');
    if (parts.length === 0) {
        return Promise.reject(new Error("Command string cannot be empty."));
    }
    const yamlName = parts[0]; // "g1" or "b1"
    const remainingCommandWords = parts.slice(1);

    let characterInfo;

    if (loadedYamlCharacters[yamlName]) {
        characterInfo = loadedYamlCharacters[yamlName];
    } else {
        if (fetchingYamlPromises[yamlName]) {
            // If this YAML is already being fetched, wait for the existing promise
            characterInfo = await fetchingYamlPromises[yamlName];
        } else {
            // Fetch and parse the YAML
            const yamlPath = `/characters/${yamlName}/${yamlName}.yaml`; // Assumes yaml files are in a /yaml/ folder at the root
            fetchingYamlPromises[yamlName] = fetch(yamlPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load YAML: ${yamlPath}, status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(yamlText => {
                    const jsonData = jsyaml.load(yamlText); // js-yaml function
                    if (jsonData && jsonData.layered_character && jsonData.layered_character.length > 0) {
                        const parsedInfo = jsonData.layered_character[0];
                        loadedYamlCharacters[yamlName] = parsedInfo; // Cache it
                        delete fetchingYamlPromises[yamlName]; // Clear the promise from tracking
                        return parsedInfo;
                    } else {
                        throw new Error(`Invalid YAML structure in ${yamlPath}. Missing 'layered_character' root or it's empty.`);
                    }
                })
                .catch(error => {
                    console.error(`Error processing YAML ${yamlPath}:`, error);
                    delete fetchingYamlPromises[yamlName]; // Ensure cleanup on error
                    throw error; // Re-throw to be caught by the caller of getImagesForCommand
                });
            characterInfo = await fetchingYamlPromises[yamlName];
        }
    }

    if (!characterInfo || !characterInfo.name) {
        return Promise.reject(new Error(`Character data for '${yamlName}' could not be loaded or is invalid.`));
    }

    const images = [];
    const excludeGroups = new Set();
    remainingCommandWords.forEach(word => {
        if (word.startsWith('-')) {
            excludeGroups.add(word.substring(1));
        }
    });

    const usedWords = new Set();

    _collectImages(characterInfo.attributes, remainingCommandWords, excludeGroups, usedWords, images, characterInfo.name);

    return images;
}

function _collectImages(attributes, words, excludeGroups, usedWords, images, characterYamlName) {
    if (!attributes || !Array.isArray(attributes)) {
        return;
    }

    // First, process 'always' attributes at the current level
    attributes.forEach(attribute => {
        if (attribute && attribute.always != null && attribute.file != null) {
            images.push({
                filePath: `${characterYamlName}/${attribute.file}.png`,
                position: attribute.position || { x: 0, y: 0 }, // Default position if not specified
            });
        }
    });

    // Then, process 'group' attributes at the current level
    attributes.forEach(attribute => {
        if (attribute && attribute.group != null && !excludeGroups.has(attribute.group)) {
            let selectedOption = null;

            if (attribute.options && Array.isArray(attribute.options) && attribute.options.length > 0) {
                // Find the selected option based on words
                for (const option of attribute.options) {
                    if (option && words.includes(option.option)) {
                        selectedOption = option;
                        // Potentially add option.option to usedWords if tracking is needed:
                        // usedWords.add(option.option);
                        break;
                    }
                }

                // If no matching option is found from the command words, use the default (first option)
                if (!selectedOption) {
                    selectedOption = attribute.options[0];
                }

                // Add the selected option's image and process its nested attributes
                if (selectedOption) {
                    const position = selectedOption.position || { x: 0, y: 0 }; // Default position
                    if (selectedOption.file != null) {
                        images.push({
                            filePath: `${characterYamlName}/${selectedOption.file}.png`,
                            position: position,
                        });
                    }

                    // Recursively process nested attributes of the selected option
                    if (selectedOption.attributes) {
                        _collectImages(
                            selectedOption.attributes,
                            words,
                            excludeGroups,
                            usedWords,
                            images,
                            characterYamlName
                        );
                    }
                }
            }
        }
    });
}


async function drawLayeredCharacter(commandString, parentElementId, parentEl=null, imageBasePath = "characters/") {
    let parentElement = null;
    if(parentEl){
        parentElement = parentEl;
    }
    else{
        parentElement = document.getElementById(parentElementId);
    }
    if (!parentElement) {
        console.error(`Parent element with ID '${parentElementId}' not found.`);
        return;
    }

    parentElement.innerHTML = '';

    try {
        // 1. Get the list of image layers for the command
        const imageLayers = await getImagesForCommand(commandString);

        if (!imageLayers || imageLayers.length === 0) {
            console.log("No image layers to draw for the command:", commandString);
            parentElement.textContent = "No character layers to display for this command.";
            return;
        }

        // 2. Get character size information from the cached YAML data
        const parts = commandString.split(' ');
        const yamlName = parts[0];
        const characterData = loadedYamlCharacters[yamlName]; // Access the cache

        if (!characterData || !characterData.size ||
            typeof characterData.size.width !== 'number' || typeof characterData.size.height !== 'number') {
            console.error("Character size information is missing or invalid from loaded YAML data for:", yamlName);
            parentElement.textContent = "Character data is incomplete (missing or invalid size).";
            return;
        }

        const canvasWidth = characterData.size.width;
        const canvasHeight = characterData.size.height;

        // 3. Create and configure the canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        // Optional: add a border for visibility during development
        // canvas.style.border = "1px solid black";
        parentElement.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // 4. Load all images
        const imageLoadingPromises = imageLayers.map(layer => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ img, layer }); // Resolve with the loaded image and its layer data
                img.onerror = (errorEvent) => {
                    console.error(`Failed to load image: ${finalImagePath}`, errorEvent);
                    reject(new Error(`Failed to load image: ${finalImagePath}`));
                }

                // Construct the final image path
                let finalImagePath = layer.filePath;
                if (imageBasePath) {
                    const basePathEndsWithSlash = imageBasePath.endsWith('/');
                    const layerPathStartsWithSlash = layer.filePath.startsWith('/');

                    if (basePathEndsWithSlash && layerPathStartsWithSlash) {
                        finalImagePath = imageBasePath + layer.filePath.substring(1);
                    } else if (!basePathEndsWithSlash && !layerPathStartsWithSlash) {
                        finalImagePath = imageBasePath + '/' + layer.filePath;
                    } else {
                        // One has a slash, the other doesn't, or only one path is relevant
                        finalImagePath = imageBasePath + layer.filePath;
                    }
                }
                img.src = finalImagePath;
            });
        });

        // Wait for all images to load
        const loadedImagesData = await Promise.all(imageLoadingPromises);

        // 5. Draw images onto the canvas in the correct order
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        loadedImagesData.forEach(data => {
            // position: { x: 0, y: 0 } is from top left corner
            ctx.drawImage(data.img, data.layer.position.x, data.layer.position.y);
        });

        console.log(`Character for "${commandString}" drawn on canvas in #${parentElementId}.`);

    } catch (error) {
        console.error(`Failed to draw layered character for command "${commandString}":`, error);
        parentElement.innerHTML = `<p style="color:red;">Error loading character: ${error.message}</p>`;
    }
}
 
function getRandomSelectValue(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return "";

    const validOptions = Array.from(selectElement.options).filter(option => option.value !== "");
    if (validOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * validOptions.length);
        return validOptions[randomIndex].value;
    }
    return ""; // Fallback
}

async function updateCharacterPreview() {
    // Get current values from select elements
    const genderValue = document.getElementById('newCharacterGenderInput').value;
    const skinValue = document.getElementById('newCharacterSkinInput').value;
    let hairColorInputValue = document.getElementById('newCharacterHairColorInput').value; // e.g., "black", "blue"
    let hairStyleInputValue = document.getElementById('newCharacterHairStyleInput').value; // e.g., "straight", ""
    let eyesInputValue = document.getElementById('newCharacterEyesInput').value;         // e.g., "blue", ""
    let dressSizeInputValue = document.getElementById('newCharacterDressSizeInput').value; // e.g., "small", ""

    // Handle "random" selections by picking a random valid value
    if (hairStyleInputValue === "") {
        hairStyleInputValue = getRandomSelectValue('newCharacterHairStyleInput');
    }
    if (eyesInputValue === "") {
        eyesInputValue = getRandomSelectValue('newCharacterEyesInput');
    }
    if (dressSizeInputValue === "") {
        dressSizeInputValue = getRandomSelectValue('newCharacterDressSizeInput');
    }

    // Map HTML values to command string keywords
    const cmdGender = genderMap[genderValue] || 'g1'; // Default if something goes wrong
    const cmdSkin = skinValue; // Direct use, e.g., "white", "black"
    const cmdEyes = eyesMap[eyesInputValue] || eyesMap[Object.keys(eyesMap)[0]]; // Default to first eye option if random fails
    const cmdHairColor = hairColorMap[hairColorInputValue] || hairColorMap[Object.keys(hairColorMap)[0]];
    const cmdHairStyle = hairStyleMap[hairStyleInputValue] || hairStyleMap[Object.keys(hairStyleMap)[0]];
    const cmdDressSize = dressSizeMap[dressSizeInputValue] || dressSizeMap[Object.keys(dressSizeMap)[0]];


    // Construct the command string
    // Order: $gender $skin $eyes $hairColor $hairStyle $dressSize
    // (Note: The $body part from your initial Dart example seems to be handled by defaults in YAML if not specified)
    const commandParts = [
        cmdGender,
        cmdSkin,
        cmdEyes,
        cmdHairColor,
        cmdHairStyle,
        cmdDressSize
    ];

    const commandString = commandParts.filter(part => part).join(' '); // Filter out any null/undefined parts

    console.log("Updating character with command:", commandString);

    // Call the function to draw the character on the canvas
    // Ensure `drawLayeredCharacter` is available in the global scope or imported correctly.
    if (typeof drawLayeredCharacter === 'function') {
        await drawLayeredCharacter(commandString, "layeredcharacter"); // Assuming "layeredcharacter" is the ID of your target div
    } else {
        console.error("drawLayeredCharacter function is not defined. Make sure it's loaded.");
    }
}

function getResizedCharacterDataURL(parentId = 'layeredcharacter', parentEl=null, targetWidth = 64, targetHeight = 64, imageFormat = 'image/png') {
    let parentElement = null;
    if(parentEl){
        parentElement = parentEl;
    }
    else{
        parentElement = document.getElementById(parentId);
    }
    if (!parentElement) {
        console.error("Parent element with ID 'layeredcharacter' not found.");
        return null;
    }

    const originalCanvas = parentElement.querySelector('canvas');
    if (!originalCanvas) {
        console.error("No canvas found within 'layeredcharacter'.");
        return null;
    }

    if (originalCanvas.width === 0 || originalCanvas.height === 0) {
        console.warn("Original canvas has zero width or height. The resulting image may be blank.");
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.imageSmoothingEnabled = true;

    try {
        tempCtx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);

        const dataURL = tempCanvas.toDataURL(imageFormat);
        return dataURL;

    } catch (error) {
        console.error("Error generating resized character Data URL:", error);
        if (error.name === 'SecurityError') {
            console.error(
                "Canvas may be tainted due to cross-origin images."
            );
        }
        return null;
    }
}