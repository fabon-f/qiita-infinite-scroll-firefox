"use strict";
window.addEventListener("load", () => {
    let htmlHeight = document.documentElement.scrollHeight;
    const moreButtons = document.getElementsByClassName("more-button");
    if (moreButtons[0] === undefined) {
        return;
    }
    const observer = new MutationObserver(mutations => {
        console.log("hoge");
        htmlHeight = document.documentElement.scrollHeight;
    });
    observer.observe(document.getElementsByClassName("activities")[0], {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: true
    });
    document.addEventListener("scroll", (e) => {
        const wScroll = e.pageY;
        if (wScroll + window.innerHeight === htmlHeight) {
            if (moreButtons[0] === undefined) {
                return;
            }
            moreButtons[0].click();
        }
    });
});
