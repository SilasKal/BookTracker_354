import rawData from '../sampleBooks.json' assert {type: 'json'}
import {
    deleteBook,
    moveBook,
    search,
    groupShelf
} from "../../utils.js"
import storageMock from "../mockLocalStorage.js"
let assert = chai.assert;
const expect = chai.expect;

var mockLocalStorage = new storageMock();
mockLocalStorage.setItem("to_read_arr", JSON.stringify([rawData.items[0], rawData.items[1]]))
mockLocalStorage.setItem("read_arr", JSON.stringify([rawData.items[2], rawData.items[3]]))
mockLocalStorage.setItem("reading_arr", JSON.stringify([rawData.items[4], rawData.items[5]]))
mockLocalStorage.setItem("favorites_arr", JSON.stringify([rawData.items[6], rawData.items[7]]))

describe('Favorites Shelf - TESTS', function () {
    describe('Moving Books', function () {
        it('Move book from Favorites to To Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("to_read_arr")).length
            moveBook("favorites", "to_read", JSON.parse(mockLocalStorage.getItem("favorites_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("to_read_arr")).length, oldLength + 1)
        });
        it('Move book from Favorites to Reading', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("reading_arr")).length
            moveBook("favorites", "reading", JSON.parse(mockLocalStorage.getItem("favorites_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("reading_arr")).length, oldLength + 1)
        });
        it('Move book from Favorites to Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("read_arr")).length
            moveBook("favorites", "read", JSON.parse(mockLocalStorage.getItem("favorites_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("read_arr")).length, oldLength + 1)
        });
        it('Move book from Favorites to Favorites', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("favorites_arr")).length
            moveBook("favorites", "favorites", JSON.parse(mockLocalStorage.getItem("favorites_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("favorites_arr")).length, oldLength)
        });
    });


    describe('Add Book', function () {
        it('Add book into Favorites shelf using search bar', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("favorites_arr")).length
            await search("Harry Potter", "favorites_arr", null, null, true, mockLocalStorage)
            await search("Lua Programming", "favorites_arr", null, null, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("favorites_arr")).length, oldLength + 2)
        });
    });
    describe('Group Shelf', function () {
        it('Group all existing books in the Favorites shelf', async function () {
            groupShelf("favorites", null, true, mockLocalStorage)
            const bookTitles = JSON.parse(mockLocalStorage.getItem("favorites_arr")).map(object => object.volumeInfo.title)
            expect(bookTitles).to.deep.equal(bookTitles.sort())
        });
    });
    describe('Delete Book', function () {
        it('Delete book from Favorites shelf', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("favorites_arr")).length
            deleteBook(event = null, JSON.parse(mockLocalStorage.getItem("favorites_arr")), null, "favorites", true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("favorites_arr")).length, oldLength - 1)
        });
    });
});