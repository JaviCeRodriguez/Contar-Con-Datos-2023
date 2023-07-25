var sadi = window.sadi || {};

sadi.tools = {};
sadi.tools.current_control = null;
sadi.tools.measure = {};
sadi.tools.select = {};
sadi.tools.islas_malvinas = {};
sadi.tools.featureInfo = {};
sadi.tools.featureInfoLayers = [];

var wgs84Sphere = new ol.Sphere(6378137);

sadi.tools.init = function(){
	
	if(sadi.settings.showcoordinates) olMap.on("pointermove", sadi.tools.updateCoordinates);
	
	sadi.tools.current_control = "toolbar_hand";	
	
	sadi.tools.select.vector = new ol.layer.Vector({
		name: 'tools_select',
		map: olMap,
		source: new ol.source.Vector(),
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255,255,0,0.6],
				width: 4
			}),
			fill: new ol.style.Fill({
				color: [255,255,0,0.2]
			}),
		})
	});

    sadi.tools.measure.vector = new ol.layer.Vector({
		name: 'tools_measure',
		map: olMap,
		source: new ol.source.Vector(),
		displayInLayerSwitcher: false,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	});
	
    sadi.tools.islas_malvinas.vector = new ol.layer.Vector({
		name: 'islas_malvinas',
		map: olMap,
		source: new ol.source.Vector(),
		displayInLayerSwitcher: false,
		visible: false,
		style: sadi.tools.islas_malvinas_getStyle()
	});
	
	var islas_malvinas = new ol.Feature({
		name: "ISLAS MALVINAS",
		geometry: new ol.geom.Point(ol.proj.transform([-59.2470, -51.5548], 'EPSG:4326', 'EPSG:3857'))
	});
	sadi.tools.islas_malvinas.vector.getSource().addFeature( islas_malvinas );
	var islas_geor_y_sand = new ol.Feature({
		name: "ISLAS GEORGIAS DEL SUR Y SANDWICH DEL SUR",
		geometry: new ol.geom.Point(ol.proj.transform([-36.8183, -54.4385], 'EPSG:4326', 'EPSG:3857'))
	});
	sadi.tools.islas_malvinas.vector.getSource().addFeature( islas_geor_y_sand );
}

sadi.tools.islas_malvinas_getStyle = function(){
	return function(feature, resolution) {
    var style = new ol.style.Style({
			text: new ol.style.Text({
				text: sadi.tools.islas_malvinas_getText(feature, resolution),
				scale: 1.3,
				fill: new ol.style.Fill({
					color: '#e6e2df'
				}),
				stroke: new ol.style.Stroke({
					color: '#434542',
					width: 3.5
				})
			})
		})
    return [style];
  };
}
sadi.tools.islas_malvinas_getText = function(feature, resolution){
	var text = feature.get("name");
	if(resolution < 4900)
		if(resolution < 300 && text == "ISLAS GEORGIAS DEL SUR Y SANDWICH DEL SUR")
			return text + "\n(ARG)";
		else
			return text;
    else
		return "";
}

sadi.tools.handler = function(e){
		
	if(e.id == "toolbar_help"){
		sadi.faq.show();
		return;
	}
	
	/*========= toolbar_hand ==========*/
	olMap.un('pointermove', moveMap);
	olMap.removeInteraction(draw);
	sadi.tools.select.vector.getSource().clear();
	
	/*========= toolbar_measure_length ==========*/
	olMap.un('pointermove', pointerMoveHandler);	
	sadi.tools.measure.vector.getSource().clear();
	
	/*========= toolbar_featureinfo ==========*/
	olMap.un('singleclick', sadi.tools.featureInfoHandler);	
		
	olMap.getOverlays().clear();
	
	//(Ext.getCmp(e.id)).pressed=true;
	if(e.id == "toolbar_hand"){
		olMap.on("pointermove", moveMap);
	}
	else if(e.id == "toolbar_measure_length"){		
		olMap.on('pointermove', pointerMoveHandler);
		addInteraction();
	}
	else if(e.id == "toolbar_featureinfo"){		
		olMap.on('singleclick', sadi.tools.featureInfoHandler);
	}
	else if(e.id == "toolbar_share"){		
		sadi.tools.shareLinkHandler();
	}
	else if(e.id == "toolbar_image"){		
		olMap.once('postcompose', function(event) {
			
			
			var canvas = event.context.canvas;
			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
			} else {
				//Uncaught DOMException: Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.
				
				/*
				var link = document.createElement('a');
				link.download = "image.jpg";
				link.href = canvas.toDataURL('image/jpeg', 1.0);
				link.click();
				*/
				
				canvas.toBlob(function(blob) {
					saveAs(blob, 'map.png');
				});
				
			}
		});
		olMap.renderSync();
	}
}

