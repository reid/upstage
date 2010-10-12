var Upstage = Y.Upstage;

function keydown (ev) {
    Y.log("upstage-keyboard: " + ev.type + ": " + ev.keyCode);
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
    }
}

Upstage.on("start", function () {
    Y.on("key", keydown, "body", "down:");
});
