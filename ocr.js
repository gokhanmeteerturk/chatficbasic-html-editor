const MIN_RECTANGLE_WIDTH = 50;
const MIN_RECTANGLE_HEIGHT = 10;
const X_THRESHOLD_FOR_GROUPING = 25;

const DEBUG_COLORS = {
  LEFT: "blue",
  RIGHT: "green",
  NONE: "red",
};
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

let worker;
let importScreenshots;
let debugMode = false;

let lastTexts = [];

function discardDuplicates(texts) {
  if(!lastTexts) return texts;

  try {
    const messages_old = lastTexts.map((lastText) => lastText.message);
    const messages_new = texts.map((text) => text.message);

    const [intersection, startIndex] = checkIntersection(messages_old, messages_new);

    if (intersection && startIndex > 0) {
        lastTexts = texts;
        return texts.slice(messages_old.length - startIndex);
    } else {
    }
  } catch (error) {
    console.error(error);
  }
  lastTexts = texts;
  return texts;
}

const initWorker = async () => {
  worker = await Tesseract.createWorker();
  // it should be english only:
  await worker.setParameters(
      // justification: left
    {
    //lang: 'eng',
    // tessedit_pageseg_mode: "3",
    //     tessjs_create_hocr: 0,
    // hocr_font_info: "1",
    // max_page_gradient_recognize: "100",
    //     tessjs_create_tsv: 0,
    tessedit_char_blacklist: "|ﬁﬂéï06",
    }
  );
};

function prepareEmojiSizes(){

}

const showImportScreenshotsModal = async () => {
  importScreenshots.show();
  document.getElementById("screenshotStatus").innerText =
    "Files are not uploaded, just processed by your browser.";
  document.getElementById("screenshotStatus").className = "text-center";
};
var emojiSpriteImageRoi;
async function onOpenCvReady(){
  await initWorker();

  importScreenshots = new bootstrap.Modal(
    document.getElementById("importScreenshotsModal")
  );


    let imgElement = document.createElement('img');
    imgElement.src = './emoji_sprite.png';
    imgElement.onload = () => {
      // Create a canvas to draw the image and get its context
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d',{ willReadFrequently: true });

      // Set canvas dimensions
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      // Draw image onto the canvas
      ctx.drawImage(imgElement, 0, 0);

      // Get the image data from the canvas
      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert the image data to an OpenCV Mat object
      let src = cv.matFromImageData(imgData);

      // Define the ROI (Region of Interest)
      // Here we use the full image as ROI
      let roi = new cv.Rect(0, 0, src.cols, src.rows);
      emojiSpriteImageRoi = src.roi(roi);
    };

}
// document.addEventListener("DOMContentLoaded", async () => {
//   onOpenCvReady();
// });

const onImageUploadOCR = async (files) => {
  const filteredFiles = Array.from(files)
    .filter((file) => file.type.startsWith("image"))
    .sort((a, b) => naturalCompare(a.name, b.name));

  const myPromiseResult = await showImageProcessingModal(files[0]);
  localStorage.setItem("gamma", myPromiseResult["gamma"].toFixed(1));
  localStorage.setItem("sharpen", myPromiseResult["sharpen"].toFixed(1));


const resultTextsArray = [];
  for await (const file of filteredFiles) {
    const currentIndex = filteredFiles.indexOf(file) + 1;

    const canvas = document.getElementById("ocrCanvas");


    // write the image to the canvas
    const ctx = canvas.getContext("2d",{ willReadFrequently: true });
    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        doGammaAndSharpen(myPromiseResult["gamma"], myPromiseResult["sharpen"], canvas, ctx);
        
        document.getElementById(
          "screenshotStatus"
        ).innerText = `Processing ${currentIndex}/${filteredFiles.length} files.`;

        document.getElementById("screenshotStatus").className = "text-center";

        resultTextsArray[currentIndex] = await processImage(img, canvas, ctx);
        resolve();
      };
    });
  }
  const resultTexts = resultTextsArray.filter(n => n)
  for (const textsWithNoDuplicates of resultTexts) {

      for (const text of textsWithNoDuplicates) {
        if(text.message.length>0 && (text.side === "LEFT" || text.side === "RIGHT")){
            addMessageCustom(
                text.side === "LEFT" ? 0 : 2,
                text.message,
                text.cleaned
            );
        }
      }
  }
  refreshChat();

  document.getElementById("screenshotStatus").innerText = "Files processed.";
  document.getElementById("screenshotStatus").className='text-success text-center';
};
function calculateMedian(image) {
  const values = [];
  const data = image.data;
  for (let i = 0; i < data.length; i++) {
    values.push(data[i]);
  }
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[half - 1] + values[half]) / 2;
  } else {
    return values[half];
  }
}
function resizeAndDrawPreviewCanvas() {
    const imageCanvas = document.getElementById("imageCanvas");
    const previewCanvas = document.getElementById("previewCanvas");

    if (imageCanvas && previewCanvas) {
        // Get the 2D contexts
        const imageContext = imageCanvas.getContext("2d");
        const previewContext = previewCanvas.getContext("2d");

        // Get the dimensions of the imageCanvas
        const imageCanvasWidth = imageCanvas.width;
        const imageCanvasHeight = imageCanvas.height;

        // Calculate the aspect ratio
        const aspectRatio = imageCanvasWidth / imageCanvasHeight;

        // Compute maximum dimensions
        const maxWidth = 500;
        const maxHeight = window.innerHeight - 400;

        // Calculate dimensions for the previewCanvas within constraints
        let previewWidth = maxWidth;
        let previewHeight = previewWidth / aspectRatio;

        if (previewHeight > maxHeight) {
            previewHeight = maxHeight;
            previewWidth = previewHeight * aspectRatio;
        }

        // Set the new dimensions for the previewCanvas
        previewCanvas.width = previewWidth;
        previewCanvas.height = previewHeight;
        previewCanvas.style.margin = "0 auto";
        previewCanvas.style.display = "block";
        previewCanvas.style.border = "1px solid #ccc";

        // Draw the image from the first canvas onto the second canvas
        previewContext.drawImage(imageCanvas, 0, 0, imageCanvasWidth, imageCanvasHeight, 0, 0, previewWidth, previewHeight);

        console.log(`Preview canvas resized and content drawn: ${previewWidth}x${previewHeight}`);
    } else {
        console.error("Either imageCanvas or previewCanvas is not found.");
    }
}

