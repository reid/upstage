var Upstage = Y.Upstage;

var MIN_SWIPE = 10; // pixel distance for considering gesture as a swipe
var MIN_HOLD = 500; // milliseconds for considering tap as held

function publish (name, event, value) {
    Upstage.publish(name, {
        emitFacade : true,
        defaultFn : Y.bind(Upstage.fire, Upstage, event, value)
    });
}

publish("ui:tap", "warp", 1);
publish("ui:heldtap", "position", 1);
publish("ui:swipeleft", "warp", 1);
publish("ui:swiperight", "warp", -1);

var fire = Y.bind(Upstage.fire, Upstage);

function gestureEnd (targetStart, ev) {

    var xStart = targetStart.getData("gestureX"),
        xEnd = ev.pageX;

    if ( (xStart - xEnd) > MIN_SWIPE ) {
        fire("ui:swipeleft", targetStart);
    } else if ( (xEnd - xStart) > MIN_SWIPE ) {
        fire("ui:swiperight", targetStart);
    } else {

        var timeStart = targetStart.getData("gestureDate").getTime(),
            timeEnd = (new Date).getTime(),
            timeDelta = timeEnd - timeStart;

        if ( timeDelta > MIN_HOLD ) {
            fire("ui:heldtap", timeDelta);
        } else {
            fire("ui:tap", timeDelta);
        }

    }

}

function gesture (ev) {

    switch (ev.target.get("tagName").toUpperCase()) {
        case "A":
        case "INPUT":
        case "BUTTON":
            return;
    }

    ev.preventDefault();

    var target = ev.currentTarget;

    target.once("selectstart", function (ev) {
        // prevent text selection in IE
        ev.preventDefault();
    });

    target.setData("gestureX", ev.pageX);
    target.setData("gestureDate", new Date);

    target.once("gesturemoveend", Y.bind(gestureEnd, this, target));

}

Upstage.on("start", function () {
    Y.one("body").delegate("gesturemovestart", gesture, ".slide");
});
