import fetch from "node-fetch";

class DataStore {
    #cachedData;

    constructor() {
        this.#cachedData = {};
    }
    #cacheData(tag, posts) {
        // Thought about using the tags from posts to cache it even further
        // but then realized that those tags are not all the api has to offer
        // might have been useful in other cases
        this.#cachedData[tag] = posts;
    }
    async fetchData(tag) {
        try {
            const response = await fetch(`${process.env.BASE_URL}?tag=${tag}`);
            const json = await response.json();
            if (response.status !== 200) {
                throw new Error(`Failed to fetch TAG : ${tag}. STATUS : ${response.status}. ERROR : ${json}`);
            }
            return json;
        }
        catch (error) {
            console.error(error);
            return { posts: [] };
        }
    }
    async processTag(tag) {
        if (this.#cachedData[tag]) {
            console.info(`TAG : ${tag} already exists; returning cached data`);
            return this.#cachedData[tag];
        }

        console.info(`TAG : ${tag} does not exists; returning fresh data`);
        const data = await this.fetchData(tag);
        this.#cacheData(tag, data.posts);
        return this.#cachedData[tag];
    }
}

export default DataStore;
