# Upstage

Upstage is a library for building web presentations.

## Examples

Upstage was created in 2010 for a [YUIConf](http://yuilibrary.com/yuiconf/) talk to
embed actual live demos in the same medium as the presentation.

In 2012, the presentation [Write Code That Works][wctw] used Upstage
to embed webcam video into a slide. This allowed the audience to see
[multiple live demos of various tablets and phones on the big screen][demo].
The [presentation][wctw] and its [S9 source file][wctw-source] are
a fine example of what's possible.

Both of these talks used the APIs described below to extend Upstage.

## Quick Start

This repository includes `index.html` as a starting point.
Copy the `build` directory and `index.html` to your own workspace and get writing.

You may also be interested in generating HTML from a template language.
An example using [Jade][] is provided at `index.jade`. (This is how I write my slides.)
To use the example, copy `*.jade` and `package.json` to your own workspace,
run `npm install` to install the Jade compiler, then run `npm run build` or `npm run watch`
to build your presentation.

## Themes

Upstage is compatible with [deck.js][] themes.
You can drop in [deck.js themes](https://github.com/imakewebthings/deck.js/tree/master/themes/style)
or [community themes](https://github.com/imakewebthings/deck.js/wiki#visual-themes) by simply adding
their CSS to your presentation.

## Hacking Upstage

Want to modify Upstage itself? Upstage uses [YUI][] and its [Shifter][] build system. To build, run:

    npm install -g shifter
    cd src/upstage
    shifter

Source files are located in `js` and `css` directories.

### Events

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

### Modules

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

Upstage is available online at <https://github.com/reid/upstage>. You may file bugs or contact me there.

  [YUI]: http://yuilibrary.com/
  [Jade]: http://cssdeck.com/labs/learning-the-jade-templating-engine-syntax
  [Shifter]: http://yui.github.io/shifter/
  [deck.js]: https://github.com/imakewebthings/deck.js
  [wctw]: http://reid.github.io/decks/2012/yuiconf/yeti.html
  [wctw-source]: https://github.com/reid/decks/blob/3960963d59da53e5098cb22697a6a5a2d7b8d171/2012/yuiconf/yeti.text
  [demo]: https://www.youtube.com/watch?feature=player_detailpage&v=lA6XVosv04E#t=849
