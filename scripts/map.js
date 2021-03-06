//-----------------BASE URLs-----------------//
const url_geoserver = "http://localhost:8080/geoserver"
const url_api = "http://localhost:3000"

//-----------------BASE MAPS-----------------//
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

let satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg')

let transportMap = L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=70c938376d9f4d57b5f7f7d545252b77')

let railwaysMap = L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=70c938376d9f4d57b5f7f7d545252b77');

let baseMaps = {
    "Esri WorldStreetMap": Esri_WorldStreetMap,
    "Satellite Map": satelliteMap,
    "Transport Map": transportMap,
    "Railways Map": railwaysMap,
};



//-----------------LAYERS FORNECIDAS-----------------//
let area_ardida = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:ardida_2018',
    format: "image/png",
    opacity: 0.5,
    transparent: "true",
});

let caop = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:cont_aad_caop2015',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let escolas_viana = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:escolas_viana',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let farmacias_viana = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:farmacias_viana',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let ifn_2015 = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:ifn_2015',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let pontos_agua = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:pontos_agua',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});


let rede_viaria = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:rede_viaria',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let zonas_caca = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:zonas_caca',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});

let ecopistas = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:Ecopistas',
    format: "image/png",
    opacity: 0.5,
    transparent: "true"
});


//-----------------LAYERS WMS EXTERNAS-----------------//
let pesca_profissional = L.tileLayer.wms('https://si.icnf.pt/wms/zpp_profissional', {
    layers: "zpp_profissional",
    format: "image/png",
    opacity: 0.5,
    transparent: true,
})

let ensino_superior = L.tileLayer.wms('http://mapas.dgterritorio.pt/wms/dgeec', {
    format: "image/png",
    layers: "Estab_Ens_Sup_Portugal",
    opacity: 0.5,
    transparent: true,
})
ensino_superior.options.crs = L.CRS.EPSG4326;

let vias_romanas = L.tileLayer.wms('http://epic-webgis-portugal.isa.ulisboa.pt/wms/epic?VERSION=1.1.1', {
    format: "image/png",
    layers: "Vias Romanas",
    opacity: 0.5,
    transparent: true,
}).on('tileerror', function () {
    $('#alert-text-error').text("Erro no servidor de destino!")
    $('#error-alert').toast('show');
});

//-----------------WFS LAYERS-----------------//
//-----------------??guas Balneares-----------------//
$.ajax(url_geoserver + '/TP3_IS/ows', {
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

//-----------------Freguesias priorit??rias para a Defesa da Floresta Contra Inc??ndio (DFCI) 2022-----------------//
$.ajax(url_geoserver + '/TP3_IS/ows', {
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

//-----------------WCS - GEOTIFF IMPORTED TO GEOSERVER-----------------//
let land_cover_esri_2021 = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    format: "image/png",
    layers: "TP3_IS:esri_2021",
    opacity: 0.8,
    transparent: true,
})

//-----------------OCORR??NCIAS GEOSERVER-----------------//
let pontos = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_point',
    format: 'image/png',
    transparent: true,
});


let poligonos = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_polygon',
    format: 'image/png',
    transparent: true,
});


let linhas = L.tileLayer.wms(url_geoserver + '/TP3_IS/wms', {
    layers: 'TP3_IS:occurrences_line',
    format: 'image/png',
    transparent: true,
});

//-----------------OCORR??NCIAS BD-----------------//
let linesToRemove = [];
let polygonsToRemove = [];
let pointsToRemove = [];

//-----------------LINHAS-----------------//
//-----------------GET LINES AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickLinhas(checkbox) {

    if (checkbox.checked) {
        $('#loading').modal('show');


        let getLines = $.ajax(url_api + '/occurrences_line', {
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
                <div class='btn-group' role='group' aria-label='Op????es'>
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
                $('#info-alert').toast('show');
                chkLines.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').toast('show');
                chkLines.checked = false;
            } else {
                linhasbd.addData(data);
            }

            $('#loading').modal('hide');
        })
        getLines.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').toast('show');
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

        let getPoints = $.ajax(url_api + '/occurrences_point', {
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
                <div class='btn-group' role='group' aria-label='Op????es'>
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
                $('#info-alert').toast('show');
                chkPoints.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').toast('show');
                chkPoints.checked = false;
            } else {
                pointsbd.addData(data);
            }

            $('#loading').modal('hide');
        })
        getPoints.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').toast('show');
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

