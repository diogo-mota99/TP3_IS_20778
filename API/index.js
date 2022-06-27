import express from 'express'
import pkg from 'body-parser';
const { json, urlencoded } = pkg;const app = express()
const port = 3000
import lines from './CRUD/lines/queries.js'
import cors from 'cors'


app.use(json())
app.use(
    urlencoded({
        extended: true,
    })
)
app.use(cors({
    origin: '*'
}));

//TEST APP
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

//LINES CRUD
app.get('/occurrences_line', lines.getLines);
app.post('/postLine', lines.postLines);
app.post('/updateLine', lines.updateLines);
app.post('/deleteLine', lines.deleteLines);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})