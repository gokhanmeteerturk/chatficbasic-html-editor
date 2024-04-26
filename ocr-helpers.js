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
                if(stringSimilarity(lst[i], element) >= 0.78) ind.push(i);
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

    if (list_1.includes(firstItemFromList2)) {
        let lastCheckedStartIndex = null;
        const messageIndices = indexesOf(list_1, firstItemFromList2);
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