//-----------------POL??GONOS-----------------//
//-----------------GET POLYGONS AND SHOW ON MAP WITH DRAW CONTROL-----------------//
function handleClickPoligonos(checkbox) {

    if (checkbox.checked) {
        $('#loading').modal('show');
        let getPolygons = $.ajax(url_api + '/occurrences_polygon', {
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
                <div class='btn-group' role='group' aria-label='Op????es'>
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
                $('#info-alert').toast('show');
                chkPolygons.checked = false;
            } else if (data.error) {
                $('#alert-text-error').text(data.error)
                $('#error-alert').toast('show');
                chkPolygons.checked = false;
            } else {
                polygonsbd.addData(data);
            }

            $('#loading').modal('hide');

        })
        getPolygons.fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').toast('show');
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
        "??rea Ardida 2018": area_ardida,
        "CAOP 2015": caop,
        "Escolas de Viana": escolas_viana,
        "Farm??cias de Viana": farmacias_viana,
        "IFN 2015": ifn_2015,
        "Pontos ??gua": pontos_agua,
        "Rede Vi??ria": rede_viaria,
        "Zonas de Ca??a": zonas_caca,
        "Ecopistas": ecopistas,
    },

    "<span style='font-weight: bold'>Layers WMS Externas</span>": {
        "Zonas de Pesca Profissional": pesca_profissional,
        "Ensino Superior": ensino_superior,
        "Vias Romanas": vias_romanas,
    },
    "<span style='font-weight: bold'>Layers WFS</span>": {
        "??guas Balneares": aguas_balneares,
        "Freguesias Priorit??rias DGCI 2022": dfci,
    },
    "<span style='font-weight: bold'>Layers WCS</span>": {
        "Cobertura do terreno": land_cover_esri_2021,
    },
    "<span style='font-weight: bold'>Ocorr??ncias Geoserver</span>": {
        "Linhas": linhas,
        "Pontos": pontos,
        "Pol??gonos": poligonos,
    },
};

//-----------------MAP OPTIONS-----------------//
let map = L.map('map', { center: [39.557191, -7.8536599], zoom: 7, layers: [Esri_WorldStreetMap] });
let layerControl = L.control.groupedLayers(baseMaps, overlayMaps).addTo(map);



$(".leaflet-control-layers-selector").on('click', function () {
    if (map.hasLayer(aguas_balneares)) {
        map.fitBounds(aguas_balneares.getBounds());
    }
});

function centerMap() {
    map.setView(new L.LatLng(39.557191, -7.8536599), 7);
}




//-----------------FeatureGroup to store editable layers-----------------//
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControlFull = new L.Control.Draw({
    draw: {
        circlemarker: false,
        circle: false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: false,
    }
});

let drawControlEditOnly = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        remove: false,
    },
    draw: false
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
            "<div class='btn-group' role='group' aria-label='Op????es'>" +
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
            "<div class='btn-group' role='group' aria-label='Op????es'>" +
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
            "<div class='btn-group' role='group' aria-label='Op????es'>" +
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
            "<div class='btn-group' role='group' aria-label='Op????es'>" +
            "<button type='button' class='btn btn-cancel rounded-pill btn-sm' onclick='cancelLayer()'><i class='fa-solid fa-xmark'></i> Cancelar</button>" +
            "<button type='button' class='btn btn-add rounded-pill btn-sm ms-1' onclick='addLine()'><i class='fa-solid fa-plus'></i> Adicionar</button>" +
            "</div>" +
            "</form>");
    }

    drawnItems.addLayer(layer);
    map.removeControl(drawControlFull);
    map.addControl(drawControlEditOnly);
});

let saveEvents = []

map.on("draw:editstart", (e) => {
    let drawToArray = Object.entries(drawnItems._layers);

    drawToArray.forEach(element => {
        saveEvents.push(element[1]._events.click);
        delete element[1]._events.click;
    });

    chkLines.disabled = true;
    chkPoints.disabled = true;
    chkPolygons.disabled = true;
})

map.on("draw:editstop", () => {
    let drawToArray = Object.entries(drawnItems._layers);

    drawToArray.forEach(element => {
        saveEvents.forEach(event => {
            element[1]._events.click = event;
        });
    });

    saveEvents = []
    chkLines.disabled = false;
    chkPoints.disabled = false;
    chkPolygons.disabled = false;

})

//-----------------Checkbox Linhas/Pontos/Poligonos-----------------//
let chkLines = document.getElementById("linhas");
let chkPoints = document.getElementById("pontos");
let chkPolygons = document.getElementById("poligonos");


