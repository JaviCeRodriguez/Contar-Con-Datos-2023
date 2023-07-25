var sadi = window.sadi || {};

sadi.map = {};
sadi.map.currentLayer = null;
sadi.map.files = null;
sadi.map.layerType = {LAT: "lat", ET: "et"};

/* global Ext*/
/* global ol*/
/* global olMap*/

Ext.require([
    'Ext.data.*',
    'Ext.tab.*',
    'Ext.panel.Panel',
	'Ext.ux.statusbar.StatusBar',
    'GeoExt.component.Map',
    'GeoExt.data.store.LayersTree',
    'GeoExt.component.FeatureRenderer',
]);

var mapComponent,
    mapPanel,
    treePanel,
    selectControl,
    layerInfo,
    olMap;

Ext.getBody().mask('Cargando datos');
sadi.map.init = function(){
        
        mapComponent = Ext.create('GeoExt.component.Map', {
            map: olMap,
        });

        mapPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            layout: 'fit',
            items: [mapComponent],
        });
		
        var ij = false;
		treePanel = Ext.create('Ext.tree.Panel', {
            rootVisible: false,
			cls: 'custom',
            flex: 1,
			scrollable: true,
            border: false,
			layout: 'fit',
			//layout: {
			//	type: 'vbox',
			//	align: 'stretch',
			//},
            listeners: {				
                itemclick: function(view, record, item, index, e ){
                    var layer = record.data;
                    sadi.map.currentLayer = layer;
					
					(Ext.DomQuery.selectNode('div#layer_name_block > table#sim-panel-header span#sim-panel-header-text')).innerHTML = layer.get("name");
					(Ext.DomQuery.selectNode('div#layer_name_block .x-tree-icon')).className = Ext.DomQuery.selectNode('.x-tree-icon', item).className;
					Ext.get("layer_name_block").setVisible(true);
					
					sadi.layers.OnChangeActiveLayer(layer.get("layer_key"));
					sadi.tools.updateOpacityControl();
					getLaterInfo(layer);					
                },
                checkchange: function(node, check, eventObj){
                    var layer = node.data;
                    if(layer.get("isBaseLayer")){
						node.parentNode.eachChild(function (n) {
							if(n.id != node.id){
								n.set('checked', false);
							}
						});						
						sadi.tools.islas_malvinas.vector.set("visible", ( check && layer.get("showMalvinasLayer")));
					}
					if(layer.get("isBaseGroup")){
						if(check){
							/* Solo activo el primer nodo. Una capa base a la vez */
							var flag = false;
							node.eachChild(function (n) {
								if(flag){
									n.set('checked', false);									
								}
								else{
									flag = true;
									sadi.tools.islas_malvinas.vector.set("visible", (n.data.get("showMalvinasLayer")));
								}
							});	
						}
						else{
							sadi.tools.islas_malvinas.vector.set("visible", false);
						}
					}
                },
            }
        });
        
		var slider = Ext.create('Ext.slider.Single', {
			hideLabel: false,
			fieldLabel: '<b>Transparencia</b>',			
			id: "ctrl_opacity",
			width: "100%",
			increment: 10,
			minValue: 0,
			maxValue: 100,
			layout: "fit",
			autoEl: {
				tag: 'div',
				'data-qtip': 'Asigne transparencia a esta capa deslizando el control con el mouse.'
			},			
			listeners: {
				change: function(thumb, transparencia){					
					sadi.tools.updateOpacity(transparencia);
				}
			},
			hidden: true
		});
		
        layerInfo = Ext.create('Ext.panel.Panel', {
            contentEl: 'layer_info',
            title: 'Simbolog&iacute;a',
			id: 'legend_continer',
            height: 330,
            border: false,
            bodyPadding: 5,
			//layout: 'vbox',
			autoScroll: true,
			collapsible: true,
			collapsed: false,
            region: 'bottom',			
			items: [
				{
					xtype: 'panel',
					id: 'symbology_header_block',
					html: "<div id='layer_name_block'></div>",
					border:0,
					height: 24,
					width: "auto",
					layout: 'fit',
				},
				slider,
				{
					xtype: 'checkboxfield',
					width: "100%",
					id:'chb_labels',
					name : 'chb_labels',
					fieldLabel: '<b>Etiquetas</b>',
					hidden: true,
					layout: 'fit',
					autoEl: {
						tag: 'div',
						'data-qtip': 'Para esta capa, muestra descripciones sobre cada elemento en el mapa.'
					},
					listeners: {
						change: function(obj, check){
							sadi.layers.OnChangeLabelEnable(check);
						}
					},
				},{
					xtype: 'panel',
					layout: 'fit',
					width: "100%",
					minHeight: 200,				
					border: 0,
					id: 'layer_sim_block',
					flex: 1,
					//html: "<div id='layer_sim_block'></div>",					
				},
			],
        });			
        
		var toolBar = new Ext.Toolbar({
			dock: 'top',
			items: [
				{
					id: 'toolbar_hand',
					text: 'Navegar',
					handler: sadi.tools.handler,
					enableToggle : true,
					pressed: true,
					toggleGroup: 'toolbar',
					icon: 'images/icon_pan.png'
				},
				{
					id: 'toolbar_measure_length',
					text: 'Medir longitud',
					handler: sadi.tools.handler,
					enableToggle : true,
					toggleGroup: 'toolbar',
					icon: 'images/linea.png'
				},
				{
					id: 'toolbar_featureinfo',
					text: 'Consultar datos',
					handler: sadi.tools.handler,
					enableToggle : true,
					toggleGroup: 'toolbar',
					icon: 'images/info.png'
				},
				{
					id: 'toolbar_share',
					text: 'Compartir mapa',
					handler: sadi.tools.handler,
					enableToggle : false,					
					icon: 'images/share.png'
				},
				/*
				{
					id: 'toolbar_image',
					text: 'Descargar imagen',
					handler: sadi.tools.handler,
					enableToggle : false,					
					icon: 'images/capture.png'
				},
				*/
				'->',
				{
					id: 'toolbar_help',
					text: 'Ayuda',
					handler: sadi.tools.handler,
					icon: 'images/help.png'
				}
			]
		});       
        
        var win = Ext.create('Ext.Viewport', {
            layout: "border",
			defaults: {
				layout: 'fit'
			},
            items: [
				{
					title: 'Capas',
                    xtype: 'panel',
                    region: 'west',
                    width: 240,
                    collapsible: true,
					split: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        treePanel,
                        layerInfo
                    ]
                },
                {
					xtype: 'tabpanel',
					region: 'center',
					activeTab: 0,
					items: [{
						title: 'Mapa',
						border: false,
						layout: 'fit',
						dockedItems:[toolBar],
						items: [mapPanel],// mapComponent]
					}],
					bbar: Ext.create('Ext.ux.StatusBar', {
						defaultText: 'Listo',
						id: 'right-statusbar',
						statusAlign: 'right',
						iconCls: 'x-status-valid',
						items: [{ text: (sadi.settings.showcoordinates)?'00.000 00.000':'', xtype: 'tbtext', id: 'statusbar-coordiantes'}]
					})
				}                
            ]
        });
        
        Ext.Ajax.request({
            loadMask: true,
            url: 'data/files.json',
			method: 'GET',
            params: {id: "1"},
            success: function(response) {
               sadi.map.files = Ext.decode(response.responseText);
            },
            failure: function(response, callOptions) {
               console.log("Could not read file");
            }
        });		
    };

