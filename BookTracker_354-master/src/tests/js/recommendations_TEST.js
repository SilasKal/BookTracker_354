import rawData from '../sampleBooks.json' assert {type: 'json'}
import {
    deleteBook,
    moveBook,
    search,
    groupShelf
} from "../../utils.js"
import {
    getGenres
} from "../../recommendations.js"
import storageMock from "../mockLocalStorage.js"
let assert = chai.assert;
const expect = chai.expect;

var mockLocalStorage = new storageMock();
mockLocalStorage.setItem("to_read_arr", JSON.stringify([rawData.items[0], rawData.items[1]]))
mockLocalStorage.setItem("read_arr", JSON.stringify([rawData.items[2], rawData.items[3]]))
mockLocalStorage.setItem("reading_arr", JSON.stringify([rawData.items[4], rawData.items[5]]))
mockLocalStorage.setItem("favorites_arr", JSON.stringify([rawData.items[6], rawData.items[7]]))
mockLocalStorage.setItem("recommendations_arr", JSON.stringify([]))

describe('Recommendations Shelf - TESTS', function () {

    describe('Generate Recommendations', function () {
        it('Generate Recommended books for Recommendation shelf', async function (done) {
            this.timeout(10000)
            await getGenres(mockLocalStorage, true)
            assert.notEqual(JSON.parse(mockLocalStorage.getItem("recommendations_arr")).length, 0)
            done()
        });
    });

    describe('Moving Books', function () {
        it('Move book from Recommendations to To Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("to_read_arr")).length
            moveBook("recommendations", "to_read", JSON.parse(mockLocalStorage.getItem("recommendations_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("to_read_arr")).length, oldLength + 1)
        });
        it('Move book from Recommendations to Reading', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("reading_arr")).length
            moveBook("recommendations", "reading", JSON.parse(mockLocalStorage.getItem("recommendations_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("reading_arr")).length, oldLength + 1)
        });
        it('Move book from Recommendations to Read', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("read_arr")).length
            moveBook("recommendations", "read", JSON.parse(mockLocalStorage.getItem("recommendations_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("read_arr")).length, oldLength + 1)
        });
        it('Move book from Recommendations to Favorites', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("favorites_arr")).length
            moveBook("recommendations", "favorites", JSON.parse(mockLocalStorage.getItem("recommendations_arr")), 0, true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("favorites_arr")).length, oldLength + 1)
        });
    });

    describe('Group Shelf', function () {
        it('Group all existing books in the Recommendations shelf', async function () {
            groupShelf("recommendations", null, true, mockLocalStorage)
            const bookTitles = JSON.parse(mockLocalStorage.getItem("recommendations_arr")).map(object => object.volumeInfo.title)
            expect(bookTitles).to.deep.equal(bookTitles.sort())
        });
    });

    describe('Delete Book', function () {
        it('Delete book from Reading shelf', async function () {
            let oldLength = JSON.parse(mockLocalStorage.getItem("recommendations_arr")).length
            deleteBook(event = null, JSON.parse(mockLocalStorage.getItem("recommendations_arr")), null, "recommendations", true, mockLocalStorage)
            assert.equal(JSON.parse(mockLocalStorage.getItem("recommendations_arr")).length, oldLength - 1)
        });
    });
});