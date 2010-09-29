YUI.add("upstage-controls", function (Y) {

    var controls = Y.one("#nav");

    if (
        controls === null
    ) throw new Error("controls are missing");

    function syncCurrentSlide (idx) {
        controls.one("#currentSlide").setContent(
            idx + "/" + Y.all(".slide").size()
        );
    }

    Y.S7.on("start", function () {
        controls.one("#prev").on("click", Y.bind(Y.S7.fire, Y.S7, "warp", -1));
        controls.one("#next").on("click", Y.bind(Y.S7.fire, Y.S7, "warp", 1));
        syncCurrentSlide(1);
    });

    // absolute position
    Y.S7.on("navigate", syncCurrentSlide);

}, "0.0.1", {
    requires : [
        "upstage-slideshow",
        "node"
    ]
});
