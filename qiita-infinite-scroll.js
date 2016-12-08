"use strict";

class Disposable {
    constructor(disposalAction) {
        this.disposed = false;
        this.disposalAction = disposalAction;
    }
    dispose() {
        if (!this.disposed) {
            this.disposalAction();
            this.disposalAction = null;
            this.disposed = true;
        }
    }
}

class CompositeDisposable {
    constructor() {
        this.disposables = new Set();
        this.disposed = false;
    }
    add(disposable) {
        this.disposables.add(disposable);
    }
    remove(disposable) {
        this.disposables.delete(disposable);
    }
    dispose() {
        if (!this.disposed) {
            this.disposables.forEach(disposable => disposable.dispose());
            this.disposables = null;
            this.disposed = true;
        }
    }
}

const disposables = new CompositeDisposable();

const getActivities = wrapper => {
    return new Promise(resolve => {
        const disposable = new Disposable(() => observer.disconnect());
        disposables.add(disposable);

        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode.classList && addedNode.classList.contains("activities")) {
                        disposable.dispose();
                        disposables.remove(disposable);
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

    const observerDisposable = new Disposable(() => observer.disconnect());
    disposables.add(observerDisposable);

    const scrollCallback = e => {
        if (e.pageY + window.innerHeight === htmlHeight) {
            const moreButton = activities.parentNode.querySelector(".more-button");
            if (moreButton === null) { return; }
            moreButton.click();
        }
    };

    const scrollListenerDisposable = new Disposable(() => {
        document.removeEventListener("scroll", scrollCallback);
    });
    disposables.add(scrollListenerDisposable);

    document.addEventListener("scroll", scrollCallback, { passive: true });
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
