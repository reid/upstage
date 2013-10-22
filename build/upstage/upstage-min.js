YUI.add("upstage-slideshow",function(e,t){e.Node.addMethod("parentsUntil",function(n,r){return this.ancestors(function(t){return e.DOM.contains(r,t._node)})});var n="upstage",r="contentBox",i="currentSlide",s=i+"Change";e.namespace("Upstage"),e.Upstage=e.Base.create(n,e.Widget,[],{initializer:function(){this.get("contentBox").addClass(this.get("classes").container),this._bindAttributes(),this._publishEvents(),this._detectFeatures()},_detectFeatures:function(){function o(e){return e in n}var t=this.get("boundingBox"),n=e.config.doc.documentElement.style,r="Webkit Moz O ms Khtml".split(" "),i=r.join("Transform,").split(","),s=r.join("TransitionProperty,").split(",");e.Array.some(i,o)&&t.addClass("csstransforms"),e.Array.some(s,o)&&t.addClass("csstransitions")},_publishEvents:function(){this.publish("warp",{emitFacade:!0,defaultFn:function(e,t){t&&t.halt&&t.halt(),this.set(i,this.get(i)+e.details[0])}}),this.publish("navigate",{emitFacade:!0,defaultFn:function(e){var t=e.details[0];t!==this.get(i)&&this.set(i,t)}})},_bindAttributes:function(){this.after("containerClassesChange",function(t){var n=this.get("contentBox");e.Array.each(t.prevVal,n.removeClass,n),e.Array.each(t.newVal,n.addClass,n)}),this.after(s,function(e){this.fire("navigate",e.newVal)}),this.after(s,e.bind("_updateState",this)),this.after(s,e.bind("_updateContainerClasses",this))},_updateContainerClasses:function(e){var t=e.newVal,n=this.get("classes").onPrefix,r=[n+t],i=this.indexToId(t);i!==t&&r.push(n+i),this.set("containerClasses",r)},snapToBounds:function(e){return e=Math.min(e,this.get("slides").size()),e=Math.max(1,e),e},syncUI:function(){var e=this.get(i);e===-1&&this.set(i,1)},getSlideById:function(e){return e=this.snapToBounds(e),this.get("slides").item(e-1)},indexToId:function(e){e=this.snapToBounds(e);var t=this.getSlideById(e).get("id");return t.indexOf("yui_3")===0&&(t=null),t?t:e},_updateState:function(t){var n=this.get("classes"),r=this.get("contentBox"),i=this.get("slides"),s=t.newVal-1,o=r.one("."+n.current),u=i.item(s);e.Array.each([n.before,n.previous,n.next,n.after,n.current],i.removeClass,i),u.addClass(n.current),o&&o.parentsUntil(r).removeClass(n.childCurrent),u.parentsUntil(r).addClass(n.childCurrent);var a=i.size();s>0&&i.item(s-1).addClass(n.previous),s+1<a&&i.item(s+1).addClass(n.next),s>1&&i.slice(0,s-1).addClass(n.before),s+2<a&&i.slice(s+2).addClass(n.after),this.fire("widget:contentUpdate")}},{ATTRS:{slides:{value:null},currentSlide:{value:-1,setter:function(t){t=parseInt(t);var n=e.Attribute.INVALID_VALUE,r=t;return t=this.snapToBounds(t),isNaN(t)||t===r&&t!==this.get(i)&&(n=t),n}},containerClasses:{value:[]},classes:{value:{container:"deck-container",after:"deck-after",before:"deck-before",current:"deck-current",childCurrent:"deck-child-current",next:"deck-next",onPrefix:"on-slide-",previous:"deck-previous"}}},HTML_PARSER:{slides:[".slide"]},CSS_PREFIX:n})},"@VERSION@",{requires:["oop","node","widget","base-build"]}),YUI.add("upstage-keyboard",function(e,t){e.Plugin.UpstageKeyboard=e.Base.create("upstage-keyboard",e.Plugin.Base,[],{initializer:function(t){var n=this.get("host");n.publish("keydown",{emitFacade:!0}),e.one(e.config.win).on("keydown",e.bind("keydown",this))},destructor:function(t){e.one(e.config.win).detach("keydown",e.bind("keydown",this))},keydown:function(e){var t=this.get("host"),n=!0,n=!0;switch(e.keyCode){case 32:case 34:case 39:case 40:t.fire("warp",1);break;case 33:case 37:case 38:t.fire("warp",-1);break;case 36:t.fire("navigate",1);break;case 35:t.fire("navigate",9999);break;case 116:case 27:this.get("playKeycode")||this.set("playKeycode",e.keyCode),e.keyCode===this.get("playKeycode")?(this.set("lastSlideBeforeReset",t.get("currentSlide")),t.fire("navigate",1)):t.fire("navigate",this.get("lastSlideBeforeReset"));break;default:n=!1}n?e.halt():t.fire("keydown",e)}},{NS:"keyboard",ATTRS:{playKeycode:{value:116},lastSlideBeforeReset:{value:1}}})},"@VERSION@",{requires:["upstage-slideshow","base-build","node","event"]}),YUI.add("upstage-blank",function(e,t){function r(e){r.superclass.constructor.apply(this,arguments)}var n=e.Upstage;r.NS="blank",r.NAME="upstage-blank",r.ATTRS={background:{value:"#000"},keycodes:{value:[66,190]},curtain:{value:null}},e.extend(r,e.Plugin.Base,{initializer:function(t){this._createCurtain();var n=this.get("curtain"),r=this;this.onHostEvent("keydown",function(t){var n=t.details[0].keyCode;e.Array.some(r.get("keycodes"),function(e){return e===n})?(r.drop(!r.get("dropped")),t.halt()):r.drop(!1)})},destructor:function(){this.get("curtain").remove(!0)},drop:function(e){this.set("dropped",e),this.get("curtain").setStyle("display",e?"block":"none")},_createCurtain:function(){var t=e.Node.create("<div></div>");t.setStyles({background:this.get("background"),position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:"100",display:"none"}),t.on("click",e.bind("drop",this,!1)),e.one("body").append(t),this.set("curtain",t)}}),e.Plugin.UpstageBlank=r},"@VERSION@",{requires:["upstage-slideshow","plugin"]}),YUI.add("upstage-gesture",function(e,t){function r(e){r.superclass.constructor.apply(this,arguments)}var n=e.Upstage;r.NS="gesture",r.NAME="upstage-gesture",r.ATTRS={gestureEventHandle:{value:null},swipeDistance:{value:10},tapHoldThreshold:{value:500},forceGestureThreshold:{value:300}},e.extend(r,e.Plugin.Base,{initializer:function(t){this.set("gestureEventHandle",e.one("body").on("gesturemovestart",e.bind("gesture",this))),this._publishEvents()},destructor:function(){e.one("body").detach(this.get("gestureEventHandle")),this.set("gestureEventHandle",null)},_publishEvents:function(){function r(r,i,s){n.publish(r,{emitFacade:!0}),t.onHostEvent(r,e.bind("fire",n,i,s))}var t=this,n=t.get("host");r("ui:tap","warp",1),r("ui:heldtap","navigate",1),r("ui:swipeleft","warp",1),r("ui:swiperight","warp",-1)},getSelection:function(){var t="",n,r=e.config.win,i=e.config.doc;return r.getSelection?t=r.getSelection():i.selection&&(t=i.selection.createRange()),n=t,t.text&&
(n=t.text),n.toString()},gestureEnd:function(e,t){var n=this.get("host"),r=e.getData("gestureX"),i=t.pageX,s=this.get("swipeDistance"),o=e.getData("gestureDate").getTime(),u=(new Date).getTime(),a=u-o;if(this.getSelection()&&a>this.get("forceGestureThreshold"))return;r-i>s?n.fire("ui:swipeleft",e):i-r>s?n.fire("ui:swiperight",e):a>this.get("tapHoldThreshold")?n.fire("ui:heldtap",a):n.fire("ui:tap",a)},gesture:function(t){switch(t.target.get("tagName").toUpperCase()){case"A":case"INPUT":case"BUTTON":case"VIDEO":case"OBJECT":return}var n=t.currentTarget;t._event&&t._event.type==="touchstart"&&t.preventDefault(),n.setData("gestureX",t.pageX),n.setData("gestureDate",new Date),n.once("gesturemoveend",e.bind("gestureEnd",this,n))}}),e.Plugin.UpstageGesture=r},"@VERSION@",{requires:["upstage-slideshow","event-move"]}),YUI.add("upstage-permalink",function(e,t){e.Plugin.UpstagePermalink=e.Base.create("upstage-permalink",e.Plugin.Base,[],{initializer:function(t){function s(e){e&&e.newVal?e=e.newVal:e=e||1,e=n._idToIndex(e),e&&e!==i.get("currentSlide")&&i.set("currentSlide",e)}var n=this,r=new e.HistoryHash,i=t.host;n.afterHostEvent("navigate",function(t){var s=n.get("titleContent"),o=t.details[0],u=i.indexToId(o),a;r.addValue("slide",u);if(o==1)a=s;else{var f=i.get("slides").item(o-1),l=f.one("h1,h2,h3,h4,h5,h6,p");l||(l=f),l&&(a=l.get("text")),a||(a=n.get("strings").slide+" "+o),a=s+": "+a}e.one("title").setContent(a)}),r.on("slideChange",s),r.on("slideRemove",s),s(r.get("slide"))},_idToIndex:function(e){var t;return isNaN(e)?(this.get("host").get("slides").some(function(n,r){if(n.get("id")===e)return t=r}),t?t+1:null):e}},{ATTRS:{strings:{value:{slide:"Slide"}},titleContent:{value:e.one("title").get("text")}},NS:"permalink"})},"@VERSION@",{requires:["upstage-slideshow","base-build","node","history"]}),YUI.add("upstage",function(e,t){},"@VERSION@",{use:["upstage-slideshow","upstage-keyboard","upstage-blank","upstage-gesture","upstage-permalink"]});
