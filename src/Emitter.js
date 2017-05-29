/* eslint-disable */
let PlayerEmitter = {

    tickRate: 20,
    oldLeft: 0,
    oldOpacity: 0,

    beginWatch: function () {
        setInterval(function () {
            let box = $(".player-status")[0];
                let wrapper = $(".player-controls-wrapper")[0];
                if (!box) {return;}
                if (this.oldLeft !== box.getBoundingClientRect().right - 55 || this.oldOpacity !== window.getComputedStyle(wrapper).getPropertyValue("opacity")) {
                    document.dispatchEvent(new CustomEvent("onPlayerChange"));
                    this.oldLeft = box.getBoundingClientRect().right - 55;
                    this.oldOpacity = window.getComputedStyle(wrapper).getPropertyValue("opacity");
                }
        }, this.tickRate);
    }

};
/* eslint-enable */
module.exports = PlayerEmitter;