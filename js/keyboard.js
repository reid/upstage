// This module handles keyboard interaction with the presentation.

var Upstage = Y.Upstage;

function keydown (ev) {
    Y.log("upstage-keyboard: " + ev.type + ": " + ev.keyCode);

    // Unblank the screen for all keys except B.
    if (ev.keyCode != 66) Upstage.fire("blank:off");

    switch (ev.keyCode) {
        case 32: // space bar
        case 34: // page down
        case 39: // right
        case 40: // down
            Upstage.fire("warp", 1);
            break;
        case 33: // page up
        case 37: // left
        case 38: // up
            Upstage.fire("warp", -1);
            break;
        case 36: // home
            Upstage.fire("position", 1);
            break;
        case 35: // end
            Upstage.fire("position", 9999);
            break;
        case 66: // B
            Upstage.fire("blank");
            break;
    }
}

Upstage.on("start", function () {
    // Handle all keydown events on the document.
    Y.on("key", keydown, document, "down:");
});
