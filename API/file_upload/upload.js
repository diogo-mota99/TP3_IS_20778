import db_config from '../db_config/db_config.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs'
import jszip from 'jszip'
import xmlReader from 'read-xml'
import { parseString } from 'xml2js';


const upload = async (request, response) => {
    let file;
    let uploadPath;
    let folder = __dirname + '/xml'
    let fileExtension;
    let fileName;

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    } else if (!request.files || Object.keys(request.files).length === 0) {
        response.json({ info: "Nenhum ficheiro carregado!" });
    } else {

        file = request.files.file;
        fileExtension = path.extname(file.name);
        fileName = path.basename(file.name, fileExtension);
        uploadPath = __dirname + '/xml/' + fileName;

        if (fileExtension === '.kmz') {

            await file.mv(uploadPath + '.zip', function (err) {
                if (err) {
                    response.json({ info: "Erro ao carregar ficheiro!" });
                } else {
                    unzip(uploadPath).then(function () {
                        fs.unlinkSync(uploadPath + '.zip');
                        readXML(uploadPath + '.kml').then(function (result) {
                            postKml(result).then(function (res) {
                                if (res && res.rowCount > 0) {
                                    response.json({ info: 'KMZ inserido com sucesso!' });
                                } else {
                                    response.json({ info: 'Erro ao inserir KMZ!' });
                                }
                            })
                        })
                    })

                }
            });
        } else if (fileExtension === '.kml') {
            await file.mv(uploadPath + fileExtension, function (err) {
                if (err) {
                    response.json({ info: "Erro ao carregar ficheiro!" });
                } else {
                    readXML(uploadPath + '.kml').then(function (result) {
                        postKml(result).then(function (res) {
                            if (res && res.rowCount > 0) {
                                response.json({ info: 'KML inserido com sucesso!' });
                            } else {
                                response.json({ info: 'Erro ao inserir KML!' });
                            }
                        })
                    })
                }
            })
        }
    }

}


const unzip = async (filePath, response) => {
    const filecontent = fs.readFileSync(filePath + '.zip');
    const jszipInstance = new jszip();
    const result = await jszipInstance.loadAsync(filecontent);
    const keys = Object.keys(result.files);

    for (let key of keys) {
        const item = result.files[key];
        const itemExtension = path.extname(item.name);

        if (itemExtension == '.kml') {
            fs.writeFileSync(filePath + itemExtension, Buffer.from(await item.async('arraybuffer')));
        }
    }
}

const readXML = async (request, response) => {

    let points = [];

    // pass a buffer or a path to a xml file
    await xmlReader.readXML(fs.readFileSync(request), function (err, data) {
        if (err) {
            console.error(err);
        }

        let xml = data.content;

        // parsing xml data
        parseString(xml, function (err, results) {

            for (let j = 0; j < results.kml.Document[0].Folder[0].Placemark.length; j++) {
                //TESTADO COM KMZ DE https://www.datapages.com/ E KML DE https://geocatalogo.icnf.pt/catalogo.html
                if (results.kml.Document[0].Folder[0].Placemark[j].Point) {
                    //TESTADO COM https://geocatalogo.icnf.pt/catalogo.html
                    if (results.kml.Document[0].Folder[0].Placemark[j].ExtendedData) {
                        for (let i = 0; i < results.kml.Document[0].Folder[0].Placemark.length; i++) {
                            let name = results.kml.Document[0].Folder[0].Placemark[i].$.id;
                            let coordinates = results.kml.Document[0].Folder[0].Placemark[i].Point[0].coordinates.toString();
                            let splitCoordinates = coordinates.split(",");
                            let latitude = splitCoordinates[0];
                            let longitude = splitCoordinates[1];
                            points.push({ "type": "point", "name": name, "latitude": latitude, "longitude": longitude });
                        }
                    } else {
                        //TESTADO COM KMZ DE https://www.datapages.com/ 
                        for (let i = 0; i < results.kml.Document[0].Folder[0].Placemark.length; i++) {
                            let name = results.kml.Document[0].Folder[0].Placemark[i].name.toString();
                            let coordinates = results.kml.Document[0].Folder[0].Placemark[i].Point[0].coordinates.toString();
                            let splitCoordinates = coordinates.split(",");
                            let latitude = splitCoordinates[0];
                            let longitude = splitCoordinates[1];
                            points.push({ "type": "point", "name": name, "latitude": latitude, "longitude": longitude });
                        }
                    }
                    //TESTADO COM https://geocatalogo.icnf.pt/catalogo.html
                } else if (results.kml.Document[0].Folder[0].Placemark[j].Polygon) {
                    for (let i = 0; i < results.kml.Document[0].Folder[0].Placemark.length; i++) {
                        let name = results.kml.Document[0].Folder[0].Placemark[i].ExtendedData[0].SchemaData[0].SimpleData[0]._;
                        let changePoints = [];
                        if (results.kml.Document[0].Folder[0].Placemark[i].MultiGeometry) {
                            for (let j = 0; j < results.kml.Document[0].Folder[0].Placemark[i].MultiGeometry[0].Polygon.length; j++) {
                                let coordinates = results.kml.Document[0].Folder[0].Placemark[i].MultiGeometry[0].Polygon[j].outerBoundaryIs[0].LinearRing[0].coordinates[0];
                                let splitCoordinates = coordinates.split(" ");
                                for (let k = 0; k < splitCoordinates.length; k++) {
                                    changePoints.push(splitCoordinates[k].replace(",", " "));
                                }

                                points.push({ "type": "multipolygon", "name": name, "makePoints": changePoints });
                            }




                        } else {
                            // let coordinates = results.kml.Document[0].Folder[0].Placemark[i].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
                            // let splitCoordinates = coordinates.split(" ");

                            // for (let i = 0; i < splitCoordinates.length; i++) {
                            //     changePoints.push(splitCoordinates[i].replace(",", " "));
                            // }

                            // points.push({ "type": "polygon", "name": name, "makePoints": changePoints });

                        }

                    }
                }
            }

        });

    });

    return points;

}

const postKml = async (request, response) => {
    let res;
    let multipolygon;

    //console.log(request[1]);
    //fs.writeFileSync(__dirname + '/xml/' + 'test.json', JSON.stringify(request[1].makePoints.toString()));

    //console.log(`INSERT INTO occurrences_polygon(name, type, date, geometry) VALUES ('${request[17].name}', 1, CURRENT_TIMESTAMP, ST_GeomFromText('POLYGON((${request[17].makePoints.toString()}))', 4326))`)

    for (let i = 0; i < request.length; i++) {
        if (request[i].type === "point") {
            res = await db_config.pool.query(`INSERT INTO occurrences_point(name, type, date, point) VALUES ('${request[i].name}', 1, CURRENT_TIMESTAMP, ST_SetSRID(ST_MakePoint(${request[i].latitude}, ${request[i].longitude}), 4326))`);
        } else if (request[i].type === "polygon") {
            res = await db_config.pool.query(`INSERT INTO occurrences_polygon(name, type, date, geometry) VALUES ('${request[i].name}', 1, CURRENT_TIMESTAMP, ST_GeomFromText('POLYGON((${request[i].makePoints.toString()}))', 4326))`);
        } else if (request[i].type === "multipolygon") {

        }
    }
    //console.log(multipolygon);
    //fs.writeFileSync(__dirname + '/xml/' + 'test.json', JSON.stringify(multipolygon));


    return res;
}

export default {
    upload,
}