import { sheetRead, sheetWrite } from './GSheetFunc.js';

let imgManifest;
let images = [];
let currentImageIndex = 0;
let acceptBtn, naBtn;
let critiqueQuestions;
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
    image(getImg(), imageXPos() - displayImageWidth(getImg()) / 2, imageYPos()- displayImageHeight(getImg()) / 2, displayImageWidth(getImg()), displayImageHeight(getImg()));
}

function definePads() {
    leftPad = 1;
    rightPad = 1;
    bottomPad = 20;
    topPad = currentShapeObj.size * 2.25;
}

function getImg() {
    return images[currentImageIndex].img;
}

function getSpinningObjectYPos() {
    return (topPad / 2.2) - (height / 2);
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
    return leftPad;
}

function imageYPos() {
    return topPad;
}

function acceptResponse() {
    let scaledValue = map(currentShapeObj.posX, 0, width - currentShapeObj.size, -5, 5);
    scaledValue = constrain(scaledValue, -5, 5);
    if (scaledValue === 0) scaledValue = 0.01;  // Reserve 0 for N/A

    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDquestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: scaledValue
    };

    responses.push(response);
    console.log(responses);

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
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
