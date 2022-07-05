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
let linesToRemove = [];
let polygonsToRemove = [];
let pointsToRemove = [];

//-----------------LINHAS-----------------//
//-----------------GET LINES AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickLinhas(checkbox) {

    if (checkbox.checked) {
        $('#loading').modal('show');


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
                linesToRemove.push(layer);
                layer.bindPopup(`<form class='form-popup' id='formLine'>
                <label for='name' class='form-label'>Nome:</label>
                <div class='mb-3'>
                <input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='${feature.properties.name}'>
                </div>
                <div class='btn-group' role='group' aria-label='Opções'>
                <button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='deleteLine(${feature.properties.id})'><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                <button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='updateLine(${feature.properties.id})'><i class="fa-solid fa-floppy-disk"></i> Atualizar</button>
                </div>
                </form>`);
            }
        }

        let linhasbd = new L.GeoJSON(null, { onEachFeature: onEachFeatureLinesBD });
        getLines.done(function (data) {
            if (data.info) {
                $('#alert-text-info').text(data.info)
                $('#info-alert').modal('show');
                chkLines.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').modal('show');
                chkLines.checked = false;
            } else {
                linhasbd.addData(data);
            }

            $('#loading').modal('hide');
        })
        getLines.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').modal('show');
            $('#loading').modal('hide');
        })
    }
    else {
        linesToRemove.forEach(function (layer) {
            drawnItems.removeLayer(layer);
        });
        linesToRemove = []
    }
}

//-----------------PONTOS-----------------//
//-----------------GET POINTS AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickPontos(checkbox) {

    if (checkbox.checked) {
        $('#loading').modal('show');

        let getPoints = $.ajax('http://localhost:3000/occurrences_point', {
            type: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });

        function onEachFeaturePointsBD(feature, layer) {
            if (feature.properties && feature.properties.name) {
                drawnItems.addLayer(layer);
                pointsToRemove.push(layer);
                layer.bindPopup(`<form class='form-popup' id='formLine'>
                <label for='name' class='form-label'>Nome:</label>
                <div class='mb-3'>
                <input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='${feature.properties.name}'>
                </div>
                <div class='btn-group' role='group' aria-label='Opções'>
                <button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='deletePoint(${feature.properties.id})'><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                <button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='updatePoint(${feature.properties.id})'><i class="fa-solid fa-floppy-disk"></i> Atualizar</button>
                </div>
                </form>`);
            }
        }

        let pointsbd = new L.GeoJSON(null, { onEachFeature: onEachFeaturePointsBD });
        getPoints.done(function (data) {
            if (data.info) {
                $('#alert-text-info').text(data.info)
                $('#info-alert').modal('show');
                chkPoints.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').modal('show');
                chkPoints.checked = false;
            } else {
                pointsbd.addData(data);
            }

            $('#loading').modal('hide');
        })
        getPoints.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').modal('show');
            $('#loading').modal('hide');
        })
    }
    else {
        pointsToRemove.forEach(function (layer) {
            drawnItems.removeLayer(layer);
        });
        pointsToRemove = []
    }
}

