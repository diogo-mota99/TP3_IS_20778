import db_config from '../db_config/db_config.js';
import path from 'path';
import fs from 'fs'
import jszip from 'jszip'
import xmlReader from 'read-xml'
import { parseString } from 'xml2js';
import parseDBF from 'parsedbf';
import shp from 'shpjs';

let fileExtension;
let fileName;
let uploadPath;
let folder;



const upload = async (request, response) => {
    let file;

    if (!request.files || Object.keys(request.files).length === 0) {
        response.json({ error: "Nenhum ficheiro carregado!" });
    } else {

        file = request.files.file;
        fileExtension = path.extname(file.name);
        fileName = path.basename(file.name, fileExtension);

        if (request.body.selectType === 'xml') {
            folder = 'file_upload/xml';

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }

            uploadPath = folder + '/' + fileName;

            if (fileExtension === '.kmz') {
                await file.mv(uploadPath + '.zip', function (err) {
                    if (err) {
                        response.json({ error: err.toString() });
                    } else {
                        unzip(uploadPath).then(function (res) {
                            fs.unlinkSync(uploadPath + '.zip');
                            if (res === 0) {
                                response.json({ error: "O ficheiro já existe!" })
                            } else {
                                readXML(uploadPath + '.kml').then(function (result) {
                                    postGeodata(result).then(function (res) {
                                        if (res && res.rowCount > 0) {
                                            response.json({ info: 'KMZ inserido com sucesso!' });
                                        } else if (res === 0) {
                                            response.json({ error: "Ficheiro com estrututra incorreta!" })
                                        } else {
                                            response.json({ error: 'Erro ao inserir KMZ!' });
                                        }
                                    })
                                })
                            }

                        })

                    }
                });
            } else if (fileExtension === '.kml') {
                if (fs.existsSync(uploadPath + fileExtension)) {
                    response.json({ error: "O ficheiro já existe!" });
                } else {
                    await file.mv(uploadPath + fileExtension, function (err) {
                        if (err) {
                            response.json({ error: err.toString() });
                        } else {
                            readXML(uploadPath + '.kml').then(function (result) {
                                postGeodata(result).then(function (res) {
                                    if (res && res.rowCount > 0) {
                                        response.json({ info: 'KML inserido com sucesso!' });
                                    } else if (res === 0) {
                                        response.json({ error: "Ficheiro com estrututra incorreta!" })
                                    } else {
                                        response.json({ error: 'Erro ao inserir KML!' });
                                    }
                                })
                            })
                        }
                    })
                }

            } else {
                response.json({ error: "Formato inválido!" })
            }
        } else if (request.body.selectType === 'shapefile') {

            folder = 'file_upload/shp';

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }

            uploadPath = folder + '/' + fileName;

            if (fileExtension === '.zip') {
                await file.mv(uploadPath + '.zip', function (err) {
                    if (err) {
                        response.json({ error: err.toString() });
                    } else {
                        unzip(uploadPath).then(function (res) {
                            fs.unlinkSync(uploadPath + '.zip');
                            if (res === 0) {
                                response.json({ error: "O ficheiro já existe!" })
                            } else {
                                readSHP(uploadPath).then(function (result) {
                                    postGeodata(result).then(function (res) {
                                        if (res && res.rowCount > 0) {
                                            fs.unlinkSync(uploadPath + '.dbf');
                                            fs.unlinkSync(uploadPath + '.prj');
                                            response.json({ info: 'SHP inserido com sucesso!' });
                                        } else if (res === 0) {
                                            response.json({ error: "Ficheiro com estrututra incorreta!" })
                                        } else {
                                            response.json({ error: 'Erro ao inserir SHP!' });
                                        }
                                    })
                                })
                            }

                        })

                    }
                });
            } else {
                response.json({ error: "Formato inválido!" })
            }
        }
    }

}


const unzip = async (filePath, response) => {
    const filecontent = fs.readFileSync(filePath + '.zip');
    const jszipInstance = new jszip();
    const result = await jszipInstance.loadAsync(filecontent);
    const keys = Object.keys(result.files);

    let res;


    for (let key of keys) {
        const item = result.files[key];
        const itemExtension = path.extname(item.name);

        if (itemExtension === '.kml') {
            if (fs.existsSync(filePath + itemExtension)) {
                res = 0;
            } else {
                fs.writeFileSync(filePath + itemExtension, Buffer.from(await item.async('arraybuffer')));
            }
        }

        if (itemExtension === '.shp' || itemExtension === '.dbf' || itemExtension === '.prj') {
            if (fs.existsSync(filePath + itemExtension)) {
                res = 0;
            } else {
                fs.writeFileSync(filePath + itemExtension, Buffer.from(await item.async('arraybuffer')));
            }
        }
    }

    return res;
}

