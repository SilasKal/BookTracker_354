import {displayResults, groupShelf, search} from "./utils.js"

var title = "favorites";
var outputList = document.getElementById("list-output-" + title);
if (JSON.parse(localStorage.getItem(title + "_arr")) != null){
    displayResults(JSON.parse(localStorage.getItem(title + "_arr")), outputList, title);
}

$("#search_" + title).click(function() {
    var searchData = $("#search_box_" + title).val();
    search(searchData, title + "_arr", outputList, title);
    $("#search_box_" + title).val("");
});

$("#group_shelf_" + title).click(function() {
    groupShelf(title, outputList)
});