//-----------------POLÍGONOS-----------------//
//-----------------GET POLYGONS AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickPoligonos(checkbox) {

    if (checkbox.checked) {
        $('#loading').modal('show');
        let getPolygons = $.ajax('http://localhost:3000/occurrences_polygon', {
            type: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        });

        function onEachFeaturePolygonBD(feature, layer) {
            if (feature.properties && feature.properties.name) {
                drawnItems.addLayer(layer);
                polygonsToRemove.push(layer);
                layer.bindPopup(`<form class='form-popup' id='formLine'>
                <label for='name' class='form-label'>Nome:</label>
                <div class='mb-3'>
                <input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='${feature.properties.name}'>
                </div>
                <div class='btn-group' role='group' aria-label='Opções'>
                <button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='deletePolygon(${feature.properties.id})'><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                <button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='updatePolygon(${feature.properties.id})'><i class="fa-solid fa-floppy-disk"></i> Atualizar</button>
                </div>
                </form>`);
            }
        }

        let polygonsbd = new L.GeoJSON(null, { onEachFeature: onEachFeaturePolygonBD });
        getPolygons.done(function (data) {
            if (data.info) {
                $('#alert-text-info').text(data.info)
                $('#info-alert').modal('show');
                chkPolygons.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').modal('show');
                chkPolygons.checked = false;
            } else {
                polygonsbd.addData(data);
            }

            $('#loading').modal('hide');

        })
        getPolygons.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').modal('show');
            $('#loading').modal('hide');
        })
    }
    else {
        polygonsToRemove.forEach(function (layer) {
            drawnItems.removeLayer(layer);
        });
        polygonsToRemove = []
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
        circlemarker: false,
        circle: false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: false,
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
        layer.bindPopup("<form class='form-popup' id='formLine'>" +
            "<label for='name' class='form-label'>Nome:</label>" +
            "<div class='mb-3'>" +
            "<input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='ponto'>" +
            "</div>" +
            "<div class='btn-group' role='group' aria-label='Opções'>" +
            "<button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='cancelLayer()'><i class='fa-solid fa-xmark'></i> Cancelar</button>" +
            "<button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='addPoint()'><i class='fa-solid fa-plus'></i> Adicionar</button>" +
            "</div>" +
            "</form>");
    }

    if (type === 'polygon') {
        layer.bindPopup("<form class='form-popup' id='formLine'>" +
            "<label for='name' class='form-label'>Nome:</label>" +
            "<div class='mb-3'>" +
            "<input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='poligono'>" +
            "</div>" +
            "<div class='btn-group' role='group' aria-label='Opções'>" +
            "<button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='cancelLayer()'><i class='fa-solid fa-xmark'></i> Cancelar</button>" +
            "<button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='addPolygon()'><i class='fa-solid fa-plus'></i> Adicionar</button>" +
            "</div>" +
            "</form>");
    }

    if (type === 'rectangle') {
        layer.bindPopup("<form class='form-popup' id='formLine'>" +
            "<label for='name' class='form-label'>Nome:</label>" +
            "<div class='mb-3'>" +
            "<input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='poligono'>" +
            "</div>" +
            "<div class='btn-group' role='group' aria-label='Opções'>" +
            "<button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='cancelLayer()'><i class='fa-solid fa-xmark'></i> Cancelar</button>" +
            "<button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='addPolygon()'><i class='fa-solid fa-plus'></i> Adicionar</button>" +
            "</div>" +
            "</form>");
    }

    if (type === 'polyline') {
        layer.bindPopup("<form class='form-popup' id='formLine'>" +
            "<label for='name' class='form-label'>Nome:</label>" +
            "<div class='mb-3'>" +
            "<input class='form-control-sm rounded-pill' type='text' id='name' name='name' value='linha'>" +
            "</div>" +
            "<div class='btn-group' role='group' aria-label='Opções'>" +
            "<button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='cancelLayer()'><i class='fa-solid fa-xmark'></i> Cancelar</button>" +
            "<button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='addLine()'><i class='fa-solid fa-plus'></i> Adicionar</button>" +
            "</div>" +
            "</form>");
    }

    drawnItems.addLayer(layer);
});

//-----------------Checkbox Linhas/Pontos/Poligonos-----------------//
let chkLines = document.getElementById("linhas");
let chkPoints = document.getElementById("pontos");
let chkPolygons = document.getElementById("poligonos");


//-----------------ADD LINE TO DB-----------------//
function addLine() {
    $('#loading').modal('show');

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
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            drawnItems.removeLayer(layer);
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
};

//-----------------UPDATE LINE IN DB-----------------//
function updateLine(id) {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    let layer = linesToRemove.find(element => element.feature.properties.id == id);
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
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');

            linesToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            linesToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE LINE IN DB-----------------//
function deleteLine(id) {
    $('#loading').modal('show');

    let layer = linesToRemove.find(element => element.feature.properties.id == id);

    $.ajax('http://localhost:3000/deleteLine', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: id }),
    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');

            linesToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            linesToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}



//-----------------POINTS-----------------//
//-----------------ADD POINT TO DB-----------------//
function addPoint() {
    $('#loading').modal('show');

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
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            drawnItems.removeLayer(layer);
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
};

