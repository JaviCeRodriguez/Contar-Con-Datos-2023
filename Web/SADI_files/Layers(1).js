var sadi = window.sadi || {};

sadi.layers = {};
sadi.layers.layers_map = {};
sadi.layers.queryable_layers = [];
sadi.bing_key = "AvpAnTjJw32nIoQm4igR8e2kpXMG6PdJf2gknWL0349XNREVygKcSzFpT7nt1Jf9";
sadi.layers.current_layer_key = "";
sadi.layers.gs_version = "20220916";

sadi.layers.init = function(){
	    
	var group_base = new ol.layer.Group({
        name: "Mapa Base",
        layers: [
			new ol.layer.Tile({
				name: 'Provincias',
				source: new ol.source.TileWMS({
					url: sadi.settings.map_server_gwc_wms,
					params: {
						'LAYERS': 'cammesa:provincias', 
						'TILED': true,
						'SRS': sadi.settings.proj_gwc,
						'FORMAT': 'image/jpeg'
						},
					serverType: 'geoserver'
				  }),
				visible: true,
				isBaseLayer : true,
				show_legends: true,
				style_legend: 'provincias',
				pk:1
			}),
			/*
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: sadi.bing_key,
					imagerySet: 'Aerial',
					maxZoom: 19,
				}),
				isBaseLayer : true,
				name: 'Imag. Aereas',
				visible: false,
				pk: 2
			}),			
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: sadi.bing_key,
					imagerySet: 'AerialWithLabels',
					maxZoom: 19,
				}),
				name: 'Imag. y Rutas',
				visible: false,
				isBaseLayer : true,
				showMalvinasLayer : true,
				pk: 3
			}),		
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: sadi.bing_key,
					imagerySet: 'Road',
					maxZoom: 19,
				}),
				isBaseLayer : true,
				name: 'Pol&iacute;tico con rutas',
				visible: false,
				showMalvinasLayer : true,
				pk: 4
			}),*/
			/*
			new ol.layer.Tile({
				source: new ol.source.TileImage({ url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}' }),
				isBaseLayer : true,
				name: 'google',
				visible: false,
				showMalvinasLayer : true,
				pk: 4
			}),*/
			new ol.layer.Tile({
				source: new ol.source.TileWMS({
					attributions: 'Tiles © <a href="https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/ServiciosOGC">Instituto Geográfico Nacional</a>',
					url: 'https://wms.ign.gob.ar/geoserver/gwc/service/wms',
					params: {
						'LAYERS': 'capabaseargenmap', 
						'TILED': true,
						'SRS': sadi.settings.proj_map,
						'FORMAT': 'image/png'
					},
					serverType: 'geoserver',
					// Countries have transparency, so do not fade tiles:
					transition: 0
				}),
				isBaseLayer : true,
				name: 'Argenmap',
				visible: false,
				pk: 3
			}),
			new ol.layer.Tile({
				source: new ol.source.XYZ({
					attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
					'rest/services/World_Imagery/MapServer">ArcGIS</a>',
					url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
					'World_Imagery/MapServer/tile/{z}/{y}/{x}'
				}),
				isBaseLayer : true,
				name: 'Imag. Aereas Esri',
				visible: false,
				pk: 4
			}),
		],
        visible: true,
		isBaseGroup : true,
		expanded: true
    });	
	
	for (var i = 0; i < sadi.settings.groups.length; i++) {
		var group = sadi.settings.groups[i];		
		var lyr_group = [];
		var is_in_group = (group.title != "root");
		for (var j = 0; j < group.layers_key.length; j++) {
			var layer_key = group.layers_key[j];
			sadi.layers.layers_map[layer_key] = sadi.layers.add_layer(sadi.settings.layers[layer_key].def, layer_key, !is_in_group);
			lyr_group.push(sadi.layers.layers_map[layer_key]);
		}
		if(is_in_group){
			var olgroup = new ol.layer.Group({
				name: group.title,
				layers: lyr_group,
				visible: group.visible,
			});
			olMap.addLayer(olgroup);
		}
	}
	
	olMap.addLayer(group_base);
}

sadi.layers.updateQueryableList = function(){
	sadi.layers.queryable_layers = [];
	olMap.getLayers().forEach(function(item){
		if (item instanceof ol.layer.Tile) {			
			//var layer = group.layers[i];
			if(item.get("queryable") && item.getVisible()){
				sadi.layers.queryable_layers.push({
					LAYERS: item.getSource().getParams().LAYERS, 
					CQL_FILTER: item.getSource().getParams().CQL_FILTER,
					STYLES: item.getSource().getParams().STYLES});
			}
		}		
		else if(item instanceof ol.layer.Group){
			item.getLayers().forEach(function(_item){
				if (_item instanceof ol.layer.Tile) {
					//var layer = group.layers[i];
					if(_item.get("queryable") && _item.getVisible()){
						sadi.layers.queryable_layers.push({
						LAYERS: _item.getSource().getParams().LAYERS, 
						CQL_FILTER: _item.getSource().getParams().CQL_FILTER,
						STYLES: _item.getSource().getParams().STYLES});
					}
				}
			});
		}
	});	
}

sadi.layers.OnChangeActiveLayer = function(key){
	sadi.layers.current_layer_key = key;	
	if(key && sadi.settings.layers[key].def.label_style){
		Ext.getCmp('chb_labels').show();
		Ext.getCmp('chb_labels').setValue( sadi.layers.layers_map[key].get("LABELS_ACTIVE") );
	}
	else{
		Ext.getCmp('chb_labels').hide();
	}
}