Ext.onReady(function(){

	olMap = new ol.Map({
		controls: [
			new ol.control.Zoom(),
			new ol.control.Attribution()
		],
		layers: [],
		pixelRatio: 1,
		view: new ol.View({
			center: [0, 0],
			zoom: 12				
		})
	});    
	
	sadi.map.init();	
	sadi.layers.init();
	sadi.tools.init();
	
	var bounds = [-70, -23, -57, -51];
    bounds = ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857');
    olMap.getView().fit(bounds, olMap.getSize());
	
	
	var treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: olMap.getLayerGroup(),
			inverseLayerOrder: false
        });
	treeStore.setRootNode(treeStore.getRootNode());
	treePanel.reconfigure(treeStore);
	
	treePanel.getRootNode().cascadeBy(function(node) { 
		var layer = node.data;
		if((layer instanceof ol.layer.Tile)){
			
			if(layer.get("showInLayerSwitcher")===false){
				node.set('cls','hideTreeNode');
			}
			
			var key = layer.get("layer_key");
			switch(key){
				case "et_red_alta_tension":
					node.set('iconCls', 'icon_et_node');
					break;
				case "et_detalle":
					node.set('iconCls', 'icon_et_detalle');
					break;
				case "red_alta_tension":
					node.set('iconCls', 'icon_lat_node');
					break;
				case "gen":
					node.set('iconCls', 'icon_gen_node');
					break;
				case "densidad_potencia_instalada":
					node.set('iconCls', 'icon_potencia');
					break;
				case "regiones_electricas":
					node.set('iconCls', 'icon_reg_elect');
					break;
			}
		}
		else if((layer instanceof ol.layer.Group)){			
			if(layer.get("expanded")) node.expand();
		}		
	});		
	
	Ext.get("layer_name_block").setVisible(false);
	Ext.get('layer_name_block').appendChild ( Ext.clone(Ext.DomQuery.selectNode('div#templates > table#sim-panel-header')) );
	Ext.getCmp("layer_sim_block").update('');
	Ext.getBody().unmask();
	
	Ext.EventManager.onWindowResize(function () {
        olMap.updateSize();
    }, null, {buffer: 100});
	
	sadi.tools.getUrlParams();
});


