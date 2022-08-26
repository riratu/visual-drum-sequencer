//Todo: Scene für Menu
//Todo: Switch Tastaturlayout
//Todo: Mousebeats
//Todo: Sezne für Sample Select
//Todo: Midi https://editor.p5js.org/luisa/sketches/B1oq93OoX

let hh, clap, bass, click; //INSTRUMENT. will serve as a container that holds a sound source
let hPat, cPat, bPat; //INSTRUMENT PATTERN. it will be an array of numbers that we can manipulate to make beats
let hPhrase, cPhrase, bPhrase, clickPhrase; //INSTRUMENT PHRASE. which defines how the instrument pattern is interpreted.
let drums; //PART. we will attach the phrase to the part, which will serve as our transport to drive the phrase
let bpmCTRL;
let beatLength;
let cellWidth;
let cellHeight;
let cnv, playPause;
let sPat;
let cursorPos;
let trackNo = 4;
let currentColorPattern;
let szene
let colorFrequency
let track = []
let sceneMode = false

let keyMapScene = {
    q: 10, w: 11, e: 12, r: 13, t: 14, z: 15
}

let keyMapColorPattern = {
    "<": "blue",
    "y": "black",
    "x": "red",
    "c": "greenOderSo",
    "v": "allesManchmal",
    "b": "seltenRandomColors",
    'n': "einzelnHell"
}

let reverseKeyMapBeats = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'],
    ['y', 'x', 'c', 'v', 'b', 'n', 'm', ',']
]

let keyMapBeats = {
    1: [0, 0], 2: [0, 1], 3: [0, 2], 4: [0, 3], 5: [0, 4], 6: [0, 5], 7: [0, 6], 8: [0, 7],
    q: [1, 0], w: [1, 1], e: [1, 2], r: [1, 3], t: [1, 4], z: [1, 5], u: [1, 6], i: [1, 7],
    a: [2, 0], s: [2, 1], d: [2, 2], f: [2, 3], g: [2, 4], h: [2, 5], j: [2, 6], k: [2, 7],
    y: [3, 0], x: [3, 1], c: [3, 2], v: [3, 3], b: [3, 4], n: [3, 5], m: [3, 6], ',': [3, 7]
}

let setCurrentColorPattern = {
    black: function () {
        return random(255)
    }, blue: function () {
        if (round(random(colorFrequency)) !== 1) return [random(255)]
        return [0, 0, random(255)]
    }, red: function () {
        if (round(random(colorFrequency)) !== 1) return [random(255)]
        return [random(255), 0, 0]
    }, greenOderSo: function () {
        if (round(random(colorFrequency)) !== 1) return [random(50), 0, random(50)]
        return [random(255), 0, random(255)]
    }, allesManchmal: function () {
        if (round(random(colorFrequency)) !== 1) return [random(255)]
        return [random(200), random(50), random(50)]
    }, seltenRandomColors: function () {
        if (round(random(colorFrequency)) !== 1) return [random(255, 0)]
        return [random(255), random(50), random(50)]
    }, einzelnHell: function () {
        if (round(random(colorFrequency)) !== 1) return [random(30)]
        return [random(255)]
    }
}

let colorFrequencyKeyMap = {
    'a': 0, 's': 30, 'd': 3
}

