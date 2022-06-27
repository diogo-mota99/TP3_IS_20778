import db_config from '../../db_config/db_config.js';


const getPoints = async (request, response) => {
    try {
        const res = await db_config.pool.query(`SELECT id, name, ST_AsGeoJSON(point)::json AS geojson FROM occurrences_point`);

        if (res && res.rowCount > 0) {
            let features = [];

            for (let i = 0; i < res.rowCount; i++) {
                let geometry = res.rows[i].geojson;
                let feature = { type: "Feature", geometry: geometry, properties: { id: res.rows[i].id, name: res.rows[i].name } };
                features.push(feature);
            }

            response.json(features);
        } else {
            response.json({ info: 'Não existem pontos!' })
        }
    } catch (err) {
        response.json(err)
    }

}

const postPoints = async (request, response) => {
    try {
        const { data } = request.body;

        let latitude = data.geometry.coordinates[0];
        let longitude = data.geometry.coordinates[1];

        const res = await db_config.pool.query(`INSERT INTO occurrences_point(name, type, date, point) VALUES ('${data.properties.name}', 1, CURRENT_TIMESTAMP, ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326))`)

        if (res && res.rowCount > 0) {
            response.json({ info: 'Ponto inserido com sucesso!' });
        } else {
            response.json({ info: 'Erro ao inserir ponto!' });
        }

    } catch (err) {
        response.json({ info: err })
    }
}

const updatePoints = async (request, response) => {
    try {
        const { data } = request.body;

        let latitude = data.geometry.coordinates[0];
        let longitude = data.geometry.coordinates[1];

        const res = await db_config.pool.query(`UPDATE occurrences_point SET name = '${data.properties.name}', date = CURRENT_TIMESTAMP, point = ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326) WHERE id = '${data.properties.id}'`);

        if (res && res.rowCount > 0) {
            response.json({ info: 'Ponto atualizado com sucesso!' });
        } else {
            response.json({ info: 'Erro ao atualizar ponto!' });
        }

    } catch (err) {
        response.json({ info: err })
    }
}

const deletePoints = async (request, response) => {
    try {
        const { data } = request.body;

        const res = await db_config.pool.query(`DELETE FROM occurrences_point WHERE id = '${data}'`);

        if (res && res.rowCount > 0) {
            response.json({ info: 'Ponto eliminado com sucesso!' });
        } else {
            response.json({ info: 'Erro ao eliminar ponto!' });
        }


    } catch (err) {
        response.json({ info: err })
    }
}

export default {
    getPoints,
    postPoints,
    updatePoints,
    deletePoints
}