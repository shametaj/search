var searchTerm = document.querySelector(".text");
var searchButton = document.querySelector(".search-btn");
var entries = document.querySelector(".entries");
var loader = document.querySelector(".loader");
var result = document.querySelector(".result");

// Send text to search
searchTerm.onkeypress = function(event){
  if(event.which === 13){
    event.preventDefault();
    setSearchText(searchTerm.value);
  }
};

searchButton.onclick = function(){
  setSearchText(searchTerm.value);
};

function setSearchText(searchValue) {
  if(searchValue == ""){
    result.innerHTML = "Please enter a text to search!";
  } else {
    entries.innerHTML = "";
    result.innerHTML = "";
    displayLoader(true);
    getArticles(searchValue);
  }
}

function truncateTitle(title, max) {
  if(title.length > max){
    var shortenedTitle = title.slice(0, max) + "...";
    return shortenedTitle;
  }
  return title;
}

function checkHits(hits) {
  if(hits == 0){
    result.innerHTML = "No result found, please enter another request!";
    displayLoader(false);
  }
}

function displayLoader(isLoaderVisible) {
  loader.style.display = isLoaderVisible ? "block" : "none";
}

// Get article data
function getArticles(searchValue){
  $.ajax("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&list=search&titles="+ searchValue +"&rvprop=content&srsearch="+ searchValue +"&srlimit=8&srinfo=totalhits&srprop=snippet", {
    dataType: "jsonp" })

    .done(function(data){

      var searchResults = data.query.search;
      var totalHits = data.query.searchinfo.totalhits;

      // Show message if article doesn't exist
      checkHits(totalHits);

      // Check length of the title
      for(var i = 0; i < searchResults.length; i++){
        var result = searchResults[i];
        var title = result.title;
        var url = "https://en.wikipedia.org/wiki/" + title.replace(/\s/g, "_");

        // Truncate article title
        var maxTitleLength = 40;
        var shortTitle = truncateTitle(title, maxTitleLength);

        // Display articles on the page
        var entryData = "<h2 class='entry-header'>" + shortTitle + "</h2>" + "<p>" + result.snippet + "..." + "</p>";

        // Create entry-container
        var entryContainer = document.createElement("div");
        entryContainer.className = "entry-container";
        entries.appendChild(entryContainer);

        // Create entry
        var div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = entryData;
        entryContainer.appendChild(div);

        // Create entry-overly
        var entryOverly = document.createElement("div");
        entryOverly.className = "entry-overly";
        entryOverly.innerHTML = "Read Article";

        // Create article link
        var a = document.createElement("a");
        a.href = url;
        a.target ="_blank";
        entryContainer.appendChild(a);
        a.appendChild(entryOverly);
      }
      displayLoader(false);
    });
}
