YUI.add("upstage-controls-fade", function (Y) {
    Y.Upstage.on("start", function () {
        var ft = Y.one("#ft");

        if (!ft) return Y.error("#ft footer is missing");

        ft.setStyles({
            "height" : 0,
            "display" : "block"
        });

        ft.transition({
            duration : 0.2,
            easing : "ease-out",
            height : "30px"
        });
    });
}, "0.0.1", {
    requires : [
        "upstage-controls",
        "transition"
    ]
});
