//-----------------BASE MAPS-----------------//
let openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg')

let transportMap = L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=70c938376d9f4d57b5f7f7d545252b77')

let railwaysMap = L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=70c938376d9f4d57b5f7f7d545252b77');

let baseMaps = {
    "OpenStreet Map": openStreetMap,
    "Satellite Map": satelliteMap,
    "Transport Map": transportMap,
    "Railways Map": railwaysMap,
};



//-----------------LAYERS FORNECIDAS-----------------//
let area_ardida = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:ardida_2018',
    format: "image/png",
    opacity: 0.8,
    transparent: "true",
});

let caop = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:cont_aad_caop2015',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let escolas_viana = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:escolas_viana',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let farmacias_viana = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:farmacias_viana',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let ifn_2015 = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:ifn_2015',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let pontos_agua = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:pontos_agua',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});


let rede_viaria = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:rede_viaria',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let zonas_caca = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:zonas_caca',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});

let ecopistas = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:Ecopistas',
    format: "image/png",
    opacity: 0.8,
    transparent: "true"
});


//-----------------LAYERS WMS EXTERNAS-----------------//
let pesca_profissional = L.tileLayer.wms('https://si.icnf.pt/wms/zpp_profissional', {
    layers: "zpp_profissional",
    format: "image/png",
    opacity: 0.8,
    transparent: true,
})

let ensino_superior = L.tileLayer.wms('http://mapas.dgterritorio.pt/wms/dgeec', {
    format: "image/png",
    layers: "Estab_Ens_Sup_Portugal",
    opacity: 0.8,
    transparent: true,
})
ensino_superior.options.crs = L.CRS.EPSG4326;

let vias_romanas = L.tileLayer.wms('http://epic-webgis-portugal.isa.ulisboa.pt/wms/epic?VERSION=1.1.1', {
    format: "image/png",
    layers: "Vias Romanas",
    opacity: 0.8,
    transparent: true,
})

//-----------------WFS LAYERS-----------------//
//-----------------Águas Balneares-----------------//
$.ajax('http://localhost:8080/geoserver/TP3_IS/ows', {
    type: 'GET',
    data: {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'TP3_IS:D311_AguasBalneares_PT_WGS84',
        outputFormat: 'text/javascript',
    },
    dataType: 'jsonp',
    jsonpCallback: 'callback:handleJsonAguasBalneares',
    jsonp: 'format_options',
});

function onEachFeatureAguasBalneares(feature, layer) {
    if (feature.properties && feature.properties.nome
        && feature.properties.lat_wgs84
        && feature.properties.lon_wgs84) {
        layer.bindPopup(`Nome: ${feature.properties.nome}`
            + `<br>Lat: ${feature.properties.lat_wgs84}`
            + `<br>Lng: ${feature.properties.lon_wgs84}`)
    }
}

let aguas_balneares = new L.GeoJSON(null, { onEachFeature: onEachFeatureAguasBalneares });

function handleJsonAguasBalneares(data) {
    aguas_balneares.addData(data);
}

//-----------------Freguesias prioritárias para a Defesa da Floresta Contra Incêndio (DFCI) 2022-----------------//
$.ajax('http://localhost:8080/geoserver/TP3_IS/ows', {
    type: 'GET',
    data: {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'TP3_IS:freg_prioritarias_dfci_2022',
        outputFormat: 'text/javascript',
        srsname: 'EPSG:4326',
        preferCoordinatesForWfsT11: 'false',
        restrictToRequestBBOX: '1'
    },
    dataType: 'jsonp',
    jsonpCallback: 'callback:handleJsonDFCI',
    jsonp: 'format_options',

});

function onEachFeatureDFCI(feature, layer) {
    if (feature.properties && feature.properties.distrito
        && feature.properties.concelho
        && feature.properties.freguesia
        && feature.properties.prioridade) {
        layer.bindPopup(`Distrito: ${feature.properties.distrito}`
            + `<br>Concelho: ${feature.properties.concelho}`
            + `<br>Freguesia: ${feature.properties.freguesia}`
            + `<br>Prioridade: ${feature.properties.prioridade}`)
    }
}

let dfci = new L.GeoJSON(null, { onEachFeature: onEachFeatureDFCI });

function handleJsonDFCI(data) {
    dfci.addData(data);
}

