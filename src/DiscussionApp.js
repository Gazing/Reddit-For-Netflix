import React, { Component } from 'react';
import './index.css';

/* eslint-disable */
class DiscussionApp extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            hidden: true
        };

    }

    componentDidMount() {
        document.addEventListener("onRedditDiscussion", function (e) {
           this.setState({data: e.detail, hidden: false});
        }.bind(this));

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.method === "onRouteChanged") {
                    this.setState({hidden: true});
                }
            }.bind(this)
        );
    }

    render() {
        if (this.state.data.length == 0) return null;
        var post = this.state.data[0].data.children[0].data;
        var hidden = this.state.hidden ? " hidden" : "";
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = post.selftext_html;
        return <div className={"r-discussion"+hidden}>
                    <div className="r-post">
                        <header className="post-header">
                            <div className="post-options">•••</div>
                            <div className="close-discussion" onClick={() => { this.setState({hidden: true}) }}>X</div>
                        </header>

                        <div className="r-discussion-wrapper">
                            <div className="r-post-wrapper">
                                <div className="post-info">

                                    <div className="subreddit">{post.subreddit_name_prefixed}</div>
                                    <div className="post-tag">{post.link_flair_text}</div>
                                </div>
                                <a className="post-title" target="_blank" href={post.url}>{post.title}</a>
                                <div className="info">
                                    <a href={"https://www.reddit.com/u/"+post.author} target="_blank" className="author">{post.author}</a>
                                    <span className={post.author_flair_text ? "flair" : "hidden"}>{post.author_flair_text}</span>
                                    <span {...{"data-livestamp": post.created}}>

                                    </span>
                                </div>

                                <div className="post-content" dangerouslySetInnerHTML={{__html: escapeEl.textContent}}>

                                </div>
                            </div>
                            <footer className="post-footer">
                                <div>{post.num_comments+" Comments"}</div>
                                <div className="post-score">{post.score+" points"}</div>
                            </footer>

                            {this.state.data[1].data.children.map(function (item) {
                                if (item.kind === "more") return;
                                return <Comment data={item.data} key={item.data.id}/>;
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
        return <div className="r-comment">
            <div className="info">
                <a href={"https://www.reddit.com/u/"+this.props.data.author} target="_blank" className="author">{this.props.data.author}</a>
                <span className={this.props.data.author_flair_text ? "flair" : "hidden"}>{this.props.data.author_flair_text}</span>
                <span className="score">{this.props.data.score+" points"}</span>
                <span {...{"data-livestamp": this.props.data.created}}>

                </span>
            </div>

            <div className="comment-content" dangerouslySetInnerHTML={{__html: escapeEl.textContent}}>

            </div>
            <div className="options">
                <a className="permalink" href={"http://www.reddit.com/r/Yogscast/comments/6chxxt/extreme_catfishing_thailand_vlog_03/dhutprd"} target="_blank">permalink</a>
                <a className="parentlink" href={"http://www.reddit.com/r/Yogscast/comments/6chxxt/extreme_catfishing_thailand_vlog_03/#6chxxt"} target="_blank">parent</a>
            </div>

            <div className="comment-reply">
                {this.props.data.replies.data ? this.props.data.replies.data.children.map(function (item) {
                    if (item.kind === "more") return;
                    return <Comment data={item.data} key={item.data.id}/>
                }) : null}
            </div>


        </div>;
    }

}
/* eslint-enable */
module.exports = DiscussionApp;