sadi.tools.download = function(e){
	olMap.once('postcompose', function(event) {
		var canvas = event.context.canvas;
		if(window.navigator.userAgent.indexOf("Edge") > -1){
			//var html="<img src='"+canvas.toDataURL()+"' alt='canvas image'/>";
			//var newTab=window.open();
			//newTab.document.write(html);
			
			document.getElementById("downloader").download = "image.png";
			document.getElementById("downloader").href = canvas.toDataURL("image/png;");
		}
		else if(Ext.isChrome){
			var b64 = window.btoa(canvas.toDataURL("image/png"));
			//b64 = "data:image/svg+xml;base64," + b64;
			document.getElementById("downloader").download = "image.svg";
			document.getElementById("downloader").href = "data:image/svg+xml;base64," + b64;
		}
		else if(Ext.isFirefox){			
			document.getElementById("downloader").href = canvas.toDataURL();
		}
		else if(Ext.isIE11p){
			var blob = canvas.msToBlob();
			window.navigator.msSaveBlob(blob, 'geoSADI.jpg');
		}
		//var blob = canvas.msToBlob();
		//window.navigator.msSaveBlob(blob, 'dicomimage.png');
		
		//document.getElementById("downloader").download = "image.png";
		//document.getElementById("downloader").href = canvas.toDataURL("image/png;base64;").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		
		//var link = document.createElement('a');
		//link.download = "image.jpg";
		//link.href = canvas.toDataURL('image/jpeg', 1.0);
		//link.click();
	});
	olMap.renderSync();
	
	
}

sadi.tools.updateCoordinates = function(e){
	var coo= ol.proj.transform(e.coordinate, sadi.settings.proj_map, sadi.settings.proj_sadi_layers);
	var stringifyFunc = ol.coordinate.createStringXY(4);
	var out = stringifyFunc(coo);
	document.getElementById('statusbar-coordiantes').innerHTML = out;	
}

sadi.tools.updateOpacityControl = function(){
	if (sadi.map.currentLayer){
		var opacity = 100 - (sadi.map.currentLayer.getOpacity() * 100 );	
		Ext.getCmp('ctrl_opacity').setValue( opacity );
		Ext.getCmp('ctrl_opacity').show();
	}
}

sadi.tools.updateOpacity = function(transparecy_value){
	if(sadi.map.currentLayer){
		var opacity = (100 - transparecy_value)/100;
		sadi.map.currentLayer.setOpacity(opacity);
	}
}