//-----------------WFC - GEOTIFF IMPORTED TO GEOSERVER-----------------//
let land_cover_esri_2021 = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    format: "image/png",
    layers: "TP3_IS:esri_2021",
    opacity: 0.8,
    transparent: true,
})

//-----------------OCORRÊNCIAS GEOSERVER-----------------//
let pontos = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_point',
    format: 'image/png',
    transparent: true,
});


let poligonos = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_polygon',
    format: 'image/png',
    transparent: true,
});


let linhas = L.tileLayer.wms('http://localhost:8080/geoserver/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_line',
    format: 'image/png',
    transparent: true,
});

//-----------------OCORRÊNCIAS BD-----------------//
let layersToRemove = [];

//-----------------LINHAS-----------------//
//-----------------GET LINES AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickLinhas(checkbox) {

    if (checkbox.checked) {
        let getLines = $.ajax('http://localhost:3000/occurrences_line', {
            type: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });

        function onEachFeatureLinesBD(feature, layer) {
            if (feature.properties && feature.properties.name) {
                drawnItems.addLayer(layer);
                layersToRemove.push(layer);
                layer.bindPopup(`<form id='formLine'>Nome:<br><input type='text' id='name' name='name' value='${feature.properties.name}'><br><br><input type='button' onclick='updateLine(${feature.properties.id})' value='Atualizar'><input type='button' onclick='deleteLine(${feature.properties.id})' value='Eliminar'></form>`);
            }
        }

        let linhasbd = new L.GeoJSON(null, { onEachFeature: onEachFeatureLinesBD });
        getLines.done(function (data) {
            linhasbd.addData(data);
        })
        getLines.fail(function (jqXHR, textStatus, errorThrown) {
            return errorThrown;
        });
    }
    else {
        layersToRemove.forEach(function (layer) {
            drawnItems.removeLayer(layer);
        });
        layersToRemove = []
    }
}

//-----------------GET POINTS AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickPontos(checkbox) {

    if (checkbox.checked) {
        let getPoints = $.ajax('http://localhost:3000/occurrences_point', {
            type: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });

        function onEachFeatureLinesBD(feature, layer) {
            if (feature.properties && feature.properties.name) {
                drawnItems.addLayer(layer);
                layersToRemove.push(layer);
                layer.bindPopup(`<form id='formLine'>Nome:<br><input type='text' id='name' name='name' value='${feature.properties.name}'><br><br><input type='button' onclick='updatePoint(${feature.properties.id})' value='Atualizar'><input type='button' onclick='deletePoint(${feature.properties.id})' value='Eliminar'></form>`);
            }
        }

        let pointsbd = new L.GeoJSON(null, { onEachFeature: onEachFeatureLinesBD });
        getPoints.done(function (data) {
            pointsbd.addData(data);
        })
        getPoints.fail(function (jqXHR, textStatus, errorThrown) {
            return errorThrown;
        });
    }
    else {
        layersToRemove.forEach(function (layer) {
            drawnItems.removeLayer(layer);
        });
        layersToRemove = []
    }
}


//-----------------OVERLAY MAPS-----------------//
let overlayMaps = {
    "<span style='font-weight: bold'>Layers Fornecidas</span>": {
        "Área Ardida 2018": area_ardida,
        "CAOP 2015": caop,
        "Escolas de Viana": escolas_viana,
        "Farmácias de Viana": farmacias_viana,
        "IFN 2015": ifn_2015,
        "Pontos Água": pontos_agua,
        "Rede Viária": rede_viaria,
        "Zonas de Caça": zonas_caca,
        "Ecopistas": ecopistas,
    },

    "<span style='font-weight: bold'>Layers WMS Externas</span>": {
        "Zonas de Pesca Profissional": pesca_profissional,
        "Ensino Superior": ensino_superior,
        "Vias Romanas": vias_romanas,
    },
    "<span style='font-weight: bold'>Layers WFS</span>": {
        "Águas Balneares": aguas_balneares,
        "Freguesias Prioritárias DGCI 2022": dfci,
    },
    "<span style='font-weight: bold'>Layers WCS</span>": {
        "Cobertura do terreno": land_cover_esri_2021,
    },
    "<span style='font-weight: bold'>Ocorrências Geoserver</span>": {
        "Linhas": linhas,
        "Pontos": pontos,
        "Polígonos": poligonos,
    },
};

