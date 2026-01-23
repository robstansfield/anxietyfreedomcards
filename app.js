/*
&& Code Version 1.2.3 &&
- Changed links from Kartra based in8 membership to Vimeo video files

&& Code Version 1.2.2 &&
- Prerelease:
- Changed flashing button behaviour
- Code optimization
- Minor fixes

&& Code Version 1.2.1 && 
- Changed the way information button is presented
- Bug fixes: 
 - Cards now maximize properly
 - Cards now properly return to the sorting bucket after being minimized

&& Code Version 1.2 &&
- Added access to information about each card
- Fixed Modal scaling issues

&& Code Version 1.1 && 
- Changed the way card sits in a bucket
- Card returns to the original position rather than in the center
- Bug fixes:
 - Fixed last info card not scaling properly
 - Fixed date display on screenshots

&& Code Version 1.0 &&
- First release

&& Code Version 0.12.1 &&
- Major changes to dynamic resizing 

&& Code Version 0.12 && 
- Added Dynamic Resizing

&& Code Version 0.11.4 &&
- Added snapshot support
- Image optimization/Slow loading times
- Bug fixes:
 - Margin errors
 - Maximized cards not centered
 - Cards size issue
 - CORS issues
*/

var header = document.getElementById('header');
var headerHeight = header.getBoundingClientRect().height;
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; // AlecS 23-Aug-2020
var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - headerHeight; // AlecS 23-Aug-2020
var scaleUpDown = 2;

var isMobile = false;
if (height > width) isMobile = true;

// Set container height (compatible with both Kartra and standalone versions)
var contentElements = document.getElementsByClassName('content');
if (contentElements && contentElements[1]) {
    contentElements[1].style.height = (height + headerHeight) + "px";
}

/* -- Global variables -- */
var startHeight;
var startWidth;
var startH;
var startW;
var cardHeight;
var cardWidth;
var rectHeight;
var rectWidth;
var space;
var spaceX;
var spaceY;
var beginningOfSortingArea;
var previousValue;
var numberBoxPosition;

if (isMobile) {
    rectHeight = window.innerHeight / 5;
    rectWidth = rectHeight / 1.4;

    if (rectWidth * 3 + 30 > width) {
        rectHeight = window.innerHeight / 6;
        rectWidth = rectHeight / 1.4;
    }

    spaceX = (window.innerWidth - (rectWidth * 3)) / 3;
    spaceY = spaceX / 4; // AlecS 30-July-2020

    beginningOfSortingArea = height - (rectHeight * 2 + spaceY * 2); // AlecS 30-July-2020

    startH = beginningOfSortingArea / 4;    // Calculate "ideal" height for display of four rows - AlecS 2-Aug-2020
    startW = width / 3;                     // Calculate "ideal" width for display of three columns - AlecS 2-Aug-2020
} else {
    space = 10;
    rectWidth = window.innerWidth / 6 - space + space / 5;
    rectHeight = rectWidth * 1.4;
    startH = (height - rectHeight / 2) / 3; // Calculate "ideal" height for display of three rows - AlecS 2-Aug-2020
    startW = width / 4;                     // Calculate "ideal" width for display of four columns - AlecS 2-Aug-2020
}

// AlecS - 2-Aug-2020 - Choose whichever "ideal card size" would be the smaller
startHeight = Math.min(startH, startW * 1200 / 854); // card image is 1200 x 854
startWidth = startHeight * 854 / 1200;

var resCardsVisible = false; // AlecS 30-July-2020
var needsCardsVisible = false;
var infoCardsVisible = false;
var isMagnified = false;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

var layer = new Konva.Layer();

var sources = {
    r1: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r01.png?cacheblock=true',
    r2: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r02.png?cacheblock=true',
    r3: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r03.png?cacheblock=true',
    r4: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r04.png?cacheblock=true',
    r5: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r05.png?cacheblock=true',
    r6: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r06.png?cacheblock=true',
    r7: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r07.png?cacheblock=true',
    r8: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/r08.png?cacheblock=true',
    n9: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n09.png?cacheblock=true',
    n10: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n10.png?cacheblock=true',
    n11: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n11.png?cacheblock=true',
    n12: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n12.png?cacheblock=true',
    n13: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n13.png?cacheblock=true',
    n14: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n14.png?cacheblock=true',
    n15: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n15.png?cacheblock=true',
    n16: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n16.png?cacheblock=true',
    n17: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n17.png?cacheblock=true',
    n18: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n18.png?cacheblock=true',
    n19: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n19.png?cacheblock=true',
    n20: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/n20.png?cacheblock=true',
    i21: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i21.png?cacheblock=true',
    i22: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i22.png?cacheblock=true',
    i23: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i23.png?cacheblock=true',
    i24: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i24.png?cacheblock=true',
    i25: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i25.png?cacheblock=true',
    i26: 'https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/cards/WebOptimized/i26.png?cacheblock=true'
};

