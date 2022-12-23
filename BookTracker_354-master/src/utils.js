var placeHldr = "https://via.placeholder.com/150"
var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
export var shelves = ["reading", "read", "favorites", "to_read"];

export function displayResults(arr, outputList, shelf_name) {
    outputList.innerHTML = ""
    for(let i = 0; i < arr.length; i++){
        var item = arr[i];
        var author = item.volumeInfo.authors;
        var publisher = item.volumeInfo.publisher;
        var bookImg = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
        var genre = item.volumeInfo.categories;
        var title = item.volumeInfo.title;
        outputList.innerHTML += formatOutput(bookImg, title, author, publisher, genre, shelf_name, i);
    }
    addEventListeners(arr, outputList, shelf_name);
}

export function formatOutput(bookImg, title, author, publisher, genre, shelf_name, index_pos) {
    var htmlCard = `
    <div class="card">
        <img src="${bookImg}" class="card-img-top" alt="Sample Image">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${author}, Published by ${publisher}, Genre: ${genre}</p>
            <div class="mt-auto buttonForCards">
                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <button id="${shelf_name + "_" + index_pos}" type="button" class="btn btn-danger"><img src="frontend/images/bin.png"></button>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="frontend/images/bookshelf.png" class = book_img>Move To
                        </button>
                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                            <a class="dropdown-item" id = "${"move_from_"+shelf_name+"_to_reading_" + index_pos}">Reading</a>
                            <a class="dropdown-item" id = "${"move_from_"+shelf_name+"_to_read_" + index_pos}">Read</a>
                            <a class="dropdown-item" id = "${"move_from_"+shelf_name+"_to_favorites_" + index_pos}">Favorites</a>
                            <a class="dropdown-item" id = "${"move_from_"+shelf_name+"_to_to_read_" + index_pos}">To Read</a>
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button id="${shelf_name + "_" + index_pos + "_done_reading"}" type="button" class="btn btn-success"><img src="frontend/images/book.png" class = book_img>I Read This Book</button>
                </div>
            </div>
        </div>
    </div>`

    return htmlCard;
}

export function displayError(recommendations) {
    if(recommendations){
        alert("Make sure there is at least one book with a defined genre added")
    }
    else{
        alert("search term can not be empty!")
    }
}

export function deleteBook(event, arr, outputList, shelf_name, test = false, localStorage_ = localStorage) {
    if (!test){
        var index = parseInt(event.currentTarget.id.replace(/^\D+/g, ""))
    }
    else{
        var index = 0
    }
    arr.splice(index, 1);
    if(arr.length === 0)
        localStorage_.removeItem(shelf_name+"_arr")
    else
        localStorage_.setItem(shelf_name + "_arr", JSON.stringify(arr))
    if(!test){
        displayResults(arr, outputList, shelf_name)
    }
}

function addEventListeners(arr, outputList, shelf_name){
    for(let i = 0; i < arr.length; i++){
        const temp = document.getElementById(shelf_name + '_' + (i).toString());
        temp.addEventListener('click', event => {deleteBook(event, arr, outputList, shelf_name)})
        const temp2 = document.getElementById('move_from_'+shelf_name+'_to_reading_' + (i).toString());
        temp2.addEventListener('click', event => {moveBook(shelf_name, "reading", arr, (i).toString());if(shelf_name != "reading"){deleteBook(event, arr, outputList, shelf_name)}});
        const temp3 = document.getElementById('move_from_'+shelf_name+'_to_read_' + (i).toString());
        temp3.addEventListener('click', event => {moveBook(shelf_name, "read", arr, (i).toString());if(shelf_name != "read"){deleteBook(event, arr, outputList, shelf_name)}});
        const temp4 = document.getElementById('move_from_'+shelf_name+'_to_favorites_' + (i).toString());
        temp4.addEventListener('click', event => {moveBook(shelf_name, "favorites", arr, (i).toString());if(shelf_name != "favorites"){deleteBook(event, arr, outputList, shelf_name)}});
        const temp5 = document.getElementById('move_from_'+shelf_name+'_to_to_read_' + (i).toString());
        temp5.addEventListener('click', event => {moveBook(shelf_name, "to_read", arr, (i).toString());if(shelf_name != "to_read"){deleteBook(event, arr, outputList, shelf_name)}});
        const temp6 = document.getElementById(shelf_name + '_' + (i).toString() + "_done_reading");
        temp6.addEventListener('click', event => {moveBook(shelf_name, "read", arr, (i).toString());if(shelf_name != "read"){deleteBook(event, arr, outputList, shelf_name)}});
    }
}

export function moveBook(from, to, arr, index_pos, test = false, localStorage_ = localStorage){
    if (from == "recommendations" && checkBookInShelf(arr[index_pos].id)) {
        alert("book already exists in your shelves");
        return;
    }
    if (from == to){
        return;
    }
    var books = JSON.parse(localStorage_.getItem(to + "_arr"))
    if(books == null){
        localStorage_.setItem(to + "_arr", JSON.stringify([]))
        books = JSON.parse(localStorage_.getItem(to + "_arr"))
    }
    books.push(arr[index_pos]);
    localStorage_.setItem(to + "_arr", JSON.stringify(books))
    if(!test){
        displayResults(books, document.getElementById("list-output-" + to), to);
    }
}

export function checkBookInShelf(id, localStorage_ = localStorage) {
    for (let i in shelves) {
        var shelf = JSON.parse(localStorage_.getItem(shelves[i] + "_arr"));
        if (shelf == null)
            continue;

        if (shelf.some(function(e) {
            return e.id == id;
        }))
            return true;
    }
    return false;
}

export async function search(searchData, shelfName, outputList, displayName, test = false, localStorage_ = localStorage) {
    document.body.style.backgroundImage = "url('')";
    if(searchData === "" || searchData === null) {
        displayError();
    }
    else {
        await $.ajax({
            url: bookUrl + searchData,
            dataType: "json",
            success: function(response) {
                if (checkBookInShelf(response.items[0].id, localStorage_)) {
                    alert("book already exists in your shelves");
                }
                else {
                    if (response.totalItems === 0) {
                        alert("no result!.. try again");
                    }
                    else {
                        var existingBooksInShelf = JSON.parse(localStorage_.getItem(shelfName))
                        if(existingBooksInShelf == null){
                            localStorage_.setItem(shelfName, JSON.stringify([response.items[0]]))
                        }
                        else{
                            existingBooksInShelf.push(response.items[0])
                            localStorage_.setItem(shelfName, JSON.stringify(existingBooksInShelf))
                        }
                        if(!test){
                            displayResults(JSON.parse(localStorage_.getItem(shelfName)), outputList, displayName);
                        }
                    }
                }
            },
            error: function () {
                alert("Something went wrong.. <br>"+"Try again!");
            }
        });
    }
}

export function groupShelf(shelfName, outputList, test = false, localStorage_ = localStorage){
    var shelf = JSON.parse(localStorage_.getItem(shelfName + "_arr"));
    if(shelf == null){
        alert("Error: Can not group empty shelves")
        return
    }
    shelf.sort(function(a, b) {
        var textA = a.volumeInfo.categories;
        var textB = b.volumeInfo.categories;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    localStorage_.setItem(shelfName+"_arr", JSON.stringify(shelf))
    if(!test){
        displayResults(JSON.parse(localStorage_.getItem(shelfName+"_arr")), outputList, shelfName)
    }
}