sadi.tools.featureInfoHandler = function(e){
	
	sadi.layers.updateQueryableList();
	if(!(sadi.layers.queryable_layers && sadi.layers.queryable_layers.length > 0)) return;
	
	Ext.getBody().mask('Consultando datos');
	var exclude_fields = ["Fecha_desd", "Fecha_actu", "Calidad", "Fecha_sync"];
	
	var lyr_key = "et_red_alta_tension";
	var lyr = sadi.layers.layers_map[lyr_key];
	statusBar = Ext.getCmp('right-statusbar');
	statusBar.showBusy();
	
	var styles = [], layers = [], filter = [];
	for(var i=0; i<sadi.layers.queryable_layers.length; i++){
		qlo = sadi.layers.queryable_layers[i];
		styles.push(qlo.STYLES);
		layers.push(qlo.LAYERS);
		filter.push( typeof qlo.CQL_FILTER !== "undefined" ? qlo.CQL_FILTER : "INCLUDE" );
	}
	
	var url = lyr.getSource().getGetFeatureInfoUrl(
				e.coordinate, 
				olMap.getView().getResolution(), 
				'EPSG:3857',
				{
					'INFO_FORMAT': 'application/json',
					'FEATURE_COUNT': '10',
					'LAYERS': layers.join(","),
					'QUERY_LAYERS': layers.join(","),
					'STYLES': styles.join(","),
					'CQL_FILTER': filter.join(";"),
				}
			);
			
			
	url = url.replace(sadi.settings.map_server_gwc_wms, sadi.settings.map_server_wms);	 
	Ext.Ajax.request({
		url: url,
		async: true,
		success: function(response, opts) {
			statusBar.clearStatus({useDefaults:true});
			var obj = Ext.decode(response.responseText);
			
			if(obj.features.length>0){
				
				var clean_json = {};
				var last_layer = "";
				for(var i=0; i< obj.features.length; i++){
					
					var feature = obj.features[i];
					var layer_name = feature.id.split(".")[0];
					var properties = feature.properties;
					
					//---- content ----//
					var content = "<table class='table table-striped table-bordered table-condensed'>";
					for(var param in feature.properties){
						var exclude = false;
						for (var j = 0; j < exclude_fields.length; j++) {
							if (exclude_fields[j] === param) {
								exclude = true;
								break;
							}
						}
						if(!exclude){
							content += "<tr><th>"+param+"</th><td>" + feature.properties[param] + "</td></tr>";
						}				
					}
					if(sadi.settings.showcoordinates && feature.geometry && feature.geometry.type == "Point"){
						var coordinates = ol.proj.transform(feature.geometry.coordinates, sadi.settings.proj_map, sadi.settings.proj_sadi_layers);
						var ubicacion = "lat: " + coordinates[1] + ", lon: " + coordinates[0];
						content += "<tr><th>Ubicaci&oacute;n (GD)</th><td>" + ubicacion + "</td></tr>";
						ubicacion = "lat: " + sadi.tools.ddToDms(coordinates[1], "lat") + ", lon: " + sadi.tools.ddToDms(coordinates[0], "lon");
						content += "<tr><th>Ubicaci&oacute;n (GMS)</th><td>" + ubicacion + "</td></tr>";
					}
					if(layer_name == "et_red_alta_tension" && feature.properties.id){
						content += sadi.tools.attachFiles(feature.properties.id);
					}					
					content += "</table>";
					//---- content ----//
					
					clean_json[layer_name] = clean_json[layer_name] || { grouping: sadi.settings.layers[layer_name].def.grouping_param, features: [] };
					clean_json[layer_name].features.push({grouping: properties[clean_json[layer_name].grouping], data: content});
					
				}
				
				var panel_layers = [];
				for (var layer_name in clean_json){
					
					if(sadi.settings.layers[layer_name].def.grouping_param){
						
					}
					
					var columns = [{text: clean_json[layer_name].grouping, dataIndex: "grouping", hidden: true}, {text: "data", dataIndex: "data"}];
					
					var store = Ext.create('Ext.data.Store', {
						fields: ["grouping", "data"],
						groupField: (clean_json[layer_name].grouping)?"grouping":"",
						data: clean_json[layer_name].features
					});
					
					var plural = (clean_json[layer_name].features.length>1)?"s":"";

					var grid = Ext.create('Ext.grid.Panel', {
						title: (sadi.settings.layers[layer_name].def.title + " ("+ clean_json[layer_name].features.length +" ítem" + plural + " encontrado" + plural + ")"),
						store: store,
						columns: columns,
						features: [{ftype:'grouping', startCollapsed: true,}],
						hideHeaders: true,
						forceFit: true,						
						viewConfig: {							
							disableSelection: true,
						}
					});
					
					panel_layers.push( grid );
					
				}				
			
				var accordion_panel = Ext.create('Ext.panel.Panel', {
					//title: 'Accordion Layout',
					//width: "100%",
					//height: 400,
					defaults: {						
						//bodyStyle: 'padding:5px'
					},
					layout: {
						type: 'accordion',
						//titleCollapse: false,
						animate: true,
						collapsed: true,
						activeOnTop: false,
						multi: true
					},
					items: panel_layers,
				});


				
				
				var win = Ext.create('Ext.window.Window', {
					title: "Consulta de datos",//feature.get("Nombre"),
					height: Ext.getBody().getViewSize().height*0.8,
					width: Ext.getBody().getViewSize().width*0.8,
					minWidth:'500',
					maxWidth:'900',
					//minHeight:'250',
					layout: 'fit',
					//itemId : 'popUpWin',
					modal:true,
					shadow:false,
					resizable:true,
					//constrainHeader:true,
					//html: content,
					items: [accordion_panel]
					
				}).show();
	
			}
			else{
				statusBar.setStatus({
					text: 'No hay resultados',
					iconCls: 'x-status-error',
					clear: true // auto-clear after a set interval
				});
			}
			Ext.getBody().unmask();
		},
		failure: function(response, opts) {
			statusBar.clearStatus({useDefaults:true});
			console.log('server-side failure with status code ' + response.status);
			Ext.getBody().unmask();
		}
	});
}

