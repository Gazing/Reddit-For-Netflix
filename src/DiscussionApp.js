import React, { Component } from 'react';
import './index.css';


class DiscussionApp extends Component {
    constructor() {
        super();
        this.state = {
            comments: [],
            hidden: true
        };

    }

    componentDidMount() {
        document.addEventListener("onRedditDiscussion", function (e) {
           this.setState(e.detail);
        }.bind(this));
    }

    render() {
        return <div>

                </div>
    }

    static renderComment(comment) {
        return <div className="r-comment">
                    <div className="info">
                    </div>
                    <div className="comment-content">
                        <span>

                        </span>
                    </div>
                </div>
    }

}