sadi.layers.add_layer = function(layer_def, key, add_to_map){
	var	wms_layer = new ol.layer.Tile({
		name: layer_def.title,
		source: new ol.source.TileWMS({
			url: sadi.settings.map_server_gwc_wms,
			params: {
				LAYERS: layer_def.layers,
				TILED: true,
				STYLES: (layer_def.label_active)?layer_def.label_style:layer_def.custom_style,
				CQL_FILTER: (layer_def.cql_filter != "")?layer_def.cql_filter:"",
				SRS: sadi.settings.proj_gwc,
				GS_VERSION: sadi.layers.gs_version,
				},					
			serverType: 'geoserver',
		}),
		visible: layer_def.visible,
		show_legends: layer_def.show_legends,
		style_legend: layer_def.style_legend,
		queryable: layer_def.queryable,
		layer_key: key,
		LABELS_ACTIVE: layer_def.label_active,
		pk: layer_def.pk
	});
	wms_layer.setZIndex(layer_def.z_index);
	if(add_to_map)
		olMap.addLayer(wms_layer);
	return wms_layer;
}

sadi.layers.GetLegendPanelContent = function(layer){
	var content = "";
	if(
		layer && 
		sadi.settings.layers[sadi.layers.current_layer_key] &&
		sadi.settings.layers[sadi.layers.current_layer_key].legend){
		content = sadi.layers.GetLegendGraphicFilterTable(sadi.layers.current_layer_key);
	}
	else{
		content = sadi.layers.GetLegendGraphic(layer);
	}
	return content;
}

sadi.layers.GetLegendGraphic = function(layer){
	return "<div style='height: 100%;'><img src='"+ (sadi.layers.GetLegendGraphicUrl(layer)) + "&#38;LEGEND_OPTIONS=forceLabels:on" +"' /></div>";
}

sadi.layers.GetLegendGraphicUrl = function(layer){
	var url = layer.getSource().getUrls();
	url = url[0];
	var layers = (layer.getSource().getParams())["LAYERS"];
	var style = layer.get("style_legend");
    url += '?REQUEST=GetLegendGraphic&#38;sld_version=1.0.0&#38;layer=' + layers + '&#38;format=image/png&#38;scale=1000&#38;style=' + style;
	return url;
}

sadi.layers.GetLegendGraphicFilterTable = function(key){
	var content="";
	var layer_map_obj = sadi.layers.layers_map[key];
	if(layer_map_obj && sadi.settings.layers[key].legend){
		var legend = sadi.settings.layers[key].legend;
		if(legend.filter){
			var url = sadi.layers.GetLegendGraphicUrl(layer_map_obj);
			content = "<table class='table table-striped table-bordered table-condensed' id='legend_filter_table'>";
			for (var i = 0; i < legend.rules.length; i++) {
				var rule = legend.rules[i];
				var title = rule.name;
				if(rule.title) title = rule.title;
				var event = "onchange=sadi.layers.onChangeLegendItem(this);"
				var checkbox = "<input type='checkbox' name='"+rule.name+"' value='"+rule.name+"' "+ ((rule.active)?"checked":"") +" id='"+rule.id+"' "+event+">";		
				content += "<tr><td>" + checkbox + "</td><td>" +"<img src='"+ url + "&#38;RULE=" + rule.name+ "'/>" +"</td><td>"+ title+"</td></tr>";
			}
			content += "</table>";
		}
		else if(legend.show){
			var url = sadi.layers.GetLegendGraphic(layer_map_obj);
			content = "<img src='"+ url + "'/>";
		}
	}
	return content;
}

sadi.layers.onChangeLegendItem = function(element){
	var key = sadi.layers.current_layer_key;
	var layer_map_obj = sadi.layers.layers_map[key];
	var legend = sadi.settings.layers[key].legend;
	var cql_filter = [];
	for (var i = 0; i < legend.rules.length; i++) {
		var rule = legend.rules[i];
		var chb = document.getElementById(rule.id);
		rule.active = chb.checked;
		if(chb.checked){
			cql_filter.push(rule.cql_filter);
		}
	}
	var params = layer_map_obj.getSource().getParams();	
	
	if(cql_filter.length == legend.rules.length){
		delete params['CQL_FILTER'];
		layer_map_obj.setVisible(true);
	}
	else if(cql_filter.length == 0){
		delete params['CQL_FILTER'];
		params['CQL_FILTER'] = legend.full_filter;
		layer_map_obj.setVisible(false);		
	}
	else{
		params['CQL_FILTER'] = cql_filter.join(" OR ");
		layer_map_obj.setVisible(true);
	}
	layer_map_obj.getSource().updateParams(params);
	
}

sadi.layers.update_filter = function(){}

sadi.layers.OnChangeLabelEnable = function(cheked){
	var lyr = sadi.layers.layers_map[sadi.layers.current_layer_key];
	params = lyr.getSource().getParams();
	if( cheked ){		
		params['STYLES'] = sadi.settings.layers[sadi.layers.current_layer_key].def.label_style;
	}
	else{
		params['STYLES'] = sadi.settings.layers[sadi.layers.current_layer_key].def.custom_style;		
	}
	lyr.set("LABELS_ACTIVE", cheked);
	lyr.getSource().updateParams(params);	
}