var cardInformationLinks = [
    "https://player.vimeo.com/video/464255541",
    "https://player.vimeo.com/video/464262820",
    "https://player.vimeo.com/video/464269584",
    "https://player.vimeo.com/video/464278150",
    "https://player.vimeo.com/video/464239892",
    "https://player.vimeo.com/video/466628855",
    "https://player.vimeo.com/video/466628509",
    "https://player.vimeo.com/video/466627978",
    "https://player.vimeo.com/video/466627671",
    "https://player.vimeo.com/video/466627003",
    "https://player.vimeo.com/video/466626286",
    "https://player.vimeo.com/video/466627462",
    "https://player.vimeo.com/video/466626771",
    "https://player.vimeo.com/video/466895277",
    "https://player.vimeo.com/video/466631329",
    "https://player.vimeo.com/video/466631092",
    "https://player.vimeo.com/video/466630758",
    "https://player.vimeo.com/video/466630511",
    "https://player.vimeo.com/video/466630264",
    "https://player.vimeo.com/video/464247736",
    "https://player.vimeo.com/video/478521764",
    "https://player.vimeo.com/video/478513659",
    "https://player.vimeo.com/video/478515285",
    "https://player.vimeo.com/video/478516425",
    "https://player.vimeo.com/video/478517694",
    "https://player.vimeo.com/video/478520351"
]

// Start the app
loadImages(sources, buildStage);

function loadImages(sources, callback) {
    let images = {};
    let loadedImages = 0;
    let numImages = 0;
    for (let src in sources)
        numImages++;

    for (let src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) callback(images);
        };

        images[src].crossOrigin = 'Anonymous';
        images[src].src = sources[src];
    }
};

//Sorting bucket rectangles
var rects = new Array(6);

//8 Resource cards(0-7), 12 Needs cards(8-20), 6 Information cards(20-25)
var cards = new Array(26);

function buildStage(images) {

    let magnifiedCardID = loadCards(images);
    loadButtons();

    cards.forEach(card => {
        layer.add(card);
    })

    //Creating the sorting bucket
    if (isMobile) {
        for (let i = 0, counter = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++, counter++) {
                rects[counter] = new Konva.Rect({
                    id: counter,
                    x: (rectWidth + spaceX) * j + spaceX / 2,
                    y: beginningOfSortingArea + ((rectHeight + spaceY) * i),
                    width: rectWidth,
                    height: rectHeight,
                    fill: '#daedcc',
                    name: 'false' //Decides if the rect already has a card on it
                });

                // Load previous data if available
                if (rectsData != undefined) {
                    rects[counter].name(rectsData[counter].attrs.name);
                    let cardID = Number(rects[counter].name());

                    // Check which rectangles have a card and place it there again
                    if (!isNaN(cardID)) placeCardInRect(cards[cardID], rects[counter], true);
                }

                layer.add(rects[counter]);
                rects[counter].moveToTop();
            }
        }
    } else {
        for (let i = 0; i < 6; i++) {
            rects[i] = new Konva.Rect({
                id: i,
                x: (rectWidth + space) * i,
                y: height - rectHeight / 2,
                width: rectWidth,
                height: rectHeight,
                fill: '#daedcc',
                name: 'false' //Decides if the rect already has a card on it
            });

            // Load previous data if available
            if (rectsData != undefined) {
                rects[i].name(rectsData[i].attrs.name);
                let cardID = Number(rects[i].name());

                // Check which rectangles have a card and place it there again
                if (!isNaN(cardID)) placeCardInRect(cards[cardID], rects[i], false);
            }

            layer.add(rects[i]);
            rects[i].moveToTop();
        }
    }

    stage.add(layer);
    arrangeCards(); // Arrange cards on z-axis based on their type
    moveSortedCardsToTop();

    // If a card was magnified, magnify it again
    if (!isNaN(magnifiedCardID)) magnifyCard(cards[magnifiedCardID]);

    layer.draw();
    finishedLoading();
}

