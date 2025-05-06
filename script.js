let apiKey = "W7gIJGjUUnOV3a5Msp8VcyIU02AWiXz7";
let search = document.getElementById("search");
let searchAuthor = document.getElementById("author");
let searchTitle = document.getElementById("title");
let clearBtn = document.getElementById("clear");

let previously = [
  { title: "The Pelican Brief", author: "John Grisham" },
  { title: "Eat Pray Love", author: "Elizabeth Gilbert" },
  { title: "Twilight", author: "Stephenie Meyer" },
  { title: "The Shack", author: "William P. Young" },
  { title: "Crazy House", author: "James Patterson and Gabrielle Charbonnet" },
  { title: "The Secret", author: "Rhonda Byrne" },
  { title: "The Da Vinci Code", author: "Dan Brown" },
  { title: "Malice", author: "Danielle Steel" },
  { title: "Fourth Wing", author: "Rebecca Yarros" },
  { title: "Hillbilly Elegy", author: "J.D. Vance" },
  { title: "The Housemaid", author: "Freida McFadden" },
  { title: "Lean In", author: "Sheryl Sandberg" },
  { title: "A Court of Thorns and Roses", author: "Sarah J. Maas" },
  { title: "The House in the Pines", author: "Ana Reyes" },
  { title: "Memoirs of a Geisha", author: "Arthur Golden" },
  { title: "While Justice Sleeps", author: "Stacey Abrams" },
  { title: "Happy Place", author: "Emily Henry" },
  { title: "Divine Rivals", author: "Rebecca Ross" },
  { title: "Just the Nicest Couple", author: "Mary Kubica" },
  { title: "The Paper Palace", author: "Miranda Cowley Heller" },
  { title: "A Man Called Ove", author: "Fredrik Backman" },
  { title: "The Bodyguard", author: "Katherine Center" },
  { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman" },
  { title: "Dichotomy of Leadership", author: "Jocko Willink and Leif Babin" },
  { title: "Verity", author: "Colleen Hoover" },
  { title: "Cherry Cheesecake Murder", author: "Joanne Fluke" },
  { title: "1984", author: "George Orwell" },
  { title: "Before We Were Yours", author: "Lisa Wingate" },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro" },
  { title: "Think and Grow Rich", author: "Napoleon Hill" },
  { title: "World War Z", author: "Max Brooks" },
  { title: "In Five Years", author: "Rebecca Serle" },
  { title: "You", author: "Caroline Kepnes" },
  { title: "You Are a Badass at Making Money", author: "Jen Sincero" },
  { title: "The Sun Down Motel", author: "Simone St. James" },
  { title: "It's Not About the Bike", author: "Lance Armstrong" },
  { title: "The Grace Year", author: "Kim Liggett" },
  { title: "Breakfast of Champions", author: "Kurt Vonnegut" },
  { title: "My Dark Vanessa", author: "Kate Elizabeth Russell" },
  { title: "Bringing Up Bébé", author: "Pamela Druckerman" },
  { title: "Dark Matter", author: "Blake Crouch" },
  { title: "The Whisper Man", author: "Alex North" },
  { title: "Survive the Night", author: "Riley Sager" },
  { title: "Big Magic", author: "Elizabeth Gilbert" },
  { title: "The Wife Upstairs", author: "Rachel Hawkins" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
  { title: "The Vanishing Half", author: "Brit Bennett" },
  { title: "Peyton Place", author: "Grace Metalious" },
  { title: "The Wives", author: "Tarryn Fisher" },
  { title: "Bridgerton", author: "Julia Quinn" },
  { title: "The Old Man and the Sea", author: "Ernest Hemingway" },
  { title: "Untamed", author: "Glennon Doyle" },
  { title: "The Overachievers", author: "Alexandra Robbins" },
  { title: "Open Book", author: "Jessica Simpson" },
  { title: "The Guest List", author: "Lucy Foley" },
  { title: "This Man Confessed", author: "Jodi Ellen Malpas" },
  { title: "Nine Perfect Strangers", author: "Liane Moriarty" },
  { title: "The Christmas Shoes", author: "Donna VanLiere" },
  {
    title: "Gossip Girl: All I Want Is Everything",
    author: "Cecily von Ziegesar",
  },
  { title: "Gerald's Game", author: "Stephen King" },
  { title: "Neon Prey", author: "John Sandford" },
  { title: "Artemis Fowl", author: "Eoin Colfer" },
  { title: "Naked Came the Stranger", author: "Penelope Ashe" },
  { title: "Women Who Work", author: "Ivanka Trump" },
  { title: "Naughty Neighbor", author: "Janet Evanovich" },
  { title: "Lolita", author: "Vladimir Nabokov" },
  { title: "American Dirt", author: "Jeanine Cummins" },
  { title: "Valley of the Dolls", author: "Jacqueline Susann" },
  { title: "The Christmas Train", author: "David Baldacci" },
  { title: "Relentless", author: "Dean Koontz" },
  { title: "L.A. Candy", author: "Lauren Conrad" },
];

function searchFor(author = "", title = "") {
  searchAuthor.value = author;
  searchTitle.value = title;
  if (!author && !title) {
    previouslyOn();
    return;
  }

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

        //console.log(book);

        let bookInfo = book;
        firstListing = book.ranks_history?.length - 1;
        list = book.ranks_history[firstListing]?.display_name || "none";
        bdate = book.ranks_history[firstListing]?.bestsellers_date || "none";

        let listing = `<div class="entry"><div class="content">
                <h2><a onclick="searchFor('${book.author}', '${book.title}')">
                ${bookInfo.title}</h2></a>
                <h4>By <a onclick="searchFor('${book.author}')">
                ${bookInfo.author}</a></h4>
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
          }
        } else {
          listing += `<p>List: ${list}<br/>
                    Bestsellers Date: ${bdate}</p>`;
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
  document.getElementById("books").innerHTML = "Previously on Mean Book Club:";
  for (let book of previously) {
    //console.log(book.title)

    let newLink = document.createElement("a");
    newLink.onclick = () => searchFor(`${book.author}`, `${book.title}`);
    newLink.innerText = `${book.title} by ${book.author}`;
    document.getElementById("books").appendChild(newLink);
  }
};

previouslyOn();
