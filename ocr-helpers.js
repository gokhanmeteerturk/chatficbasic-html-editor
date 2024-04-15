function replaceCommons(text){
    const replaceDict = {
        "|":"I",
        "\n":" ",
    }
    for (const [key, value] of Object.entries(replaceDict)) {
        text = text.replaceAll(key, value);
    }
    return text.trim();
}

function fixGibberish(text){
    text = fixSingleLetterWords(text);
    text = fixSpecialCharacters(text);
    return text;
}

function checkIfFullyGibberish(text){
    return text.replaceAll('!','').replaceAll('?','').match(/[A-Za-z09]/g).length / text.length < 0.5;
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