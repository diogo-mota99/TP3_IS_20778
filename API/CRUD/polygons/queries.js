import db_config from '../../db_config/db_config.js';


const getPolygons = async (request, response) => {
    try {
        const res = await db_config.pool.query(`SELECT id, name, ST_AsGeoJSON(geometry)::json AS geojson FROM occurrences_polygon`);

        if (res && res.rowCount > 0) {
            let features = [];

            for (let i = 0; i < res.rowCount; i++) {
                let geometry = res.rows[i].geojson;
                let feature = { type: "Feature", geometry: geometry, properties: { id: res.rows[i].id, name: res.rows[i].name } };
                features.push(feature);
            }

            response.json(features);
        } else {
            response.json({ info: 'Não existem polígonos!' })
        }
    } catch (err) {
        response.json({ error: err.toString() })
    }

}

const postPolygons = async (request, response) => {
    try {
        const { data } = request.body;

        let makePoints = [];

        for (let j = 0; j < data.geometry.coordinates[0].length; j++) {
            makePoints.push(data.geometry.coordinates[0][j][0] + " " + data.geometry.coordinates[0][j][1]);
        }


        const res = await db_config.pool.query(`INSERT INTO occurrences_polygon(name, type, date, geometry) VALUES ('${data.properties.name}', 1, CURRENT_TIMESTAMP, ST_GeomFromText('POLYGON((${makePoints.toString()}))', 4326))`);

        if (res && res.rowCount > 0) {
            response.json({ info: 'Polígono inserido com sucesso!' });
        } else {
            response.json({ error: 'Erro ao inserir polígono!' });
        }

    } catch (err) {
        response.json({ error: err.toString() })
    }
}

const updatePolygons = async (request, response) => {
    try {
        const { data } = request.body;

        let makePoints = [];

        for (let j = 0; j < data.geometry.coordinates[0].length; j++) {
            makePoints.push(data.geometry.coordinates[0][j][0] + " " + data.geometry.coordinates[0][j][1]);
        }

        const res = await db_config.pool.query(`UPDATE occurrences_polygon SET name = '${data.properties.name}', 
        date = CURRENT_TIMESTAMP, geometry = ST_GeomFromText('POLYGON((${makePoints.toString()}))', 4326) WHERE id = '${data.properties.id}'`);

        if (res && res.rowCount > 0) {
            response.json({ info: 'Polígono atualizado com sucesso!' });
        } else {
            response.json({ error: 'Erro ao atualizar polígono!' });
        }

    } catch (err) {
        response.json({ error: err.toString() })
    }
}

const deletePolygons = async (request, response) => {
    try {
        const { data } = request.body;

        const res = await db_config.pool.query(`DELETE FROM occurrences_polygon WHERE id = '${data}'`);

        if (res && res.rowCount > 0) {
            response.json({ info: 'Polígono eliminado com sucesso!' });
        } else {
            response.json({ error: 'Erro ao eliminar polígono!' });
        }


    } catch (err) {
        response.json({ error: err.toString() })
    }
}

export default {
    getPolygons,
    postPolygons,
    updatePolygons,
    deletePolygons
}