"use strict";

const getActiveFeedPane = () => {
    return new Promise(resolve => {
        const activePane = document.querySelector(".feedActivities > .active");
        if (activePane !== null) {
            resolve(activePane);
        } else {
            const feedActivityWrapper = document.querySelector(".feedActivities");
            const observer = new MutationObserver(records => {
                for (let record of records) {
                    if (record.target.parentNode === feedActivityWrapper && record.target.classList.contains("active")) {
                        observer.disconnect();
                        resolve(record.target);
                        return;
                    }
                }
            });
            observer.observe(feedActivityWrapper, {
                childList: false,
                attributes: true,
                characterData: false,
                subtree: true
            });
        }
    });
};

const getActivity = (activityFeedPane) => {
    return new Promise(resolve => {
        if (activityFeedPane.querySelector(".activities") !== null) {
            resolve(activityFeedPane.querySelector(".activities"));
            return;
        }
        const observer = new MutationObserver(records => {
            for (let record of records) {
                if (record.target.classList.contains("activities")) {
                    observer.disconnect();
                    resolve(record.target);
                    return;
                }
            }
        });
        observer.observe(activityFeedPane, {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: true
        });
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
    });
};

const init = () => {
    getActiveFeedPane().then(activeFeedPane => {
        return getActivity(activeFeedPane);
    }).then(activities => {
        infiniteScroll(activities);
    });
};
document.addEventListener("DOMContentLoaded", init);