function doGammaAndSharpen(gamma, sharpenAmount, canvas, ctx) {
    try{
        function createGammaTable(gamma) {
            const table = new Uint8Array(256);
            for (let i = 0; i < 256; i++) {
                table[i] = Math.min(255, Math.pow(i / 255, 1 / gamma) * 255);
            }
            return table;
        }


        const originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const imageData = new ImageData(
            new Uint8ClampedArray(originalImage.data),
            originalImage.width,
            originalImage.height
        );

        const data = imageData.data;

        // Apply gamma correction
        const gammaTable = createGammaTable(gamma);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = gammaTable[data[i]];     // Red
            data[i + 1] = gammaTable[data[i + 1]]; // Green
            data[i + 2] = gammaTable[data[i + 2]]; // Blue
        }

        ctx.putImageData(imageData, 0, 0);



    let src = cv.matFromImageData(imageData);
    let rgbSrc = new cv.Mat();
    cv.cvtColor(src, rgbSrc, cv.COLOR_RGBA2BGR);    // Step 2: Create destination matrix
    let dst = new cv.Mat();

    // Step 3: Apply sharpening
    const kernel = cv.Mat.eye(3, 3, cv.CV_32F);
    kernel.data32F[0] = 0;
    kernel.data32F[1] = -sharpenAmount;
    kernel.data32F[2] = 0;
    kernel.data32F[3] = -sharpenAmount;
    kernel.data32F[4] = 1 + 4 * sharpenAmount;
    kernel.data32F[5] = -sharpenAmount;
    kernel.data32F[6] = 0;
    kernel.data32F[7] = -sharpenAmount;
    kernel.data32F[8] = 0;

    cv.filter2D(rgbSrc, dst, -1, kernel);

    // Step 4: Convert back to RGBA
    let rgbaDst = new cv.Mat();
    cv.cvtColor(dst, rgbaDst, cv.COLOR_BGR2RGBA);

    // Step 5: Ensure correct data length for ImageData
    const width = canvas.width;
    const height = canvas.height;

    const rgbaData = new Uint8ClampedArray(rgbaDst.data); // Extract data
    if (rgbaData.length !== width * height * 4) {
        console.error(
            `Invalid data length: ${rgbaData.length}. Expected: ${width * height * 4}`
        );
        alert("Error: Data length mismatch detected. Check console for details.");
        return;
    }

    const resultImageData = new ImageData(rgbaData, width, height);
    ctx.putImageData(resultImageData, 0, 0);

    // Cleanup
    src.delete();
    rgbSrc.delete();
    dst.delete();
    rgbaDst.delete();
    kernel.delete();
    }
    catch(err){
        console.error(err);
    }
}

