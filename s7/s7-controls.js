YUI.add("s7-controls", function (Y) {

    var controls = Y.one("#controls");

    if (
        controls === null
    ) throw new Error("controls are missing");

    Y.S7.on("start", function () {
        controls.one("#prev").on("click", Y.S7.hire("warp", -1));
        controls.one("#next").on("click", Y.S7.hire("warp", 1));        
    });

    // absolute position
    Y.S7.on("navigate", function (idx) {
        controls.one("#currentSlide").setContent(
            idx + "/" + Y.all(".slide").size()
        );
    });

}, "0.0.1", {
    requires : [
        "s7-slideshow",
        "node"
    ]
});
