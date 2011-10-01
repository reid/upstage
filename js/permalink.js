// This module provides browser history and permalinks for your presentation.

var getText = Y.Selection.getText;

function UpstagePermalink (config) {
    UpstagePermalink.superclass.constructor.apply(this, arguments);
}

UpstagePermalink.NS = "permalink";

UpstagePermalink.NAME = "upstage-permalink";

UpstagePermalink.HTML_PARSER = {
    titleContent: function () {
        return getText(Y.one("title"));
    }
};

UpstagePermalink.ATTRS = {
    strings: {
        value: {
            "slide" : "Slide"
        }
    },
    titleContent: {
        value: ""
    },
    subscriptions: {
        value: []
    }
};

Y.extend(UpstagePermalink, Y.Plugin.Base, {
    initializer: function (config) {
        var plugin = this;
        var subscriptions = [];
        var history = new Y.HistoryHash;
        var host = plugin.get("host");
        var titleContent = getText(Y.one("title"));

        subscriptions.push(
            host.after("navigate", function (ev) {
                var index = ev.details[0];

                var hash = plugin._indexToId(index);
                var slideTitle;

                history.addValue("slide", hash);

                if (index == 1) {
                    // Ignore the title slide,
                    // because I like it that way.
                    slideTitle = titleContent;
                } else {
                    var next = host.get("slides").item(index - 1);
                    var h1 = next.one("h1");
                    if (h1) slideTitle = getText(h1);
                    if (!slideTitle) slideTitle = plugin.get("strings").slide + " " + index;
                    slideTitle = titleContent + ": " + slideTitle;
                }

                Y.one("title").setContent(slideTitle);
            })
        );

        // Handle changes to the URL.

        // No matter what `ev.src` this came from, we will get
        // two `slideChange` events for every change.
        // That's OK, since `position` only acts if a change occurs.

        function positioner (idx) {
            if (idx && idx.newVal) idx = idx.newVal;
            else idx = idx || 1;
            idx = plugin._idToIndex(idx);
            if (idx && idx !== host.get("currentSlide")) {
                Y.log("Valid hash change detected, navigating to slide " + idx, "info", "upstage-permalink");
                host.fire("navigate", idx);
            }
        }

        history.on("slideChange", positioner);
        history.on("slideRemove", positioner);

        // navigate to permalink on startup
        positioner(history.get("slide"));

        // set subscriptions
        this.set("subscriptions", subscriptions);
    },
    destructor: function () {
        Y.Array.each(this.get("subscriptions"), function (ev) {
            ev.detach();
        });
    },
    _indexToId: function (index) {
        index = this.get("host").snapToBounds(index);
        var id = this.get("host").get("slides").item(index - 1).get("id");
        return (id) ? id : index;
    },
    _idToIndex: function (id) {
        var found;
        if (!isNaN(id)) {
            // Treat numbers as slide index.
            return id;
        }
        this.get("host").get("slides").some(function (node, index) {
            if (node.get("id") === id) {
                return found = index;
            }
        });
        if (found) {
            return found + 1;
        } else {
            return null;
        }
    }
});

Y.Plugin.UpstagePermalink = UpstagePermalink;
