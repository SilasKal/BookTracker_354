import {displayResults, displayError, shelves, groupShelf} from "./utils.js"

var bookUrlGenre = "https://www.googleapis.com/books/v1/volumes?q=subject:";

var title = "recommendations";
var outputList = document.getElementById("list-output-" + title);
if (JSON.parse(localStorage.getItem(title + "_arr")) != null){
    displayResults(JSON.parse(localStorage.getItem(title + "_arr")), outputList, title);
}

$("#group_shelf_" + title).click(function() {
    groupShelf(title, outputList)
});

$("#generate_recommendations").click(function(category) {
    getGenres()
});

export async function getGenres(localStorage_ = localStorage, test = false){
    var genres = [];
    for (let i in shelves) {
        var shelf = JSON.parse(localStorage_.getItem(shelves[i] + "_arr"));
        if(shelf != null){
            for(let j = 0; j < shelf.length; j++){
                var item = shelf[j];
                var genre = item.volumeInfo.categories;
                if(genre != undefined)
                    genres.push(genre);
            }
        }
    }

    genres = [...new Set(genres)];

    if(genres.length == 0){
        alert("No books to recommend")
        if (JSON.parse(localStorage_.getItem(title + "_arr")) != null){
            if(!test){
                displayResults(JSON.parse(localStorage_.getItem(title + "_arr")), outputList, title);
            }
        }
        else{
            outputList.innerHTML = ""
        }
    }
    else {
        for(let i = 0; i < genres.length; i++){
            var curr_genre = genres[i];
            await searchByGenre(curr_genre, localStorage_, test)
        }
    };
}

async function searchByGenre(genre, localStorage_ = localStorage, test = false) {
    if(genre === "" || genre === null) {
        displayError(true);
    }
    else {
        await $.ajax({
            url: (bookUrlGenre + genre).replace(/ /g, "_"),
            dataType: "json",
            success: function(response) {
                var existingBooksInShelf = JSON.parse(localStorage_.getItem(title + "_arr"))
                if(existingBooksInShelf == null){
                    localStorage_.setItem(title + "_arr", JSON.stringify([response.items[0],
                                                                                response.items[1],
                                                                                response.items[2]]))
                }
                else{
                    existingBooksInShelf.push(response.items[randomIntFromInterval(0, response.items.length-1)],
                                                response.items[randomIntFromInterval(0, response.items.length-1)],
                                                response.items[randomIntFromInterval(0, response.items.length-1)])
                    existingBooksInShelf = removeDuplicateBooks(existingBooksInShelf)
                    localStorage_.setItem(title + "_arr", JSON.stringify(existingBooksInShelf))
                }
                if (response.totalItems === 0) {
                    alert("no result!.. try again")
                }
                else {
                    if(!test){
                        displayResults(JSON.parse(localStorage_.getItem(title + "_arr")), outputList, title);
                    }
                }
            },
            error: function () {
                alert("Something went wrong.. Refresh");
            }
        });
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function removeDuplicateBooks(arr, localStorage_ = localStorage){
    var ids = []
    var newArr = []

    for (let i in shelves) {
        var shelf = JSON.parse(localStorage_.getItem(shelves[i] + "_arr"));
        if (shelf != null) {
            for(let j = 0; j < shelf.length; j++){
                var curr_book = shelf[j]
                var id = curr_book.id
                if (!ids.includes(id)){
                    ids.push(id)
                }
            }
        }
    }

    for(let i = 0; i < arr.length; i++){
        var curr_book = arr[i]
        var id = curr_book.id
        if (!ids.includes(id)) {
            ids.push(id)
            newArr.push(curr_book)
        }
    }

    return newArr
}