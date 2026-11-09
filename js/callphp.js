var xhr = new XMLHttpRequest();
var Datamovies=[];

xhr.open("GET", "retrieveMovies.php", true);

xhr.onload = function() {

    if (xhr.status == 200) {
        Datamovies = JSON.parse(xhr.responseText);
        console.log(Datamovies);
        for (var i = 0; i < Datamovies.length; i++) {

            // Card structure: poster, title, duration
            var movieDiv = document.createElement("div");
            movieDiv.className = "movie-item";

            var img = document.createElement("img");
            img.src = Datamovies[i].image;
            img.alt = "";
            movieDiv.appendChild(img);

            var titleDiv = document.createElement("div");
            titleDiv.className = "movie-title";
            var titleText = document.createElement("span");
            titleText.className = "movie-title-text";
            titleText.innerHTML = Datamovies[i].title;
            titleDiv.appendChild(titleText);
            movieDiv.appendChild(titleDiv);

            var durationDiv = document.createElement("div");
            durationDiv.className = "movie-duration";
            durationDiv.innerHTML = Datamovies[i].duration;
            movieDiv.appendChild(durationDiv);

            document.getElementById("movies-container").appendChild(movieDiv);


            console.log(Datamovies[i].title,Datamovies[i].mp4);
            (function(movieUrl) {

                movieDiv.onclick = function() {

                    var videoContainer = document.getElementById("video-container");

                    videoContainer.innerHTML = "";

                    var vid = document.createElement("video");

                    vid.src = movieUrl;
                    vid.controls = true;
                    vid.autoplay = true;

                    vid.width = 640;
                    vid.height = 360;

                    videoContainer.appendChild(vid);
                    document.getElementById("movies-container").style.display = "none";
                    videoContainer.style.display = "block";     
                    vid.play();

                };

            })(Datamovies[i].mp4);
        }
        updateMovieSelection();

    }

};

xhr.send();