function setup() {
    cnv = createCanvas(displayWidth, displayHeight)
    frameRate(10)
    strokeWeight(0.3);

    szene = 5;

    colorArr = [];

    fill(0)
    rect(0, 0, displayWidth, displayHeight)

    beatLength = 8;
    cellWidth = round(width / beatLength);
    cellHeight = round(displayHeight / trackNo);
    squareSize = cellWidth / 6
    textSize(squareSize - 2);

    colorPattern = []

    currentColorPattern = setCurrentColorPattern['black']
    createPattern()

    colorFrequency = 5

    getAudioContext().suspend();
    cnv.mousePressed(canvasPressed);

    cursorPos = 0;

    hh = loadSound('/samples/505/hh.mp3', () => {
    });
    clap = loadSound('/samples/505/hho.mp3', () => {
    });
    bass = loadSound('/samples/505/kick.mp3', () => {
    });
    click = loadSound('/samples/zeug/click_trim.wav', () => {
    });

    //hPat = [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1];
    //cPat = [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    //bPat = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0];
    //sPat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    track[0] = []
    //
    // for (let i = 0; i < trackNo; i++) {
    //     for (let ii = 0; ii <= beatLength; ii++) {
    //         track[0].push(round(random(1)))
    //     }
    // }

    track[0] = [1, 0, 1, 0, 0, 0, 0, 0];
    track[1] = [0, 1, 0, 0, 1, 0, 1, 0];
    track[2] = [0, 0, 0, 0, 1, 0, 0, 0];
    track[3] = [0, 0, 1, 0, 1, 0, 1, 0];

    sPat = [1, 2, 3, 4, 5, 6, 7, 8];

    hPhrase = new p5.Phrase('hh', (time) => {
        hh.play(time);
    }, track[1]);
    cPhrase = new p5.Phrase('clap', (time) => {
        clap.play(time);
    }, track[2]);
    bPhrase = new p5.Phrase('bass', (time) => {
        bass.play(time);
    }, track[0]);
    clickPhrase = new p5.Phrase('click', (time) => {
        click.play(time);
    }, track[3]);

    playPause = createButton("play")
        .position(20, 20)
        .mouseClicked(() => {
            userStartAudio();
            if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded()) {
                if (!drums.isPlaying) {
                    // drums.metro.metroTicks = 0;
                    drums.loop();
                    playPause.html("pause")
                } else {
                    drums.pause();
                    playPause.html("play")
                }
            } else {
                console.log('oops, be patient as the drums load...');
            }
        })

    drums = new p5.Part();

    drums.addPhrase(hPhrase);
    drums.addPhrase(cPhrase);
    drums.addPhrase(bPhrase);
    drums.addPhrase(clickPhrase);
    drums.addPhrase('seq', sequence, sPat);

    bpmCTRL = createSlider(30, 600, 80, 1);
    bpmCTRL.position(10, 70);
    bpmCTRL.input(() => {
        drums.setBPM(bpmCTRL.value())
    });
    drums.setBPM('60');

    //drawMatrix();
}

function mousePressed() {
    //if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    createPattern(currentColorPattern);
    //}
}

function keyPressed() {

    console.log(key);
    if (key === 'Enter') {
        console.log(key);
        let fs = fullscreen();
        fullscreen(!fs);
    }

    if (key === '<') sceneMode = !sceneMode

    if (sceneMode){
        //Choose the Scene
        if (keyCode >= 48 && keyCode <= 57)  szene = keyCode - 48;
        if (undefined !== keyMapScene[key]) szene = keyMapScene[key]

        //Choose the Color-Pattern
        if (undefined !== keyMapColorPattern[key]) {
            currentColorPattern = setCurrentColorPattern[keyMapColorPattern[key]]
            createPattern()
        }

        //How Colorful is is? (I want to delete that, since it is to complicated.)
        if (undefined !== colorFrequencyKeyMap[key]) {
            colorFrequency = colorFrequencyKeyMap[key]
        }
    } else {
        szene = 5
        keyMapBeat(key)
    }
}

function drawVisuals(beatIndex) {

    numberOfsquaresY = floor((displayHeight / squareSize));
    numberOfsquaresX = floor((displayWidth / squareSize));

    switch (szene) {
        case 1:
            greenCrawlingSquares(squareSize, colorArr)
            break;
        case 2:
            greenCrawlingSquaresRandomBev(squareSize, colorArr)
            break;
        case 3:
            noiseSquares(squareSize, colorArr)
            break;
        case 4:
            noiseText(squareSize, colorArr)
            break;
        case 5:
            noiseText2(squareSize, colorArr, beatIndex)
            break;
        case 6:
            noiseTextAllUcChars(squareSize, colorArr)
            break;
        case 7:
            noiseText4(squareSize, colorArr)
            break;
        case 8:
            noiseTextRand(squareSize, colorArr)
            break;
        case 9:
            noiseSquaresRand(squareSize, colorArr)
            break;
        case 10:
            noiseSquaresRand2(squareSize, colorArr)
            break;
        case 11:
            noiseSquaresRand3(squareSize, colorArr)
            break;
        case 12:
            noiseSquaresRand4(squareSize, colorArr)
            break;
        case 13:
            noiseTextSeq2(squareSize, colorArr, beatIndex)
            break;
        case 14:
            beatSeqencer2(squareSize, colorArr, beatIndex)
            break;
        default:
        // code block
    }
    //


}

function noiseSquares(squareSize, colorArr) {
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            let rand = round(random(5))
            //console.log(rand)
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            rect(x, y, squareSize, squareSize)
        }
    }
}

function noiseSquaresRand(squareSize, colorArr) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            x = x + random(1)
            y = y + random(1)
            let rand = round(random(5))
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            rect(x, y, squareSize, squareSize)
        }
    }
}

