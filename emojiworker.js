// emojiworker.js
importScripts('opencv.js');

var emojis = {
        e0: { x: 2, y: 2, e: "😠", isYellow: true },
        e1: { x: 70, y: 2, e:"👿" },
        e2: { x: 2, y: 70, e:"😦", isYellow: true },
        e3: { x: 70, y: 70, e:"😰", isYellow: true },
        e4: { x: 138, y: 2, e:"😁", isYellow: true },
        e5: { x: 138, y: 70, e:"👏", isYellow: true },
        e6: { x: 2, y: 138, e:"😕", isYellow: true },
        e7: { x: 70, y: 138, e:"😢", isYellow: true },
        e8: { x: 138, y: 138, e:"😞", isYellow: true },
        e9: { x: 206, y: 2, e:"😵", isYellow: true },
        e10: { x: 206, y: 70, e:"😓", isYellow: true },
        e11: { x: 206, y: 138, e:"🤤", isYellow: true },
        e12: { x: 2, y: 206, e:"🤯", isYellow: true },
        e13: { x: 70, y: 206, e:"😑", isYellow: true },
        e14: { x: 138, y: 206, e:"👀" },
        e15: { x: 206, y: 206, e:"😘", isYellow: true },
        e16: { x: 274, y: 2, e:"😋", isYellow: true },
        e17: { x: 274, y: 70, e:"😱", isYellow: true },
        e18: { x: 274, y: 138, e:"🤮", isYellow: true },
        e19: { x: 274, y: 206, e:"😮", isYellow: true },
        e20: { x: 2, y: 274, e:"😶", isYellow: true },
        e21: { x: 70, y: 274, e:"🤨", isYellow: true },
        e22: { x: 138, y: 274, e:"🙄", isYellow: true },
        e23: { x: 206, y: 274, e:"😤", isYellow: true },
        e24: { x: 274, y: 274, e:"🤬" },
        e25: { x: 342, y: 2, e:"😂", isYellow: true },
        e26: { x: 342, y: 70, e:"🤒", isYellow: true },
        e27: { x: 342, y: 138, e:"😛", isYellow: true },
        e28: { x: 342, y: 206, e:"😨", isYellow: true },
        e29: { x: 342, y: 274, e:"💪", isYellow: true },
        e30: { x: 2, y: 342, e:"😳", isYellow: true },
        e31: { x: 70, y: 342, e:"🙏" },
        e32: { x: 138, y: 342, e:"☹️", isYellow: true },
        e33: { x: 206, y: 342, e:"👻" },
        e35: { x: 274, y: 342, e:"😺", isYellow: true },
        e34: { x: 342, y: 342, e:"😬", isYellow: true },
        e36: { x: 410, y: 2, e:"😸", isYellow: true },
        e39: { x: 410, y: 70, e:"😅", isYellow: true },
        e38: { x: 410, y: 138, e:"😄", isYellow: true },
        e37: { x: 410, y: 206, e:"😀", isYellow: true },
        e40: { x: 410, y: 274, e:"😆", isYellow: true },
        e41: { x: 410, y: 342, e:"💗" },
        e42: { x: 2, y: 410, e:"🤝", isYellow: true },
        e43: { x: 70, y: 410, e:"🥵", isYellow: true },
        e44: { x: 138, y: 410, e:"🤗", isYellow: true },
        e45: { x: 206, y: 410, e:"💯" },
        e47: { x: 274, y: 410, e:"😽", isYellow: true },
        e48: { x: 342, y: 410, e:"😗", isYellow: true },
        e46: { x: 410, y: 410, e:"😯", isYellow: true },
        e49: { x: 478, y: 2, e:"😚", isYellow: true },
        e51: { x: 478, y: 70, e:"💋" },
        e50: { x: 478, y: 138, e:"😙", isYellow: true },
        e52: { x: 478, y: 206, e:"😭", isYellow: true },
        e53: { x: 478, y: 274, e:"🖕", isYellow: true },
        e54: { x: 478, y: 342, e:"🤑", isYellow: true },
        e55: { x: 478, y: 410, e:"🤢" },
        e57: { x: 2, y: 478, e:"👌", isYellow: true },
        e56: { x: 70, y: 478, e:"😐", isYellow: true },
        e60: { x: 138, y: 478, e:"🤏", isYellow: true },
        e58: { x: 206, y: 478, e:"👊", isYellow: true },
        e59: { x: 274, y: 478, e:"🥳", isYellow: true },
        e62: { x: 342, y: 478, e:"😡" },
        e63: { x: 410, y: 478, e:"💜" },
        e64: { x: 478, y: 478, e:"✊", isYellow: true },
        e65: { x: 546, y: 2, e:"🙌", isYellow: true },
        e61: { x: 546, y: 70, e:"🥺", isYellow: true },
        e66: { x: 546, y: 138, e:"❤️" },
        e67: { x: 546, y: 206, e:"😌", isYellow: true },
        e68: { x: 546, y: 274, e:"🤣", isYellow: true },
        e69: { x: 546, y: 342, e:"😥", isYellow: true },
        e70: { x: 546, y: 410, e:"🤫", isYellow: true },
        e71: { x: 546, y: 478, e:"☠️" },
        e72: { x: 2, y: 546, e:"💀" },
        e73: { x: 70, y: 546, e:"😴", isYellow: true },
        e74: { x: 138, y: 546, e:"😪", isYellow: true },
        e75: { x: 206, y: 546, e:"🙁", isYellow: true },
        e76: { x: 274, y: 546, e:"🙂", isYellow: true },
        e77: { x: 342, y: 546, e:"😻", isYellow: true },
        e78: { x: 410, y: 546, e:"😊", isYellow: true },
        e79: { x: 478, y: 546, e:"😇", isYellow: true },
        e80: { x: 546, y: 546, e:"😍", isYellow: true },
        e82: { x: 614, y: 2, e:"😈" },
        e81: { x: 614, y: 70, e:"🥰", isYellow: true },
        e83: { x: 614, y: 138, e:"😊", isYellow: true },
        e84: { x: 614, y: 206, e:"😎", isYellow: true },
        e85: { x: 614, y: 274, e:"😏", isYellow: true },
        e86: { x: 614, y: 342, e:"💖" },
        e87: { x: 614, y: 410, e:"🙊" },
        e88: { x: 614, y: 478, e:"😝", isYellow: true },
        e89: { x: 614, y: 546, e:"💦" },
        e90: { x: 2, y: 614, e:"🤔", isYellow: true },
        e91: { x: 70, y: 614, e:"👎", isYellow: true },
        e92: { x: 138, y: 614, e:"👍", isYellow: true },
        e93: { x: 206, y: 614, e:"😩", isYellow: true },
        e94: { x: 274, y: 614, e:"👅" },
        e95: { x: 342, y: 614, e:"💕" },
        e96: { x: 410, y: 614, e:"😒", isYellow: true },
        e97: { x: 478, y: 614, e:"🙃", isYellow: true },
        e98: { x: 546, y: 614, e:"👋", isYellow: true },
        e99: { x: 614, y: 614, e:"😩", isYellow: true },
        e100: { x: 682, y: 2, e:"😉", isYellow: true },
        e101: { x: 682, y: 70, e:"😜", isYellow: true },
        e102: { x: 682, y: 138, e:"🤪", isYellow: true },
        e103: { x: 682, y: 206, e:"🤐", isYellow: true },
      };