sadi.tools.attachFiles = function(et_id){
	var content = "";
	if(sadi.map.files[et_id]){
	    for (var index = 0; index < sadi.map.files[et_id].length; ++index) {
				
			var path = sadi.map.files[et_id][index]["path"];
			var extension = path.substring(path.length-4,path.length);
			var icon = "file_icon.png";
			switch(extension){
				case ".pdf":
					icon = "pdf_icon.png";
					break;
				case ".doc":
					icon = "doc_icon.png";
					break;
				case ".jpg":
				case ".png":
				case ".tif":
					icon = "jpg_icon.png";
					break;
			}
			var fuente_dato = "<p><b><small>documento provisto por: " + sadi.map.files[et_id][index]["agen"] + "</small></b></p>";
			var link = '<a href="data/'+ sadi.map.files[et_id][index]["path"] +'" target="_blank"><img src="images/'+icon+'" width="25" height="25"></a>';
			
			content += "<tr><th>"+sadi.map.files[et_id][index]["name"]+"</th><td><div style='float:left'>" + link + "</div><div style='float:left'>&nbsp;</div><div style='float:left'>" + fuente_dato + "</div></td></tr>";
		}
	}
	return content;
}

sadi.tools.ddToDms = function(dd, axis){
	var d = parseInt(dd);
    var minfloat  = Math.abs((dd-d) * 60); 
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    var s = Math.round(secfloat);
	var or;
    d = Math.abs(d);

    if (s==60) {
        m++;
        s=0;
    }
    if (m==60) {
        d++;
        m=0;
    }
	
	if(axis == "lon"){
		or = (dd>0)?"E":"O";
	}
	else{
		or = (dd>0)?"N":"S";
	}
	
	return (d + "&deg; " + m + "' " + s + "\" " + or);
}

sadi.tools.shareLinkHandler = function(){
	var win = Ext.create('Ext.window.Window', {
		title: "Compartir link de mapa",
		//height: 'auto',
		width: 500,
		//minWidth:'500',
		//maxWidth:'900',
		//minHeight:'250',
		modal:true,
		shadow:false,
		resizable:true,
		//constrainHeader:true,
		padding: 5,
		border: false,		
		layout: {
			type: 'vbox',
			align: 'stretch',
			border: false,
		},
		items: [
			{ 
				xtype : 'container',
				html: "<b>Copie la siguiente ruta para compartir el mapa.</b>"
			},
			{ 
				xtype: 'textarea',
				id: 'shareurl',
				allowBlank: false,
				readOnly:true,
				grow: true,
				listeners: {
						afterRender: function() {
							var comp = Ext.getCmp('shareurl');
							comp.setValue(sadi.tools.setUrlParams());
							comp.autoSize();
							comp.focus();
							comp.selectText();
						}
				}
			}
		],
		
		
		
	}).show();
}