function loadCards(images) {
    if (cardsData != undefined) { // Load previous data if available
        cards = cardsData;
        isMagnified = dblClicked;
        cardWidth = startWidth;
        cardHeight = startHeight;

        // Get all cards' heights
        let arr = new Array(26);
        for (let i = 0; i < 26; i++) {
            if (cards[i] == undefined) {
                let err = confirm("Error loading the page. Please reload the page.");
                if (err) location.reload();
            }
            arr[i] = cards[i].height();
        }

        // Find the double clicked card
        let id = arr.indexOf(Math.max(...arr));

        // Update the width, height, x and y of all cards
        cards.forEach(card => {
            card.width(startWidth);
            card.height(startHeight);

            let newX = rescaleCard(stageWidth, card.x(), stage.getWidth());
            let newY = rescaleCard(stageHeight, card.y(), stage.getHeight());

            card.x(newX);
            card.y(newY);
        })

        // Apply the same amount of scaling up/down as before
        while (scaleUpDown > 0)
            scaledown();

        while (scaleUpDown != numOfScale)
            scaleup();

        // Update the position of the magnified card
        if (isMagnified) {
            let { x, y } = previousValues;

            x = rescaleCard(stageWidth, x, stage.getWidth());
            y = rescaleCard(stageHeight, y, stage.getHeight());

            previousValues = { x, y };
        } else {
            id = undefined;
        }

        return id;

        function rescaleCard(oldValueScreen, oldValueCard, newValueScreen) {

            /* Calculate the values based on the ratio between the resolutions and card size
            * For example, calculating the new width of the card is based on the old resolution,
            * new resolution and card's old width:
            * 
            * oldWidth : newWidth = oldResolution : newResolution
            * newWidth = oldWidth * newResolution / oldResolution
            * 
            */

            return newValueScreen * oldValueCard / oldValueScreen;
        }
    } else { // No data available, create new card objects
        values = Object.values(images);

        cardHeight = startHeight;
        cardWidth = startWidth;

        for (let i = 0; i < 26; i++) {
            cards[i] = new Konva.Image({
                id: i,
                image: values[i],
                x: 0,
                y: 0,
                width: cardWidth,
                height: cardHeight,
                draggable: true,
                visible: true,
                name: "false" // Defines is the card in the sorting bucket
            });
        }

        reset() // Position cards on the board

        /* Implementing needed methods for the cards */
        cards.forEach(card => {
            card.on('mouseover', function () {
                document.body.style.cursor = 'pointer';
            });

            card.on('mouseout', function () {
                document.body.style.cursor = 'default';
            });

            card.on('click tap', function () {
                card.moveToTop();
                layer.draw();
            });

            previousValues = {
                x: 0,
                y: 0
            };

            card.on('dblclick dbltap', function () {
                if (!isMagnified) {
                    //Save the position of the card
                    Object.assign(previousValues, {
                        x: card.x(),
                        y: card.y(),
                    })

                    magnifyCard(card);

                    //Disable moving cards around
                    cards.forEach(eachCard => {
                        eachCard.draggable(false);
                        eachCard.listening(false);
                    })
                    card.listening(true);

                    disableButtons();
                } else {
                    // Update the card's width and height
                    let h, w;
                    cards.forEach(c => {
                        if (c.name() != "true" && c.id() != card.id()) {
                            h = c.height();
                            w = c.width();
                        }
                    })

                    card.height(h);
                    card.width(w);

                    // If the card was sorted get it back into the rectangle; else return to original position
                    if (card.name() == "true") {
                        rects.forEach(rect => {
                            if (rect.name() == card.id()) placeCardInRect(card, rect, isMobile);
                        });
                    } else {
                        card.x(previousValues.x);
                        card.y(previousValues.y);

                        // Check if the card is off screen
                        outOfBoundaries(card);
                    }

                    previousValues = {};

                    // Enable moving cards around
                    cards.forEach(eachCard => {
                        eachCard.draggable(true);
                        eachCard.listening(true);
                    })

                    // Enable using the buttons
                    enableButtons();

                    // Remove overlay
                    stage.removeChildren();
                    stage.add(layer);
                }

                layer.draw(); //Update the screen
                isMagnified = !isMagnified;
            })

            card.on('dragstart', function () {
                card.moveToTop();
            });

            card.on('dragend', function () {
                outOfBoundaries(card);

                //Mouse and touch input handling
                let input = {
                    "x": null,
                    "y": null
                }

                if (event.changedTouches) {
                    let touch = event.changedTouches[0];
                    input.x = touch.clientX;
                    input.y = touch.clientY - headerHeight;
                } else {
                    input.x = event.x;
                    input.y = event.y;
                }

                if (isMobile) {
                    if (input.y > beginningOfSortingArea) { //If the card is moved to the sorting bucket area
                        if (card.name() == "true") resetRect(card.id());  //If the client moved a card from one sorting rectangle to another
                        snapToGridY(card, input); //Snap to one of the sorting rectangles
                    } else if (card.name() == "true") //If the card is moved off the grid
                        cardOffGrid(card);

                    layer.draw();
                } else {
                    if (input.y > height - rectHeight / 2) {
                        if (card.name() == "true") resetRect(card.id());
                        snapToGrid(card, input);
                    } else if (card.name() == "true")
                        cardOffGrid(card);

                    moveSortedCardsToTop();
                    layer.draw();
                }
            });
        });
    }
}

