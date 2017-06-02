import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* eslint-disable */
class DiscussionApp extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            hidden: true,
            style: null
        };

    }

    componentDidMount() {
        document.addEventListener("onRedditDiscussion", function (e) {
           this.setState({data: e.detail, hidden: false});
           this.resizePlayer(false);
        }.bind(this));

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.method === "onRouteChanged" && window.location.href.indexOf("#") === -1) {
                    this.setState({hidden: true});
                    this.resizePlayer(true);
                }
            }.bind(this)
        );

        document.addEventListener("onPlayerChange", function (e) {
            if (this.state.style) this.resizePlayer(false, true);

        }.bind(this));
    }

    resizePlayer(hidden, replace=false) {
        if (!hidden) {
            if (this.state.style && !replace) return;
            if (replace && this.state.style) this.state.style.remove();
            var appWidth = ReactDOM.findDOMNode(this).clientWidth;
            var playerWidth = $(window).width() - appWidth;
            var controlWidth = playerWidth * 0.9;
            var controlLeft = playerWidth * 0.05;

            var playerStyle = $("<style>").text(`#netflix-player:not(.player-postplay) .player-video-wrapper { width: ${playerWidth}px !important; }.player-controls-wrapper { width: ${controlWidth}px !important; left: ${controlLeft}px !important}.player-progress-round { margin-left: -150px !important; }`);
            playerStyle.appendTo("body");
            this.setState({style: playerStyle[0]});

        } else {
            if (!this.state.style) return;
            this.setState({style: this.state.style.remove()});
        }

    }

    render() {
        if (this.state.data.length == 0) return null;
        var post = this.state.data[0].data.children[0].data;
        var hidden = this.state.hidden ? " hidden" : "";
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = post.selftext_html;
        var unescaped = escapeEl.textContent;
        escapeEl.remove();
        return <div className={"r-discussion"+hidden}>
                    <div className="r-post">
                        <header className="post-header">
                            <div className="post-options">•••</div>
                            <div className="close-discussion" onClick={() => { this.setState({hidden: true}); this.resizePlayer(true); }}>X</div>
                        </header>

                        <div className="r-discussion-wrapper">
                            <div className="r-post-wrapper">
                                <div className="post-info">

                                    <div className="subreddit">{post.subreddit_name_prefixed}</div>
                                    <div className={"post-tag"+((post.link_flair_text) ? "" : " hidden")}>{post.link_flair_text}</div>
                                </div>
                                <a className="post-title" target="_blank" href={post.url}>{post.title}</a>
                                <div className="info">
                                    <a href={"https://www.reddit.com/u/"+post.author} target="_blank" className="author">{post.author}</a>
                                    <span className={post.author_flair_text ? "flair" : "hidden"}>{post.author_flair_text}</span>
                                    <span {...{"data-livestamp": post.created}}>

                                    </span>
                                </div>

                                <div className="post-content" dangerouslySetInnerHTML={{__html: unescaped}}>

                                </div>
                            </div>
                            <footer className="post-footer">
                                <div>{post.num_comments+" Comments"}</div>
                                <div className="post-score">{post.score+" points"}</div>
                            </footer>

                            {this.state.data[1].data.children.map(function (item) {
                                if (item.kind === "more") return;
                                return <Comment data={item.data} url={post.url} key={item.data.id} first={true}/>;
                            })}

                        </div>
                    </div>
                </div>
    }

}

class Comment extends Component {

    constructor() {
        super();
        this.state = {
            hidden: true
        };

    }

    componentDidMount() {

    }

    render() {
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = this.props.data.body_html;
        var unescaped = escapeEl.textContent;
        escapeEl.remove();
        var hideParent =  this.props.first ?  " hidden" : "";
        return <div className="r-comment">
            <div className="info">
                <a className="parent" name={this.props.data.id}> </a>
                <a href={"https://www.reddit.com/u/"+this.props.data.author} target="_blank" className="author">{this.props.data.author}</a>
                <span className={this.props.data.author_flair_text ? "flair" : "hidden"}>{this.props.data.author_flair_text}</span>
                <span className="score">{this.props.data.score+" points"}</span>
                <span {...{"data-livestamp": this.props.data.created}}>

                </span>
            </div>

            <div className="comment-content" dangerouslySetInnerHTML={{__html: unescaped}}>

            </div>
            <div className="options">
                <a className="permalink" href={this.props.url+"#"+this.props.data.id} target="_blank">permalink</a>
                <a className={"parentlink"+hideParent} href={"#"+this.props.data.parent_id.substring(3, this.props.data.parent_id.length)}>parent</a>
            </div>

            <div className="comment-reply">
                {this.props.data.replies.data ? this.props.data.replies.data.children.map(function (item) {
                    if (item.kind === "more") return;
                    return <Comment data={item.data} key={item.data.id} url={this.props.url}/>
                }.bind(this)) : null}
            </div>


        </div>;
    }

}
/* eslint-enable */
module.exports = DiscussionApp;