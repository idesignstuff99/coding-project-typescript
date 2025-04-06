
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"




const moviesContainer = document.getElementById("movies-container")

export async function onFetchMoviesClick() {
    const response = await fetch("http://localhost:3005/movies")
    const movieList = await response.json()

    type Movie = {
        title: string;
        id: string | number;
        genres_type: string;
        img: string;
    };

    moviesContainer!.innerHTML = movieList.map(
        (movie: Movie) => `
        <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="${movie.img}" alt="Card image cap">
  <div class="card-body">
    <h3 class="card-title">${movie.title}</h3>
    <p>Genre: ${movie.genres_type}</p>
    <div class="container mt-3">
            <hr class="my-4"/>
            <button type="button" class="btn btn-primary" onclick="increaseCounter()">
        Likes <span id="badgeCounter" class="badge badge-light">0</span>
    </button>
        </div>
  </div>
</div>
        `
    ).join("")
  }

window.onFetchMoviesClick = onFetchMoviesClick;
window.onCreateMovieClick = onCreateMovieClick;
window.onUpdateMovieClick = onUpdateMovieClick;
window.onDeleteMovieClick = onDeleteMovieClick;


let lastCreatedItem: null | number = null;

async function onCreateMovieClick() {
    const testMovie = { title: "Fetching movie...", genreId: 1 }
    const response = await fetch("http://localhost:3005/movies", {
        method: "POST", // Create
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(testMovie)
    })
    const newlyCreatedItem = await response.json()
    lastCreatedItem = newlyCreatedItem
}

async function onUpdateMovieClick() {
    if(lastCreatedItem === null) {
        console.log("no item created yet to update")
        return
    }

fetch("http://localhost:3005/movies/" + lastCreatedItem.id, {
        method: "PUT", // Update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {title: "A Working Man", genreId: 3, "genres_type": "Action",
      "img": "./src/images/workingMan.jpg"} )
    })
}

async function onDeleteMovieClick() {
    if(lastCreatedItem === null) {
        console.log("no item created yet to delete")
        return
    }
    
fetch("http://localhost:3005/movies/" + lastCreatedItem.id, {
        method: "DELETE", // Update
    })
}


const apiUrl = "http://localhost:3005/notifications";

// Function to fetch and display the current counter
function fetchCounter() {
    fetch(apiUrl)
        .then(response1 => response1.json())
        .then(data1 => {
            document.getElementById("badgeCounter")!.textContent = data1.count;
        })
        .catch(error => console.error("Error fetching counter:", error));
}

// Function to increase counter and update db.json
function increaseCounter() {
    fetch(apiUrl)
        .then(response1 => response1.json())
        .then(data1 => {
            const newCount = data1.count + 1;

            // Update count in db.json
            return fetch(apiUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: newCount })
            });
        })
        .then(response1 => response1.json())
        .then(updatedData => {
            document.getElementById("badgeCounter")!.textContent = updatedData.count;
        })
        .catch(error => console.error("Error updating counter:", error));
}

// Load counter on page load
document.addEventListener("DOMContentLoaded", fetchCounter);
