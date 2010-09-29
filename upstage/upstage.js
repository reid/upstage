YUI({
    base : "yui3/build/",
    // filter : "debug",
    useConsole : true
}).use(
    "upstage-slideshow",
    "upstage-controls",
    "upstage-keyboard",
    "upstage-gesture",
    "upstage-permalink",
    "upstage-transition-fade",
    function (Y) {
        Y.Upstage.fire("start");
    }
);
