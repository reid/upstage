var Upstage = Y.Upstage,
    create = Y.Node.create,
    BOUNDING_BOX = "boundingBox";

function Controls () {
   Controls.superclass.constructor.apply(this, arguments);
}

Controls.NAME = "controls";

Controls.ATTRS = {
    height : {
        value : 37
    },
    total : {
        value : Y.all(".slide").size(),
        readOnly : true
    },
    footer : {
        value : ""
    },
    slide : {
        value : 1
    }
};

Controls.HTML_PARSER = {
    footer : function (srcNode) {
        return srcNode.one(".credit").get("innerHTML");
    }
};

Y.extend(Controls, Y.Widget, {
    renderUI : function () {
        var ft = this.get("contentBox");

        if (!ft) return Y.error("controls: contentBox is missing");

        var nav = create("<div class='nav'></div>");
        nav.appendChild(create("<a class='prev' href='#'>&larr;</a>"));
        nav.appendChild(create("<a class='currentSlide'>0/0</a>"));
        nav.appendChild(create("<a class='next' href='#'>&rarr;</a>"));

        ft.appendChild(nav);

        ft.setStyles({
            "height" : 0,
            "display" : "block"
        });

        ft.transition({
            duration : 0.2,
            easing : "ease-out",
            height : this.get("height") + "px"
        });
    },
    bindUI : function () {
        var controls = this.get(BOUNDING_BOX);

        controls.one(".prev").on("click", Y.bind(Upstage.fire, Upstage, "warp", -1));
        controls.one(".next").on("click", Y.bind(Upstage.fire, Upstage, "warp", 1));

        Upstage.on("navigate", Y.bind("set", this, "slide"));
        Upstage.on("navigate", Y.bind("syncUI", this));
    },
    syncUI : function (idx) {
        var ft = this.get(BOUNDING_BOX);
        ft.one(".currentSlide").setContent(
            this.get("slide") + "/" + this.get("total")
        );
        ft.one(".credit").setContent(this.get("footer"));
    }
});

Upstage.on("start", function () {
    new Controls({srcNode: "#ft"}).render();
});