function magnifyCard(card) {
    if (height < width * 1.4) {
        card.height(height);
        card.width(height / 1.4);
    } else {
        card.width(width);
        card.height(width * 1.4);
    }

    //Center the card
    card.x(stage.getWidth() / 2 - card.getWidth() / 2);
    card.y(stage.getHeight() / 2 - card.getHeight() / 2);

    card.moveToTop();
    numberBoxOverlay(card);
}

function numberBoxOverlay(card) {
    /* &&& Placment of the overlay on the card &&& 
    *
    * infoStartX = 83px / 854 * 100 = 9.7%
    * infoEndX = 162px / 854 * 100 = 19.0%
    * infoStartX = 75px / 1200 * 100 = 6.25%
    * infoEndY = 155px / 1200 * 100 = 12.9%
    * 
    * Percentages represent the beginning and end points
    * of the number box on the cards design relative to
    * its dimensions in pixels. So if the card were 100px
    * wide, the beginning of the number box would be 9.3%
    * from the beginning of the card -> or x ~= 9px etc.
    *
    * beginningX = 9.7% of cards width + cards X position;
    * endingX = 19.0% of cards width + cards X position;
    * beginningY = 6.25% of cards height + cards Y position;
    * endingY = 12.9% of cards height + cards Y position;
    */

    let beginningX = Math.round((9.7 / 100 * card.getWidth()) + card.x());
    let endingX = Math.round((19.0 / 100 * card.getWidth()) + card.x());
    let beginningY = Math.round((6.25 / 100 * card.getHeight()) + card.y());
    let endingY = Math.round((12.9 / 100 * card.getHeight()) + card.y());

    let numberBoxPosition = { beginningX, endingX, beginningY, endingY };

    drawOverlay(card, numberBoxPosition);
}

function drawOverlay(card, { beginningX, endingX, beginningY, endingY }) {
    let centerX = (beginningX + endingX) / 2
    let centerY = (beginningY + endingY) / 2
    let radius = endingX - centerX;

    let layer2 = new Konva.Layer({
        opacity: 0,
    });

    // Draw the circle
    let circle = new Konva.Circle({
        x: centerX,
        y: centerY,
        radius: radius + 20,
        fill: "#f89a55",
    });

    let id = card.id();

    if (id > 7) circle.fill("#61949f");
    if (id > 19) circle.fill("#489561");

    // On click handler
    circle.on('click tap', function () {
        let id = card.id();
        let url = cardInformationLinks[id];

        window.open(url, "_blank");
    })

    circle.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });

    // Flashing animation
    layer2.add(circle);
    stage.add(layer2);
    layer2.moveToTop();

    let anim = new Konva.Tween({
        node: layer2,
        opacity: 1,
        duration: 1
    })

    anim.play();

    animate(0)

    function animate(i) {
        if (i < 3) {
            if (i % 2 == 0) {
                setTimeout(() => {
                    anim.reverse();
                    i++;
                    animate(i);
                }, 1000);
            } else {
                setTimeout(() => {
                    anim.play();
                    i++;
                    animate(i);
                }, 1000);
            }
        }
    }
}

