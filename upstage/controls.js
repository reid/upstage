YUI.add("upstage-controls", function (Y) {

    var Upstage = Y.Upstage;

    var controls = Y.one("#nav");

    if (
        controls === null
    ) throw new Error("controls are missing");

    function syncCurrentSlide (idx) {
        controls.one("#currentSlide").setContent(
            idx + "/" + Y.all(".slide").size()
        );
    }

    Upstage.on("start", function () {
        controls.one("#prev").on("click", Y.bind(Upstage.fire, Upstage, "warp", -1));
        controls.one("#next").on("click", Y.bind(Upstage.fire, Upstage, "warp", 1));
        syncCurrentSlide(1);
    });

    // absolute position
    Upstage.on("navigate", syncCurrentSlide);

}, "0.0.1", {
    requires : [
        "upstage-slideshow",
        "node"
    ]
});
