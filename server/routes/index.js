import pets from './pet.js'

const constructorMethod = (app) => {

    app.use('/pets', pets);

    app.use("*", (req, res) => {
        res.status(404).send("Page Not x!");
    })
}

export default constructorMethod;