export default function validation(req, res, next) {
    const { tags, sortBy, direction } = req.query;
    if (!tags) {
        return res.status(400).json({ error: "Tags parameter is required" });
    }
    if (sortBy) {
        if (!process.env.SORT_KEYS.split(",").includes(sortBy)) {
            console.error(`SORTBY : ${sortBy} is invalid`);
            return res.status(400).json({ error: "sortBy parameter is invalid" });
        }
        if (direction && !process.env.SORT_ORDER.split(",").includes(direction)) {
            console.error(`DIRECTION : ${direction} is invalid`);
            return res.status(400).json({ error: "direction parameter is invalid" });
        }
        if (!direction) {
            req.query.direction = "asc";

        }
    }
    next();
};