function moveSortedCardsToTop() {
    cards.forEach(card => {
        if (card.name() == "true") card.moveToTop();
    })
}

/* --- Desktop snap to grid --- */
function snapToGrid(card, input) {
    let foundASpot = false;

    //Determine the row of the card
    rects.forEach(rect => {
        let rectX = rect.x();
        let mX = input.x;
        if (mX > rectX - space && mX < rectX + rectWidth && rect.name() == 'false') {
            placeCardInRect(card, rect, false);
            foundASpot = true;
        }
    });

    //If the client places a card on top of an occupied space
    if (!foundASpot) cardOffGrid(card);
}

/* --- Mobile snap to grid --- */
function snapToGridY(card, input) {
    //Determine the row of the card
    if (input.y > beginningOfSortingArea) {
        input.y > rects[5].y() ? snapToGridX(card, input, 2) : snapToGridX(card, input, 1);

        // if (input.y > rects[5].y()) 
        //     snapToGridX(card, input, 2);
        // else 
        //     snapToGridX(card, input, 1);
    }
}

function snapToGridX(card, input, column) {
    let foundASpot = false;

    //Determine the column of the card
    for (let i = (3 * column) - 3; i < 3 * column; i++) {
        let rectX = rects[i].x();
        let tX = input.x;
        if (tX > rectX - spaceX && tX < rectX + rectWidth && rects[i].name() == 'false') {
            placeCardInRect(card, rects[i], true);
            foundASpot = true;
        }
    }

    //If the client places a card on top of an occupied space
    if (!foundASpot) cardOffGrid(card);
}

function placeCardInRect(card, rect, isPortrait) {
    if (isPortrait) {
        let adjustment = 5; //adjusting for the size of the border around the card image
        card.x(rect.x() - adjustment / 2 / 1.4);
        card.y(rect.y() - adjustment / 2);
        card.width(rect.width() + adjustment / 1.4);
        card.height(rect.height() + adjustment);
        card.name("true");
        rect.name(String(card.id()));
    } else {
        let widthReduction = 25;
        card.width(rect.width() - widthReduction);
        card.height(rect.height() - widthReduction);
        card.x(rect.x() + widthReduction / 2);
        card.y(height - card.height());

        card.name("true");
        rect.name(String(card.id()));
    }
}

function cardOffGrid(card) {
    let cardID = card.id();
    let cardVisible = shouldBeVisible(card);

    card.width(cardWidth);
    card.height(cardHeight);
    card.visible(cardVisible);
    card.name("false");
    resetRect(cardID);
    outOfBoundaries(card);
}

//Check the visibility of the card based on its type
function shouldBeVisible(card) {
    let cardID = card.id();
    if (cardID < 8)
        return resCardsVisible;
    else if (cardID < 20)
        return needsCardsVisible;
    else
        return infoCardsVisible;
}

//If the card is dropped off of a sort rectangle, allow the rectangle to accept other cards
function resetRect(id) {
    rects.forEach(rect => {
        if (rect.name() == id) rect.name("false");
    })
}

// Check if card is dropped off screen
function outOfBoundaries(card) {
    if (card.x() + card.width() > width) {   //Off to the right
        card.x(width - card.width());
    } else if (card.x() < 0) {               //Off to the left
        card.x(0);
    }

    if (card.y() < 0) {                      //Off to the top
        card.y(0);
    } else if (isMobile) {                   //Off to the bottom(considering the sorting bucket)
        if (card.y() + card.height() > beginningOfSortingArea)
            card.y(beginningOfSortingArea - card.height());
    } else {
        if (card.y() + card.height() > height - rectHeight / 2)
            card.y(height - rectHeight / 2 - cardHeight);
    }
}

// Arange cards along z-axis based on their type
function arrangeCards() {
    for (let i = 20; i < 26; i++)
        cards[i].moveToTop();

    for (let i = 8; i < 20; i++)
        cards[i].moveToTop();

    for (let i = 0; i < 8; i++)
        cards[i].moveToTop();

    layer.draw();
}

