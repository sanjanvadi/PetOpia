const constructorMethod = (app) => {
    app.use("*", (req, res) => {
        res.status(404).send("Page Not Found!");
    })
}

export default constructorMethod;