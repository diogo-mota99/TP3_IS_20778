import db_config from '../../db_config/db_config.js';


const getLines = async (request, response) => {
  try {
    const res = await db_config.pool.query(`SELECT id, name, ST_AsGeoJSON(line)::json AS geojson FROM occurrences_line`);

    if (res && res.rowCount > 0) {
      let features = [];

      for (let i = 0; i < res.rowCount; i++) {
        let geometry = res.rows[i].geojson;
        let feature = { type: "Feature", geometry: geometry, properties: { id: res.rows[i].id, name: res.rows[i].name } };
        features.push(feature);
      }

      response.json(features);
    } else {
      response.json({ info: 'Não existem linhas!' })
    }
  } catch (err) {
    response.json(err)
  }

}

const postLines = async (request, response) => {
  try {
    const { data } = request.body;
    let makePoints = [];

    for (let i = 0; i < data.geometry.coordinates.length; i++) {
      makePoints.push(data.geometry.coordinates[i][0] + " " + data.geometry.coordinates[i][1]);
    }

    const res = await db_config.pool.query(`INSERT INTO occurrences_line(name, type, date, line) VALUES ('${data.properties.name}', 1, CURRENT_TIMESTAMP, ST_GeomFromText('LINESTRING(${makePoints.toString()})', 4326))`)

    if (res && res.rowCount > 0) {
      response.json({ info: 'Linha inserida com sucesso!' });
    } else {
      response.json({ info: 'Erro ao inserir linha!' });
    }

  } catch (err) {
    response.json({ info: err })
  }
}

const updateLines = async (request, response) => {
  try {
    const { data } = request.body;
    let makePoints = [];

    for (let i = 0; i < data.geometry.coordinates.length; i++) {
      makePoints.push(data.geometry.coordinates[i][0] + " " + data.geometry.coordinates[i][1]);
    }

    const res = await db_config.pool.query(`UPDATE occurrences_line SET name = '${data.properties.name}', date = CURRENT_TIMESTAMP, line = ST_GeomFromText('LINESTRING(${makePoints.toString()})', 4326) WHERE id = '${data.properties.id}'`);

    if (res && res.rowCount > 0) {
      response.json({ info: 'Linha atualizada com sucesso!' });
    } else {
      response.json({ info: 'Erro ao atualizar linha!' });
    }

  } catch (err) {
    response.json({ info: err })
  }
}

const deleteLines = async (request, response) => {
  try {
    const { data } = request.body;

    const res = await db_config.pool.query(`DELETE FROM occurrences_line WHERE id = '${data}'`);

    if (res && res.rowCount > 0) {
      response.json({ info: 'Linha eliminada com sucesso!' });
    } else {
      response.json({ info: 'Erro ao eliminar linha!' });
    }


  } catch (err) {
    response.json({ info: err })
  }
}

export default {
  getLines,
  postLines,
  updateLines,
  deleteLines,
}