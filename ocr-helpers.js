function replaceCommons(text){
    // 1. direct replaces
    const replaceDict = {
        "|":"I",
        "\n":" ",
        "Iam":"I am",
        "Ido ": "I do ",
        "understanc": "understand",
        "agair": "again",
        "doinc":"doing",
        "T'll": "I'll",
        "Tll": "I'll",
        "Tt ": "It ",
        " tc ": " to ",
        " j ": " ",
        " td ": " to ",
        " vou ": " you ",
        " hir ": " him ",
        " ther ": " then ",
    }
    for (const [key, value] of Object.entries(replaceDict)) {
        text = text.replaceAll(key, value);
    }

    text = text.trim();

    // 2. regex replaces
    const replaceRegexDict = {
        "\\bitis\\b": "it is",
        "\\b(?:\\s)*[@%#&,'^)(\\[\\]\\|\\/`\"+{}]+$": "",
        "^[@%#&,'^)(\\[\\]\\|\\/`\"+{}]+(?:\\s)*\\b": "",
        "\ba$": ""
    }
    for (const [key, value] of Object.entries(replaceRegexDict)) {
        text = text.replaceAll(new RegExp(key, "g"), value);
    }

    const qMarkRegex = /((?=[27]*[\?])(?=[\?]*[27])(?:[27\?]{2,8})[72?]*)/gm;
    const match = qMarkRegex.exec(text);
    const qMarkLength = match ? match[1].length : 2;
    text = text.replaceAll(qMarkRegex, "?".repeat(qMarkLength));

    text = replaceEnd(text.trim());

    return text;
}

function replaceEnd(text){
    const replace_dict = {
        "’’": "??",
        "Ido": "I do",
        "Iam": "I am",
        "lam": "I am",
        "Isee": "I see",
        "lsee": "I see",
        "’": "?",
        ";": "",
        ",": "",
        ":": "",
        "}": "",
        "{": "",
        "'": "",
        " j": "",
        " i": "",
        " I": "",
        " l": "",
        " l!": "!!",
        " !l": "!!",
        " !I": "!!",
        " I!": "!!",
        " |": "",
        "®": "🥰",
        " lo": " lol",
        " sc": " so",
        " tc": " to",
        " ther": " then",
    }

    for (const [key, value] of Object.entries(replace_dict)) {
        if (text.endsWith(key)) {
            return text.slice(0, -key.length) + value;
        }
    }
}

function replaceCommonFinals(text) {
    const replaceFullDict = {
        "fo": "lol",
        "lo": "lol",
    }
    if (replaceFullDict.hasOwnProperty(text)) {
        return replaceFullDict[text];
    }

    return text;
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
function checkIfShortGibberish(text){
    const shortGibberishList = [
        "¥", "¢"
    ];
    return shortGibberishList.includes(text.trim());
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
    return text.replace(/((?!'|`|\.)(?:.{1}|^)\b(B|C|D|E|G|H|J|L|N|P|T|V|W)\b)/gi, "");
}

function fixSpecialCharacters(text){
    // fix special-only words:
    text = text.replace(/\b(\s*[-_!"`'#%&,:;<>¢£¥·=@®©{}~\$\*\+\/\\\?\[\]\^]{2,10}\s*)+\b/g, " ");

    // fix single specials:
    text = text.replace(/(?:\b|^|\s)(\s*[\s\_#%&>¢£¥·=®©@{}~\*\+\/\\\[\]\^]{2,10}\s*)+(?:\b|$|\s)/g, " ");

    return text;
}

function isCleaned(oldText, newText){
    return oldText.replace(/\s/g, "").length !== newText.replace(/\s/g, "").length;
}

function indexesOf(lst, element) {
    const ind = [];
    for(let i=0; i<lst.length;i++) {

        if (lst[i] === element){
            ind.push(i);
        }
        else{
            try {
                if(stringSimilarity(lst[i], element) >= 0.78){
                    ind.push(i);
                }
                else{
                    // We can always do better :)
                    const len1 = lst[i].length;
                    const len2 = element.length;
                    if(len2 > 10 && len1 > 11 && stringSimilarity(lst[i].slice(len2), element) >= 0.78){
                        // there is a very good chance that lst[i].endsWith(element) (with similarity)
                        ind.push(i);
                    }
                }
            }
            catch(e) {
            }
        }
    }
    return ind;
}

function checkIntersection(list_1, list_2) {
    // check if both are arrays:
    if (!Array.isArray(list_1) || !Array.isArray(list_2)) return [false, null];
    const list_1_length = list_1.length;
    const list_2_max_index = list_2.length - 1;
    if(list_1_length < 1 || list_2_max_index < 0) return [false, null];
    const firstItemFromList2 = list_2[0];

    const messageIndices = indexesOf(list_1, firstItemFromList2);
    if (messageIndices.length > 0 ) {
        let lastCheckedStartIndex = null;
        let fullSuccess = false;

        for (const lcsi of messageIndices) {
            lastCheckedStartIndex = lcsi;
            let list1IndexToCheck = lcsi;

            if (list1IndexToCheck === list_1_length - 1) {
                fullSuccess = true;
                break;
            } else {
                list1IndexToCheck++;

                let index2 = 1;
                while (true) {
                    if (index2 > list_2_max_index) break; // No success. Go to next item in messageIndices.
                    if (list_2[index2] !== list_1[list1IndexToCheck]){
                        try {
                            if(stringSimilarity(list_2[index2], list_1[list1IndexToCheck]) < 0.78){
                                break; // No success. Go to next item in messageIndices.
                            }
                        }
                        catch(e) {
                            // No success. Go to next item in messageIndices.
                            break;
                        }
                    }

                    if (list1IndexToCheck === list_1_length - 1) {
                        // Successful till the end of list_1!
                        fullSuccess = true;
                        break;
                    } else {
                        list1IndexToCheck++;
                        index2++;
                    }

                }

                if (fullSuccess) break;
            }
        }

        if (fullSuccess) return [true, lastCheckedStartIndex];
        else return [false, lastCheckedStartIndex];
    } else {
        return [false, null];
    }
}


// string similarity from Scott Sauyet
// https://stackoverflow.com/a/69451128
const stringSimilarity = (a, b) =>
  _stringSimilarity (ssPrep (a), ssPrep (b))

const _stringSimilarity = (a, b) => {
  const bg1 = ssBigrams (a)
  const bg2 = ssBigrams (b)
  const c1 = ssCount (bg1)
  const c2 = ssCount (bg2)
  const combined = ssUniq ([... bg1, ... bg2])
    .reduce ((t, k) => t + (Math .min (c1 [k] || 0, c2 [k] || 0)), 0)
  return 2 * combined / (Math .max (bg1 .length + bg2 .length, 1))
}

const ssPrep = (str) =>
  str .toLowerCase () .replace (/[^\w\s]/g, ' ') .replace (/\s+/g, ' ')

const ssBigrams = (str) =>
  [...str] .slice (0, -1) .map ((c, i) => c + str [i + 1])

const ssCount = (xs) =>
  xs .reduce ((a, x) => ((a [x] = (a [x] || 0) + 1), a), {})

const ssUniq = (xs) =>
  [... new Set (xs)]

