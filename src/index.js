import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import "./model.js";

/* eslint-disable */

var isLoaded = false;
$("body").append("<div id=\"r4n_mount\" >");
loadExt();



function loadExt() {

    $(document).arrive(".player-status-main-title", function () {
        var showSpan = $(this);
        var episodeSpan = showSpan.next();
        var titleSpan = episodeSpan.next();

        if (!isLoaded) {
            document.dispatchEvent(new CustomEvent("onPlayerLoaded", {
                detail: {
                    show: showSpan[0].innerHTML,
                    episode: episodeSpan[0].innerHTML,
                    title: titleSpan[0].innerHTML
                }
            }));
        } else {
            document.dispatchEvent(new CustomEvent("onReloadListings", {
                detail: {
                    show: showSpan[0].innerHTML,
                    episode: episodeSpan[0].innerHTML,
                    title: titleSpan[0].innerHTML
                }
            }));
        }


    });
}


document.addEventListener("onPlayerLoaded", function (e) {
    ReactDOM.render(
        <App detail={e.detail} />,
        document.getElementById("r4n_mount")
    );
    isLoaded = true;
    chrome.runtime.sendMessage({isLoaded: isLoaded}, function (response) {

    });
});

document.addEventListener("onOpenDiscussion", function (e) {
    $("#netflix-player").append("<div id='discussion-mount'>");


});
/* eslint-enable */