sadi.tools.getUrlParams = function(){
	var sUrlParams = location.search.split('?');
	if(sUrlParams.length!=2) return;
	
	sUrlParams = decodeURI(sUrlParams[1]);
	sUrlParams = sUrlParams.split('&');
	var params = {};
	for (var i = 0; i < sUrlParams.length; i++) {				
		var param = sUrlParams[i].split('=');
		var paramName = param[0];		
		var paramValue = sUrlParams[i].substring(paramName.length+1, sUrlParams[i].length);
		params[paramName] = paramValue;
	}
	
	if( 'x' in params && 'y' in params && 'z' in params && 'x' in params && 
		'layers' in params && 'labels' in params && 'transp' in params && 'filter' in params ){
		
		params["x"] = Number(params["x"]);
		params["y"] = Number(params["y"]);
		params["z"] = Number(params["z"]);
		
		var coor = ol.proj.transform([params["y"],params["x"]], sadi.settings.proj_map, sadi.settings.proj_sadi_layers);
		if(
			isNaN(coor[0]) || isNaN(coor[1]) ||
			(coor[0]>90 || coor[0]<-90 || coor[1]>180 || coor[1]<-180) ||
			(isNaN(params["z"]) || params["z"]>30 || params["z"]<0)
		){
			Ext.Msg.alert('Alerta', 'Par&aacute;metros no v&aacute;lidos de URL', Ext.emptyFn);
			return;
		}
		
		var pan = olMap.getView().animate({
			center: olMap.getView().getCenter(),
			duration: 1,
        });
        //olMap.beforeRender(pan);
		olMap.getView().setCenter([params["y"], params["x"]]);
		var zoom = olMap.getView().animate({
			zoom: olMap.getView().getResolution(),
			duration: 1,
        });
        //olMap.beforeRender(zoom);
		olMap.getView().setZoom(params["z"]);
		
		var layers = params["layers"].split(";");
		var labels = params["labels"].split(";");
		var transp = params["transp"].split(";");
		var filter = params["filter"].split(";");
		
		if(layers.length > 0 && layers.length == labels.length && layers.length == transp.length && layers.length == filter.length){
			sadi.tools.setUrlLayersParams(olMap, layers, labels, transp, filter);
		}
		else{
			//argumentos no validos
		}	
		
	}
}

sadi.tools.setUrlParams = function(){
	var sUrl = "";
	sUrl = [location.protocol, '//', location.host, location.pathname].join('');
	sUrl += "?x=" + olMap.getView().getCenter()[1];
	sUrl += "&y=" + olMap.getView().getCenter()[0];
	sUrl += "&z=" + olMap.getView().getZoom();
	var params = [];
	params = sadi.tools.getUrlLayersParamas(olMap, params);
	
	var layers = [];
	var labels = [];
	var transp = [];
	var filter = [];
	
	for (var i = 0; i < params.length; i++) {
		layers.push(params[i]['p']);
		labels.push(params[i]['l']);
		transp.push(params[i]['t']);
		filter.push(params[i]['f']);
	}
	
	sUrl += "&layers=" + layers.join(';');
	sUrl += "&labels=" + labels.join(';');
	sUrl += "&transp=" + transp.join(';');
	sUrl += "&filter=" + filter.join(';');
	
	return encodeURI(sUrl);
}

