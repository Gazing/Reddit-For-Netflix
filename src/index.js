import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import "./model.js";

/* eslint-disable */

loadExt();



function loadExt() {

    $(document).arrive(".player-status-main-title", function () {

        $("#netflix-player").append("<div id=\"r4n_mount\" >");

        var showSpan = $(this);
        var episodeSpan = showSpan.next();
        var titleSpan = episodeSpan.next();
        var isShow = true;
        if (!episodeSpan[0]) isShow = false;

        // if (!isLoaded) {
            document.dispatchEvent(new CustomEvent("onPlayerLoaded", {
                detail: {
                    show: showSpan[0].innerHTML,
                    episode: episodeSpan[0] ? episodeSpan[0].innerHTML : null,
                    title: titleSpan[0] ? titleSpan[0].innerHTML : null,
                    isShow: isShow
                }
            }));
        // } else {
        //     document.dispatchEvent(new CustomEvent("onReloadListings", {
        //         detail: {
        //             show: showSpan[0].innerHTML,
        //             episode: episodeSpan[0] ? episodeSpan[0].innerHTML : null,
        //             title: titleSpan[0] ? titleSpan[0].innerHTML : null,
        //             isShow: isShow
        //         }
        //     }));
        // }


    });
}


document.addEventListener("onPlayerLoaded", function (e) {
    ReactDOM.render(
        <App detail={e.detail} />,
        document.getElementById("r4n_mount")
    );
    chrome.runtime.sendMessage({isLoaded: true});
});

/* eslint-enable */