import app from "./app.mjs";
app.listen(process.env.PORT, () => {
    console.info(`running on ${process.env.PORT}`);
});
