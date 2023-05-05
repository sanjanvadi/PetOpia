import pets from './pet.js'
import user from './user.js'

const constructorMethod = (app) => {

    app.use('/account/pets', pets);
    app.use('/user', user);

    app.use("*", (req, res) => {
        res.status(404).send("Page Not x!");
    })
}

export default constructorMethod;