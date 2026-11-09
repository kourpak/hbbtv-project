var selectedMovieIndex = 0;

// Number of cards per visual row, measured from the real layout
// (cards in the same row share the same offsetTop).
function getColumns() {
    var movies = document.getElementById("movies-container").children;
    if (movies.length === 0) {
        return 1;
    }
    var firstTop = movies[0].offsetTop;
    var cols = 0;
    while (cols < movies.length && movies[cols].offsetTop === firstTop) {
        cols++;
    }
    return cols > 0 ? cols : 1;
}

// Keep the selected card fully visible inside the grid area
function scrollSelectedIntoView(card) {
    var container = document.getElementById("movies-container");
    var margin = 20;
    var top = card.offsetTop;
    var bottom = top + card.offsetHeight;

    if (top - margin < container.scrollTop) {
        container.scrollTop = top - margin;
    } else if (bottom + margin > container.scrollTop + container.clientHeight) {
        container.scrollTop = bottom + margin - container.clientHeight;
    }
}

//Title marquee for the focused card (only when the title is too long) 
var marqueeTitleDiv = null;

function stopTitleMarquee() {
    if (marqueeTitleDiv) {
        var oldText = marqueeTitleDiv.getElementsByTagName("span")[0];
        if (oldText && oldText.originalHtml !== undefined) {
            oldText.innerHTML = oldText.originalHtml;
        }
        marqueeTitleDiv.className = "movie-title";
        marqueeTitleDiv = null;
    }
}

function startTitleMarquee(card) {
    var titleDiv = null;
    for (var i = 0; i < card.children.length; i++) {
        if (card.children[i].className === "movie-title") {
            titleDiv = card.children[i];
            break;
        }
    }
    if (!titleDiv) {
        return;
    }
    var text = titleDiv.getElementsByTagName("span")[0];
    if (!text) {
        return;
    }
    if (text.originalHtml === undefined) {
        text.originalHtml = text.innerHTML;
    }
    if (titleDiv.clientWidth > 0 && text.offsetWidth > titleDiv.clientWidth) {
        var period = text.offsetWidth + 100;      
        var seconds = (period / 70) / 0.88;       
        text.innerHTML = text.originalHtml + "<span class=\"movie-title-gap\"></span>" + text.originalHtml +
                         "<span class=\"movie-title-gap\"></span>";
        titleDiv.className = "movie-title marquee";
        text.style.webkitAnimationDuration = seconds + "s";
        text.style.animationDuration = seconds + "s";
        marqueeTitleDiv = titleDiv;
    }
}

function updateMovieSelection() {
    stopTitleMarquee();

    var movies = document.getElementById("movies-container").children;

    //remove the selection from all movies
    for (var i = 0; i < movies.length; i++) {
        movies[i].className = "movie-item";
    }

   // Highlight the selected movie
    if (movies.length > 0 && selectedMovieIndex >= 0 && selectedMovieIndex < movies.length) {
        movies[selectedMovieIndex].className = "movie-item selected";
        scrollSelectedIntoView(movies[selectedMovieIndex]);
        startTitleMarquee(movies[selectedMovieIndex]);
    }
}


function playMovie(movie) {

    var videoContainer = document.getElementById("video-container");

    //Clear previous video
    videoContainer.innerHTML = "";

    var video = document.createElement("video");

    video.src = movie.mp4;
    video.controls = true;
    video.autoplay = true;

    video.width = 640;
    video.height = 360;

    videoContainer.appendChild(video);
    console.log(movie.title);
    // Show video and hide movie list
    videoContainer.style.display = "block";
    document.getElementById("movies-container").style.display = "none";

    // Start playback
    video.play();
}


function handleTVRemote(event) {
    console.log("Key pressed:", event.key, event.keyCode);

    var movies=document.getElementById("movies-container").children;

    var videoContainer = document.getElementById("video-container");

    var key = event.key;

    // Fallback for older TV browsers
    if (!key && event.keyCode) {

        switch (event.keyCode) {

            case 37: key = "ArrowLeft"; break;
            case 38: key = "ArrowUp"; break;
            case 39: key = "ArrowRight"; break;
            case 40: key = "ArrowDown"; break;
            case 13: key = "Enter"; break;
            case 27: key = "Escape"; break;
            case 8:  key = "Backspace"; break;

        }
    }

    if (videoContainer.children.length > 0) {

        if (key === "Escape" || key === "Backspace") {

            //Stop video
            var video = videoContainer.getElementsByTagName("video")[0];

            if (video) {
                video.pause();
            }

            //Remove video
            videoContainer.innerHTML = "";
            //Hide video player
            videoContainer.style.display = "none";
            //Show movie list
            document.getElementById("movies-container").style.display = "block";
            //Restore previous selection
            updateMovieSelection();
            event.preventDefault();
        }

        return;
    }


    
    if (movies.length === 0) {
        return;
    }

    var cols = getColumns();

    if (key === "ArrowDown") {

        if (selectedMovieIndex + cols < movies.length) {
            selectedMovieIndex += cols;
        } else if (Math.floor(selectedMovieIndex / cols) < Math.floor((movies.length - 1) / cols)) {
            selectedMovieIndex = movies.length - 1;
        }

    }else if (key === "ArrowUp") {

        if (selectedMovieIndex - cols >= 0) {
            selectedMovieIndex -= cols;
        }

    }else if (key === "ArrowRight") {

        if (selectedMovieIndex < movies.length - 1 && (selectedMovieIndex + 1) % cols !== 0) {
            selectedMovieIndex++;
        }

    }else if (key === "ArrowLeft") {

        if (selectedMovieIndex % cols !== 0) {
            selectedMovieIndex--;
        }

    }else if (key === "Enter") {

        playMovie(window.Datamovies[selectedMovieIndex]);

    }

    updateMovieSelection();

    // Prevent default browser behavior for handled keys
    if (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Enter"
    ) {
        event.preventDefault();
    }

}
// Listen for remote-control keyboard events
document.addEventListener("keydown", handleTVRemote, false);
