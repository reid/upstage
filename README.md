# The Upstage System

Upstage is a slideshow system that runs in a web browser. It's powered by [YUI][].

## Getting started

Clone this repo and open index.html. Your slides are HTML.

Copy the `build` directory and `index.html` to your own workspace and get writing.

## Building Upstage

Source files are located in `js` and `css` directories.

Upstage uses [YUI Builder][] and Apache Ant. Clone YUI Builder in a sibling directory, then run `ant` to build Upstage.

Ant property files are in the `components` directory.

## Hacking Upstage

Upstage is easily extensible. Interesting moments in the slideshow are exposed as events on Y.Upstage.

- warp
    - Fired to move forward or backward a given number of steps or slides.
    - Takes an integer representing how many steps to move. If negative, movement will be backwards.
    - Default action: Will fire the navigate event with the specific slide index.
- navigate
    - Fired to request to move to the specified slide.
    - Takes an integer representing the slide to move to.
    - Default action:
        - If the movement is allowed, the slide is moved.
        - If the movement is out of bounds (less than 1 or more than the amount of slides), nothing happens and the event is not propagated.
        - Therefore, if you want to know to when a slide actually moves, subscribe to the after moment of this event.

Check out `js/permalink.js` for an example of using the navigate event.

## Built-in Upstage Modules

- upstage-slideshow
    - A YUI Widget representing the slideshow. Provides warp and navigate events.
    - Requires upstage-keyboard, upstage-gesture, or your own plugin to actually navigate slides.
- upstage-keyboard
    - Handles keyboard interaction to move between slides: back, forward, home, end, etc.
    - Provides Upstage events: keydown.
- upstage-gesture
    - Handles gesture interaction.
    - Provides Upstage events: ui:swipeleft, ui:swiperight, ui:tap, ui:heldtap.
- upstage-permalink
    - Updates the fragment identifier of the page to create permalinks to the slides.
    - Navigates to the correct slide when a fragment identifier is in the URL.
- upstage-blank
    - Blanks the screen when `B` is pressed.
    - Uses the keydown event provided by upstage-keyboard.

## Author, License, Bugs

Upstage was written by Reid Burke.

Upstage is available online at <http://github.com/reid/upstage>. You may file bugs or contact me there.

  [YUI]: http://yuilibrary.com/
  [YUI Builder]: http://github.com/yui/builder
