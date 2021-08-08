import fetch from 'node-fetch';
import supertest from "supertest";
import app from "../app.mjs";

jest.mock('node-fetch', () => jest.fn());

const responseA = Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
        return {
            posts: [{
                id: 1,
                authorId: 9,
                likes: 960,
                popularity: 0.13,
                reads: 50361,
                tags: ["A"]
            }]
        };
    },
});
const responseB = Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
        return {
            posts: [
                {
                    id: 2,
                    authorId: 9,
                    likes: 961,
                    popularity: 0.14,
                    reads: 50362,
                    tags: ["B"]
                }]
        };
    },
});

fetch.mockImplementation((url) => {
    if (url.includes("tag=A")) {
        return responseA;
    }
    if (url.includes("tag=B")) {
        return responseB;
    }
});

test("test fetching tags /api/posts?tags=A,B", async () => {

    await supertest(app).get("/api/posts?tags=A,B")
        .expect(200)
        .then((result) => {
            expect(result.body).toEqual(
                {
                    posts: [{
                        id: 1,
                        authorId: 9,
                        likes: 960,
                        popularity: 0.13,
                        reads: 50361,
                        tags: ["A"]
                    },
                    {
                        id: 2,
                        authorId: 9,
                        likes: 961,
                        popularity: 0.14,
                        reads: 50362,
                        tags: ["B"]
                    }]
                }
            );
        });
});

test("test sorting and desc sort order /api/posts?tags=A,B&sortBy=id&direction=desc", async () => {

    await supertest(app).get("/api/posts?tags=A,B&sortBy=id&direction=desc")
        .expect(200)
        .then((result) => {
            expect(result.body).toEqual(
                {
                    posts: [
                        {
                            id: 2,
                            authorId: 9,
                            likes: 961,
                            popularity: 0.14,
                            reads: 50362,
                            tags: ["B"]
                        },
                        {
                            id: 1,
                            authorId: 9,
                            likes: 960,
                            popularity: 0.13,
                            reads: 50361,
                            tags: ["A"]
                        },]
                }
            );
        });
});

test("test sorting and default sort order /api/posts?tags=A,B&sortBy=id", async () => {

    await supertest(app).get("/api/posts?tags=A,B&sortBy=id")
        .expect(200)
        .then((result) => {
            expect(result.body).toEqual(
                {
                    posts: [{
                        id: 1,
                        authorId: 9,
                        likes: 960,
                        popularity: 0.13,
                        reads: 50361,
                        tags: ["A"]
                    },
                    {
                        id: 2,
                        authorId: 9,
                        likes: 961,
                        popularity: 0.14,
                        reads: 50362,
                        tags: ["B"]
                    }]
                }
            );
        });
});

test("test no tags error /api/posts", async () => {

    await supertest(app).get("/api/posts")
        .expect(400)
        .then((result) => {
            expect(result.body).toEqual(
                { error: "Tags parameter is required" }
            );
        });
});

test("test incorrect sort key error /api/posts?tags=A,B&sortBy=bla", async () => {

    await supertest(app).get("/api/posts?tags=A,B&sortBy=bla")
        .expect(400)
        .then((result) => {
            expect(result.body).toEqual(
                { error: "sortBy parameter is invalid" }
            );
        });
});

test("test incorrect sort key error /api/posts?tags=A,B&sortBy=id&direction=bla", async () => {

    await supertest(app).get("/api/posts?tags=A,B&sortBy=id&direction=bla")
        .expect(400)
        .then((result) => {
            expect(result.body).toEqual(
                { error: "direction parameter is invalid" }
            );
        });
});
