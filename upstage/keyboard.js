YUI.add("upstage-keyboard", function (Y) {

    function keydown (ev) {
        Y.log("upstage-keyboard: " + ev.type + ": " + ev.keyCode);
        switch (ev.keyCode) {
            case 32: // space bar
            case 34: // page down
            case 39: // right
            case 40: // down
                Y.S7.fire("warp", 1);
                break;
            case 33: // page up
            case 37: // left
            case 38: // up
                Y.S7.fire("warp", -1);
                break;
            case 36: // home
                Y.S7.fire("position", 1);
                break;
            case 35: // end
                Y.S7.fire("position", 9999);
                break;
        }
    } 

    Y.S7.on("start", function () {
        Y.on("key", keydown, "body", "down:");
    });

}, "0.0.1", {
    requires : [
        "upstage-slideshow",
        "node",
        "event"
    ]
});
