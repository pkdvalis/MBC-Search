let apiKey = "W7gIJGjUUnOV3a5Msp8VcyIU02AWiXz7";
//let apiKey = "ldD9shrU9AywvAcnn5IOs8QaHWgvfUvv";
//let apikeyinput = document.getElementById("apikeyinput")
//let apiKey = apikeyinput.value;
let search = document.getElementById("search");
let searchAuthor = document.getElementById("author");
let searchTitle = document.getElementById("title");
let clearBtn = document.getElementById("clear");
let searchTerms = new Set();
let localSearchDb = {};
let detailTerms = new Set();
let localDetailDb = {};
let titleText = document.getElementsByTagName("TITLE")[0];
let booksElement = document.getElementById("books");

/*
apikeyinput.addEventListener("change", () => {
  apiKey = apikeyinput.value
  
})*/

function searchFor(author = "", title = "") {
  //update URL
  modifyState(
    `?author=${author.replace(" ", "+")}&title=${title.replace(" ", "+")}`
  );
  titleText.text = `Mean Book Club Bestsellers List Search`;
  booksElement.style.display = "grid";
  booksElement.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(350px, 1fr))";

  searchAuthor.value = author = author.replace(/J\.D\./g, "JD");
  searchTitle.value = title;

  if (!author && !title) {
    previouslyOn();
    return;
  }

  booksElement.innerHTML = "";

  //check local search terms

  for (let key of Object.keys(localStorage)) {
    console.log(`${key}`);
    if (key.toLowerCase() == ("search-" + author + title).toLowerCase()) {
      displaySearchResults(JSON.parse(localStorage.getItem(key)).slice(0, -1));
      return;
    }
  }
  /* memory db
  if (
    Array.from(searchTerms).find(
      (a) => a.toLowerCase() == (author + title).toLowerCase()
    )
  ) {
    //toptop.innerText = "local";
    displaySearchResults(localSearchDb[author + title]);
    return;
  }
  */

  //if not found in local go fetch
  //toptop.innerText = "fetch";
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?contributor=` +
      `${author}&title=${title}&api-key=${apiKey}`,
    { method: "get" }
  )
    .then((response) => {
      return response.json();
    })
    .then((nytimesBestSellers) => {
      booksElement.innerHTML = "";

      //no entries found
      if (nytimesBestSellers.results.length == 0) {
        booksElement.innerHTML = `
      
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2JvOWsybzVsYTJ4bDVlNDhkYmFqeWp5MWFseXpvNmNoMWhjZmgxNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8J2MOphsMnQUo/giphy.gif"><br />
        No entries found<br />
        
        `;
      }
      // add to local storage
      nytimesBestSellers.results.push(Date.now());
      localStorage.setItem(
        "search-" + author + title,
        JSON.stringify(nytimesBestSellers.results)
      );

      displaySearchResults(nytimesBestSellers.results);
    })
    .catch((error) => {
      console.log(error);
      booksElement.innerHTML = `
      
      <img src="https://img.allw.mn/content/tm/gb/sirkxxrk594bd534d8e99856700530_520x277.gif"><br />
        Hold your horses!<br /><br />

        The New York Times limits the number of requests that we can send to the database. 
        By the time you're done reading this you can probably try again.<br /><br />

        If not, just wait longer.
      
        `;
    });
}

const getDetails = (author = "", title = "") => {
  modifyState(
    `?author=${author.replace(" ", "+")}&title=${title.replace(" ", "+")}`
  );
  searchAuthor.value = author;
  searchTitle.value = title;
  //element.style.removeProperty('background-color');
  booksElement.style.gridTemplateColumns = "repeat(3,minmax(auto, 800px))";

  if (!author && !title) {
    previouslyOn();
    return;
  }

  booksElement.innerHTML = "";

  //check local details

  for (let key of Object.keys(localStorage)) {
    if (key.toLowerCase() == ("detail-" + author + title).toLowerCase()) {
      displaySearchResults(
        JSON.parse(localStorage.getItem(key)).slice(0, -1),
        true
      );
      return;
    }
  }

  /*
  if (
    Array.from(detailTerms).find(
      (a) => a.toLowerCase() == (author + title).toLowerCase()
    )
  ) {
    //toptop.innerText = "local";
    displaySearchResults(localDetailDb[author + title], true);
    return;
  }
  */

  //if not found in local go fetch
  //toptop.innerText = "fetch";
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?contributor=` +
      `${author}&title=${title}&api-key=${apiKey}`,
    { method: "get" }
  )
    .then((response) => {
      return response.json();
    })
    .then((nytimesBestSellers) => {
      if (nytimesBestSellers.results.length == 0) {
        booksElement.innerHTML = `
      
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2JvOWsybzVsYTJ4bDVlNDhkYmFqeWp5MWFseXpvNmNoMWhjZmgxNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8J2MOphsMnQUo/giphy.gif"><br />
        No entries found<br />
        
        `;
      }

      // add to local storage
      nytimesBestSellers.results.push(Date.now());
      localStorage.setItem(
        "detail-" + author + title,
        JSON.stringify(nytimesBestSellers.results)
      );

      displaySearchResults(nytimesBestSellers.results, true);
    })
    .catch((error) => {
      console.log(error);
      booksElement.innerHTML = `
      
      <img src="https://img.allw.mn/content/tm/gb/sirkxxrk594bd534d8e99856700530_520x277.gif"><br />
        Hold your horses!<br /><br />

        The New York Times limits the number of requests that we can send to the database. 
        By the time you're done reading this you can probably try again.<br /><br />

        If not, just wait longer.
        `;
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
  titleText.text = `Mean Book Club Bestsellers List Search`;
  booksElement.innerHTML =
    '<p id="previouslyon" >Previously on Mean Book Club:</p>';
  for (let book of previouslyList) {
    let newLink = document.createElement("a");
    newLink.onclick = () => searchFor(`${book.author}`, `${book.title}`);
    newLink.innerText = `${book.title} by ${book.author}`;
    booksElement.appendChild(newLink);
  }
};

const displaySearchResults = (results, details = false) => {
  titleText.text = `Mean Book Club Bestsellers List Search`;

  if (details) booksElement.innerHTML += `<div></div>`;

  results.forEach((book) => {
    if (!details && results.length == 1) {
      console.log("calling details", book.contributor.slice(3));
      getDetails(book.contributor.slice(3), book.title);
      return;
    }

    if (details && book.title != searchTitle.value) return;

    let firstListing;
    let list = "none";
    if (book.ranks_history) {
      firstListing = book.ranks_history?.length - 1;
      list = book.ranks_history[firstListing]?.display_name || "none";
    }

    let isbn = book.isbns[0]?.isbn13;
    if (!isbn) isbn = "";

    //Basic Info
    let listing = `
          <div class="entry">
            <div class="content">
              <h2>
              <a onclick="getDetails('${book.contributor.slice(3)}', '${
      book.title
    }'), true">
              ${book.title}</h2></a>
              <h4><a onclick="searchFor('${book.contributor.slice(3)}')">
              ${book.contributor}</a></h4>
              <h4 class="publisher">${book.publisher}</h4>
            
            <div class="cover">
              <a onclick="getDetails('${book.contributor.slice(3)}', '${
      book.title
    }', true)">
              <img src="https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg" /></a>
            </div>
            <p class="description">${book.description}</p>`;

    //Search Links
    if (details) {
      titleText.text = `${book.title} ${book.contributor} Mean Book Club Bestsellers List Search`;
      listing += `
          <div class="links">
          <a href="https://www.audible.com/search?keywords=${book.title} ${book.author}" target="_blank"><img src="https://favicon.im/audible.com?larger=true" height=50 alt="audible.com favicon (large)" /></a>
          <a href="https://www.audiobooks.com/search/book/${book.title} ${book.author}" target="_blank"><img src="https://favicon.im/audiobooks.com?larger=true" height=50 alt="audiobooks.com favicon (large)" /></a>
          <a href="https://www.goodreads.com/search?q=${book.title} ${book.author}" target="_blank"><img src="https://favicon.im/goodreads.com?larger=true" height=50 alt="goodreads.com favicon (large)" /></a>
          <a href="https://app.thestorygraph.com/browse?search_term=${book.title} ${book.author}" target="_blank"><img src="https://assets.thestorygraph.com/assets/logo-no-text-7334be64b3d3a1652e2a4d9bc2ce2c12fdc48c879f4503e8fa702e1b57005e40.png" height=50 alt="thestorygraph.com favicon (large)" /></a>
          <a href="https://www.youtube.com/results?search_query=${book.title} ${book.author} audiobook" target="_blank"><img src="https://favicon.im/youtube.com?larger=true" height=50 alt="youtube.com favicon (large)" /></a>
          <a href="https://libbyapp.com/search/cwmars/search/query-${book.title} ${book.author}/page-1" target="_blank"><img src="https://favicon.im/libbyapp.com?larger=true" height=50 alt="libbyapp.com favicon (large)" /></a>
          <a href="https://duckduckgo.com/?q=${book.title} ${book.author} New York Times Bestseller" target="_blank"><img src="https://favicon.im/duckduckgo.com?larger=true" height=50 alt="duckduckgo.com favicon (large)" /></a>
          </div>`;
    }

    //Display first list book appears on
    if (list != "none" && author && title && !details) {
      listing += `<p>${book.ranks_history[firstListing]?.list_name}<br />
                    ${book.ranks_history[firstListing]?.published_date}</p>`;
    }

    //Display all lists
    if (details) {
      if (list != "none") {
        listing += `<p>
        ${book.title} ${book.contributor} appears in the following Bestsellers lists:</p>
        <div id="bestsellerlists">
        `;
        for (let i in book.ranks_history) {
          let listlinkname = book.ranks_history[i].list_name
            .toLowerCase()
            .replaceAll(" ", "-");
          let listlinkdate = book.ranks_history[i].published_date.replaceAll(
            "-",
            "/"
          );
          listing += `<a href="https://www.nytimes.com/books/best-sellers/${listlinkdate}/${listlinkname}/" target="_blank">
          <p>${book.ranks_history[i].list_name}<br />
          ${book.ranks_history[i].published_date}</p></a>`;
        }
        listing += `</div>`;
      } else {
        listing += `<p>List: none</p>`;
      }
    }

    if (!details)
      listing += `<br/><p class="clickfordetails">Click book title for details</p>`;
    listing += `</div></div>`;
    listing += `</div>`;

    booksElement.innerHTML += listing;
    if (details) booksElement.innerHTML += `<div></div>`;
  });
};

function processURL() {
  let paramString = window.location.href.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  console.log(queryString);
  let a, t;
  for (let pair of queryString.entries()) {
    console.log(pair[0].toLowerCase(), pair[1]);
    if (pair[0].toLowerCase() == "author") a = pair[1];
    if (pair[0].toLowerCase() == "title") t = pair[1];
    console.log(a, t);
  }
  console.log(a, t);
  searchFor(a, t);
}

function modifyState(newURL) {
  let stateObj = { id: Date.now() };
  window.history.replaceState(stateObj, newURL, `${newURL}`);
}

previouslyOn();
processURL();
