const request = require("supertest");
const Book = require("../models/book");

const app = require("../app");
const db = require("../db");

describe("Books Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books")

        let bookOne = await Book.create({
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        });
        let bookTwo = await Book.create({
            isbn: "7777777",
            amazon_url: "http://a.co/eobPtX2",
            author: "Percy Shelly",
            language: "english",
            pages: 1,
            publisher: "Scholastic",
            title: "Ozymandias",
            year: 1888
        });
    });

    /** GET / => {books: [book, ...]} */
    describe("GET /books/", function() {
        test("can get list of books", async function() {
            let response = await request(app)
            .get("/books/")

            expect(response.statusCode).toEqual(200);
            expect(response.body.books.length).toEqual(2)
        })
    })
    /** GET /[id]  => {book: book} */
    describe("GET /books/7777777", function() {
        test("can get list of books", async function() {
            let ozyResponse = await request(app)
            .get("/books/7777777")

            expect(ozyResponse.statusCode).toEqual(200);
            expect(ozyResponse.body.book).toEqual({
                isbn: "7777777",
                amazon_url: "http://a.co/eobPtX2",
                author: "Percy Shelly",
                language: "english",
                pages: 1,
                publisher: "Scholastic",
                title: "Ozymandias",
                year: 1888
            });
        });
    });
    /** POST /   bookData => {book: newBook} */
    describe("POST /books/", function() {
        test("can create a new book", async function() {
            let response = await request(app)
            .post("/books/")
            .send({
                isbn: "88888888",
                amazon_url: "http://a.co/eobPtX2",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            })

            expect(response.statusCode).toEqual(201);
            expect(response.body.book).toEqual({
                isbn: "88888888",
                amazon_url: "http://a.co/eobPtX2",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            });
        });
        test("invalid data creates an error", async function() {
            //request but missing amazon url
            let response = await request(app)
            .post("/books/")
            .send({
                isbn: "88888888",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            })

            expect(response.statusCode).toEqual(400)
        })
    });
    /** PUT /[isbn]   bookData => {book: updatedBook} */
    describe("PUT /books/7777777", function() {
        test("can update a book", async function() {
            let response = await request(app)
            .put("/books/7777777")
            .send({
                isbn: "7777777",
                amazon_url: "http://a.co/eobPtX2",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            })

            expect(response.statusCode).toEqual(200);
            expect(response.body.book).toEqual({
                isbn: "7777777",
                amazon_url: "http://a.co/eobPtX2",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            });
        });
        test("invalid data creates an error", async function() {
            //request but missing amazon url
            let response = await request(app)
            .put("/books/7777777")
            .send({
                isbn: "7777777",
                author: "Mac Miller",
                language: "pure poetry",
                pages: 13,
                publisher: "Warner Records Inc",
                title: "Swimming",
                year: 2018
            })

            expect(response.statusCode).toEqual(400)
        })
    });
    /** DELETE /[isbn]   => {message: "Book deleted"} */
    describe("DELETE /books/7777777", function() {
        test("can delete a book", async function() {
            let response = await request(app)
            .delete("/books/7777777")

            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toEqual("Book deleted");
        });
        })
});

afterAll(async function () {
    await db.end();
});