S7 Slideshow System
===================

S7 is a slideshow system that runs in a web browser. It's powered by [YUI][].

S7 is inspired by S5 and S6, which are similar and do much more than this project. This project does nothing more than what I need.

Using S7
--------

S7 is ready for you to use with [SlideShow][].

    gem install slideshow

Once SlideShow is installed, you can install the S7 template pack:

    slideshow -f http://github.com/reid/s7/raw/master/s7.txt 

Then, generate your presentation:

    slideshow -t s7 example.text

For an example of a SlideShow document, see my [decks][] repository.

YUI is not included with S7. Download [YUI 3][] and place it in the same folder as your presentation under the directory yui.

Alternatively, you may edit index.html.erb to point to yui.yahooapis.com or another local copy of YUI.

S7's stylesheet references the YUI logo and Gotham font. These files are not included with S7's distribution because I can't relicense them.

Hacking S7
----------

S7 is easily extensible. Interesting moments in the slideshow are exposed as events on Y.S7.

- start
    - Fired once when S7 is ready to be started. This happens right before onload, in s7.js.
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
    - May be overriden to add your own transition effects. See s7-transition-fade.js.

Built-in S7 Modules
-------------------

The s7.js file loads all S7 modules and then fires the start event. Here are the included modules:

- s7-slideshow
    - This core module defines most of S7's events. Required to do anything useful.
- s7-controls
    - Displays back and next buttons. Shows the current slide number.
- s7-keyboard
    - Handles keyboard interaction to move between slides: back, forward, home, end, etc.
- s7-gesture
    - Handles gesture interaction, exposing ui:swipeleft, ui:swiperight, ui:tap, etc.
    - Provides default handlers that move between slides.
- s7-permalink
    - Updates the fragment identifier of the page to create permalinks to the slides.
    - Navigates to the correct slide when a fragment identifier is in the URL.
- s7-transition-fade
    - Replaces the default transition with one that fades between slides.

Author, License, Bugs
---------------------

S7 was written by Reid Burke.

S7 is available online at <http://github.com/reid/s7>. You may file bugs or contact me there.

  [YUI]: http://yuilibrary.com/
  [SlideShow]: http://slideshow.rubyforge.org/
  [decks]: http://github.com/reid/decks
  [YUI 3]: http://yuilibrary.com/projects/yui3
