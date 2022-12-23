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

describe('Reading Shelf - TESTS', function () {
    describe('Moving Books', function () {
        it('Move book from Reading to To Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("to_read_arr")).length
            moveBook("reading", "to_read", JSON.parse(mockLocalStorage.getItem("reading_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("to_read_arr")).length, oldLength + 1)
        });
        it('Move book from Reading to Reading', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("reading_arr")).length
            moveBook("reading", "reading", JSON.parse(mockLocalStorage.getItem("reading_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("reading_arr")).length, oldLength)
        });
        it('Move book from Reading to Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("read_arr")).length
            moveBook("reading", "read", JSON.parse(mockLocalStorage.getItem("reading_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("read_arr")).length, oldLength + 1)
        });
        it('Move book from Reading to Favorites', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("favorites_arr")).length
            moveBook("reading", "favorites", JSON.parse(mockLocalStorage.getItem("reading_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("favorites_arr")).length, oldLength + 1)
        });
    });


    describe('Add Book', function () {
        it('Add book into Reading shelf using search bar', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("reading_arr")).length
            await search("Harry Potter", "reading_arr", null, null, true, mockLocalStorage)
            await search("Lua Programming", "reading_arr", null, null, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("reading_arr")).length, oldLength + 2)
        });
    });
    describe('Group Shelf', function () {
        it('Group all existing books in the Reading shelf', async function () {
            groupShelf("reading", null, true, mockLocalStorage)
            const bookTitles = JSON.parse(mockLocalStorage.getItem("reading_arr")).map(object => object.volumeInfo.title)
            expect(bookTitles).to.deep.equal(bookTitles.sort())
        });
    });
    describe('Delete Book', function () {
        it('Delete book from Reading shelf', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("reading_arr")).length
            deleteBook(event = null, JSON.parse(mockLocalStorage.getItem("reading_arr")), null, "reading", true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("reading_arr")).length, oldLength - 1)
        });
    });
});