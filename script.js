
 // ==================================
 // 1. GET AND SAVE MOVIES
 // ==================================

function getSavedMovies() {
    try {
        return JSON.parse(localStorage.getItem("myMovies")) || [];
    } catch (error) {
        return [];
    }
}

function saveMovies(movies) {
    localStorage.setItem("myMovies", JSON.stringify(movies));
}


// ==================================
// 2. SEARCH, FILTER AND PAGINATION
// ==================================

let searchInput = document.getElementById("searchInput");
let genreFilter = document.getElementById("genreFilter");

let movieContainer = document.getElementById("movieContainer");

let currentPage = 1;
let moviesPerPage = 4;

let movieCards = movieContainer
    ? Array.from(movieContainer.querySelectorAll(":scope > .col-md-3"))
    : [];

let pageButtons = document.querySelectorAll(".page-btn");


function filterMovies() {

    let searchValue = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    let selectedGenre = genreFilter
        ? genreFilter.value
        : "all";

    // Find matching movies
    let filteredMovies = movieCards.filter(function(column) {

        let card = column.querySelector(".movie-card");

        let title = card.querySelector("h5")
            .textContent.toLowerCase();

        let genre = card.dataset.genre;

        let matchesSearch = title.includes(searchValue);

        let matchesGenre =
            selectedGenre === "all" || genre === selectedGenre;

        return matchesSearch && matchesGenre;

    });


    // Calculate number of pages
    let totalPages = Math.ceil(
        filteredMovies.length / moviesPerPage
    );

    // Reset page if necessary
    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }


    // Hide all movies
    movieCards.forEach(function(column) {
        column.style.display = "none";
    });


    // Display four movies on selected page
    let start = (currentPage - 1) * moviesPerPage;

    let end = start + moviesPerPage;

    filteredMovies.slice(start, end).forEach(function(column) {
        column.style.display = "";
    });


    // Update pagination buttons
    pageButtons.forEach(function(button) {

        let page = Number(button.dataset.page);

        button.style.display =
            page <= totalPages ? "inline-block" : "none";

        button.classList.toggle(
            "active",
            page === currentPage
        );

    });


    // Hide pagination if only one page
    let pagination = document.querySelector(
        ".pagination-container"
    );

    if (pagination) {

        pagination.style.display =
            totalPages > 1 ? "flex" : "none";

    }

}


// Search movies
if (searchInput) {

    searchInput.addEventListener("input", function() {

        currentPage = 1;
        filterMovies();

    });

}


// Filter by genre
if (genreFilter) {

    genreFilter.addEventListener("change", function() {

        currentPage = 1;
        filterMovies();

    });

}


// Pagination buttons
pageButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentPage = Number(this.dataset.page);

        filterMovies();

        window.scrollTo({
            top: movieContainer.offsetTop,
            behavior: "smooth"
        });

    });

});


// Initial display
if (movieContainer) {
    filterMovies();
}


// ==================================
// 3. ADD MOVIES TO MY LIST
// ==================================

document.addEventListener("click", function(event) {

    if (!event.target.classList.contains("add-btn")) {
        return;
    }

    let button = event.target;

    let movieCard = button.closest(".movie-card");

    if (!movieCard) {
        return;
    }

    let title = movieCard.querySelector("h5")
        .textContent.trim();

    let genre = movieCard.dataset.genre;

    let video = movieCard.querySelector("video");

    if (!video) {
        alert("Movie video was not found.");
        return;
    }

    let videoSource = video.getAttribute("src");

    if (!videoSource) {

        let source = video.querySelector("source");

        videoSource = source ? source.getAttribute("src") : "";

    }

    if (!videoSource) {
        alert("Video source was not found.");
        return;
    }

    let movie = {
        title: title,
        genre: genre,
        video: videoSource
    };

    let savedMovies = getSavedMovies();

    let alreadySaved = savedMovies.some(function(item) {

        return item.title.toLowerCase() === title.toLowerCase();

    });

    if (alreadySaved) {

        alert("This movie is already in your list!");
        return;

    }

    savedMovies.push(movie);

    saveMovies(savedMovies);

    button.textContent = "Added to My List";

    button.disabled = true;

    alert("Movie added to My List!");

});


// ==================================
// 4. DISPLAY SAVED MOVIES
// ==================================

let savedMoviesContainer =
    document.getElementById("savedMovies");

let emptyMessage =
    document.getElementById("emptyMessage");


function displaySavedMovies() {

    if (!savedMoviesContainer) {
        return;
    }

    let savedMovies = getSavedMovies();

    savedMoviesContainer.innerHTML = "";

    if (emptyMessage) {

        emptyMessage.style.display =
            savedMovies.length === 0 ? "block" : "none";

    }

    savedMovies.forEach(function(movie, index) {

        let column = document.createElement("div");

        column.className = "col-md-3 mb-4";

        let card = document.createElement("div");

        card.className = "movie-card";

        let video = document.createElement("video");

        video.src = movie.video;

        video.controls = true;

        video.style.width = "100%";

        let title = document.createElement("h5");

        title.textContent = movie.title;

        let genre = document.createElement("p");

        genre.textContent = movie.genre;

        let removeButton = document.createElement("button");

        removeButton.className = "btn btn-danger remove-btn";

        removeButton.textContent = "Remove";


        // REMOVE MOVIE
        removeButton.addEventListener("click", function() {

            let movies = getSavedMovies();

            movies.splice(index, 1);

            saveMovies(movies);

            displaySavedMovies();

        });


        card.appendChild(video);

        card.appendChild(title);

        card.appendChild(genre);

        card.appendChild(removeButton);

        column.appendChild(card);

        savedMoviesContainer.appendChild(column);

    });

}

displaySavedMovies();


// ==================================
// 5. ACCOUNT FORM VALIDATION
// ==================================

let loginForm = document.getElementById("loginForm");

let registerForm = document.getElementById("registerForm");

let accountMessage =
    document.getElementById("accountMessage");


function showAccountMessage(message) {

    if (accountMessage) {
        accountMessage.textContent = message;
    }

}


// ==================================
// LOGIN VALIDATION
// ==================================

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email =
            document.getElementById("loginEmail").value.trim();

        let password =
            document.getElementById("loginPassword").value;

        showAccountMessage("");

        if (email === "" || password === "") {

            showAccountMessage("Please fill in all fields.");

            return;

        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showAccountMessage("Please enter a valid email address.");

            return;

        }

        if (password.length < 8) {

            showAccountMessage(
                "Password must have at least 8 characters."
            );

            return;

        }

        showAccountMessage(
            "Login form validated successfully!"
        );

    });

}


// ==================================
// REGISTER VALIDATION
// ==================================

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let fullName =
            document.getElementById("fullName").value.trim();

        let email =
            document.getElementById("registerEmail").value.trim();

        let password =
            document.getElementById("registerPassword").value;

        showAccountMessage("");

        if (!fullName || !email || !password) {

            showAccountMessage("Please fill in all fields.");

            return;

        }

        if (!/^[A-Za-z ]{3,50}$/.test(fullName)) {

            showAccountMessage(
                "Enter a valid name without numbers."
            );

            return;

        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showAccountMessage("Enter a valid email address.");

            return;

        }

        if (password.length < 8) {

            showAccountMessage(
                "Password must contain at least 8 characters."
            );

            return;

        }

        showAccountMessage(
            "Registration form validated successfully!"
        );

    });

}
