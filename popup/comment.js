let objectStore;
let p;
function init() {
    // loadBootstrap();
}

function initDb() {
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
            request.onupgradeneeded = (event) => {
                console.log("onupgradeneeded");
                window.db = event.target.result;
                objStore = window.db.createObjectStore("comments", {keyPath: "id", autoIncrement: true});
                objStore.createIndex("url", "url", { unique: false });
                resolve(window.db);
            };
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

    p.then((db) => {
        insertComment("My first comment");
    })

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

function insertComment(comment) {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0];
        const customer = {url: tab.url, comment: comment};
        console.log("inserting comment...");
        console.log(customer);

        const transaction = window.db.transaction("comments", "readwrite")

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
            window.db = event.target.result;
            console.log(window.db);
        }

        const objectStore = transaction.objectStore("comments");

        const request = objectStore.add(customer);
        request.onsuccess = (event) => {
            const data = event.target.result;
            console.log("comment added");
            console.log("result");
            console.log(data);
        };
    }).catch((error) => {
        alert("Could not fetch browser tab");
        console.log(error);
    });
}

initDb();

window.onload=init;

