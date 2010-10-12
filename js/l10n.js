Y.namespace("UpstageL10N");

var L10N = Y.UpstageL10N,
    Intl = Y.Intl,
    UPSTAGE = "upstage-l10n";

L10N.setActiveLang = function (lang) {
    return Intl.setLang(UPSTAGE, lang);
};

L10N.getActiveLang = function () {
    return Intl.getLang(UPSTAGE);
};

L10N.get = function (resource, lang) {
    return Intl.get(UPSTAGE, resource, lang);
};

L10N.add = function (lang, strings) {
    var add = Intl.add(UPSTAGE, lang, strings);
    if (!L10N.getActiveLang()) L10N.setActiveLang(lang);
    return add;
};
