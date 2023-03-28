let objectStore;
let db;
function init() {
    // loadBootstrap();
}

function loadBootstrap() {
    var cssId = 'bootstrap-css';
    if (!document.getElementById(cssId))
    {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'bootstrap.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function getDbInstancePromise() {
    console.log("Init db started");
    p = new Promise((resolve, reject) => {
        if (window.db == null) {
            console.log("initialising db");
            const request = indexedDB.open("commentsdb", 3);
            request.onerror = (event) => {
                console.log("db error");
                console.error(event.target.error);
                reject("no indexdb created");
            };

            // Gets called if the db does not exist
            request.onupgradeneeded = (event) => {
                console.log("onupgradeneeded");
                window.db = event.target.result;
                objStore = window.db.createObjectStore("comments", {keyPath: "id", autoIncrement: true});
                objStore.createIndex("url", "url", { unique: false });
                resolve(window.db);
            };

            // Return the target result directly if the db already exists
            request.onsuccess = (event) => {
                window.db = event.target.result;
                resolve(window.db);
                console.log("db success");
                console.log(window.db);
            }
        } else {
            resolve(window.db);
        }
    });

    return p;
}

function insertComment(db, urlValue, commentValue) {
    const comment = {url: urlValue, comment: commentValue, created: Date.now()};
    console.log("inserting comment...");
    console.log(comment);

    const transaction = db.transaction("comments", "readwrite")

    // Do something when all the data is added to the database.
    transaction.oncomplete = (event) => {
        console.log("transaction complete");
    };

    transaction.onerror = (event) => {
        console.log("transaction error");
        console.log(event.target.error);
    };

    transaction.onsuccess = (event) => {
        console.log("db success");
    }

    const objectStore = transaction.objectStore("comments");

    const request = objectStore.add(comment);
    request.onsuccess = (event) => {
        const data = event.target.result;
        console.log("comment added");
        console.log("result");
        console.log(data);
    };
}

function fetchComments(db, url) {
    const transaction = db.transaction(["comments"]);
    const objectStore = transaction.objectStore("comments");
    // const request = objectStore.get(url);
    request = objectStore.index('url').openCursor(IDBKeyRange.only(url));
    request.onerror = (event) => {
    // Handle errors!
    };

    // https://github.com/mdn/dom-examples/blob/bda3ad1e1ef5c9edf70530cc071bb255024a3aa8/indexeddb-examples/idbkeyrange/scripts/main.js#L156-L170
    request.onsuccess = (event) => {
        var cursor = event.target.result;
        if (cursor) {
            commentText = cursor.value.comment;
            commentDate = cursor.value.created;

            console.log("Comment");
            console.log({id: cursor.value.id, comment: commentText, created: commentDate});

            cursor.continue();
        } else {
            console.log("Entries all displayed.");
        }
    };

}

p = getDbInstancePromise();

p.then((db) => {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0];
        url = tab.url;

        insertComment(db, url, "My second comment");

        fetchComments(db, url);
    }).catch((error) => {
        alert("Could not fetch browser tab");
        console.log(error);
    });

})

window.onload=init;