const readXML = async (request, response) => {

    let points = [];
    let coordPolygon = [];
    let namePolygon = [];

    // pass a buffer or a path to a xml file
    await xmlReader.readXML(fs.readFileSync(request), function (err, data) {
        if (err) {
            console.log(err);
        }

        let xml = data.content;

        // parsing xml data
        parseString(xml, function (err, results) {
            if (results.kml.Document) {
                for (let j = 0; j < results.kml.Document[0].Folder[0].Placemark.length; j++) {

                    //TESTADO COM KMZ DE https://www.datapages.com/ E KML DE https://geocatalogo.icnf.pt/catalogo.html
                    if (results.kml.Document[0].Folder[0].Placemark[j].Point) {
                        //TESTADO COM KML https://geocatalogo.icnf.pt/catalogo.html
                        if (results.kml.Document[0].Folder[0].Placemark[j].ExtendedData) {
                            let name = results.kml.Document[0].Folder[0].Placemark[j].ExtendedData[0].SchemaData[0].SimpleData[0]._;
                            let coordinates = results.kml.Document[0].Folder[0].Placemark[j].Point[0].coordinates.toString();
                            let splitCoordinates = coordinates.split(",");
                            let latitude = splitCoordinates[0];
                            let longitude = splitCoordinates[1];
                            points.push({ "type": "point", "name": name, "latitude": latitude, "longitude": longitude, "filename": fileName + '.kml' });

                        } else {
                            //TESTADO COM KMZ DE https://www.datapages.com/ 
                            let name = results.kml.Document[0].Folder[0].Placemark[j].name.toString();
                            let coordinates = results.kml.Document[0].Folder[0].Placemark[j].Point[0].coordinates.toString();
                            let splitCoordinates = coordinates.split(",");
                            let latitude = splitCoordinates[0];
                            let longitude = splitCoordinates[1];
                            points.push({ "type": "point", "name": name, "latitude": latitude, "longitude": longitude, "filename": fileName + '.kml' });

                        }
                        //TESTADO COM KML https://geocatalogo.icnf.pt/catalogo.html
                    } else if (results.kml.Document[0].Folder[0].Placemark[j].MultiGeometry) {
                        for (let k = 0; k < results.kml.Document[0].Folder[0].Placemark[j].MultiGeometry[0].Polygon.length; k++) {
                            namePolygon.push(results.kml.Document[0].Folder[0].Placemark[j].ExtendedData[0].SchemaData[0].SimpleData[0]._);
                            let coordinates = results.kml.Document[0].Folder[0].Placemark[j].MultiGeometry[0].Polygon[k].outerBoundaryIs[0].LinearRing[0].coordinates[0];
                            coordPolygon.push(coordinates.split(" "));

                            for (let l = 0; l < coordPolygon.length; l++) {
                                for (let m = 0; m < coordPolygon[l].length; m++) {
                                    coordPolygon[l][m] = coordPolygon[l][m].replace(",", " ")
                                }
                            }
                        }
                    } else {
                        namePolygon.push(results.kml.Document[0].Folder[0].Placemark[j].ExtendedData[0].SchemaData[0].SimpleData[0]._);
                        let coordinates = results.kml.Document[0].Folder[0].Placemark[j].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
                        coordPolygon.push(coordinates.split(" "));

                        for (let l = 0; l < coordPolygon.length; l++) {
                            for (let m = 0; m < coordPolygon[l].length; m++) {
                                coordPolygon[l][m] = coordPolygon[l][m].replace(",", " ")
                            }
                        }
                    }


                }
            } else {
                fs.unlinkSync(uploadPath + '.kml');
                points.push({ error: "Ficheiro com estrututra incorreta!" })
            }

            if (coordPolygon.length > 0) {
                for (let i = 0; i < coordPolygon.length; i++) {
                    points.push({ "type": "polygon", "name": namePolygon[i], "makePoints": coordPolygon[i], "filename": fileName + fileExtension });
                }
            }

        });

    });
    return points;

}

const postGeodata = async (request, response) => {
    let res;

    for (let i = 0; i < request.length; i++) {
        if (request[i].type === "point") {
            res = await db_config.pool.query(`INSERT INTO occurrences_point(name, type, date, point, image) VALUES ('${request[i].name}', 1, CURRENT_TIMESTAMP, ST_SetSRID(ST_MakePoint(${request[i].latitude}, ${request[i].longitude}), 4326), '${request[i].filename.toString()}')`);
        } else if (request[i].type === "polygon") {
            res = await db_config.pool.query(`INSERT INTO occurrences_polygon(name, type, date, geometry, image) VALUES ('${request[i].name}', 1, CURRENT_TIMESTAMP, ST_GeomFromText('POLYGON((${request[i].makePoints.toString()}))', 4326), '${request[i].filename.toString()}')`);
        } else if (request[i].error) {
            res = 0;
        }
    }

    return res;
}