// AlecS layout cards as grid array
function layoutCardsGrid(cols, rows, startIndex, endIndex) {
    let workspaceHeight = isMobile ? beginningOfSortingArea : height - rectHeight / 2;
    let gapY = (workspaceHeight - rows * cardHeight) / (rows + 1);
    let gapX = (width - cols * cardWidth) / (cols + 1);

    gapY = Math.min(gapY, cardHeight * 0.7);  // Limit gap to 0.7 card height max
    gapX = Math.min(gapX, cardWidth * 0.7);   // Limit gap to 0.7 card width max

    let marginY = (workspaceHeight - rows * cardHeight - (rows - 1) * gapY) / 2;
    let marginX = (width - cols * cardWidth - (cols - 1) * gapX) / 2;

    for (let i = startIndex, colCount = 0; i < endIndex; i++) {
        cards[i].y(marginY + Math.trunc((i - startIndex) / cols) * (cardHeight + gapY));
        cards[i].x(marginX + colCount * (cardWidth + gapX));

        if (++colCount >= cols) colCount = 0;   // Start new row
    }
}

/* ------------------- Button Functionalities ------------------- */

// --- Reset --- //
function reset() {
    //Reseting the card values to their default setting
    cards.forEach(card => {
        card.x(0);
        card.width(startWidth);
        card.height(startHeight);
        card.visible(false);
        card.name("false");
    })

    cardHeight = startHeight;
    cardWidth = startWidth;

    //Resources cards
    let spacing;
    if (isMobile) spacing = (beginningOfSortingArea - cardHeight) / 7;
    else spacing = (height - cardHeight - rectHeight / 2) / 7;

    for (let i = 0; i < 8; i++)
        cards[i].y(spacing * i);

    //Needs cards
    if (isMobile) spacing = (beginningOfSortingArea - cardHeight) / 11;
    else spacing = (height - cardHeight - rectHeight / 2) / 11;

    for (let i = 8; i < 20; i++)
        cards[i].y(spacing * (i - 8));

    //Information cards
    if (isMobile) spacing = (beginningOfSortingArea - cardHeight) / 5;
    else spacing = (height - cardHeight - rectHeight / 2) / 5;

    for (let i = 20; i < 26; i++)
        cards[i].y(spacing * (i - 20));

    // AlecS stuff for layout as grid
    if (isMobile) {
        // Resource cards
        layoutCardsGrid(2, 4, 0, 8); // cols, rows, startIndex, endIndex
        // Needs cards
        layoutCardsGrid(3, 4, 8, 20); // cols, rows, startIndex, endIndex
        // Information cards
        layoutCardsGrid(2, 3, 20, 26); // cols, rows, startIndex, endIndex
    } else {
        // Resource cards
        layoutCardsGrid(4, 2, 0, 8); // cols, rows, startIndex, endIndex
        // Needs cards
        layoutCardsGrid(4, 3, 8, 20); // cols, rows, startIndex, endIndex
        // Information cards
        layoutCardsGrid(3, 2, 20, 26); // cols, rows, startIndex, endIndex
    }
    // end of AlecS stuff for layout as grid

    arrangeCards();

    //Reset the sorting bucket
    rects.forEach(rect => {
        rect.name("false");
    })

    //Reset the buttons
    enableButtons()

    document.getElementById("plus").src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Plus.png";
    document.getElementById("minus").src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Minus.png";
    document.getElementById("resCards").src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Res.png";
    document.getElementById("needsCards").src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Needs.png";
    document.getElementById("infoCards").src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Info.png";
    scaleUpDown = 2;

    //Close the modal
    let modal = document.getElementById("resetModal");
    modal.style.display = "none";
}

// --- Scale up/down --- //
var rateOfChange, rateOfChangeX;
if (isMobile) {
    rateOfChange = startHeight / 5;
    rateOfChangeX = rateOfChange / 1.4;
} else {
    rateOfChangeX = startWidth / 5;
    rateOfChange = rateOfChangeX * 1.4;
}

function scaleup() {
    if (scaleUpDown == 12)
        return;

    cardWidth += rateOfChangeX / 2;
    cardHeight += rateOfChange / 2;
    cards.forEach(card => {
        if (card.name() == "false") {
            let x = card.x();
            let y = card.y();

            card.x(x - rateOfChangeX / 4);
            card.y(y - rateOfChange / 4);
            card.width(cardWidth);
            card.height(cardHeight);

            outOfBoundaries(card);
        }
    });

    scaleUpDown++;

    enableDisableUpDown();
    layer.draw();
}

