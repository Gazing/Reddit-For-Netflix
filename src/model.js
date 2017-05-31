/* eslint-disable */
var model = (function(){

    var model = {};

    model.searchURL = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=en&prettyPrint=false&source=gcsc&gss=.com&sig=890e228675e68570fa203500d9572ad4&cx=014468540023885266078:_mepemh0zxk&q={query}&googlehost=www.google.com&oq=archer%20%22discussion%22%20%22nellis%22&gs_l=partner.12...0.0.8.111538.0.0.0.0.0.0.0.0..0.0.gsnos%2Cn%3D13...0.0jj1..1ac..25.partner..0.0.0.&callback=google.search.Search.apiary1466&nocache=1495132230346"

    document.addEventListener("onSearchReddit", function (query) {
        $.ajax({
            url: model.searchURL.replace("{query}", query.detail),
            success: function (result) {
                result = result.replace("google.search.Search.apiary1466(", "").replace("// API callback\n", "");
                result = JSON.parse(result.substring(0, result.length-2));
                document.dispatchEvent(new CustomEvent("onListings", {detail: {results: result.results}}));
            }

        })
    });

    document.addEventListener("onOpenDiscussion", function (e) {
        $.ajax({
            url: e.detail.url.replace("reddit.com", "api.reddit.com").replace("www.", ""),
            success: function (result) {
                document.dispatchEvent(new CustomEvent("onRedditDiscussion", {detail: result}));
            }
        })
    });

    return model;
}());





/* eslint-enable */
module.exports = model;