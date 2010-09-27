YUI.add("s7-gesture", function (Y) {

    var MIN_SWIPE = 10; // pixel distance for considering gesture as a swipe
    var MIN_HOLD = 500; // milliseconds for considering tap as held

    var fire = Y.bind(Y.S7.fire, Y.S7);

    function publish (name, event, value) {
        Y.S7.publish(name, {
            emitFacade : true,
            defaultFn : Y.bind(Y.S7.fire, Y.S7, event, value)
        });
    }

    publish("ui:tap", "warp", 1);
    publish("ui:heldtap", "position", 1);
    publish("ui:swipeleft", "warp", 1);
    publish("ui:swiperight", "warp", -1);

    function gesture (ev) {

        switch (ev.target.get("tagName").toUpperCase()) {
            case "A":
            case "INPUT":
            case "BUTTON":
                return;
        }

        ev.preventDefault();

        var t = ev.currentTarget;

        t.once("selectstart", function (ev) {
            // prevent text selection in IE
            ev.preventDefault();
        });

        t.setData("gestureX", ev.pageX);
        t.setData("gestureStart", new Date);

        t.once("gesturemoveend", function (ev) {

            var xStart = t.getData("gestureX"),
                xEnd = ev.pageX;

            if ( (xStart - xEnd) > MIN_SWIPE ) {
                fire("ui:swipeleft", t);
            } else if ( (xEnd - xStart) > MIN_SWIPE) {
                fire("ui:swiperight", t);
            } else {

                var timeStart = t.getData("gestureStart").getTime(),
                    timeEnd = (new Date).getTime(),
                    timeDelta = timeEnd - timeStart;

                if ( timeDelta > MIN_HOLD ) {
                    fire("ui:heldtap", timeDelta);
                } else {
                    fire("ui:tap", timeDelta);
                }

            }

        });

    }

    Y.S7.on("start", function () {
        Y.one("body").delegate("gesturemovestart", gesture, ".slide");
    });

}, "0.0.1", {
    requires : [
        "s7-slideshow",
        "event-move"
    ]
});