function filterCloseMatches(matches) {
    // Store original index to restore order later
    matches.forEach((match, index) => {
        match.originalIndex = index;
    });

    // Sort matches by score in descending order
    matches.sort((a, b) => b.score - a.score);

    let filteredMatches = [];

    const regularSize = matches[0] ? matches[0].size.width*0.9 : 25;

    for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        let isClose = false;

        // Check if this match is close to any of the already filtered matches
        for (let j = 0; j < filteredMatches.length; j++) {
            let filteredMatch = filteredMatches[j];
            if (
                Math.abs(match.loc.x - filteredMatch.loc.x) < regularSize &&
                Math.abs(match.loc.y - filteredMatch.loc.y) < regularSize
            ) {
                isClose = true;
                break;
            }
        }

        // If this match is not close to any filtered match, add it to the filtered list
        if (!isClose) {
            filteredMatches.push(match);
        }
    }

    // Sort filtered matches by their original index to restore the original order
    filteredMatches.sort((a, b) => a.originalIndex - b.originalIndex);

    // Optionally remove the originalIndex property if it's no longer needed
    filteredMatches.forEach(match => {
        delete match.originalIndex;
    });

    return filteredMatches;
}

const cvReady = new Promise((resolve) => {
  cv['onRuntimeInitialized'] = () => {
    resolve(cv);
  };
});

