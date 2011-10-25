// This module provides browser history and permalinks for your presentation.

function UpstagePermalink (config) {
    UpstagePermalink.superclass.constructor.apply(this, arguments);
}

UpstagePermalink.NS = "permalink";

UpstagePermalink.NAME = "upstage-permalink";

UpstagePermalink.ATTRS = {
    strings: {
        value: {
            "slide" : "Slide"
        }
    },
    titleContent: {
        value: Y.one("title").get("text")
    }
};

Y.extend(UpstagePermalink, Y.Plugin.Base, {
    initializer: function (config) {
        var plugin = this;
        var history = new Y.HistoryHash;
        var host = config.host;

        plugin.afterHostEvent("navigate", function (ev) {
            var titleContent = plugin.get("titleContent");
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
                var h1 = next.one("h1,h2,h3,h4,h5,h6,p");
                if (!h1) h1 = next;
                if (h1) slideTitle = h1.get("text");
                if (!slideTitle) slideTitle = plugin.get("strings").slide + " " + index;
                slideTitle = titleContent + ": " + slideTitle;
            }

            Y.one("title").setContent(slideTitle);
        });

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
    },
    _indexToId: function (index) {
        index = this.get("host").snapToBounds(index);
        var slide = this.get("host").get("slides").item(index - 1);
        var id = slide.get("id");

        // Avoid using auto-generated ids, they change on every pageview.
        if (id === Y.stamp(slide, true)) {
            id = null;
        }

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
