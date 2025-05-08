import { previouslyList } from "./previouslylist.js";

let apiKey = "W7gIJGjUUnOV3a5Msp8VcyIU02AWiXz7";
//let apiKey = "ldD9shrU9AywvAcnn5IOs8QaHWgvfUvv"
//let apikeyinput = document.getElementById("apikeyinput")
//let apiKey = apikeyinput.value;
let search = document.getElementById("search");
let searchAuthor = document.getElementById("author");
let searchTitle = document.getElementById("title");
let clearBtn = document.getElementById("clear");
let searchTerms = new Set();
let localSearchDb = {};

/*
apikeyinput.addEventListener("change", () => {
  apiKey = apikeyinput.value
  
})*/

function searchFor(author = "", title = "") {
  searchAuthor.value = author;
  searchTitle.value = title;

  if (!author && !title) {
    previouslyOn();
    return;
  }

  //check local searchterms
  document.getElementById("books").innerHTML = "";
  if (
    Array.from(searchTerms).find(
      (a) => a.toLowerCase() == (author + title).toLowerCase()
    )
  ) {
    console.log("found!");
    displaySearchResults(localSearchDb[author + title]);
    return;
  }

  //if not found in local go fetch
  console.log("Fetch!");

  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?author=` +
      `${author}&title=${title}&api-key=${apiKey}`,
    { method: "get" }
  )
    .then((response) => {
      return response.json();
    })
    .then((nytimesBestSellers) => {
      document.getElementById("books").innerHTML = "";

      //no entries found
      if (nytimesBestSellers.results.length == 0) {
        document.getElementById("books").innerHTML = `
      
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2JvOWsybzVsYTJ4bDVlNDhkYmFqeWp5MWFseXpvNmNoMWhjZmgxNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8J2MOphsMnQUo/giphy.gif"><br />
        No entries found<br />
        
        `;
      }
      // add to local terms and db
      searchTerms.add(author + title);

      Object.defineProperty(localSearchDb, author + title, {
        value: nytimesBestSellers.results,
      });
      displaySearchResults(nytimesBestSellers.results);
    })
    .catch((error) => {
      console.log("Error CATCH");
      document.getElementById("books").innerHTML = `
      
      <img src="https://img.allw.mn/content/tm/gb/sirkxxrk594bd534d8e99856700530_520x277.gif"><br />
        Hold your horses!<br /><br />

        The New York Times limits the number of requests that we can send to the database. 
        By the time you're done reading this you can probably try again.<br /><br />

        If not, just wait longer.
      
        `;

      console.log(error);
    });
}

const getDetails = (author = "", title = "") => {
  searchAuthor.value = author;
  searchTitle.value = title;
  if (!author && !title) {
    previouslyOn();
    return;
  }
  console.log("Fetch! getDetails");
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?author=` +
      `${author}&title=${title}&api-key=${apiKey}`,
    { method: "get" }
  )
    .then((response) => {
      return response.json();
    })
    .then((nytimesBestSellers) => {
      document.getElementById("books").innerHTML = "";

      if (nytimesBestSellers.results.length == 0) {
        document.getElementById("books").innerHTML = `
      
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2JvOWsybzVsYTJ4bDVlNDhkYmFqeWp5MWFseXpvNmNoMWhjZmgxNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8J2MOphsMnQUo/giphy.gif"><br />
        No entries found<br />
        
        `;
      }

      nytimesBestSellers.results.forEach((book) => {
        if (book.title != title) return;

        let firstListing = book.ranks_history?.length - 1;
        let list = book.ranks_history[firstListing]?.display_name || "none";

        let listing = `<div class="entry"><div class="content">
                <h2><a onclick="getDetails('${book.author}', '${book.title}')">
                ${book.title}</h2></a>
                <h4>By <a onclick="searchFor('${book.author}')">
                ${book.author}</a></h4>
                <h4 class="publisher">${book.publisher}</h4>
                <p class="listdate">${book.description}</p>
                <a href="https://www.audible.com/search?keywords=${book.title} ${book.author}" target="_blank">Audible Search</a><br />
                <a href="https://www.goodreads.com/search?q=${book.title} ${book.author}" target="_blank">Goodreads Search</a><br />
                <a href="https://app.thestorygraph.com/browse?search_term=${book.title} ${book.author}" target="_blank">The Storygraph Search</a><br />
                <a href="https://www.youtube.com/results?search_query=${book.title} ${book.author} audiobook" target="_blank">Youtube Search</a><br />
                <a href="https://libbyapp.com/search/cwmars/search/query-${book.title} ${book.author}/page-1" target="_blank">Libby Search</a><br />
                <a href="https://duckduckgo.com/?q=${book.title} ${book.author} New York Times Bestseller" target="_blank">Internet Search</a><br />
                </div>`;

        if (list != "none") {
          for (let i in book.ranks_history) {
            listing += `<p>List: ${book.ranks_history[i].display_name}<br />
                        Bestsellers Date: ${book.ranks_history[i].bestsellers_date}</p>`;
          }
        } else {
          listing += `<p>List: none</p>`;
        }
        listing += `</div>`;
        document.getElementById("books").innerHTML += listing;
      });
    })
    .catch((error) => {
      console.log("Error CATCH");
      document.getElementById("books").innerHTML = `
      
      <img src="https://img.allw.mn/content/tm/gb/sirkxxrk594bd534d8e99856700530_520x277.gif"><br />
        Hold your horses!<br /><br />

        The New York Times limits the number of requests that we can send to the database. 
        By the time you're done reading this you can probably try again.<br /><br />

        If not, just wait longer.
        `;

      console.log(error);
    });
};

search.addEventListener("submit", (e) => {
  e.preventDefault();
  searchFor(searchAuthor.value, searchTitle.value);
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchFor();
});

const previouslyOn = () => {
  document.getElementById("books").innerHTML = "Previously on Mean Book Club:";
  for (let book of previouslyList) {
    let newLink = document.createElement("a");
    newLink.onclick = () => searchFor(`${book.author}`, `${book.title}`);
    newLink.innerText = `${book.title} by ${book.author}`;
    document.getElementById("books").appendChild(newLink);
  }
};

const displaySearchResults = (results) => {
  results.forEach((book) => {
    if (results.length == 1) {
      getDetails(book.author, book.title);
    }

    let firstListing = book.ranks_history?.length - 1;
    let list = book.ranks_history[firstListing]?.display_name || "none";

    let listing = `<div class="entry"><div class="content">
                  <h2><a onclick="getDetails('${book.author}', '${book.title}')">
                  ${book.title}</h2></a>
                  <h4>By <a onclick="searchFor('${book.author}')">
                  ${book.author}</a></h4>
                  <h4 class="publisher">${book.publisher}</h4>
                  <p class="description">${book.description}</p>
                  </div>`;

    if (list != "none" && author && title) {
      listing += `<p>List: ${book.ranks_history[firstListing]?.display_name}<br />
                    Bestsellers Date: ${book.ranks_history[firstListing]?.bestsellers_date}</p>`;
    }

    listing += `<p>Click book title for details</p>`;
    listing += `</div>`;
    document.getElementById("books").innerHTML += listing;
  });
};

window.searchFor = searchFor;
window.getDetails = getDetails;
window.previouslyOn = previouslyOn;
window.displaySearchResults = displaySearchResults;

previouslyOn();
