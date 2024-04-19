function replaceCommons(text){
    // 1. direct replaces
    const replaceDict = {
        "|":"I",
        "\n":" ",
    }
    for (const [key, value] of Object.entries(replaceDict)) {
        text = text.replaceAll(key, value);
    }

    text = text.trim();

    // 2. regex replaces
    const replaceRegexDict = {
        "\\bitis\\b": "it is",
        "\\b(?:\\s)*[@%#&,'^)(\\[\\]\\|\\/`\"+{}]+$": "",
        "^[@%#&,'^)(\\[\\]\\|\\/`\"+{}]+(?:\\s)*\\b": ""
    }
    for (const [key, value] of Object.entries(replaceRegexDict)) {
        text = text.replaceAll(new RegExp(key, "g"), value);
    }


    return text.trim();
}

function fixGibberish(text){
    text = fixSingleLetterWords(text);
    text = fixSpecialCharacters(text);
    text = fixSideEffects(text);
    return text;
}

function checkIfFullyGibberish(text){
    return text.replaceAll('!','').replaceAll('?','').match(/[A-Za-z09]/g).length / text.length < 0.5;
}

function fixSideEffects(text){
    const replaceDict = {
        "n' ":"n't ",
    }
    for (const [key, value] of Object.entries(replaceDict)) {
        text = text.replaceAll(key, value);
    }
    return text;
}


function fixSingleLetterWords(text){
    return text.replace(/(\b(B|C|D|E|G|H|J|L|N|P|T|V|W)\b)/gi, "");
}

function fixSpecialCharacters(text){
    // fix special-only words:
    text = text.replace(/\b(\s*[-._!"`'#%&,:;<>¢£¥·=@{}~\$\*\+\/\\\?\[\]\^]{2,10}\s*)+\b/g, " ");

    // fix special

    return text;
}