//-----------------ADD LINE TO DB-----------------//
function addLine() {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax(url_api + '/postLine', {
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
            $('#success-alert').toast('show');
            cancelLayer();
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
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



    $.ajax(url_api + '/updateLine', {
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
            $('#success-alert').toast('show');

            linesToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            linesToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE LINE IN DB-----------------//
function deleteLine(id) {
    $('#loading').modal('show');

    let layer = linesToRemove.find(element => element.feature.properties.id == id);

    $.ajax(url_api + '/deleteLine', {
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
            $('#success-alert').toast('show');

            linesToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            linesToRemove = [];
            handleClickLinhas(chkLines);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}



//-----------------POINTS-----------------//
//-----------------ADD POINT TO DB-----------------//
function addPoint() {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax(url_api + '/postPoint', {
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
            $('#success-alert').toast('show');
            cancelLayer();
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
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



    $.ajax(url_api + '/updatePoint', {
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
            $('#success-alert').toast('show');
            pointsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            pointsToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE POINT IN DB-----------------//
function deletePoint(id) {
    $('#loading').modal('show');

    let layer = pointsToRemove.find(element => element.feature.properties.id == id);

    $.ajax(url_api + '/deletePoint', {
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
            $('#success-alert').toast('show');
            pointsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            pointsToRemove = [];
            handleClickPontos(chkPoints);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}

//-----------------POLYGONS-----------------//
//-----------------ADD POLYGONS TO DB-----------------//
function addPolygon() {
    $('#loading').modal('show');

    let nome = document.getElementById("name").value;
    props.name = nome;
    $.ajax(url_api + '/postPolygon', {
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
            $('#success-alert').toast('show');
            cancelLayer();
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
        layer.closePopup();
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
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



    $.ajax(url_api + '/updatePolygon', {
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
            $('#success-alert').toast('show');
            polygonsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            polygonsToRemove = [];
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}

//-----------------DELETE POLYGON IN DB-----------------//
function deletePolygon(id) {
    $('#loading').modal('show');

    let layer = polygonsToRemove.find(element => element.feature.properties.id == id);

    $.ajax(url_api + '/deletePolygon', {
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
            $('#success-alert').toast('show');
            polygonsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            layer.closePopup();
            polygonsToRemove = [];
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}

//-----------------CANCEL LAYER IN DRAWER-----------------//
function cancelLayer() {
    drawnItems.removeLayer(layer);
    layer.closePopup();
    map.removeControl(drawControlEditOnly);
    map.addControl(drawControlFull);
}

//-----------------add scalebar in meter to the map-----------------//
L.control.scale({ metric: true }).addTo(map);
map.addControl(drawControlFull);


//-----------------CHANGE FILE FORMAT ON FORMFILE-----------------//
function changeFileFormat() {
    let selected = document.getElementById("selectType").value;
    let inputFile = document.getElementById("formFile");

    if (selected === 'xml') {
        inputFile.accept = '.kml, .kmz';
    } else if (selected === 'shapefile') {
        inputFile.accept = ".zip"
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
    document.getElementById("formFile").accept = '.kml, .kmz';

}

$('#fileModal').on('hide.bs.modal', function () {
    cleanFormFile();
})

//-----------------SUBMIT FORMFILE-----------------//
$("#fileForm").submit(function (event) {
    $('#loading').modal('show');


    let inputFile = document.getElementById("formFile");
    let selectType = document.getElementById("selectType");


    let formData = new FormData();

    if (inputFile.value !== '') {

        formData.append("file", inputFile.files[0]);
        formData.append("selectType", selectType.value)

        $.ajax(url_api + '/upload', {
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
                $('#success-alert').toast('show');
                $('#fileModal').modal('hide');
                cleanFormFile();
            } else if (res.error) {
                $('#alert-text-error').text(res.error);
                $('#error-alert').toast('show');
            }
        }).fail(function (xhr, textStatus, error) {
            $('#alert-text-error').text(textStatus)
            $('#error-alert').toast('show');
            $('#loading').modal('hide');
        });

    } else {
        $('#alert-text-error').text('Nenhum ficheiro selecionado!');
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    }

    event.preventDefault();

})

//-----------------BOOTSTRAP TABLE-----------------//
$('#editFileModal').on('show.bs.modal', function () {
    $('#loading').modal('show');

    $.ajax(url_api + '/files', {
        type: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    }).done(function (response) {
        $('#loading').modal('hide');
        $('#filesTable').bootstrapTable('load', JSON.parse(response));
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
});

let fileToDelete;

function tableActions(value, row, index) {
    fileToDelete = row.name;
    return `<button type='button' class='btn btn-cancel rounded-pill btn-sm' data-bs-toggle="modal"
    data-bs-target="#deleteFileModal"><i class="fa-solid fa-trash-can"></i> Eliminar</button>`
}

function cancelDeleteFile() {
    $('#editFileModal').modal('show');
}

function deleteFile() {
    $('#loading').modal('show');

    $.ajax(url_api + '/deleteFile', {
        type: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ data: fileToDelete }),
    }).done(function (response) {
        $('#loading').modal('hide');

        if (response.info) {
            $('#alert-text-success').text(response.info);
            $('#deleteFileModal').modal('hide');
            $('#editFileModal').modal('show');
            $('#success-alert').toast('show');


            polygonsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })
            linesToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })
            pointsToRemove.forEach(function (layer) {
                drawnItems.removeLayer(layer);
            })

            polygonsToRemove = [];
            linesToRemove = [];
            pointsToRemove = [];

            handleClickLinhas(chkLines);
            handleClickPontos(chkPoints);
            handleClickPoligonos(chkPolygons);
        } else if (response.error) {
            $('#alert-text-error').text(response.error);
            $('#deleteFileModal').modal('hide');
            $('#editFileModal').modal('show');
            $('#error-alert').toast('show');
        }
    }).fail(function (xhr, textStatus, error) {
        $('#alert-text-error').text(textStatus)
        $('#deleteFileModal').modal('hide');
        $('#editFileModal').modal('show');
        $('#error-alert').toast('show');
        $('#loading').modal('hide');
    });
}