function fetureInfo(feature){
    
    var content = "<table class='table table-striped table-bordered table-condensed'>";
	for(var field in feature.getProperties()) {
	    if(field != "geometry")
	        content += "<tr><th>"+field+"</th><td>" + feature.get(field) + "</td></tr>";
	}
	if(sadi.map.currentLayer && sadi.map.currentLayer.get("layerType") == sadi.map.layerType.ET && sadi.map.files[feature.get("id")]){
	    for (var index = 0; index < sadi.map.files[feature.get("id")].length; ++index) {
				
			var path = sadi.map.files[feature.get("id")][index]["path"];
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
			var link = '<a href="data/files/'+ sadi.map.files[feature.get("id")][index]["path"] +'" target="_blank"><img src="images/'+icon+'" width="25" height="25"></a>';
			content += "<tr><th>"+sadi.map.files[feature.get("id")][index]["name"]+"</th><td>" + link + "</td></tr>";
		}
	}
	content += "</table>";
    
    var win = Ext.create('Ext.window.Window', {
        title: feature.get("Nombre"),
        //height: Ext.getBody().getViewSize().height*0.8,
        //width: Ext.getBody().getViewSize().width*0.8,
        minWidth:'500',
        //minHeight:'450',
        layout: 'fit',
        itemId : 'popUpWin',        
        modal:true,
        shadow:false,
        resizable:false,
        constrainHeader:true,
        html: content,
        listeners:{
            close: function(){
                selectControl.getFeatures().clear();
            }
        }
    }).show();
    
}

function getLaterInfo(layer){    
	if(layer.get("show_legends")){
		content = sadi.layers.GetLegendPanelContent(layer);		
		Ext.getCmp("layer_sim_block").update(content);
	}
	else{
		Ext.getCmp("layer_sim_block").update('');
	}
	//Ext.getCmp('layer_sim_block').doLayout();
}

function moveMap(evt) {
	var feature = null;
	sadi.tools.select.vector.getSource().clear();
}