async function showImageProcessingModal(file) {
    return new Promise((resolve, reject) => {
        const defaultGamma = parseFloat(localStorage.getItem("gamma")) || 0.6;
        const defaultSharpen = parseFloat(localStorage.getItem("sharpen")) || 0.0;
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="imageProcessingModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Set overall filter</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <canvas id="imageCanvas" style="display: none" class="img-fluid"></canvas>
                            <canvas id="previewCanvas" class="img-fluid"></canvas>
                            <div class="mt-3">
                                <div class="mb-3">
                                    <label for="gamma" class="form-label">Gamma: <span id="gammaValue">\` + defaultGamma.toFixed(1) + \`</span></label>
                                    <input type="range" class="form-range" id="gamma" min="0.1" max="2.0" step="0.1" value="` + defaultGamma.toFixed(1) + `">
                                </div>
                                <div class="mb-3">
                                    <label for="sharpen" class="form-label">Sharpening: <span id="sharpenValue">\` + defaultSharpen.toFixed(1) + \`</span></label>
                                    <input type="range" class="form-range" id="sharpen" min="0" max="1.0" step="0.1" value="` + defaultSharpen.toFixed(1) + `">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="applyButton">Apply To All</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal element and create Bootstrap modal instance
        const modalElement = document.getElementById('imageProcessingModal');
        const modal = new bootstrap.Modal(modalElement);

        // Get UI elements
        const mycanvas = document.getElementById('imageCanvas');
        const myctx = mycanvas.getContext('2d', { willReadFrequently: true });
        const gammaSlider = document.getElementById('gamma');
        const sharpenSlider = document.getElementById('sharpen');
        const gammaValue = document.getElementById('gammaValue');
        const sharpenValue = document.getElementById('sharpenValue');
        const applyButton = document.getElementById('applyButton');

        let originalImage = null;

        // Handle image loading
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                mycanvas.width = img.width;
                mycanvas.height = img.height;
                myctx.clearRect(0, 0, img.width, img.height);
                myctx.fillStyle = "white";
                myctx.fillRect(0, 0, img.width, img.height);
                myctx.drawImage(img, 0, 0);
                originalImage = myctx.getImageData(0, 0, img.width, img.height);

                applyCorrections();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Gamma correction lookup table
        function createGammaTable(gamma) {
            const table = new Uint8Array(256);
            for (let i = 0; i < 256; i++) {
                table[i] = Math.min(255, Math.pow(i / 255, 1 / gamma) * 255);
            }
            return table;
        }
        // Apply image corrections

        function applyCorrections() {
            if (!originalImage) return;

            // Update slider values display
            gammaValue.textContent = gammaSlider.value;
            sharpenValue.textContent = sharpenSlider.value;

            const gamma = parseFloat(gammaSlider.value);
            const sharpenAmount = parseFloat(sharpenSlider.value);

            const imageData = new ImageData(
                new Uint8ClampedArray(originalImage.data),
                originalImage.width,
                originalImage.height
            );


            const data = imageData.data;

            // Apply gamma correction
            const gammaTable = createGammaTable(gamma);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = gammaTable[data[i]];     // Red
                data[i + 1] = gammaTable[data[i + 1]]; // Green
                data[i + 2] = gammaTable[data[i + 2]]; // Blue
            }


            // Create a temporary canvas to avoid data corruption
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = mycanvas.width;
            tempCanvas.height = mycanvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Put the gamma-corrected image data
            tempCtx.putImageData(imageData, 0, 0);

            // Draw it back to the main canvas
            myctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
            myctx.drawImage(tempCanvas, 0, 0);

           applySharpening(sharpenAmount);

            (() => {
                findAndDisplayRectangles(mycanvas, myctx)
                    .then(() => resizeAndDrawPreviewCanvas())
                    .catch(err => console.error('Error displaying rectangles:', err));
            })();

        }
// Apply sharpening filter with robust handling for ImageData
async function applySharpening(amount) {
    if (!originalImage || amount <= 0) return;

    const imageData = myctx.getImageData(0, 0, mycanvas.width, mycanvas.height);


    let src = cv.matFromImageData(imageData);
    let rgbSrc = new cv.Mat();
    cv.cvtColor(src, rgbSrc, cv.COLOR_RGBA2BGR);
    // Step 2: Create destination matrix
    let dst = new cv.Mat();

    // Step 3: Apply sharpening
    const kernel = cv.Mat.eye(3, 3, cv.CV_32F);
    kernel.data32F[0] = 0;
    kernel.data32F[1] = -amount;
    kernel.data32F[2] = 0;
    kernel.data32F[3] = -amount;
    kernel.data32F[4] = 1 + 4 * amount;
    kernel.data32F[5] = -amount;
    kernel.data32F[6] = 0;
    kernel.data32F[7] = -amount;
    kernel.data32F[8] = 0;

    cv.filter2D(rgbSrc, dst, -1, kernel);

    // Step 4: Convert back to RGBA
    let rgbaDst = new cv.Mat();
    cv.cvtColor(dst, rgbaDst, cv.COLOR_BGR2RGBA);

    // Step 5: Ensure correct data length for ImageData
    const width = mycanvas.width;
    const height = mycanvas.height;

    const rgbaData = new Uint8ClampedArray(rgbaDst.data); // Extract data
    if (rgbaData.length !== width * height * 4) {
        console.error(
            `Invalid data length: ${rgbaData.length}. Expected: ${width * height * 4}`
        );
        alert("Error: Data length mismatch detected. Check console for details.");
        return;
    }

    const resultImageData = new ImageData(rgbaData, width, height);
    myctx.putImageData(resultImageData, 0, 0);

    // Cleanup
    src.delete();
    rgbSrc.delete();
    dst.delete();
    rgbaDst.delete();
    kernel.delete();
}

        // Event listeners
        gammaSlider.addEventListener('input', applyCorrections);
        sharpenSlider.addEventListener('input', applyCorrections);

        // Handle apply button click
        applyButton.addEventListener('click', () => {
            const result = {
                gamma: parseFloat(gammaSlider.value),
                sharpen: parseFloat(sharpenSlider.value)
            };
            modalElement.classList.add('processed'); // Add this line
            modal.hide();
            modalElement.addEventListener('hidden.bs.modal', () => {
                try{
                modalElement.remove();
                }
                catch(err){}
                resolve(result);
            }, { once: true });
        });

        // Handle modal dismissal
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (!modalElement.classList.contains('processed')) {
                modalElement.remove();
                reject(new Error('Modal was dismissed'));
            }
        }, { once: true });

        // Show modal
        modal.show();
    });
}



var showTheProcess;

async function findAndDisplayRectangles(canvas, ctx) {
  const mat = cv.imread(canvas);
  const grayscaleImage = new cv.Mat();
  cv.cvtColor(mat, grayscaleImage, cv.COLOR_RGB2GRAY, 0);
  const median = calculateMedian(grayscaleImage);

  // Define Canny's parameters based on the median value
  let cannyTh1, cannyTh2;
  const s = 0.33;
  if (median > 191) {
    // light images
    cannyTh1 = Math.max(0, (1 - 2 * s) * (255 - median));
    cannyTh2 = Math.max(85, (1 + 2 * s) * (255 - median));
  } else if (median > 127) {
    cannyTh1 = Math.max(0, (1 - s) * (255 - median));
    cannyTh2 = Math.min(255, (1 + s) * (255 - median));
  } else if (median < 63) {
    // dark images
    cannyTh1 = Math.max(0, (1 - 2 * s) * median);
    cannyTh2 = Math.max(85, (1 + 2 * s) * median);
  } else {
    cannyTh1 = Math.max(0, (1 - s) * median);
    cannyTh2 = Math.min(255, (1 + s) * median);
  }
  // Apply Gaussian blur (optional for noise reduction)
  const blurredImage = new cv.Mat();
  const ksize = new cv.Size(5, 5); // Adjust kernel size as needed
  cv.GaussianBlur(
    grayscaleImage,
    blurredImage,
    ksize,
    0,
    0,
    cv.BORDER_REPLICATE
  );

  const edges = new cv.Mat();
  const apertureSize = 3; // Sobel kernel size (common value)
  cv.Canny(blurredImage, edges, cannyTh1, cannyTh2, apertureSize, false); // Use gradient magnitude

  // Find contours (using the Canny edge image)
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  const rectangles = groupRectangles(
    await findRectangles(contours, mat),
    mat.cols
  ).reverse();


  displayRectangles(rectangles, ctx, false);

}

const processImage = async (img, canvas, ctx) => {
showTheProcess = document.getElementById('showProcessSwitch').checked;

  const mat = cv.imread(canvas);

  const maxEmojiSize = Math.round(mat.cols / 17);
  const minEmojiSize = Math.max(Math.round(mat.cols / 29),16);
  const possibleLineHeights = {min:minEmojiSize, max:maxEmojiSize};
  const emojiStep = Math.round((maxEmojiSize - minEmojiSize) / 6);

  // Convert to grayscale (optional but recommended for edge detection)
  const grayscaleImage = new cv.Mat();
  cv.cvtColor(mat, grayscaleImage, cv.COLOR_RGB2GRAY, 0);

  // Calculate median value
  const median = calculateMedian(grayscaleImage);

  // Define Canny's parameters based on the median value
  let cannyTh1, cannyTh2;
  const s = 0.33;
  if (median > 191) {
    // light images
    cannyTh1 = Math.max(0, (1 - 2 * s) * (255 - median));
    cannyTh2 = Math.max(85, (1 + 2 * s) * (255 - median));
  } else if (median > 127) {
    cannyTh1 = Math.max(0, (1 - s) * (255 - median));
    cannyTh2 = Math.min(255, (1 + s) * (255 - median));
  } else if (median < 63) {
    // dark images
    cannyTh1 = Math.max(0, (1 - 2 * s) * median);
    cannyTh2 = Math.max(85, (1 + 2 * s) * median);
  } else {
    cannyTh1 = Math.max(0, (1 - s) * median);
    cannyTh2 = Math.min(255, (1 + s) * median);
  }
  // Apply Gaussian blur (optional for noise reduction)
  const blurredImage = new cv.Mat();
  const ksize = new cv.Size(5, 5); // Adjust kernel size as needed
  cv.GaussianBlur(
    grayscaleImage,
    blurredImage,
    ksize,
    0,
    0,
    cv.BORDER_REPLICATE
  );

  // Perform Canny edge detection with parameter tuning
  const edges = new cv.Mat();
  const apertureSize = 3; // Sobel kernel size (common value)
  cv.Canny(blurredImage, edges, cannyTh1, cannyTh2, apertureSize, false); // Use gradient magnitude

  // Find contours (using the Canny edge image)
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  const rectangles = groupRectangles(
    await findRectangles(contours, mat),
    mat.cols
  ).reverse();


  displayRectangles(rectangles, ctx);

  // recognize text
  const texts = [];

  for await (const rect of rectangles) {

    let text = await recognizeText(img, rect, mat, {minEmojiSize, maxEmojiSize, emojiStep}, possibleLineHeights);
    if(text && text.message !== null && text.message.length > 0){
      const tempOriginal = text.message;
      if(text.message && checkIfShortGibberish(text.message)){
      }
      if(text.message && ((text.message.length > 6 && checkIfFullyGibberish(text.message)) || checkIfShortGibberish(text.message))){
        continue;
      }
      text.message = replaceCommons(text.message);
      text.message = fixGibberish(text.message);

      text.message = replaceCommonFinals(text.message);
      if(isCleaned(tempOriginal, text.message)){
        text.cleaned = true;
      }

      texts.push(text);
    }

  }

  mat.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();

  const textsWithNoDuplicates = discardDuplicates(texts);

  return textsWithNoDuplicates;
};
const findRectangles = async (contours, mat) => {
  const rectangles = [];

  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const rect = cv.boundingRect(contour);

    const roi = mat.roi(rect);

    try {
      const dominantColor = await calculateDominantColor(roi);

      const absDiffRedGreen = Math.abs(dominantColor.red - dominantColor.green);
      const absDiffGreenBlue = Math.abs(
        dominantColor.green - dominantColor.blue
      );
      const absDiffRedBlue = Math.abs(dominantColor.red - dominantColor.blue);

      if (rect.height < mat.cols / 12 || rect.width / rect.height < 1 / 3) {
        continue;
      }

      // if it's too close to 1:1 ratio, it's probably not a text (it's a square or a circle)
      if (rect.width / rect.height < 1.3) {
        // Check dominant color condition
        if (
          dominantColor.red > 240 &&
          dominantColor.green > 240 &&
          dominantColor.blue > 240
        ) {
          continue;
        } else if (
          absDiffRedGreen < 60 &&
          absDiffGreenBlue < 60 &&
          absDiffRedBlue < 60
        ) {
          continue;
        }
      }

      // if rectangle is equal or near the size of the image, it's probably not a text
      if (rect.width >= mat.cols - 10) {
        continue;
      }

      if (
        rect.width >= MIN_RECTANGLE_WIDTH &&
        rect.height >= MIN_RECTANGLE_HEIGHT
      ) {
        const dividerYCoordinates = [];

        const grayscaleRoi = new cv.Mat();
        cv.cvtColor(roi, grayscaleRoi, cv.COLOR_RGBA2GRAY, 0);
        // Loop through all pixels of grayscale ROI
        for (let y = 10; y < grayscaleRoi.rows; y++) {
          let consecutiveWhitePixels = 0;
          if (
            dividerYCoordinates.length == 0 ||
            dividerYCoordinates[dividerYCoordinates.length - 1] < y - 15
          ) {
            for (
              let x = Math.round(grayscaleRoi.cols / 3);
              x < grayscaleRoi.cols;
              x++
            ) {
              // Check if pixel is white (considering 95% white)
              if (grayscaleRoi.ucharPtr(y, x)[0] >= 241) {
                consecutiveWhitePixels++;
                if (consecutiveWhitePixels >= 15) {
                  // Save the y coordinate as a divider
                  dividerYCoordinates.push(y);
                  break;
                }
              } else {
                break;
              }
            }
          }
        }

        if (dividerYCoordinates.length == 0) {
          rectangles.push({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            endX: rect.x + rect.width,
          });
        } else {
          const rectanglesTemp = [];
          let lastStart = 0;
          for (let i = 0; i < dividerYCoordinates.length; i++) {
            if (dividerYCoordinates[i] - lastStart > mat.cols / 12) {
              rectanglesTemp.push({
                x: rect.x,
                y: rect.y + lastStart,
                width: rect.width,
                height: dividerYCoordinates[i] - lastStart,
                endX: rect.x + rect.width,
              });
            }
            lastStart = dividerYCoordinates[i];
          }
          if (rect.height - lastStart > mat.cols / 12) {
            rectanglesTemp.push({
              x: rect.x,
              y: rect.y + lastStart,
              width: rect.width,
              height: rect.height - lastStart,
              endX: rect.x + rect.width,
            });
          }
          // first reverse temp array:
          rectanglesTemp.reverse();
          rectangles.push(...rectanglesTemp);
        }

        grayscaleRoi.delete();
      }
    } catch (error) {
      console.error("Error:", error);
    }

    roi.delete();
  }
  // Iterate through sorted rectangles to check overlapping y-coordinates
  for (let i = 0; i < rectangles.length - 1; i++) {
    const currentRect = rectangles[i];
    const nextRect = rectangles[i + 1];
    const currentRectmidY = currentRect.y + currentRect.height / 2;

    // If the middle point of current rectangle is between the y start and end coordinates of the next rectangle
    if (
      currentRectmidY >= nextRect.y &&
      currentRectmidY <= nextRect.y + nextRect.height
    ) {
      // Remove the rectangle with the smaller width
      if (currentRect.width < nextRect.width) {
        rectangles.splice(i, 1);
        i--; // Decrement index as the array length has decreased
      } else {
        rectangles.splice(i + 1, 1);
      }
    }
  }

  return rectangles;
};
function mostFrequent(arr) {
  const store = {}
    // and ignore <10
  arr.forEach((num) => store[num] && (num>10 && num<80) ? store[num] += 1 : store[num] = 1)
  return Object.keys(store).sort((a, b) => store[b] - store[a])[0]
}
function detectPadding(roi) {
    const y = Math.floor(roi.rows / 2);
    const cols = roi.cols;
    //const rowPtr = roi.ucharPtr(y); // Get the middle row pointer


    function brightness(r,g,b) {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    const brightnessList = [];
    for (let x = 0; x < roi.cols; x++) {
        let [r, g, b, a] = roi.ucharPtr(y, x);
        brightnessList.push(Math.floor(brightness(r,g,b)/3));
    }
    const midValues = brightnessList.slice(Math.floor(cols*0.25), Math.floor(cols*0.75));
    const mostFrequentBrightness = mostFrequent(midValues);
    let leftPaddingEnd = 0;
    let rightPaddingStart = cols;
    let leftFound = 0;
    let rightFound = 0;
    const threshold = 20;
    for(let x = 0; x < brightnessList.length/3; x++) {
        // detect first time if brightness more than 10 PERCENT different:
        if(leftPaddingEnd=== 0 && (brightnessList[x] > 7 && brightnessList[x] < 80) && Math.abs(brightnessList[x] - mostFrequentBrightness) < threshold) {
            leftFound++;
        }
        else{
            leftFound = 0;
        }
        if(leftFound > 2){
            leftPaddingEnd = x;
        }
    }
    for(let x = brightnessList.length; x > brightnessList.length/3; x--) {
        if(rightPaddingStart === cols && (brightnessList[x] > 7 && brightnessList[x] < 81) && Math.abs(brightnessList[x] - mostFrequentBrightness) < threshold) {
            rightFound++;
        }
        else{
            rightFound = 0;
        }
        if(rightFound > 2){
            rightPaddingStart = brightnessList.length - x;
        }
    }

    return {
        left: leftPaddingEnd,
        right: rightPaddingStart
    };
}

// Function to calculate dominant color within a region of interest (ROI)
function calculateDominantColor(roi) {
  return new Promise((resolve, reject) => {
    // Convert the ROI to a canvas
    const canvas = document.createElement("canvas");
    canvas.width = roi.cols;
    canvas.height = roi.rows;
    cv.imshow(canvas, roi);

    // Get the data URL from the canvas
    const dataUrl = canvas.toDataURL();

    // Create an image element
    const img = new Image();

    // Set the source of the image element to the data URL
    img.src = dataUrl;

    // When the image loads, draw it onto a hidden canvas and extract the pixel color data
    img.onload = () => {
      const hiddenCanvas = document.createElement("canvas");
      hiddenCanvas.width = 1;
      hiddenCanvas.height = 1;
      const ctx = hiddenCanvas.getContext("2d",{ willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 1, 1);

      // Get the pixel color data
      const imageData = ctx.getImageData(0, 0, 1, 1).data;
      const red = imageData[0];
      const green = imageData[1];
      const blue = imageData[2];

      // Construct the dominant color object
      const dominantColor = {
        red: red,
        green: green,
        blue: blue,
      };

      // Resolve the promise with the dominant color
      resolve(dominantColor);
    };

    // If there's an error loading the image, reject the promise
    img.onerror = (error) => {
      reject(error);
    };
  });
}

const groupRectangles = (rectangles, width) => {
  const scaleFactor = width / 150;

  return rectangles.map((rect) => ({
    ...rect,
    group:
      rect.x > X_THRESHOLD_FOR_GROUPING * scaleFactor &&
      rect.endX < width - X_THRESHOLD_FOR_GROUPING * scaleFactor
        ? "NONE"
        : width - rect.endX > rect.x
        ? "LEFT"
        : "RIGHT",
  }));
};

const displayRectangles = (rectangles, ctx, addCoordinates=true) => {
  rectangles.forEach((rect) => {
    const color = DEBUG_COLORS[rect.group];

    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = color;
    ctx.lineWidth  = 4;
    ctx.stroke();


    ctx.fillStyle = color;
    ctx.font = "bold 24px Helvetica";
    ctx.fillText(rect.group, rect.x, rect.y - 16);
    if(addCoordinates){
        ctx.font = "bold 12px Helvetica";
        ctx.fillText(
            `(${rect.x}, ${rect.y}, ${rect.endX})`,
            rect.x,
            rect.y + rect.height + 16
        );
    }
  });

};
function findMostCommonColors(imageMat, emojiDetectionStep = 5) {
    let colorCounts = {};
    let yellowCount = 0;
    let purpleCount = 0;
    for (let y = 0; y < imageMat.rows; y++) {
        for (let x = 0; x < imageMat.cols; x++) {
            let [r, g, b, a] = imageMat.ucharPtr(y, x);
            if (a > 0) {  // Ignore fully transparent pixels
                let colorKey = `${r},${g},${b}`;
                colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
                if(y%emojiDetectionStep === 0 && x%emojiDetectionStep === 0) {
                    // 1 pixel for every 5x5 pixel area (or emojiDetectionStep x emojiDetectionStep).
                    if(r > 200){
                        if(b < 93){
                            if(g>170){
                                // yellow-ish
                                yellowCount++;
                            }
                        }
                    }
                    // else if(r>75){
                    //     if(g<120){
                    //         if(b>120){
                    //             // purple-ish
                    //             purpleCount++;
                    //         }
                    //     }
                    //
                    // }

                }
            }
        }
    }

    let mostCommonColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b).split(',').map(Number);
    return {mostCommonColor, yellowCount};
}
const recognizeText = async (img, rect, mat, emojiInfo, possibleLineHeights) => {

let tempCanvas = document.createElement("canvas");
tempCanvas.className='ortacanvas';
document.body.appendChild(tempCanvas);
const roi = mat.roi(rect);
if(showTheProcess){
cv.imshow(tempCanvas,roi);
await new Promise(r => setTimeout(r, 400));
}

    let leftCrop;
    let rightCrop;
    try{
        const paddingObj = detectPadding(roi);
        leftCrop = paddingObj.left;
        rightCrop = paddingObj.right;
    }
    catch(e){
        console.log(e);
    }
    let padding = 12
    padding = Math.round(padding * Math.round(mat.cols) / 1000);

    const x1 = padding * 2;
    const y1 = Math.round(padding * 1.5);

    const x2 = roi.cols - Math.round(padding * 2.5);
    const y2 = roi.rows - padding;
    const maximumPossibleCropDistance = Math.min(roi.cols/2, roi.rows/2)
    let rect2;
    if((leftCrop !== 0 && !leftCrop || leftCrop > maximumPossibleCropDistance) || (rightCrop !== 0 && !rightCrop || rightCrop > maximumPossibleCropDistance)) {
        rect2 = {
          x: x1,
          y: y1,
          width: x2 - (x1 *1.5),
          height: y2 - y1,
        };
    }
    else{
        rect2 = {
          x: leftCrop + 5,
          y: y1,
          width: roi.cols - (leftCrop + rightCrop + 10),
          height: y2 - y1,
        };
    }


  const croppedRoi = new cv.Mat();
  // Create a new cv.Mat object for the padded image
  roi.roi(new cv.Rect(rect2.x, rect2.y, rect2.width, rect2.height)).copyTo(croppedRoi);

if(showTheProcess){
cv.imshow(tempCanvas,croppedRoi);
await new Promise(r => setTimeout(r, 200));
}
  const {mostCommonColor, yellowCount} = findMostCommonColors(croppedRoi, (Math.floor(emojiInfo.minEmojiSize/3)));
  const colorAtCoordinate = mostCommonColor ?? croppedRoi.ucharPtr(4, 2);

  // Extract the BGR values
  const red = colorAtCoordinate[0];
  const green = colorAtCoordinate[1];
  const blue = colorAtCoordinate[2];


  const paddedRoi = new cv.Mat();

  // Fill the paddedRoi with blue color
  paddedRoi.setTo(new cv.Scalar(red, green, blue, 255));

  // Define the border type (here, we use a constant border color)
  const borderType = cv.BORDER_CONSTANT;

  // Define the color of the border (blue)
  const borderColor = new cv.Scalar(red, green, blue, 255)

  // Add padding to the croppedRoi using cv.copyMakeBorder
  cv.copyMakeBorder(
      croppedRoi, // Source image (croppedRoi)
      paddedRoi, // Destination image (paddedRoi)
      // 30,30,30,30,
      30,200,30,60,
      borderType, // Border type
      borderColor // Border color
  );
  let matches = [];
  if(document.getElementById('emojiDetectionSwitch').checked){


        let originalGray = new cv.Mat();
        cv.cvtColor(paddedRoi, originalGray, cv.COLOR_RGBA2GRAY);
       let { allMatches, updatedOriginalImageROI } = detectEmojiFull(paddedRoi,originalGray, emojiSpriteImageRoi, emojiInfo, mostCommonColor, yellowCount);

        originalGray.delete();

       matches=allMatches;
      cv.imshow(tempCanvas,updatedOriginalImageROI);
    const paddedGrayscale = new cv.Mat();
      cv.cvtColor(updatedOriginalImageROI, paddedGrayscale, cv.COLOR_RGBA2GRAY);
    cv.imshow(tempCanvas,paddedGrayscale);
      // console.log("RESULT IMAGE:")
      // await new Promise(r => setTimeout(r, 10000));
  }
  else{
      // first convert to greyscale:
    const paddedGrayscale = new cv.Mat();
      cv.cvtColor(paddedRoi, paddedGrayscale, cv.COLOR_RGBA2GRAY);
    cv.imshow(tempCanvas,paddedGrayscale);
  }

if(showTheProcess){
await new Promise(r => setTimeout(r, 150));
}

  // await new Promise(r => setTimeout(r, 5000));
  let b64image = tempCanvas.toDataURL();

  const paddedWidth = paddedRoi.cols;
  const paddedHeight = paddedRoi.rows;
  // Release Mats to free memory
  roi.delete();
  croppedRoi.delete();
  paddedRoi.delete();

  // Remove temporary canvas element from DOM
  tempCanvas.remove();

  let {
    data: { text },
  } = await worker.recognize(b64image, {
    rectangle: {
      top: 10,
      left: 10,
      width: paddedWidth - 20,
      height: paddedHeight - 20,
    },
  });


  if(document.getElementById('emojiDetectionSwitch').checked && matches.length > 0){
      text=text.replaceAll("2x","zx").replaceAll("2X","zx").replaceAll("Zx","zx").replaceAll("ZX","zx").replaceAll("zX","zx");
    for (const emoji of matches) {
      text = text.replace("zx", emojis[emoji.emoji].e);
    }
  }

  return {
    message: text,
    side: rect.group,
    cleaned: false
  };
};

const debug = () => {
  debugMode = !debugMode;
  document.getElementById("ocrCanvas").style.display = debugMode
    ? "block"
    : "none";
};

const naturalCompare = (a, b) => {
  return new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  }).compare(a, b);
};

// NEW STUFFFFFFFFFFFFFFFF
var emojiCanvas = null;
var filledEmojiCanvas = null;

function getOrCreateEmojiCanvases(){
    if(emojiCanvas == null){
        emojiCanvas = document.createElement("canvas");
          emojiCanvas.width = 64;
          emojiCanvas.height = 64;
    }
    if(filledEmojiCanvas == null){
        filledEmojiCanvas = document.createElement("canvas");
          filledEmojiCanvas.width = 64;
          filledEmojiCanvas.height = 64;
    }
    return {emojiCanvas, filledEmojiCanvas};
}
var resizedEmojiLibrary = {
    "png": {},
    "filled": {}
}

function clearResizedEmojiLibrary(){
    for(const emoji_string in resizedEmojiLibrary.png){
        resizedEmojiLibrary.png[emoji_string].delete();
    }
    for(const emoji_string in resizedEmojiLibrary.filled){
        for(const grayscale_value in resizedEmojiLibrary.filled[emoji_string]){
            for(const dimension in resizedEmojiLibrary.filled[emoji_string][grayscale_value]){
                resizedEmojiLibrary.filled[emoji_string][grayscale_value][dimension].delete();
            }
        }
    }
}

function getResizedEmoji(emoji_string, emojiCoords, mostCommonColor, dimension){
        let background_grayscale_value = Math.floor((0.299 * mostCommonColor[0]) + (0.587 * mostCommonColor[1]) + (0.114 * mostCommonColor[2]));
        background_grayscale_value = Math.floor(Math.max(0, Math.min(255, background_grayscale_value)) /20).toString();


        if(resizedEmojiLibrary.filled.hasOwnProperty(emoji_string)){
            if(resizedEmojiLibrary.filled[emoji_string].hasOwnProperty(background_grayscale_value)){
                if(resizedEmojiLibrary.filled[emoji_string][background_grayscale_value].hasOwnProperty(dimension.toString())){
                    return resizedEmojiLibrary.filled[emoji_string][background_grayscale_value][dimension.toString()];
                }
            }
        }


    if(!resizedEmojiLibrary.png.hasOwnProperty(emoji_string)){
        resizedEmojiLibrary.png[emoji_string] = {};
    }

        // We will need to create it.
    let {emojiCanvas, filledEmojiCanvas} = getOrCreateEmojiCanvases();

    if(!resizedEmojiLibrary.png[emoji_string].hasOwnProperty("64")) {
        let filledEmojiCtx = filledEmojiCanvas.getContext("2d",{ willReadFrequently: true });
        let emojiCroppedRoi = emojiSpriteImageRoi.roi(
        new cv.Rect(emojiCoords.x, emojiCoords.y, 64, 64)
        );
        // Convert emojiRegion to a canvas element
        resizedEmojiLibrary.png[emoji_string]["64"] = emojiCroppedRoi;
    }
    // now we have .png[emoji_string]["64"]

    if(!resizedEmojiLibrary.filled.hasOwnProperty(emoji_string)){
        resizedEmojiLibrary.filled[emoji_string] = {};
    }
    if(!resizedEmojiLibrary.filled[emoji_string].hasOwnProperty(background_grayscale_value)){
        resizedEmojiLibrary.filled[emoji_string][background_grayscale_value] = {};
    }

    if(!resizedEmojiLibrary.filled[emoji_string][background_grayscale_value].hasOwnProperty("64")){
        let filledEmojiCtx = filledEmojiCanvas.getContext("2d",{ willReadFrequently: true });
        let emoji64 = resizedEmojiLibrary.png[emoji_string]["64"];
        let emojiCtx = emojiCanvas.getContext("2d",{ willReadFrequently: true });
        emojiCtx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height);
        cv.imshow(emojiCanvas, emoji64);
        filledEmojiCtx.fillStyle = `rgb(${mostCommonColor[0]}, ${mostCommonColor[1]}, ${mostCommonColor[2]})`;
        filledEmojiCtx.fillRect(0, 0, 64, 64);
        // Now draw the emoji image on the filledEmojiCanvas
        filledEmojiCtx.drawImage(emojiCanvas, 0, 0);
        let emojiGray = new cv.Mat();
        let filledEmojiMat = cv.imread(filledEmojiCanvas);
        cv.cvtColor(filledEmojiMat, emojiGray, cv.COLOR_RGBA2GRAY);
        filledEmojiMat.delete();
        resizedEmojiLibrary.filled[emoji_string][background_grayscale_value]["64"] = emojiGray;
    }
    // now we have .filled[emoji_string][background_grayscale_value]["64"] as gray emoji

    if(!resizedEmojiLibrary.filled[emoji_string][background_grayscale_value].hasOwnProperty(dimension.toString())){
        let emojiGray = resizedEmojiLibrary.filled[emoji_string][background_grayscale_value]["64"];
        let scale = dimension / emojiGray.cols;
        let resizedEmoji = new cv.Mat();
        cv.resize(
          emojiGray,
          resizedEmoji,
          new cv.Size(0, 0),
          scale,
          scale,
          cv.INTER_AREA
        );
        resizedEmojiLibrary.filled[emoji_string][background_grayscale_value][dimension.toString()] = resizedEmoji;
    }
    // now we have .filled[emoji_string][background_grayscale_value][dimension.toString()] as resized emoji

    return resizedEmojiLibrary.filled[emoji_string][background_grayscale_value][dimension.toString()];

      }

      function detectEmojiFull(originalImageROI, originalGray, emojiImageROI, emojiInfo, mostCommonColor, yellowCount) {
        let allMatches = [];

        let greatSize = null;
        let skipYellows = yellowCount < 2;
        Object.keys(emojis).forEach((key) => {
          let emoji_string = key;

          let emojiCoords = emojis[emoji_string];
          if (!emojiCoords) {
            return;
          }
          if(emojiCoords.isYellow && skipYellows) {
            return;
          }
/*
          // Create a new canvas to draw the emoji region from the emojiImageROI
          let {emojiCanvas, filledEmojiCanvas} = getOrCreateEmojiCanvases();

          // Create an ROI from the emojiImageROI based on the sprite sheet coordinates
          let emojiRegion = emojiImageROI.roi(
            new cv.Rect(emojiCoords.x, emojiCoords.y, 64, 64)
          );

          // Convert emojiRegion to a canvas element
          cv.imshow(emojiCanvas, emojiRegion);

          let filledEmojiCtx = filledEmojiCanvas.getContext("2d");
          filledEmojiCtx.fillStyle = `rgb(${mostCommonColor[0]}, ${mostCommonColor[1]}, ${mostCommonColor[2]})`;
          filledEmojiCtx.fillRect(0, 0, 64, 64);

          // Now draw the emoji image on the filledEmojiCanvas
          filledEmojiCtx.drawImage(emojiCanvas, 0, 0);

          let emojiGray = new cv.Mat();
          let filledEmojiMat = cv.imread(filledEmojiCanvas);
          cv.cvtColor(filledEmojiMat, emojiGray, cv.COLOR_RGBA2GRAY);

          */

          let minSize = emojiInfo.minEmojiSize;
          let maxSize = emojiInfo.maxEmojiSize;
          let step = emojiInfo.emojiStep;
          let threshold = 0.78;
          let matches = [];

          for (let width = maxSize; width >= minSize; width -= step) {
              if(greatSize != null && greatSize !== width) {
                  continue;
              }
            let resizedEmoji = getResizedEmoji(emoji_string, emojiCoords, mostCommonColor, width);

            let result = new cv.Mat();
            cv.matchTemplate(
              originalGray,
              resizedEmoji,
              result,
              cv.TM_CCOEFF_NORMED
            );


              // Assume result is a cv.Mat with type CV_32F
const resultData = result.data32F; // Access the underlying Float32Array
const rows = result.rows;
const cols = result.cols;



// Iterate through the buffer directly
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    // Calculate the index in the Float32Array
    let index = y * cols + x;
    let matchValue = resultData[index];
    if (matchValue >= threshold) {
        if(matchValue > 0.9){
            greatSize = width;
        }
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

            result.delete();
          }

          allMatches.push(...matches);
        });

        allMatches = filterCloseMatches(allMatches);
        let updatedOriginalMat;
          let tempCanvas = document.createElement("canvas");
          tempCanvas.width = originalImageROI.cols;
          tempCanvas.height = originalImageROI.rows;
          let tempCtx = tempCanvas.getContext("2d",{ willReadFrequently: true });
          cv.imshow(tempCanvas, originalImageROI);
        for (let i = 0; i < allMatches.length; i++) {
          let match = allMatches[i];

          tempCtx.fillStyle = `rgb(${mostCommonColor[0]}, ${mostCommonColor[1]}, ${mostCommonColor[2]})`;
          tempCtx.fillRect(
            match.loc.x,
            match.loc.y,
            match.size.width,
            match.size.height
          );

          let isTextWhite =
              mostCommonColor[0] * 0.299 +
              mostCommonColor[1] * 0.587 +
              mostCommonColor[2] * 0.114 <
            170;
          tempCtx.fillStyle = isTextWhite
            ? "rgb(228,241,246)"
            : "rgb(15,15,15)";
          tempCtx.font = `${0.72 * match.size.height}px Arial`;
          tempCtx.textAlign = "center";
          tempCtx.textBaseline = "middle";
          tempCtx.fillText(
            "Zx",
            match.loc.x + match.size.width / 2,
            match.loc.y + match.size.height * 0.09 + match.size.height / 2
          );

          // Convert canvas back to Mat
        }
        updatedOriginalMat = cv.imread(tempCanvas);
        let newROI = updatedOriginalMat.roi(new cv.Rect(0, 0, originalImageROI.cols, originalImageROI.rows));


        return {
          allMatches: filterCloseMatches(allMatches),
          updatedOriginalImageROI: newROI,
        };
      }

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

/*
      function findMostCommonColor(imageMat) {
        let colorCounts = {};
        for (let y = 0; y < imageMat.rows; y++) {
          for (let x = 0; x < imageMat.cols; x++) {
            let [r, g, b, a] = imageMat.ucharPtr(y, x);
            if (a > 0) {
              // Ignore fully transparent pixels
              let colorKey = `${r},${g},${b}`;
              colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
            }
          }
        }

        let mostCommonColor = Object.keys(colorCounts)
          .reduce((a, b) => (colorCounts[a] > colorCounts[b] ? a : b))
          .split(",")
          .map(Number);
        return mostCommonColor;
      }

*/