//-----------------UPDATE POINT IN DB-----------------//
function updatePoint(id) {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    let layer = pointsToRemove.find(element => element.feature.properties.id == id);
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
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            pointsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            pointsToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE POINT IN DB-----------------//
function deletePoint(id) {
    $('#loading').modal('show');

    let layer = pointsToRemove.find(element => element.feature.properties.id == id);

    $.ajax('http://localhost:3000/deletePoint', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: id }),
    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            pointsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            pointsToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}

//-----------------POLYGONS-----------------//
//-----------------ADD POLYGONS TO DB-----------------//
function addPolygon() {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax('http://localhost:3000/postPolygon', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: data }),

    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            drawnItems.removeLayer(layer);
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
};

//-----------------UPDATE POLYGON IN DB-----------------//
function updatePolygon(id) {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    let layer = polygonsToRemove.find(element => element.feature.properties.id == id);
    let feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    let props = feature.properties = feature.properties || {};

    let layerToUpdate = layer.toGeoJSON();


    props.name = nome;
    props.id = id;



    $.ajax('http://localhost:3000/updatePolygon', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: layerToUpdate }),
    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            polygonsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            polygonsToRemove = [];
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE POLYGON IN DB-----------------//
function deletePolygon(id) {
    $('#loading').modal('show');

    let layer = polygonsToRemove.find(element => element.feature.properties.id == id);

    $.ajax('http://localhost:3000/deletePolygon', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: id }),
    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#success-alert').modal('show');
            polygonsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            polygonsToRemove = [];
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').modal('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    });
}

//-----------------CANCEL LAYER IN DRAWER-----------------//
function cancelLayer() {
    drawnItems.removeLayer(layer);
    layer.closePopup();
}

//-----------------add scalebar in meter to the map-----------------//
L.control.scale({ metric: true }).addTo(map);
map.addControl(drawControl);


//-----------------CHANGE FILE FORMAT ON FORMFILE-----------------//
function changeFileFormat() {
    let selected = document.getElementById("type").value;
    let inputFile = document.getElementById("formFile");

    if (selected === 'xml') {
        inputFile.accept = '.kml, .kmz';
    } else if (selected === 'shapefile') {
        inputFile.accept = ".zip, .shp"
    } else {
        inputFile.accept = ".tiff";
    }
}

//-----------------ENABLE/DISABLE ADD BUTTON ON FORMFILE-----------------//
function enableDisableBtn() {
    let inputFile = document.getElementById("formFile");
    let btnAdd = document.getElementById("addFile");

    if (inputFile.value === '') {
        btnAdd.disabled = true;
    } else {
        btnAdd.disabled = false;
    }
}

//-----------------CLEAN FORMFILE-----------------//
function cleanFormFile() {

    document.getElementById("addFile").disabled = true;
    document.getElementById("fileForm").reset();

}

$('#fileModal').on('hide.bs.modal', function () {
    cleanFormFile();
})

//-----------------SUBMIT FORMFILE-----------------//
$("#fileForm").submit(function (event) {
    console.log("EN")
    $('#loading').modal('show');


    let inputFile = document.getElementById("formFile");
    let selectType = document.getElementById("selectType");


    let formData = new FormData();

    if (inputFile.value !== '') {

        formData.append("file", inputFile.files[0]);
        formData.append("selectType", selectType.value)

        $.ajax('http://localhost:3000/upload', {
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": formData
        }).done(function (response) {
            $('#loading').modal('hide');

            let res = JSON.parse(response);

            if (res.info) {
                $('#alert-text-success').text(res.info);
                $('#success-alert').modal('show');
                $('#fileModal').modal('hide');
                cleanFormFile();
            } else if (res.error) {
                $('#alert-text-error').text(res.error);
                $('#error-alert').modal('show');
            }
        }).fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').modal('show');
            $('#loading').modal('hide');
        });

    } else {
        $('#alert-text-error').text('Nenhum ficheiro selecionado!');
        $('#error-alert').modal('show');
        $('#loading').modal('hide');
    }

    event.preventDefault();

})
