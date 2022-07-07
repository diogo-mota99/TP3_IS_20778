import express from 'express'
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
const app = express()
const port = 3000
import lines from './CRUD/lines/queries.js'
import points from './CRUD/points/queries.js'
import polygons from './CRUD/polygons/queries.js'
import upload from './file_upload/upload.js'
import cors from 'cors'
import fileUpload from 'express-fileupload';

app.use(json())
app.use(
    urlencoded({
        extended: true,
    })
)
app.use(cors({
    origin: '*'
}));
app.use(fileUpload());

//TEST APP
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

//LINES CRUD
app.get('/occurrences_line', lines.getLines);
app.post('/postLine', lines.postLines);
app.post('/updateLine', lines.updateLines);
app.post('/deleteLine', lines.deleteLines);

//POINTS CRUD
app.get('/occurrences_point', points.getPoints);
app.post('/postPoint', points.postPoints);
app.post('/updatePoint', points.updatePoints);
app.post('/deletePoint', points.deletePoints);

//POLYGONS CRUD
app.get('/occurrences_polygon', polygons.getPolygons);
app.post('/postPolygon', polygons.postPolygons);
app.post('/updatePolygon', polygons.updatePolygons);
app.post('/deletePolygon', polygons.deletePolygons);

//UPLOAD FILES
app.post('/upload', upload.upload);

//GET ALL FILES IN FOLDER
app.get('/files', upload.readAllFiles);

//DELETE FILE AND DATA
app.post('/deleteFile', upload.deleteFile);




app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})