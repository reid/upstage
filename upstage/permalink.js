YUI.add("upstage-permalink", function (Y) {

    var Upstage = Y.Upstage;

    // enable indexing by search engines
    Y.HistoryHash.hashPrefix = "!";

    var history = new Y.HistoryHash,
        title,
        titleContent;

    Upstage.on("start", function () {
        title = Y.one("title");
        titleContent = title.get("innerHTML");

        Upstage.fire("position", history.get("slide") || 1);
    });
 
    Upstage.on("navigate", function (idx) {
        history.addValue("slide", idx);
    });

    Upstage.on("transition", function (ev) {
        var next = ev.details[1],
            idx = next.getData("slide"),
            slide = Upstage.L10N.get("Slide"),
            slideTitle;

        if (idx == 1) {
            // ignore the title slide,
            // because I like it that way.
            slideTitle = titleContent;
        } else {
            var h1 = next.one("h1");
            if (h1) slideTitle = Y.Selection.getText(h1);
            if (!slideTitle) slideTitle = slide + " " + next.getData("slide");
            slideTitle = titleContent + ": " + slideTitle;
        }

        title.setContent(slideTitle);
    });

    // no matter what ev.src this came from, we will get
    // two history:change events for every change
    // that's ok, since position only acts if a change occurs

    function positioner (idx) {
        if (idx && idx.newVal) idx = idx.newVal;
        else idx = 1;
        Upstage.fire("position", idx);
    }

    history.on("slideChange", positioner);
    history.on("slideRemove", positioner);

}, "0.0.1", {
    requires : [
        "upstage-slideshow",
        "node",
        "history",
        "selection"
    ]
});
