YUI.add("s7-permalink", function (Y) {

    // enable indexing by search engines
    Y.HistoryHash.hashPrefix = "!";

    var history = new Y.HistoryHash();

    Y.S7.on("start", function () {
        Y.S7.fire("position", history.get("slide") || 1);
    });
 
    Y.S7.on("navigate", function (idx) {
        Y.log("history, add: " + idx);
        Y.log("history, current: " + Y.S7.currentSlide);
        history.addValue("slide", idx);
    });

    Y.on("history:change", function (ev) {
        if (ev.src !== Y.HistoryHash.SRC_HASH) return;
        var idx = 1;
        if (ev.changed.slide) idx = ev.changed.slide.newVal;
        Y.S7.fire("position", idx);
    });

}, "0.0.1", {
    requires : [
        "s7-slideshow",
        "history"
    ]
});
