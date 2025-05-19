let search = document.getElementById("search");
let searchAuthor = document.getElementById("author");
let searchTitle = document.getElementById("title");
let clearBtn = document.getElementById("clear");
let titleText = document.getElementsByTagName("TITLE")[0];
let booksElement = document.getElementById("books");
const files = ["consolidated_books.json"];
const allBooks = [];
let filesLoaded = false;
const ONE_MONTH_AGO = Date.now() - 2629800000;

async function loadFiles(author = "", title = "", isbn = false) {
  if (filesLoaded && (author || title || isbn)) {
    searchJSON(author, title, isbn);
    return;
  }

  for (file of files) {
    const url = file; // Adjust path if needed

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Could not load ${url}`);
        //continue;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        allBooks.push(...data);
      } else {
        console.warn(`${url} is not an array`);
      }
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
    }
  }
  filesLoaded = true;
  if (author || title || isbn) {
    searchJSON(author, title, isbn);
    return;
  }
}

function searchFor(author = "", title = "") {
  //update URL
  modifyState(`?author=${author}&title=${title}`);
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
  if (localSearch(author, title)) return;

  //if not found in local go fetch
  console.log("load JSON");
  loadFiles(author, title, false);
}

function searchJSON(author = "", title = "", isbn = false) {
  if (isbn) {
    let found = allBooks.filter((book) => {
      return book.primary_isbn13 == isbn;
    });
    if (found.length) {
      addToLocalStorage(author, title, found, isbn);
    } else {
      noEntriesFound();
    }
    return;
  }

  let found = allBooks.filter((book) => {
    //TODO this logic needs updating
    let hit = false;
    if (author) {
      hit = book.author.toLowerCase().includes(author.toLowerCase())
        ? true
        : false;
    }
    if (title) {
      hit = book.title.toLowerCase().includes(title.toLowerCase())
        ? true
        : false;
    }
    return hit;
  });

  if (found.length) {
    addToLocalStorage(author, title, found, isbn);
  } else {
    noEntriesFound();
  }
}

function addToLocalStorage(author, title, results, isbn = false) {
  results.push(Date.now());

  let key = isbn ? isbn : `${author.toLowerCase()}${title.toLowerCase()}`;

  try {
    localStorage.setItem(key, JSON.stringify(results));
  } catch (error) {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify(results));
  }
  console.log("from JSON", results, isbn);
  displaySearchResults(results, isbn);
}

function noEntriesFound() {
  booksElement.innerHTML = `

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2JvOWsybzVsYTJ4bDVlNDhkYmFqeWp5MWFseXpvNmNoMWhjZmgxNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8J2MOphsMnQUo/giphy.gif"><br />
  No entries found<br />
  
  `;
}

const getDetails = (author = "", title = "", isbn) => {
  modifyState(`?author=${author}&title=${title}`);
  searchAuthor.value = author;
  searchTitle.value = title;

  booksElement.style.gridTemplateColumns = "repeat(3,minmax(auto, 800px))";

  if (!author && !title) {
    previouslyOn();
    return;
  }

  booksElement.innerHTML = "";

  //check local details
  if (localSearch(author, title, isbn)) return;

  //if not found in local go fetch
  console.log("load JSON");
  loadFiles(author, title, isbn);
};

function localSearch(author, title, isbn = false) {
  let key = isbn ? isbn : `${author.toLowerCase()}${title.toLowerCase()}`;

  if (localStorage.getItem(key)) {
    console.log("local search hit");

    let result = JSON.parse(localStorage.getItem(key));
    console.log("from local", result, isbn);
    displaySearchResults(result, isbn);

    if (result[result.length - 1] < ONE_MONTH_AGO) {
      console.log("local item purged")(localStorage.removeItem(key));
    }

    return true;
  }
  return false;
}

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

const displaySearchResults = (results, isbn = false) => {
  titleText.text = `Mean Book Club Bestsellers List Search`;
  console.log(Boolean(isbn), isbn, results.length);

  if (isbn) booksElement.innerHTML += `<div></div>`;
  if (isbn) results = [results[0]];

  results.forEach((book) => {
    if (book.primary_isbn13 === "undefined") return;

    if (typeof book == "number") return;
    console.log("book isbn", book.primary_isbn13);

    if (!isbn && results.length == 2) {
      getDetails(book.contributor, book.title, book.primary_isbn13);
      return;
    }

    //if (isbn && book.title != searchTitle.value) return;

    let firstListing;
    let list = "none";
    if (book.ranks_history) {
      firstListing = book.ranks_history?.length - 1;
      list = book.ranks_history[firstListing]?.list_name || "none";
    }

    // isbn = book.primary_isbn13 || 0;

    //Basic Info
    let listing = `
          <div class="entry">
            <div class="content">
              <h2>
              <a onclick="getDetails('${book.contributor}', 
              '${book.title}', '${book.primary_isbn13}')">
              ${book.title}</h2></a>
              <h4><a onclick="searchFor('${book.contributor}')">
              ${book.contributor}</a></h4>
              <h4 class="publisher">${book.publisher}</h4>
            
            <div class="cover">
              <a onclick="getDetails('${book.contributor}', '${book.title}', ${book.primary_isbn13})">
              <img src="https://covers.openlibrary.org/b/isbn/${book.primary_isbn13}-M.jpg" />
              
              </a>
            </div>
            <p class="description">${book.description}</p>`;
    //<img src="${book.book_image}" />

    //Search Links
    if (isbn) {
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
    if (list != "none" && author && title && !isbn) {
      listing += `<p>${book.ranks_history[firstListing]?.list_name}<br />
                    ${book.ranks_history[firstListing]?.published_date}</p>`;
    }

    //Display all lists
    if (isbn) {
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

    if (!isbn)
      listing += `<br/><p class="clickfordetails">Click book title for details</p>`;
    listing += `</div></div>`;
    listing += `</div>`;

    booksElement.innerHTML += listing;
    if (isbn) booksElement.innerHTML += `<div></div>`;
  });
};

function processURL() {
  let paramString = window.location.href.split("?")[1];
  let queryString = new URLSearchParams(paramString);

  let a, t;
  for (let pair of queryString.entries()) {
    if (pair[0].toLowerCase() == "author") a = pair[1];
    if (pair[0].toLowerCase() == "title") t = pair[1];
  }

  searchFor(a, t);
}

function modifyState(newURL) {
  let stateObj = { id: Date.now() };
  window.history.replaceState(
    stateObj,
    newURL.replaceAll(" ", "+"),
    `${newURL.replaceAll(" ", "+")}`
  );
}

previouslyOn();
processURL();
loadFiles();