self.onmessage = async function(event) {
    const cv = await cvReady;
    console.log("onmessage cv:");
    console.log(cv);
    const {emoji_string, originalImageROI, emojiImageROI, emojiInfo, mostCommonColor, yellowCount} = event.data;

          let emojiCoords = emojis[emoji_string];
          if (!emojiCoords) {
            console.error("Invalid emoji string.");
            return;
          }
          console.log("yellowCount");
          console.log(yellowCount);
          if(emojiCoords.isYellow && yellowCount < 2) {
            return;
          }

          // // Create a new canvas to draw the emoji region from the emojiImageROI
          // let emojiCanvas = document.createElement("canvas");
          // emojiCanvas.width = 64;
          // emojiCanvas.height = 64;
          //
          let emojiCanvas = new OffscreenCanvas(64, 64);

          // Create an ROI from the emojiImageROI based on the sprite sheet coordinates
          let emojiRegion = emojiImageROI.roi(
            new cv.Rect(emojiCoords.x, emojiCoords.y, 64, 64)
          );

          // Convert emojiRegion to a canvas element
          cv.imshow(emojiCanvas, emojiRegion);

          // let filledEmojiCanvas = document.createElement("canvas");
          // filledEmojiCanvas.width = 64;
          // filledEmojiCanvas.height = 64;

          let filledEmojiCanvas = new OffscreenCanvas(64, 64);

          let filledEmojiCtx = filledEmojiCanvas.getContext("2d");
          filledEmojiCtx.fillStyle = `rgb(${mostCommonColor[0]}, ${mostCommonColor[1]}, ${mostCommonColor[2]})`;
          filledEmojiCtx.fillRect(0, 0, 64, 64);

          // Now draw the emoji image on the filledEmojiCanvas
          filledEmojiCtx.drawImage(emojiCanvas, 0, 0);

          let emojiGray = new cv.Mat();
          let filledEmojiMat = cv.imread(filledEmojiCanvas);
          cv.cvtColor(filledEmojiMat, emojiGray, cv.COLOR_RGBA2GRAY);

          let minSize = emojiInfo.minEmojiSize;
          let maxSize = emojiInfo.maxEmojiSize;
          let step = emojiInfo.emojiStep;
          let threshold = 0.78;
          let matches = [];

          for (let width = maxSize; width >= minSize; width -= step) {
            let scale = width / emojiGray.cols;
            let resizedEmoji = new cv.Mat();
            cv.resize(
              emojiGray,
              resizedEmoji,
              new cv.Size(0, 0),
              scale,
              scale,
              cv.INTER_AREA
            );

            let result = new cv.Mat();
            cv.matchTemplate(
              originalGray,
              resizedEmoji,
              result,
              cv.TM_CCOEFF_NORMED
            );

            for (let y = 0; y < result.rows; y++) {
              for (let x = 0; x < result.cols; x++) {
                let matchValue = result.floatAt(y, x);
                if (matchValue >= threshold) {
                  let matchLoc = { x: x, y: y };
                  let matchSize = {
                    width: resizedEmoji.cols,
                    height: resizedEmoji.rows,
                  };

                    matches.push({
                      emoji: emoji_string,
                      loc: matchLoc,
                      size: matchSize,
                      score: matchValue,
                    });
                }
              }
            }

            resizedEmoji.delete();
            result.delete();
          }

          filledEmojiMat.delete();
          emojiGray.delete();

        self.postMessage({
          allMatches: matches,
        });  // Send the result back to the main thread
};