//-----------------MAP OPTIONS-----------------//
let map = L.map('map', { center: [39.557191, -7.8536599], zoom: 7, layers: [openStreetMap] });
let layerControl = L.control.groupedLayers(baseMaps, overlayMaps).addTo(map);



$(".leaflet-control-layers-selector").on('click', function () {
    if (map.hasLayer(aguas_balneares)) {
        map.fitBounds(aguas_balneares.getBounds());
    } else {
        map.setView(new L.LatLng(39.557191, -7.8536599), 7);
    }
});




//-----------------FeatureGroup to store editable layers-----------------//
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
    draw: {
        rectangle: false,
        circlemarker: false,
        circle: false,
    },
    edit: {
        featureGroup: drawnItems
    }
});

//-----------------DATA FROM ADDED LAYER-----------------//
let data;
let props;
let layer;

map.on('draw:created', (e) => {
    let type = e.layerType;
    layer = e.layer;
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    props = feature.properties = feature.properties || {};

    data = layer.toGeoJSON();

    if (type === 'marker') {
        layer.bindPopup("<form id='formLine'>Nome:<br><input type='text' id='name' name='name' value='ponto'><br><br><input type='button' onclick='addPoint()' value='Guardar'></form>");
    }

    if (type === 'polygon') {
        layer.bindPopup('POLYGON!');
    }

    if (type === 'polyline') {
        layer.bindPopup("<form id='formLine'>Nome:<br><input type='text' id='name' name='name' value='linha'><br><br><input type='button' onclick='addLine()' value='Guardar'></form>");
    }

    drawnItems.addLayer(layer);
});

//-----------------Checkbox Linhas/Pontos/Poligonos-----------------//
let chkLines = document.getElementById("linhas");
let chkPoints = document.getElementById("pontos");


//-----------------ADD LINE TO DB-----------------//
function addLine() {
    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax('http://localhost:3000/postLine', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: data }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);
            drawnItems.removeLayer(layer);
            handleClickLinhas(chkLines);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
        layer.closePopup();
    });
};

//-----------------UPDATE LINE IN DB-----------------//
function updateLine(id) {
    let nome = document.getElementById("name").value;
    let layer = layersToRemove.find(element => element.feature.properties.id == id);
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    let props = feature.properties = feature.properties || {};

    let layerToUpdate = layer.toGeoJSON();


    props.name = nome;
    props.id = id;



    $.ajax('http://localhost:3000/updateLine', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: layerToUpdate }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);

            layersToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            layersToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
    });
}

//-----------------DELETE LINE IN DB-----------------//
function deleteLine(id) {
    let layer = layersToRemove.find(element => element.feature.properties.id == id);
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    let props = feature.properties = feature.properties || {};

    let layerToDelete = layer.toGeoJSON();

    props.id = id;

    $.ajax('http://localhost:3000/deleteLine', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: layerToDelete }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);

            layersToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            layersToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
    });
}



//-----------------POINTS-----------------//
//-----------------ADD POINT TO DB-----------------//
function addPoint() {
    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax('http://localhost:3000/postPoint', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: data }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);
            drawnItems.removeLayer(layer);
            handleClickPontos(chkPoints);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
        layer.closePopup();
    });
};

//-----------------UPDATE POINT IN DB-----------------//
function updatePoint(id) {
    let nome = document.getElementById("name").value;
    let layer = layersToRemove.find(element => element.feature.properties.id == id);
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    let props = feature.properties = feature.properties || {};

    let layerToUpdate = layer.toGeoJSON();


    props.name = nome;
    props.id = id;



    $.ajax('http://localhost:3000/updatePoint', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: layerToUpdate }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);

            layersToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            layersToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
    });
}

//-----------------DELETE POINT IN DB-----------------//
function deletePoint(id) {
    let layer = layersToRemove.find(element => element.feature.properties.id == id);
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    let props = feature.properties = feature.properties || {};

    let layerToDelete = layer.toGeoJSON();

    props.id = id;

    $.ajax('http://localhost:3000/deletePoint', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: layerToDelete }),
    }).done(function (response) {
        if (response.info) {
            popWindow.dialog(response.info, popWindow.dialog.typeEnum.success);

            layersToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            layersToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            popWindow.dialog(response.error, popWindow.dialog.typeEnum.error);
        }
    });
}

//-----------------add scalebar in meter to the map-----------------//
L.control.scale({ metric: true }).addTo(map);
map.addControl(drawControl);

