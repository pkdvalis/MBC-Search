let search = document.getElementById("search");

function searchFor(author = "", title = "") {
  //console.log("search launch", author, title)
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?author=` +
      `${author}&title=${title}&api-key=${apiKey}`,
    { method: "get" }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      document.getElementById("books").innerHTML = "";

      let nytimesBestSellers = json;
      nytimesBestSellers.results.forEach((book) => {
        //reset
        let list = "none";
        let bdate = "none";
        let firstListing = "none";

        console.log(book);

        let bookInfo = book;
        firstListing = book.ranks_history?.length - 1;
        list = book.ranks_history[firstListing]?.display_name || "none";
        bdate = book.ranks_history[firstListing]?.bestsellers_date || "none";

        let listing = `<div class="entry"><div class="content">
                <h2>${bookInfo.title}</h2>
                <h4>By ${bookInfo.author}</h4>
                <h4 class="publisher">${bookInfo.publisher}</h4>
                <p class="listdate">${bookInfo.description}</p>
                <a href="https://www.audible.com/search?keywords=${book.title} ${book.author}" target="_blank">Audible Search</a><br />
                <a href="https://www.goodreads.com/search?q=${book.title} ${book.author}" target="_blank">Goodreads Search</a><br />
                <a href="https://app.thestorygraph.com/browse?search_term=${book.title} ${book.author}" target="_blank">The Storygraph Search</a><br />
                <a href="https://www.youtube.com/results?search_query=${book.title} ${book.author} audiobook" target="_blank">Youtube Search</a><br />
                <a href="https://libbyapp.com/search/cwmars/search/query-${book.title} ${book.author}/page-1" target="_blank">Libby Search</a><br />
                <a href="https://duckduckgo.com/?q=${book.title} ${book.author} New York Times Bestseller" target="_blank">Internet Search</a><br />
                </div>`;

        if (list != "none") {
          for (rank in book.ranks_history) {
            listing += `<p>List: ${book.ranks_history[rank].display_name}<br />
                                    Bestsellers Date: ${book.ranks_history[rank].bestsellers_date}</p>`;
            //listing += rank.display_name
          }
        } else {
          listing += `<p>List: ${list}<br/>
                    Bestsellers Date: ${bdate}</p>`;
        }
        listing += `</div>`;
        document.getElementById("books").innerHTML += listing;
      });
    });
}

search.addEventListener("submit", (e) => {
  e.preventDefault();
  searchFor(
    document.getElementById("author").value,
    document.getElementById("title").value
  );
});