function noiseSquaresRand2(squareSize, colorArr) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            xNew = x + random(squareSize / 3)
            yNew = y + random(squareSize / 3)
            let rand = round(random(5))
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            rect(xNew, yNew, squareSize, squareSize)
        }
    }
}

function noiseSquaresRand3(squareSize, colorArr) {
    fill(0, 10)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        if (0 == round(random(10))) {
            for (let y = 0; y < displayHeight; y += squareSize) {
                //et ok = round(random(10))
                if (0 == round(random(2))) {
                    //xNew = x + random(squareSize*2)
                    yNew = y + random(squareSize * 2)
                    let rand = round(random(5))
                    fill(currentColorPattern())
                    //fill(colorArr[x][y])
                    rect(x, yNew, squareSize, squareSize)
                }
            }
        }
    }
}

function noiseSquaresRand4(squareSize, colorArr) {
    fill(0, 20)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            if (0 == round(random(50))) {
                //xNew = x + random(squareSize*2)
                //yNew = y + random(squareSize*2)
                let rand = round(random(5))
                fill(currentColorPattern())
                //fill(colorArr[x][y])
                rect(x, y, squareSize, squareSize)
            }

        }
    }
}

function noiseText(squareSize, colorArr) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            let rand = round(random(5))
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            //rect(x, y, squareSize, squareSize)
            let s = Math.random().toString(32).substr(2, 1)
            //Math.random().toString(16).substr(2, length);
            text(s, x, y)
        }
    }
}

function noiseText2(squareSize, colorArr, beatIndex) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {

            fill(currentColorPattern())

            let currentTrack = floor(y / (height / trackNo))
            let currentBeat = floor(x / (width / beatLength))
            let s = reverseKeyMapBeats[currentTrack][currentBeat];
            if (track[currentTrack][currentBeat] === 0) fill(random(50))

            if (currentBeatSquareX(x, beatIndex)) {
                s = ''
                if (track[currentTrack][beatIndex - 1] === 1) {
                    fill("yellow")
                    s = '/'
                }
            }
            text(s, x, y)
        }
    }
}

function beatSeqencer2(squareSize, colorArr, beatIndex) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {

            fill(currentColorPattern())

            let s = ".";

            let currentTrack = floor(y / (height / trackNo))
            let currentBeat = floor(x / (width / beatLength))
            console.log("currentTrack " + currentTrack)
            if (track[currentTrack][currentBeat] === 1) s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));

            if (currentBeatSquareX(x, beatIndex)) {

                if (y > cellHeight + squareSize * 2 && y < cellHeight * 2 - squareSize * 2) {

                }
                if (track[currentTrack][beatIndex - 1] === 1) {
                    fill("yellow")
                    //s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
                    //s = trackSymbol[currentTrack]
                    s = '/'
                }
            }
            text(s, x, y)
        }
    }
}

function noiseTextSeq2(squareSize, colorArr, beatIndex) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            let rand = round(random(5))
            fill(currentColorPattern())

            let s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));

            if (currentBeatSquareX(x, beatIndex)) {
                if (y >= cellHeight + squareSize && y < cellHeight * 2 - squareSize) {
                    if (track[2][beatIndex - 1] === 1) {
                        fill("red")
                        s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
                    }
                } else if (y > squareSize && y < cellHeight - squareSize) {
                    if (track[1][beatIndex - 1] === 1) {
                        fill("red")
                        s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
                    }
                }
            }
            if (track[0][beatIndex - 1] === 1) s = '.';
            text(s, x, y)
        }
    }
}

function noiseTextAllUcChars(squareSize, colorArr) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            let rand = round(random(5))
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            //rect(x, y, squareSize, squareSize)
            let s = String.fromCharCode(0x30A0 + Math.random() * (0x1000 - 0xFFFF + 1));
            //Math.random().toString(16).substr(2, length);
            text(s, x, y)
        }
    }
}

function noiseText4(squareSize, colorArr) {
    fill(0, 10)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            let rand = round(random(5))
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            //rect(x, y, squareSize, squareSize)
            let s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
            //Math.random().toString(16).substr(2, length);
            text(s, x, y)
        }
    }
}

function noiseTextRand(squareSize, colorArr) {
    fill(0)
    rect(0, 0, displayWidth, displayWidth)
    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {
            //et ok = round(random(10))
            x = x + random(4) - 2
            y = y + random(4) - 2
            fill(currentColorPattern())
            //fill(colorArr[x][y])
            //rect(x, y, squareSize, squareSize)
            let s = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
            //Math.random().toString(16).substr(2, length);
            text(s, x, y)
        }
    }
}

