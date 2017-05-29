import React, { Component } from 'react';
import './index.css';
import DiscussionApp from "./DiscussionApp.js";
import PlayerEmitter from "./Emitter.js";

/* eslint-disable */
class App extends Component {

    constructor() {
        super();
        this.state = {
            results: [],
            hidden: true,
            left: -1
        };

    }
    
    componentDidMount() {
        this.getListings();

        document.addEventListener("onListings", function (e) {
            var filtered = [];
            e.detail.results.forEach(function (item) {
                if (!item.richSnippet.metatags.ogTitle) return;
                if (item.richSnippet.metatags.ogTitle.indexOf("Discussion") === -1) return;
                else filtered.push(item);
            }.bind(this));
            e.detail.results = filtered;
            this.setState(e.detail);
        }.bind(this));

        document.addEventListener("onReloadListings", function (e) {
            this.props.detail = e.detail;
            this.getListings();
        }.bind(this));

        PlayerEmitter.beginWatch();

        document.addEventListener("onPlayerChange", function (e) {
            let box = $(".player-status")[0];
            let left = box.getBoundingClientRect().right - 55;
            if (left < 0) this.forceUpdate();
            else this.setState({left: left});
        }.bind(this));

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.method == "onRouteChanged") {
                    if (window.location.href.indexOf("netflix.com/watch/") === -1) this.setState({hidden: true});
                }
            }.bind(this)
        );

        document.addEventListener("click", function (e) {
            var list = $("#r4n-box")[0];
            if (!list.contains(e.target) && e.target != $(".reddit_toggle")[0]) {
                this.setState({hidden: true});
            }
        }.bind(this));
    }

    getListings() {
        // if (this.props.detail.title.indexOf(":") !== -1) {
        //     this.props.detail.title = this.props.detail.title.substring(0, this.props.detail.title.indexOf(":"));
        // }
        if (this.props.detail.isShow) {
            var episode = this.props.detail.episode.replace("Season ", "").replace("Ep. ", "").replace(":", "");
            var ep = episode.split(" ")[1];
            var season = episode.split(" ")[0];
            if (ep.length == 1) ep = "0" + ep;
            if (season.length == 1) season = "0" + season;
            document.dispatchEvent(new CustomEvent("onSearchReddit", {detail: "\""+this.props.detail.show+"\" \"discussion\" "+this.props.detail.title}));
        } else document.dispatchEvent(new CustomEvent("onSearchReddit", {detail: "\""+this.props.detail.show+"\" \"discussion\" \""}));

    }

    render() {
        var hidden = this.state.hidden ? " hidden" : "";

        var box = $(".player-status")[0];
        var wrapper = $(".player-controls-wrapper")[0];
        let left = box ? box.getBoundingClientRect().right - 55 : 0;
        var toggleHide;
        if (box) toggleHide = (left < 0) ? " hidden" : "";
        else toggleHide = " hidden";
        return <div>
                <div id="r4n-box" className={"player-control-button reddit_results"+hidden} style={{left: (box) ? this.state.left - 300 : 0}}>
                    <div className="result_title">Episode Discussions</div>
                    <ul className={"discussion-list"}>
                        {this.state.results.length == 0 ? <div className="discussion-list-item-detail">No discussion threads found</div> : ""}
                        {this.state.results.map(function (item) { return <DiscussionItem item={item}/> }.bind(this))}
                    </ul>

                </div>

                <div className={"reddit_toggle"+toggleHide} style={{left: (box) ? left : 0,
                    lineHeight:  (box) ? window.getComputedStyle(box).getPropertyValue("line-height") : 0,
                    height: (box) ? window.getComputedStyle(box).getPropertyValue("height") : 0,
                    opacity: (wrapper) ? window.getComputedStyle(wrapper).getPropertyValue("opacity") : 0,
                    display: (wrapper) ? window.getComputedStyle(wrapper).getPropertyValue("display") : "none"}} onClick={() => { this.setState({hidden: !this.state.hidden}) }}>
                    Reddit
                </div>

                <DiscussionApp />
            </div>
    }
}

class DiscussionItem extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };

    }

    componentDidMount() {


    }

    renderExpanded() {
        if (!this.state.expanded) return;
        return <div className="discussion-list-item-detail">
                    {this.props.item.richSnippet.metatags.ogDescription}
                    <div className="discussion-button-box">
                        <div className="discussion-button" onClick={() => { document.dispatchEvent(new CustomEvent("onOpenDiscussion", {detail: {url: this.props.item.url}})) }}>Open Discussion</div>
                    </div>
                </div>
    }

    render() {
        return <div>
                    <li className="discussion-list-item" onClick={() => { this.setState({expanded: !this.state.expanded}) }}><div>{this.props.item.richSnippet.metatags.ogTitle}</div></li>
                    {this.renderExpanded()}
                </div>
    }

}
/* eslint-enable */


export default App;