function scaledown() {
    if (scaleUpDown == 0)
        return;

    cardWidth -= rateOfChangeX / 2;
    cardHeight -= rateOfChange / 2;

    cards.forEach(card => {
        if (card.name() == "false") {
            let x = card.x();
            let y = card.y();

            card.x(x + rateOfChangeX / 4);
            card.y(y + rateOfChange / 4);
            card.width(cardWidth);
            card.height(cardHeight);

            outOfBoundaries(card);
        }
    })
    scaleUpDown--;
    enableDisableUpDown();
    layer.draw();
}


// --- Hide/show cards --- //
function resCards() {
    let isVisible = resCardsVisible;

    for (let i = 0; i < 8; i++) {
        if (cards[i].name() == "false") isVisible ? cards[i].visible(false) : cards[i].visible(true); //Change the visibility for the card
        cards[i].moveToTop();
    }

    let src;
    if (isVisible) {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Res.png"
    } else {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Hide-Res.png"
    }

    document.getElementById('resCards').src = src;

    resCardsVisible = !resCardsVisible;
    moveSortedCardsToTop();
    layer.draw();
}

function needCards() {
    let isVisible = needsCardsVisible;

    for (let i = 8; i < 20; i++) {
        if (cards[i].name() == "false") isVisible ? cards[i].visible(false) : cards[i].visible(true);
        cards[i].moveToTop();
    }

    let src;
    if (isVisible) {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Needs.png"
    } else {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Hide-Needs.png"
    }

    document.getElementById('needsCards').src = src;

    needsCardsVisible = !needsCardsVisible;
    moveSortedCardsToTop();
    layer.draw();
}

function infoCards() {
    let isVisible = infoCardsVisible;

    for (let i = 20; i < 26; i++) {
        if (cards[i].name() == "false") isVisible ? cards[i].visible(false) : cards[i].visible(true);
        cards[i].moveToTop();
    }

    let src;
    if (isVisible) {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Show-Info.png"
    } else {
        src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Hide-Info.png"
    }

    document.getElementById('infoCards').src = src;

    infoCardsVisible = !infoCardsVisible;
    moveSortedCardsToTop();
    layer.draw();
}

// --- Screenshot --- //
function screenshot() {

    // Create the ackground layer(make the background not transparent)
    const backgroundLayer = new Konva.Layer();
    let yChange = 30;

    //Resize the stage to make room for the trademark
    let h = stage.height();
    stage.height(h + yChange);

    // Create the background element
    let stageRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.attrs.width,
        height: stage.attrs.height,
        fill: '#F1F6EC',
    })

    // Add the background element to the layer
    backgroundLayer.add(stageRect)

    // Create the trademark layer
    let trademarkLayer = new Konva.Layer();

    // Create the bar for the trademark
    let bottomBar = new Konva.Rect({
        x: 0,
        y: stage.attrs.height - yChange,
        width: stage.attrs.width,
        height: yChange,
        fill: '#F1F6EC',
    })

    // Create the in8 trademark text
    let d = new Date();
    let dateString = d.getDate() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + '-' + ("0" + d.getHours()).slice(-2) + ":" + ("0" + (d.getMinutes() + 1)).slice(-2);
    let text = new Konva.Text({
        x: 0,
        y: stageRect.height() - yChange + 6,
        text: `© Alec Stansfield ${dateString}`,
        fontSize: 18,
        fontFamily: 'Open Sans',
        fill: 'green',
    });

    // Add the elements to the layer
    trademarkLayer.add(bottomBar);
    trademarkLayer.add(text);

    // Add the bg layer and send it to the back
    stage.add(backgroundLayer);
    backgroundLayer.setZIndex(0);

    // Add the trademark layer to the front
    stage.add(trademarkLayer);

    // Save the screenshot
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, dateString + '.jpg');

    // Remove the layers
    backgroundLayer.destroy();
    trademarkLayer.destroy();

    // Resize the stage to its original size
    stage.height(h);

    // Update the canvas
    layer.draw();
}

async function loadLogo(logoObj, stageRect) {
    let logo = new Konva.Image({
        x: stageRect.width() - 100,
        y: 0,
        image: logoObj,
        width: 100,
        height: 100
    });
    return logo;
}

