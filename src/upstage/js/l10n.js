// The module provides common l10n features
// for Upstage's user interface.

// Provide our own namespace.
// We don't want to depend on anything else,
// including the slideshow.js file.
Y.namespace("UpstageL10N");

var L10N = Y.UpstageL10N,
    Intl = Y.Intl,
    UPSTAGE = "upstage-l10n";

// Sets the active language for `get`.
L10N.setActiveLang = function (lang) {
    return Intl.setLang(UPSTAGE, lang);
};

// Gets the active language.
L10N.getActiveLang = function () {
    return Intl.getLang(UPSTAGE);
};

// Gets a string for `resource`. A `lang` is optional.
L10N.get = function (resource, lang) {
    return Intl.get(UPSTAGE, resource, lang);
};

// Adds a lang pack. See the `l10n/` directory.
L10N.add = function (lang, strings) {
    var add = Intl.add(UPSTAGE, lang, strings);
    if (!L10N.getActiveLang()) L10N.setActiveLang(lang);
    return add;
};
