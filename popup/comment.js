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

function fetchComments() {
    alert("Fetching comments");
}

window.onload=loadBootstrap;
