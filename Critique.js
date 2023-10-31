//import { sheetRead, sheetWrite } from './GSheetFunc.js';

let imgManifest;
let images = [];
let currentImageIndex = 0;
let acceptBtn, naBtn;
//let critiqueQuestions;
let responses = [];
let leftPad;
let rightPad;
let bottomPad;


// Now you can use sheetRead() and sheetWrite() in this file
let topPad;

function preload() {
    imgManifest = loadJSON('data/manifest.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUIDImage + '.jpg');
        images.push({ data: imgData, img: img });
    }
    switchShape('box');
    currentImageIndex = 0;

    definePads();
}

function draw() {
    background(0);
    currentShapeObj.display(getSpinningObjectYPos());
    image(getImg(), imageXPos(), imageYPos(), displayImageWidth(getImg()), displayImageHeight(getImg()));
}

function definePads() {
    leftPad = currentShapeObj.size/2;
    rightPad = currentShapeObj.size/2;
    bottomPad = 20;
    topPad = currentShapeObj.size * 2.125;
}

function getImg() {
    return images[currentImageIndex].img;
}

function getSpinningObjectYPos() {
    return (topPad / 1.9) - (height / 2);
}

function maxImageWidth() {
    return windowWidth - leftPad - rightPad;
}

function maxImageHeight() {
    return windowHeight - topPad - bottomPad;
}

function displayImageWidth(img) {
    let aspectRatio = calculateImageAspectRatio(img);
    if (maxImageWidth() / aspectRatio < maxImageHeight()) {
        return maxImageWidth();
    } else {
        return displayImageHeight(img) * aspectRatio;
    }
}

function displayImageHeight(img) {
    let aspectRatio = calculateImageAspectRatio(img);
    if (maxImageWidth() / aspectRatio < maxImageHeight()) {
        return maxImageWidth() / aspectRatio;
    } else {
        return maxImageHeight();
    }
}

function calculateImageAspectRatio(img) {
    return img.width / img.height;
}

function imageXPos() {
    return -displayImageWidth(getImg()) / 2;
}

function imageYPos() {
   return topPad - (height / 2);
    // return -topPad - displayImageHeight(getImg()) / 2;
}

function naResponse() {
    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDQuestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: 0
    };

    responses.push(response);
    console.log(responses);

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
function doubleClicked() {
    saveResponse();

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;

    // Reset the x position of the spinning object
    currentShapeObj.posX = width / 2;  // Assuming the middle of the canvas is the default position
}
function saveResponse() {
    let scaledValue = map(currentShapeObj.posX, 0, width - currentShapeObj.size, -5, 5);
    scaledValue = constrain(scaledValue, -5, 5);
    if (scaledValue === 0) scaledValue = 0.01;  // Reserve 0 for N/A
    scaledValue = parseFloat(scaledValue.toFixed(2));

    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDQuestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: scaledValue
    };

    responses.push(response);
    console.log(responses);

    // Write to the sheet
    Gsheetfunc.sheetWrite('ImageRatings', response);
}