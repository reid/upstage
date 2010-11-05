Upstage Slideshow System
========================

Upstage is a slideshow system that runs in a web browser. It's powered by [YUI][].

Upstage is inspired by S5 and S6, which are similar and do much more than this project. This project does nothing more than what I need.

Using Upstage
-------------

Upstage is ready for you to use with [SlideShow][].

    gem install slideshow

Clone this repository. Then symlink it into `~/.slideshow/templates/upstage`.

Then, generate your presentation:

    slideshow -t upstage example.text

For an example of a SlideShow document, see the [deck samples][samples] in the [SlideShow repository][s9].

YUI is not included with Upstage. Download [YUI 3][] and place it in the same folder as your presentation under the directory `yui3`.

Alternatively, you may edit index.html.erb to point to yui.yahooapis.com or another local copy of YUI.

When publishing your slideshow to the internet, you should be using YUI from yui.yahooapis.com: it's much faster.

Upstage's stylesheet references the YUI logo and Gotham font. These files are not included with Upstage's distribution because I can't relicense them.

Hacking Upstage
---------------

Upstage is easily extensible. Interesting moments in the slideshow are exposed as events on Y.Upstage.

- start
    - Fired once when Upstage is ready to be started. This happens right before onload, in upstage.js.
- warp
    - Fired to move forward or backward a given number of steps or slides.
    - Takes an integer representing how many steps to move. If negative, movement will be backwards.
- position
    - Fired to request to move to the specified slide.
    - Takes an integer representing the slide to move to.
    - If the movement is out of bounds (less than 1 or more than the amount of slides) nothing happens. Otherwise, navigate is fired.
    - Normally you'd listen to the navigate event, not this event.
- navigate
    - Fired to actually move to the specified slide.
    - Takes an integer representing the slide that will be shown.
    - Normally only fired by the position event.
    - If you'd like to listen for when a transition will happen, listen to this event.
- transition
    - Fired to perform the actual transition between slides.
    - Takes two YUI Node instances for the previous and next slides, respectively.
    - Normally only fired by the navigate event.
    - May be overriden to add your own transition effects. See transition-fade.js.

Built-in Upstage Modules
------------------------

The upstage.js file loads all Upstage modules and then fires the start event. Here are the included modules:

- slideshow
    - This core module defines most of Upstage's events. Required to do anything useful.
- controls
    - Displays back and next buttons. Shows the current slide number.
- keyboard
    - Handles keyboard interaction to move between slides: back, forward, home, end, etc.
- gesture
    - Handles gesture interaction, exposing ui:swipeleft, ui:swiperight, ui:tap, etc.
    - Provides default handlers that move between slides.
- permalink
    - Updates the fragment identifier of the page to create permalinks to the slides.
    - Navigates to the correct slide when a fragment identifier is in the URL.
- transition-fade
    - Replaces the default transition with one that fades between slides.

Author, License, Bugs
---------------------

Upstage was written by Reid Burke.

Upstage is available online at <http://github.com/reid/upstage>. You may file bugs or contact me there.

  [YUI]: http://yuilibrary.com/
  [SlideShow]: http://slideshow.rubyforge.org/
  [s9]: https://github.com/geraldb/slideshow/
  [samples]: https://github.com/geraldb/slideshow/tree/master/samples/
  [decks]: http://github.com/reid/decks
  [YUI 3]: http://yuilibrary.com/projects/yui3
