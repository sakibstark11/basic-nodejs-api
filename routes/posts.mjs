import { Router } from "express";

import DataStore from "../utils/dataStore.mjs";

const postsRouter = Router();

const store = new DataStore();

postsRouter.get("/", async (req, res) => {
    const tags = req.query.tags.split(",");
    let posts = await Promise.all(tags.map(async (tag) => {
        return store.processTag(tag);
    }));
    posts = [].concat.apply([], posts);

    const { sortBy, direction } = req.query;
    // thinking if it makes sense to cache sorted arrays
    // but since there is a chance of multiple tags
    // seems redundant
    if (sortBy) {
        if (direction === "asc") {
            posts = posts.sort((a, b) => {
                return a[sortBy] - b[sortBy];
            });
        } else {
            posts = posts.sort((a, b) => {
                return b[sortBy] - a[sortBy];
            });
        }
    }
    res.json({ posts: posts });
});

export default postsRouter;