sadi.tools.getUrlLayersParamas = function(parent, params){
	parent.getLayers().forEach(function(item){
		if (item instanceof ol.layer.Tile && item.getVisible()) {			
			var pk = item.get("pk");
			if(pk){
				var lyr_params = false;
				if(!item.get("isBaseLayer"))
					lyr_params = item.getSource().getParams();
				params.push({
					p: pk,
					t: item.getOpacity(),
					l: (typeof (item.get("LABELS_ACTIVE")) === 'undefined' || !item.get("LABELS_ACTIVE")) ? null : 1,
					f: (lyr_params) ? lyr_params.CQL_FILTER : ""
				});
			}
		}		
		else if(item instanceof ol.layer.Group){
			sadi.tools.getUrlLayersParamas(item, params);			
		}
	});
	return params;
}

sadi.tools.setUrlLayersParams = function(parent, p, l, t, f){
	parent.getLayers().forEach(function(item){
		if (item instanceof ol.layer.Tile) {
			item.setVisible(false);
			
			for (var i = p.length -1; i >= 0 ; i--) {
				
				if(p[i] == item.get("pk")){
					item.setVisible(true);
					item.setOpacity(t[i]);
					var key = item.get("layer_key");
					var filter = f[i].split(" OR ");
					//***** filtro ******//
					var nothing_to_do = (filter.length == 1 && filter[0] == "");
					if(!nothing_to_do && key){
						var legend = sadi.settings.layers[key].legend;
						var cql_filter = [];
						for (var j = 0; j < legend.rules.length; j++) {
							var rule = legend.rules[j];							
							rule.active = false;
							for (var k = 0; k < filter.length; k++) {
								if(filter[k] == rule.cql_filter){
									rule.active = true;
									cql_filter.push(rule.cql_filter);
								}
							}
						}
						if(cql_filter.length>0){
							var params = item.getSource().getParams();	
							params['CQL_FILTER'] = cql_filter.join(" OR ");							
							item.getSource().updateParams(params);
						}						
					}
					//***** filtro ******//
					
					p.splice(i, 1);
					l.splice(i, 1);
					t.splice(i, 1);	
					f.splice(i, 1);	
					break;
				}
			}			
		}		
		else if(item instanceof ol.layer.Group){
			sadi.tools.setUrlLayersParams(item, p, l, t, f);			
		}
	});
}

/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click para continuar dibujando la linea.</br>Doble click para finalizar';


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
var pointerMoveHandler = function(evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = 'Click para comenzar a dibujar';
  /** @type {ol.Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;

  if (sketch) {
    var output;
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {
      output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
      helpMsg = continuePolygonMsg;
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof ol.geom.LineString) {
      output = formatLength( /** @type {ol.geom.LineString} */ (geom));
      helpMsg = continueLineMsg;
      tooltipCoord = geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);
};




var typeSelect = document.getElementById('type');
var geodesicCheckbox = document.getElementById('geodesic');

var draw; // global so we can remove it later
function addInteraction() {
  var type = 'LineString'; //(typeSelect.value == 'area' ? 'Polygon' : 'LineString');
  draw = new ol.interaction.Draw({
    source: sadi.tools.measure.vector.getSource(),
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  olMap.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  draw.on('drawstart',
      function(evt) {
        // set sketch
        sketch = evt.feature;
      }, this);

  draw.on('drawend',
      function(evt) {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
      }, this);
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  olMap.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  olMap.addOverlay(measureTooltip);
}


/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 */
// typeSelect.onchange = function(e) {
  // olMap.removeInteraction(draw);
  // addInteraction();
// };


/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
var formatLength = function(line) {
  var length;
  var useGeodesic = true;
  if (useGeodesic) {
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = olMap.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
      var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
      length += wgs84Sphere.haversineDistance(c1, c2);
    }
  } else {
    length = Math.round(line.getLength() * 100) / 100;
  }
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
  }
  return output;
};


/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function(polygon) {
  var area;
  if (geodesicCheckbox.checked) {
    var sourceProj = olMap.getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
  } else {
    area = polygon.getArea();
  }
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
  }
  return output;
};