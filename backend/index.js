import express from 'express';
import routes from './src/routes';

const app = express();
const port = 5000;

app.use(express.json());
app.use('/', routes);
app.use((req, res) => {
    res.status(404).send({ "message": "not found" })
});

export default app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
}
)