const readSHP = async (request, response) => {

    //POLYGONS
    let allCoordsPolygon = [];
    let polygonsNames = [];
    let spliceNumber = [];

    let points = []

    let shpBuffer;
    let shapeFile;
    let DBF;
    let PRJ;

    if (fs.existsSync(request + '.shp')) {
        shpBuffer = fs.readFileSync(request + '.shp');
    }

    if (fs.existsSync(request + '.dbf')) {
        let dbfBufferFile = fs.readFileSync(request + '.dbf');
        DBF = parseDBF(dbfBufferFile, 'latin1');
    }

    if (fs.existsSync(request + '.prj')) {
        PRJ = fs.readFileSync(request + '.prj');
    }

    if (shpBuffer !== undefined && DBF !== undefined && PRJ !== undefined) {
        shapeFile = shp.parseShp(shpBuffer, PRJ);
    }

    if (shapeFile !== undefined) {

        for (let i = 0; i < shapeFile.length; i++) {

            shapeFile[i].attributes = DBF[i];

            if (shapeFile[i].type === 'Polygon') {
                for (let j = 0; j < shapeFile[i].coordinates.length; j++) {
                    if (shapeFile[i].attributes.nome_ap !== undefined) {
                        polygonsNames.push(shapeFile[i].attributes.nome_ap);
                    } else if (shapeFile[i].attributes.name !== undefined) {
                        polygonsNames.push(shapeFile[i].attributes.name)
                    }
                    spliceNumber.push(shapeFile[i].coordinates[j].length);
                    for (let k = 0; k < shapeFile[i].coordinates[j].length; k++) {
                        allCoordsPolygon.push(shapeFile[i].coordinates[j][k][0] + ' ' + shapeFile[i].coordinates[j][k][1])
                    }
                }
            } else if (shapeFile[i].type === 'Point') {
                let latitude = shapeFile[i].coordinates[0];
                let longitude = shapeFile[i].coordinates[1];

                points.push({ "type": "point", "name": shapeFile[i].attributes.código, "latitude": latitude, "longitude": longitude, "filename": fileName + '.shp' });


            } else if (shapeFile[i].type === 'Polyline') {
                //DO FOR LINES
            }
        }

        if (spliceNumber.length > 0 && polygonsNames.length === spliceNumber.length) {
            for (let i = 0; i < spliceNumber.length; i++) {
                points.push({ "type": "polygon", "name": polygonsNames[i], "makePoints": allCoordsPolygon.splice(0, spliceNumber[i]), "filename": fileName + '.shp' })
            }
        }

    } else {
        points.push({ error: "Ficheiro inválido!" })
    }

    return points;
}

const readAllFiles = async (request, response) => {

    let folderXML = 'file_upload/xml';
    let folderSHP = 'file_upload/shp';

    let files = [];

    if (fs.existsSync(folderXML)) {
        fs.readdirSync(folderXML).forEach(file => {
            files.push({ name: file });
        });
    }
    if (fs.existsSync(folderSHP)) {
        fs.readdirSync(folderSHP).forEach(file => {
            files.push({ name: file });
        });
    }

    response.json(JSON.stringify(files))

}


const deleteFile = async (request, response) => {

    try {
        const { data } = request.body;

        const res = await db_config.pool.query(`DELETE FROM occurrences_polygon WHERE image='${data}'`);
        const res1 = await db_config.pool.query(`DELETE FROM occurrences_line WHERE image='${data}'`);
        const res2 = await db_config.pool.query(`DELETE FROM occurrences_point WHERE image='${data}'`);

        if (res && res.rowCount > 0 || res1 && res1.rowCount > 0 || res2 && res2.rowCount > 0) {
            fileToDelete(data);
            response.json({ info: 'Dados eliminados com sucesso!' });
        } else {
            response.json({ error: 'Erro ao eliminar dados!' });
        }

    } catch (err) {
        response.json({ error: err.toString() })
    }
}

const fileToDelete = (request, response) => {

    let folderXML = 'file_upload/xml';
    let folderSHP = 'file_upload/shp';
    let folderTIFF = 'file_upload/tiff';


    if (fs.existsSync(folderXML)) {
        fs.readdirSync(folderXML).forEach(file => {
            if (file === request) {
                fs.unlinkSync(folderXML + '/' + file);
            }
        });
    }
    if (fs.existsSync(folderSHP)) {
        fs.readdirSync(folderSHP).forEach(file => {
            if (file === request) {
                fs.unlinkSync(folderSHP + '/' + file);
            }
        });
    }
    if (fs.existsSync(folderTIFF)) {
        fs.readdirSync(folderTIFF).forEach(file => {
            if (file === request) {
                fs.unlinkSync(folderTIFF + '/' + file);
            }
        });
    }
}

export default {
    upload,
    readAllFiles,
    deleteFile
}