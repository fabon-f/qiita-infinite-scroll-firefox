"use strict";

const getActivities = wrapper => {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode.classList && addedNode.classList.contains("activities")) {
                        observer.disconnect();
                        resolve(addedNode);
                        return;
                    }
                }
            }
        });
        observer.observe(wrapper, { childList: true, subtree: true });
    });
};

const infiniteScroll = activities => {
    let htmlHeight = document.documentElement.scrollHeight;

    const observer = new MutationObserver(() => {
        htmlHeight = document.documentElement.scrollHeight;
    });
    observer.observe(activities, {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: true
    });

    document.addEventListener("scroll", e => {
        if (e.pageY + window.innerHeight === htmlHeight) {
            const moreButton = activities.parentNode.querySelector(".more-button");
            if (moreButton === null) { return; }
            moreButton.click();
        }
    }, { passive: true });
};

const init = () => {
    const activities = document.querySelector(".activities");
    if (activities !== null) {
        infiniteScroll(activities);
        return;
    }
    const wrapper = document.querySelector(".feedActivities");
    if (wrapper === null) {
        return;
    }
    getActivities(wrapper).then(activities => infiniteScroll(activities));
};
document.addEventListener("DOMContentLoaded", init);
