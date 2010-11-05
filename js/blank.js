// This module provides an event that blanks the screen.

var Upstage = Y.Upstage,
    // The ID of the curtain, the element that covers the slideshow.
    CURTAIN_ID = "upstage-curtain",
    ON = "blank:on",
    OFF = "blank:off",
    curtain,
    blanked = false;

// Create the curtain.
Upstage.on("start", function () {

    var div = Y.Node.create("<div id='" + CURTAIN_ID + "'></div>");

    div.setStyles({
        background : "#000",
        position : "absolute",
        top : 0,
        left : 0,
        width : "100%",
        height : "100%",
        zIndex : "100",
        display : "none"
    });

    Y.one("body").append(div);

    curtain = div;

    // Unblank the screen when the curtain is clicked.
    curtain.on("click", Y.bind(Upstage.fire, Upstage, "blank:off"));

});

// Toggle screen blanking.
Upstage.on("blank", function () {

    if (!blanked) Upstage.fire(ON);
    else Upstage.fire(OFF);

});

function error () {
    return Y.error("Curtain not found.");
}

// Blank the screen.
Upstage.on(ON, function () {

    if (!curtain) return error();

    curtain.setStyle("display", "block");

    blanked = true;

});

// Unblank the screen.
Upstage.on(OFF, function () {

    if (!curtain) return error();

    curtain.setStyle("display", "none");

    blanked = false;

});
