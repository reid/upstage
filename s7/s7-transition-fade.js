YUI.add("s7-transition-fade", function (Y) {

    Y.S7.on("transition", function (ev) {
        ev.preventDefault();

        var prev = ev.details[0],
            next = ev.details[1];
        
        prev.transition({
            duration : 0.2,
            easing : "ease-out",
            opacity : 0
        }, function () {
            next.setStyles({
                "opacity" : "0",
                "display" : "block"
            });
            next.transition({
                duration : 0.2,
                easing : "ease-out",
                opacity : 1
            });
        });
    });

}, "0.0.1", {
    requires : [
        "s7-slideshow",
        "transition"
    ]
});