function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


// --- Enable/disable/update buttons --- //
function enableButtons() {
    let logo = document.getElementById("logo");
    let reset = document.getElementById("reset");
    let plus = document.getElementById("plus");
    let minus = document.getElementById("minus");
    let res = document.getElementById("resCards");
    let needs = document.getElementById("needsCards");
    let info = document.getElementById("infoCards");

    logo.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Logo.png"
    logo.onclick = openLogoModal;
    reset.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Reset.png"
    reset.onclick = openResetModal;
    plus.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Plus.png"
    plus.onclick = scaleup;
    minus.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Minus.png"
    minus.onclick = scaledown;

    // Enable buttons //
    let str, source;
    str = res.src;
    source = str.replace("-Disabled", "");
    res.src = source;
    res.onclick = resCards;

    str = needs.src;
    source = str.replace("-Disabled", "");
    needs.src = source;
    needs.onclick = needCards;

    str = info.src;
    source = str.replace("-Disabled", "");
    info.src = source;
    info.onclick = infoCards;

    // Check if Up or Down need to be disabled
    enableDisableUpDown();
}

function disableButtons() {
    let logo = document.getElementById("logo");
    let reset = document.getElementById("reset");
    let plus = document.getElementById("plus");
    let minus = document.getElementById("minus");
    let res = document.getElementById("resCards");
    let needs = document.getElementById("needsCards");
    let info = document.getElementById("infoCards");
    let snapshot = document.getElementById("snapshot");

    let imgs = document.getElementsByTagName('img');

    for (let i = 0; i < imgs.length; i++)
        imgs[i].onclick = false;

    snapshot.onclick = screenshot;

    // Disable buttons //
    logo.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Logo-Disabled.png"
    reset.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Reset-Disabled.png"
    plus.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Plus-Disabled.png"
    minus.src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Minus-Disabled.png"

    let str, source;
    str = res.src;
    source = insert(str, str.length - 4, "-Disabled")
    res.src = source;

    str = needs.src;
    source = insert(str, str.length - 4, "-Disabled")
    needs.src = source;

    str = info.src;
    source = insert(str, str.length - 4, "-Disabled")
    info.src = source;
}

function enableDisableUpDown() {
    if (scaleUpDown == 0) {
        document.getElementById('minus').src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Minus-Disabled.png"
        document.getElementById('minus').onclick = false;
    } else if (scaleUpDown == 1) {
        document.getElementById('minus').src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Minus.png"
        document.getElementById('minus').onclick = scaledown;
    } else if (scaleUpDown == 11) {
        document.getElementById('plus').src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Plus.png"
        document.getElementById('plus').onclick = scaleup;
    } else if (scaleUpDown == 12) {
        document.getElementById('plus').src = "https://in8-cards-resources.s3-eu-west-1.amazonaws.com/assets/images/Buttons/Button-Plus-Disabled.png"
        document.getElementById('plus').onclick = false;
    }
}

function loadButtons() {
    if (buttonsData == undefined)
        return;

    let buttons = [
        document.getElementById("logo"),
        document.getElementById("reset"),
        document.getElementById("plus"),
        document.getElementById("minus"),
        document.getElementById("resCards"),
        document.getElementById("needsCards"),
        document.getElementById("infoCards")
    ];

    let i = 0;

    buttons.forEach(button => {
        button.onclick = window[buttonsData[i][1]]; // Define onclick call to function
        button.src = buttonsData[i][2];
        i++;
    })

    for (let i = 0; i < 8; i++) {
        if (cards[i].name() == "false") {
            resCardsVisible = cards[i].visible();
            break;
        }
    }

    for (let i = 8; i < 20; i++) {
        if (cards[i].name() == "false") {
            needsCardsVisible = cards[i].visible();
            break;
        }
    }

    for (let i = 20; i < 26; i++) {
        if (cards[i].name() == "false") {
            infoCardsVisible = cards[i].visible();
            break;
        }
    }
}

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function finishedLoading() {
    var loadingWrapper = document.querySelector(".loading-wrapper");
    if (loadingWrapper) {
        loadingWrapper.style.transition = "opacity 0.6s ease";
        loadingWrapper.style.opacity = "0";
        setTimeout(function () {
            loadingWrapper.style.display = "none";
        }, 600);
    }
}