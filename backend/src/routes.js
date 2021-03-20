import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { addItem, getAll } from './utils/readAndWriteToJSON';


const router = express.Router();
const errorArray = []
const verifyEmail = (email) => (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
const validateRequestBody = (properties, req) => {
    errorArray.length = 0
    properties.forEach(item => {
        if (req.body.hasOwnProperty(item) === false) {
            errorArray.push(`${item}`)
        }
    })
}
const validateEmail = (email) => {
    if (email) {
        if (verifyEmail(email) === false) {
            errorArray.push("email")
        }
    }
}
const validationResponse = (res) => {
    if (errorArray.length !== 0) {
        res.status(400).send({
            "message": "validation error",
            "invalid": errorArray
        })
        return true
    } else {
        return false
    }
}
const checkToken = (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(403).send({
            message: "token not provided"
        })
    }
    jwt.verify(token, 'jwtsecret', (err) => {
        if (err) {
            return res.status(403).send({
                message: err.message
            })
        } else {
            next()
        }
    })
}


router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.post('/contact_form/entries', async (req, res) => {
    const properties = ['name', 'email', 'phoneNumber', 'content']
    try {
        validateRequestBody(properties, req)
        validateEmail(req.body.email)
        const validationError = await validationResponse(res)
        if (!validationError) {
            let newEntry = {
                "id": uuidv4(),
                ...req.body
            }
            await addItem(newEntry, 'entries.json')
            return res.status(201).send(newEntry)
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/users', async (req, res) => {
    errorArray.length = 0
    const properties = ['name', 'email', 'password']
    try {
        validateRequestBody(properties, req)
        validateEmail(req.body.email)
        if (req.body.password) {
            if (req.body.password.length < 8) {
                errorArray.push(`password`)
            }
        }
        const validationError = await validationResponse(res)
        if (!validationError) {
            let newUser = {
                id: uuidv4(),
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 2)
            }
            await addItem(newUser, 'users.json')
            const createdUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password
            }
            res.status(201).send(createdUser)
        }
    }
    catch (err) {
        console.log(err);
    }
})

router.post('/auth', async (req, res) => {
    const properties = ['email', 'password']
    try {
        validateRequestBody(properties, req)
        validateEmail(req.body.email)
        const validationError = await validationResponse(res)
        if (!validationError) {
            const users = await getAll('users.json')
            const checkUser = users.filter((user) => user.email === req.body.email)
            if (checkUser.length === 0) {
                return res.status(401).send({
                    "message": "incorrect credentials provided"
                })
            } else if (checkUser.length > 0) { 
                if (bcrypt.compareSync(req.body.password, checkUser[0].password)) {
                    const payload = {
                        email: checkUser[0].email,
                        time: new Date()
                    }
                    const token = jwt.sign(payload, 'jwtsecret', {
                        expiresIn: '22h'
                    })
                    return res.status(200).send({ token: token })
                } else {
                    return res.status(401).send({
                        "message": "incorrect credentials provided"
                    })
                }
            }
        }
    } catch (err) {
        console.log(err);
    }

})


router.get('/contact_form/entries', checkToken, async (req, res) => {
    let entries = await getAll('entries.json') 
    res.status(200).send( entries)
}
)

router.get('/contact_form/entries/:id', checkToken, async (req, res) => {
    let entries = await getAll('entries.json') 
    const specificSubmission = await entries.filter(item => item.id === req.params.id)
    if (specificSubmission.length === 0) {
        return res.status(404).send(
            {
                "message": `entry ${req.params.id} not found`
            }

        )
    }
    res.status(200).send(specificSubmission[0])
})

export default router;