function greenCrawlingSquaresRandomBev(squareSize, colorArr) {

    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {

            let offset = (frameCount % (numberOfsquaresY * 10))

            let yNew = (y + offset) % numberOfsquaresY
            let xNew = (x + offset) % numberOfsquaresX

            fill(colorArr[x][y])
            rect(x + xNew, y + yNew, squareSize, squareSize)
        }
    }
}

function greenCrawlingSquares(squareSize, colorArr) {

    for (let x = 0; x < displayWidth; x += squareSize) {
        for (let y = 0; y < displayHeight; y += squareSize) {

            let offset = (frameCount)

            let yNew = (y + offset * 10)

            fill(colorArr[x][y])
            rect(x, yNew % windowHeight, squareSize, squareSize)
        }
    }
}

function createPatternGreenRed() {
    for (let x = 0; x < displayWidth; x += squareSize) {
        colorArr[x] = [];
        for (let y = 0; y < displayHeight; y += squareSize) {
            let green = round(random(255))
            colorArr[x][y] = [random(255), green, 0]
        }
    }
}

function createPatternGreen() {
    for (let x = 0; x < displayWidth; x += squareSize) {
        colorArr[x] = [];
        for (let y = 0; y < displayHeight; y += squareSize) {
            let green = round(random(255))
            colorArr[x][y] = [0, green, 0]
        }
    }
}

function createPatternBlue() {
    for (let x = 0; x < displayWidth; x += squareSize) {
        colorArr[x] = [];
        for (let y = 0; y < displayHeight; y += squareSize) {
            colorArr[x][y] = currentColorPattern()
        }
    }
}

function createPattern() {
    for (let x = 0; x < displayWidth; x += squareSize) {
        colorArr[x] = [];
        for (let y = 0; y < displayHeight; y += squareSize) {
            colorArr[x][y] = currentColorPattern()
        }
    }
}


function canvasPressed() {
    let rowClicked = floor(3 * mouseY / height);
    let indexClicked = floor(16 * mouseX / width);
    if (rowClicked === 0) {
        console.log('first row ' + indexClicked);
        track[1][indexClicked] = +!track[1][indexClicked];
    } else if (rowClicked === 1) {
        console.log('second row');
        track[2][indexClicked] = +!track[2][indexClicked];
    } else if (rowClicked === 2) {
        console.log('third row');
        track[0][indexClicked] = +!track[0][indexClicked];
    }

    drawMatrix();
}

const drawMatrix = () => {
    //background(80);
    stroke('gray');
    strokeWeight(2);
    fill('white');
    for (let i = 0; i < beatLength + 1; i++) {
        //startx, starty, endx, endy
        line(i * cellWidth, 0, i * cellWidth, height);
    }
    for (let i = 0; i < 4; i++) {
        line(0, i * cellHeight, width, i * cellHeight);
    }
    noStroke();
    for (let i = 0; i < beatLength; i++) {
        if (track[1][i] === 1) {
            ellipse(i * cellWidth + 0.5 * cellWidth, cellHeight / 2, 10);
        }
        if (track[2][i] === 1) {
            ellipse(i * cellWidth + 0.5 * cellWidth, cellHeight + (cellHeight / 2), 10);
        }
        if (track[0][i] === 1) {
            ellipse(i * cellWidth + 0.5 * cellWidth, (cellHeight * 2) + (cellHeight / 2), 10);
        }
    }
}

const sequence = (time, beatIndex) => {
    // console.log(beatIndex);
    setTimeout(() => {
        drawVisuals(beatIndex);
        //drawMatrix();
        //drawPlayhead(beatIndex);

    }, time * 1000);
}

const drawPlayhead = (beatIndex) => {
    stroke('red');
    fill(255, 0, 0, 30);
    rect((beatIndex - 1) * cellWidth, 0, cellWidth, height);

}

const touchStarted = () => {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}

function currentBeatSquareX(x, beatIndex) {
    return x >= (beatIndex - 1) * cellWidth && x < (beatIndex) * cellWidth
}

function keyMapBeat(key) {
    //console.log(getKeyByValue(keyMapBeats, [1, 3]))

    if (undefined !== keyMapBeats[key]) {

        let currentTrack = keyMapBeats[key][0]
        let currentBeat = keyMapBeats[key][1]

        //console.log('currentTrack ' + currentTrack + ' currentBeat ' + currentBeat)

        track[currentTrack][currentBeat] = (track[currentTrack][currentBeat] - 1) * -1
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}