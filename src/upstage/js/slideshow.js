/*! Upstage @VERSION@ github.com/reid/upstage
 *  Copyright Yahoo! Inc., BSD licensed: yuilibrary.com/license */

// This is the core of the [Upstage](http://github.com/reid/upstage)
// presentation system. Upstage is built as a collection of modules
// on top of [YUI](http://developer.yahoo.com/yui/3/).

// If you'd like to build a slideshow, check out the
// [README](http://github.com/reid/upstage/blob/master/README.md).

// Upstage was written by [Reid Burke](http://github.com/reid)
// at Yahoo! Inc.
// It's free to use under the [BSD license](http://developer.yahoo.com/yui/license.html).

Y.Node.addMethod("parentsUntil", function parentsUntil (element, parentNode) {
    return this.ancestors(function (ancestor) {
        return Y.DOM.contains(parentNode, ancestor._node);
    });
});

var UPSTAGE_NAME = "upstage",
    CONTENT_BOX = "contentBox",
    CURRENT_SLIDE = "currentSlide",
    CURRENT_SLIDE_CHANGE = CURRENT_SLIDE + "Change";

Y.namespace("Upstage");

Y.Upstage = Y.Base.create(UPSTAGE_NAME, Y.Widget, [], {
    initializer: function () {
        this.get("contentBox").addClass(this.get("classes").container);
        this._bindAttributes();
        this._publishEvents();
        this._detectFeatures();
    },
    _detectFeatures: function () {
        // deck.js compat
        var boundingBox = this.get("boundingBox"),
            style = Y.config.doc.documentElement.style,
            prefixes = "Webkit Moz O ms Khtml".split(" "), // warning: khtml will be skipped
            transformProperties = prefixes
                .join("Transform,").split(","),
            transitionProperties = prefixes
                .join("TransitionProperty,").split(",");

        function testStyle (property) {
            return property in style;
        }

        if (Y.Array.some(transformProperties, testStyle)) {
            boundingBox.addClass("csstransforms");
        }
        if (Y.Array.some(transitionProperties, testStyle)) {
            boundingBox.addClass("csstransitions");
        }
    },
    _publishEvents: function () {
        this.publish("warp", {
            emitFacade: true,
            defaultFn: function (ev, mouseEvent) {
                if (mouseEvent && mouseEvent.halt) {
                    // prevent navigation to "#"
                    mouseEvent.halt();
                }
                this.set(CURRENT_SLIDE, this.get(CURRENT_SLIDE) + ev.details[0]);
            }
        });

        // Legacy event.
        this.publish("navigate", {
            emitFacade: true,
            defaultFn: function (ev) {
                var idx = ev.details[0];
                if (idx !== this.get(CURRENT_SLIDE)) {
                    this.set(CURRENT_SLIDE, idx);
                }
            }
        });
    },
    _bindAttributes: function () {
        this.after("containerClassesChange", function (ev) {
            var contentBox = this.get("contentBox");
            Y.Array.each(ev.prevVal, contentBox.removeClass, contentBox);
            Y.Array.each(ev.newVal, contentBox.addClass, contentBox);
        });
        this.after(CURRENT_SLIDE_CHANGE, function (ev) {
            // Fire legacy event.
            this.fire("navigate", ev.newVal);
        });
        this.after(CURRENT_SLIDE_CHANGE, Y.bind("_updateState", this));
        this.after(CURRENT_SLIDE_CHANGE, Y.bind("_updateContainerClasses", this));
        this.after(CURRENT_SLIDE_CHANGE, Y.bind("_deselect", this));
    },
    _deselect: function () {
        // Deselect elements which are no longer visible.
        // Eliminates phantom selected text on iOS.
        var win = Y.config.win;
        if (win.getSelection) {
            win.getSelection().removeAllRanges();
        } else if (win.selection) {
            win.selection.empty();
        }
    },
    _updateContainerClasses: function (ev) {
        var currentIndex = ev.newVal,
            onPrefix = this.get("classes").onPrefix,
            containerClasses = [
                onPrefix + currentIndex
            ],
            currentId = this.indexToId(currentIndex);

        if (currentId !== currentIndex) {
            containerClasses.push(onPrefix + currentId);
        }

        this.set("containerClasses", containerClasses);
    },
    snapToBounds: function (index) {
        index = Math.min(index, this.get("slides").size());
        index = Math.max(1, index);
        return index;
    },
    syncUI: function () {
        var currentSlide = this.get(CURRENT_SLIDE);
        if (currentSlide === -1) {
            Y.log("Firing navigate since no navigation occured at startup.", "info", "upstage");
            this.set(CURRENT_SLIDE, 1);
        }
    },
    getSlideById: function (index) {
        index = this.snapToBounds(index);
        return this.get("slides").item(index - 1);
    },
    indexToId: function (index) {
        index = this.snapToBounds(index);
        var id = this.getSlideById(index).get("id");

        // Avoid using auto-generated ids, they change on every pageview.
        if (id.indexOf("yui_3") === 0) {
            id = null;
        }

        return (id) ? id : index;
    },
    _updateState: function (ev) {
        var classes = this.get("classes");
        var contentBox = this.get("contentBox");
        var slides = this.get("slides");
        var current = ev.newVal - 1;

        // not the previous slide, per-se.
        // just the one that's about tbe be navigated away from.
        var lastSlide = contentBox.one("." + classes.current);

        var currentSlide = slides.item(current);

        // Remove classes from slides.
        Y.Array.each([
            classes.before,
            classes.previous,
            classes.next,
            classes.after,
            classes.current
        ], slides.removeClass, slides);

        // Set current slide.
        currentSlide.addClass(classes.current);

        if (lastSlide) {
            // Last slide doesn't exist on startup.
            lastSlide.parentsUntil(contentBox).removeClass(classes.childCurrent);
        }
        currentSlide.parentsUntil(contentBox).addClass(classes.childCurrent);

        var slideTotal = slides.size();

        if (current > 0) {
            slides.item(current - 1).addClass(classes.previous);
        }
        if (current + 1 < slideTotal) {
            slides.item(current + 1).addClass(classes.next);
        }
        if (current > 1) {
            slides.slice(0, current - 1).addClass(classes.before);
        }
        if (current + 2 < slideTotal) {
            slides.slice(current + 2).addClass(classes.after);
        }
        this.fire("widget:contentUpdate");
    }
}, {
    ATTRS: {
        slides: {
            value: null
        },
        currentSlide: {
            value: -1,
            setter: function (index) {
                index = parseInt(index);
                var normalizedIndex = Y.Attribute.INVALID_VALUE,
                    originalIndex = index;
                index = this.snapToBounds(index);
                if (isNaN(index)) {
                    Y.log("Invalid index, invalid " + index + " snapped from " + originalIndex, "info", "upstage");
                } else if (index !== originalIndex) {
                    Y.log("Index out of bounds, invalid " + index + " snapped from " + originalIndex, "info", "upstage");
                } else if (index === this.get(CURRENT_SLIDE)) {
                    Y.log("Nothing changed, invalid.", "info", "upstage");
                } else {
                    Y.log("currentSlide validated.", "info", "upstage");
                    normalizedIndex = index;
                }
                return normalizedIndex;
            }
        },
        containerClasses: {
            value: []
        },
        classes: {
            value: {
                container: "deck-container",
                after: "deck-after",
                before: "deck-before",
                current: "deck-current",
                childCurrent: "deck-child-current",
                next: "deck-next",
                onPrefix: "on-slide-",
                previous: "deck-previous"
            }
        }
    },
    HTML_PARSER: {
        slides: [".slide"]
    },
    CSS_PREFIX: UPSTAGE_NAME
});
