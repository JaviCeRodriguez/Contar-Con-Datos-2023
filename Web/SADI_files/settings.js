var sadi = window.sadi || {};

sadi.settings = {};
sadi.settings.environment = 'public';
sadi.settings.map_server_gwc_wms = 'https://aplic.cammesa.com/stat/geoserver/gwc/service/wms';
sadi.settings.map_server_wms = 'https://aplic.cammesa.com/stat/geoserver/wms';
sadi.settings.proj_map = 'EPSG:3857';
sadi.settings.proj_gwc = 'EPSG:900913';
sadi.settings.proj_sadi_layers = 'EPSG:4326';
sadi.settings.showcoordinates = true;

sadi.settings.layers = {
	red_alta_tension: {def:"", olLayer:""},	
	lat_edenor: {def:"", olLayer:""}, 
	lat_edesur: {def:"", olLayer:""}, 
	lat_futuro: {def:"", olLayer:""}, 
	et_red_alta_tension: {def:"", olLayer:""},
	et_futuro: {def:"", olLayer:""},
	gen: {def:"", olLayer:""},
	densidad_potencia_instalada: {def:"", olLayer:""},
	regiones_electricas: {def:"", olLayer:""},
	renovar_1: {def:"", olLayer:""},
	renovar_15: {def:"", olLayer:""},
	renovar_2: {def:"", olLayer:""},
	renovar_3: {def:"", olLayer:""},
	resolucion_21: {def:"", olLayer:""},
	resolucion_287: {def:"", olLayer:""},
	resolucion_202: {def:"", olLayer:""},
	mater: {def:"", olLayer:""},
	et_detalle: {def:"", olLayer:""},
	enlaces: {def:"", olLayer:""},
	mastiles: {def:"", olLayer:""},
	rep_fibra_optica: {def:"", olLayer:""},
};

sadi.settings.groups = [
	{title: "root", visible: false, expanded: true,  layers_key: ["red_alta_tension", "et_red_alta_tension", "gen", "et_detalle", "densidad_potencia_instalada", "regiones_electricas"]},	
	{title: "Futuro", visible: false, expanded: false, layers_key: ["lat_futuro", "et_futuro"]},
	{title: "Capital y Gran Buenos Aires", visible: false, expanded: false, layers_key: ["lat_edenor", "lat_edesur"]},
	{title: "Comunicaciones", visible: false, expanded: false, layers_key: ["enlaces", "mastiles", "rep_fibra_optica"]},
	{title: "Proyectos Renovables", visible: false, expanded: false, layers_key: ["renovar_1", "renovar_15", "renovar_2", "renovar_3", "resolucion_202", "mater"]},
	{title: "Proyectos T&#233;rmicos", visible: false, expanded: false, layers_key: ["resolucion_21", "resolucion_287"]},	
]

sadi.settings.layers.red_alta_tension.def = {title: "L&#237;neas", layers: "cammesa:red_alta_tension", custom_style: "lineas_at_v2", show_legends: true, style_legend: "lat_legend", queryable: true, grouping_param: "Nombre", visible: true, z_index: 20};
sadi.settings.layers.et_detalle.def = {title: "Est. Transf. detalle", layers: "cammesa:et_detalle", custom_style: "et_detalle", show_legends: false, style_legend: "et_detalle", queryable: false, visible: false, z_index: 18};
sadi.settings.layers.lat_edenor.def = {title: "L&#237;neas Edenor", layers: "cammesa:lat_edenor", custom_style: "lineas_at_v2", show_legends: true, style_legend: "lat_legend_gba", 	queryable: true, grouping_param: "ID", visible: false, z_index: 20};
sadi.settings.layers.lat_edesur.def = {title: "L&#237;neas Edesur", layers: "cammesa:lat_edesur", custom_style: "lineas_at_v2", show_legends: true, style_legend: "lat_legend_gba", 	queryable: true, grouping_param: false, visible: false, z_index: 20};
sadi.settings.layers.lat_futuro.def = {title: "L&#237;neas futuro", layers: "cammesa:lat_futuro", custom_style: "lineas_at_v2_futuro", show_legends: true, style_legend: "lat_legend_futuro", 	queryable: true, grouping_param: "Nombre", visible: false, z_index: 21};
sadi.settings.layers.et_red_alta_tension.def = {title: "Estaciones Transf.", layers: "cammesa:et_red_alta_tension",	custom_style: "ETs", show_legends: true, style_legend: "et_legend", 	queryable: true, grouping_param: "Nombre", visible: true, z_index: 30};
sadi.settings.layers.et_futuro.def = {title: "Estaciones Transf. futuro", layers: "cammesa:et_futuro",	custom_style: "ETs_futuro", show_legends: true, style_legend: "et_legend_futuro", 	queryable: true, grouping_param: "Nombre", visible: false, z_index: 31};
sadi.settings.layers.gen.def = {title: "Centrales", layers: "cammesa:gen", custom_style: "gen", show_legends: true, style_legend: "gen_legend", 	queryable: true, grouping_param: "Nombre", visible: false, z_index: 40};

sadi.settings.layers.densidad_potencia_instalada.def = {title: "Densidad Pot. instalada", layers: "cammesa:densidad_potencia_instalada",	custom_style: "", show_legends: true, style_legend: "densidad_potencia_instalada", 	queryable: false, visible: false, z_index: 11};
sadi.settings.layers.regiones_electricas.def = {title: "Regiones electricas", layers: "cammesa:regiones_electricas",	custom_style: "", show_legends: true, style_legend: "regiones_electricas", 	queryable: false, visible: false, z_index: 10};

sadi.settings.layers.renovar_1.def = {title: "RenovAr Rond 1", 	layers: "cammesa:renovar_1", custom_style: "renovar", style_legend: "renovar", show_legends: true, queryable: true, grouping_param: "PROYECTO", visible: false, z_index: 102};
sadi.settings.layers.renovar_15.def = {title: "RenovAr Rond 1.5", 	layers: "cammesa:renovar_15", custom_style: "renovar", style_legend: "renovar", show_legends: true, queryable: true, grouping_param: "PROYECTO", visible: false, z_index: 103};
sadi.settings.layers.renovar_2.def = {title: "RenovAr Rond 2", 	layers: "cammesa:renovar_2", custom_style: "renovar2", style_legend: "renovar2", show_legends: true, queryable: true, grouping_param: "NOMBRE", visible: false, z_index: 104};
sadi.settings.layers.renovar_3.def = {title: "RenovAr Rond 3", 	layers: "cammesa:renovar_3", custom_style: "renovar2", style_legend: "renovar2", show_legends: true, queryable: true, grouping_param: "NOMBRE", visible: false, z_index: 104};
sadi.settings.layers.resolucion_21.def = {title: "Resoluci&#243;n 21", 	layers: "cammesa:resolucion_21", custom_style: "resolucion21", style_legend: "resolucion21", show_legends: true, queryable: true, grouping_param: "Proyecto", visible: false, z_index: 105};
sadi.settings.layers.resolucion_287.def = {title: "Resoluci&#243;n 287", 	layers: "cammesa:resolucion_287", custom_style: "resolucion287", style_legend: "resolucion287", show_legends: true, queryable: true, grouping_param: "Proyecto", visible: false, z_index: 106};
sadi.settings.layers.resolucion_202.def = {title: "Resoluci&#243;n 202", 	layers: "cammesa:resolucion_202", custom_style: "resolucion202", style_legend: "resolucion202", show_legends: true, queryable: true, grouping_param: "PROYECTO", visible: false, z_index: 106};
sadi.settings.layers.mater.def = {title: "MATER", 	layers: "cammesa:mater", custom_style: "mater", style_legend: "mater", show_legends: true, queryable: true, grouping_param: "proyecto", visible: false, z_index: 107};

sadi.settings.layers.enlaces.def = {title: "Enlaces", layers: "cammesa:enlaces", custom_style: "", show_legends: true, style_legend: "", queryable: true, grouping_param: "Tipo", visible: false, z_index: 108};
sadi.settings.layers.mastiles.def = {title: "Mastiles", layers: "cammesa:mastiles", custom_style: "", show_legends: true, style_legend: "", queryable: true, grouping_param: "Nombre", visible: false, z_index: 108};
sadi.settings.layers.rep_fibra_optica.def = {title: "Repetidoras Fib. Opt.", layers: "cammesa:rep_fibra_optica", custom_style: "", show_legends: true, style_legend: "", queryable: true, grouping_param: "Nombre", visible: false, z_index: 108};

sadi.settings.layers.et_red_alta_tension.def.label_style = "et_con_etiquetas_v2";
sadi.settings.layers.et_red_alta_tension.def.label_active = true;
sadi.settings.layers.et_futuro.def.label_style = "et_con_etiquetas_v2_futuro";
sadi.settings.layers.et_futuro.def.label_active = true;
sadi.settings.layers.gen.def.label_style = "gen_con_etiquetas";
sadi.settings.layers.gen.def.label_active = true;
sadi.settings.layers.renovar_1.def.label_style = "renovar_con_etiquetas";
sadi.settings.layers.renovar_1.def.label_active = true;
sadi.settings.layers.renovar_15.def.label_style = "renovar_con_etiquetas";
sadi.settings.layers.renovar_15.def.label_active = true;
sadi.settings.layers.renovar_2.def.label_style = "renovar2_con_etiquetas";
sadi.settings.layers.renovar_2.def.label_active = true;
sadi.settings.layers.renovar_3.def.label_style = "renovar2_con_etiquetas";
sadi.settings.layers.renovar_3.def.label_active = true;
sadi.settings.layers.resolucion_21.def.label_style = "resolucion21_con_etiquetas";
sadi.settings.layers.resolucion_21.def.label_active = true;
sadi.settings.layers.resolucion_287.def.label_style = "resolucion287_con_etiquetas";
sadi.settings.layers.resolucion_287.def.label_active = true;
sadi.settings.layers.resolucion_202.def.label_style = "resolucion202_con_etiquetas";
sadi.settings.layers.resolucion_202.def.label_active = true;
sadi.settings.layers.mater.def.label_style = "mater_con_etiquetas";
sadi.settings.layers.mater.def.label_active = true;

sadi.settings.layers.red_alta_tension.def.pk = 5;
sadi.settings.layers.et_red_alta_tension.def.pk = 6;
sadi.settings.layers.gen.def.pk = 7;
sadi.settings.layers.et_detalle.def.pk = 8;
sadi.settings.layers.densidad_potencia_instalada.def.pk = 9;
sadi.settings.layers.regiones_electricas.def.pk = 10;

sadi.settings.layers.lat_futuro.def.pk = 11;
sadi.settings.layers.et_futuro.def.pk = 12;
sadi.settings.layers.lat_edenor.def.pk = 13;
sadi.settings.layers.lat_edesur.def.pk = 14;

sadi.settings.layers.renovar_1.def.pk = 15;
sadi.settings.layers.renovar_15.def.pk = 16;
sadi.settings.layers.renovar_2.def.pk = 17;
sadi.settings.layers.renovar_3.def.pk = 27;
sadi.settings.layers.resolucion_21.def.pk = 18;
sadi.settings.layers.resolucion_287.def.pk = 19;
sadi.settings.layers.resolucion_202.def.pk = 20;
sadi.settings.layers.mater.def.pk = 21;

sadi.settings.layers.enlaces.def.pk = 27;
sadi.settings.layers.mastiles.def.pk = 28;
sadi.settings.layers.rep_fibra_optica.def.pk = 29;

sadi.settings.layers.red_alta_tension.legend = {show: true, filter: true, style: "lat_legend", 
	full_filter: "Tension>1000",
	rules:[
		{id:"lat_rule_500", name: "500 kV", cql_filter:"Tension=500", active:true},
		{id:"lat_rule_345-330", name: "345-330 kV", cql_filter:"Tension=345 OR Tension=330", active:true},
		{id:"lat_rule_220", name: "220 kV", cql_filter:"Tension=220", active:true},
		{id:"lat_rule_132", name: "132 kV", cql_filter:"Tension=132", active:true},
		{id:"lat_rule_66", name: "66-33 kV", cql_filter:"Tension<=66", active:true},
	]
};

sadi.settings.layers.lat_edenor.legend = {show: true, filter: true, style: "lat_legend", 
	full_filter: "Tension>1000",
	rules:[		
		{id:"lat_rule_220", name: "220 kV", cql_filter:"Tension=220", active:true},
		{id:"lat_rule_132", name: "132 kV", cql_filter:"Tension=132", active:true},
		{id:"lat_rule_66", name: "Menos de 132 kV", cql_filter:"Tension<132", active:true},
	]
};

sadi.settings.layers.lat_edesur.legend = {show: true, filter: true, style: "lat_legend", 
	full_filter: "Tension>1000",
	rules:[		
		{id:"lat_rule_220", name: "220 kV", cql_filter:"Tension=220", active:true},
		{id:"lat_rule_132", name: "132 kV", cql_filter:"Tension=132", active:true},
		{id:"lat_rule_66", name: "Menos de 132 kV", cql_filter:"Tension<132", active:true},
	]
};

sadi.settings.layers.et_red_alta_tension.legend = {show: true, filter: true, style: "et_legend", 
	full_filter: "Tension>1000",
	rules:[
		{id:"et_rule_500", name: "500 kV", cql_filter:"Tension=500", active:true},
		{id:"et_rule_345-132", name: "345-132 kV", cql_filter:"Tension>131 AND Tension<500", active:true},
		{id:"et_rule_lt_132", name: "&lt; 132 kV", cql_filter:"Tension<132", active:true},
	]
};
sadi.settings.layers.gen.legend = {show: true, filter: true, style: "gen_legend", 
	full_filter: "Tension>1000",
	rules:[
		{id:"gen_rule_termico", name: "Termico", title: "T&#233;rmico", cql_filter:"Tipo in('VG','DI','TG','TV')", active:true},
		{id:"gen_rule_nuclear", name: "Nuclear", cql_filter:"Tipo='NU'", active:true},
		{id:"gen_rule_hidraulico", name: "Hidraulico", title: "Hidr&#225;ulico", cql_filter:"Tipo in('HI','HB','HR')", active:true},
		{id:"gen_rule_solar", name: "Solar", cql_filter:"Tipo='FV'", active:true},
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"Tipo='EO'", active:true},
	]
};
sadi.settings.layers.renovar_1.legend = {show: true, filter: true, style: "renovar", 
	full_filter: "FUENTE='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"FUENTE='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"FUENTE='SFV'", active:true},
		{id:"gen_rule_biomasa", name: "Biomasa", cql_filter:"FUENTE='BM'", active:true},
		{id:"gen_rule_biogas", name: "Biogas", cql_filter:"FUENTE='BG'", active:true},
		{id:"gen_rule_hidraulico", name: "Hidraulico", title: "Hidr&#225;ulico", cql_filter:"FUENTE='PAH'", active:true},
	]
};
sadi.settings.layers.renovar_15.legend = {show: true, filter: true, style: "renovar", 
	full_filter: "FUENTE='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"FUENTE='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"FUENTE='SFV'", active:true},
		{id:"gen_rule_biomasa", name: "Biomasa", cql_filter:"FUENTE='BM'", active:true},
		{id:"gen_rule_biogas", name: "Biogas", cql_filter:"FUENTE='BG'", active:true},
		{id:"gen_rule_hidraulico", name: "Hidraulico", title: "Hidr&#225;ulico", cql_filter:"FUENTE='PAH'", active:true},
	]
};

sadi.settings.layers.renovar_2.legend = {show: true, filter: true, style: "renovar2", 
	full_filter: "FUENTE='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"FUENTE='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"FUENTE='SFV'", active:true},
		{id:"gen_rule_biomasa", name: "Biomasa", cql_filter:"FUENTE='BM'", active:true},
		{id:"gen_rule_biogas", name: "Biogas", cql_filter:"FUENTE='BG'", active:true},
		{id:"gen_rule_biorelleno", name: "Biorelleno", cql_filter:"FUENTE='BRS'", active:true},
		{id:"gen_rule_hidraulico", name: "Hidraulico", title: "Hidr&#225;ulico", cql_filter:"FUENTE='PAH'", active:true},
	]
};

sadi.settings.layers.renovar_3.legend = {show: true, filter: true, style: "renovar2", 
	full_filter: "FUENTE='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"FUENTE='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"FUENTE='SFV'", active:true},
		{id:"gen_rule_biomasa", name: "Biomasa", cql_filter:"FUENTE='BM'", active:true},
		{id:"gen_rule_biogas", name: "Biogas", cql_filter:"FUENTE='BG'", active:true},
		{id:"gen_rule_biorelleno", name: "Biorelleno", cql_filter:"FUENTE='BRS'", active:true},
		{id:"gen_rule_hidraulico", name: "Hidraulico", title: "Hidr&#225;ulico", cql_filter:"FUENTE='PAH'", active:true},
	]
};

sadi.settings.layers.resolucion_287.legend = {show: true, filter: true, style: "resolucion287", 
	full_filter: "Tecnologia='NON'",
	rules:[
		{id:"287_rule_cc", name: "Cierre CC", cql_filter:"Tecnologia='CIERRE CC'", active:true},
		{id:"287_rule_cog", name: "Cogeneracion", title: "Cogeneraci&#243;n", cql_filter:"Tecnologia='COGENERACION'", active:true},
	]
};

sadi.settings.layers.resolucion_202.legend = {show: true, filter: true, style: "resolucion202", 
	full_filter: "FUENTE='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"FUENTE='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"FUENTE='SFV'", active:true},
		{id:"gen_rule_biomasa", name: "Biomasa", cql_filter:"FUENTE='BM'", active:true},
	]
};

sadi.settings.layers.mater.legend = {show: true, filter: true, style: "mater", 
	full_filter: "fuente='NON'",
	rules:[
		{id:"gen_rule_eolico", name: "Eolico", title: "E&#243;lico", cql_filter:"fuente='EOL'", active:true},
		{id:"gen_rule_solar", name: "Fotovoltaico", cql_filter:"fuente='SFV'", active:true},
	]
};

sadi.settings.layers.regiones_electricas.legend = {show: true, filter: true, style: "regiones_electricas", 
	full_filter: "Region='NON'",
	rules:[
		{id:"reg_elect_noa", name: "NOA", cql_filter:"Region='NOA'", active:true},
		{id:"reg_elect_nea", name: "NEA", cql_filter:"Region='NEA'", active:true},
		{id:"reg_elect_cuyo", name: "CUYO", cql_filter:"Region='CUYO'", active:true},
		{id:"reg_elect_centro", name: "CENTRO", cql_filter:"Region='CENTRO'", active:true},
		{id:"reg_elect_litoral", name: "LITORAL", cql_filter:"Region='LITORAL'", active:true},
		{id:"reg_elect_bsas", name: "BUENOS AIRES", cql_filter:"Region='BUENOS AIRES'", active:true},
		{id:"reg_elect_gba", name: "GBA", cql_filter:"Region='GBA'", active:true},
		{id:"reg_elect_com", name: "COMAHUE", cql_filter:"Region='COMAHUE'", active:true},
		{id:"reg_elect_pat", name: "PATAGONIA", cql_filter:"Region='PATAGONIA'", active:true},
	]
};

sadi.settings.layers.enlaces.legend = {show: true, filter: true, style: "enlaces", 
	full_filter: "Tipo='NON'",
	rules:[
		{id:"fo_adsl", name: "FIBRA OPTICA (ADSL)", title: "FIBRA OPTICA (ADSL)", cql_filter:"Tipo='FIBRA OPTICA (ADSL)'", active:true},
		{id:"fo_opgw", name: "FIBRA OPTICA (OPGW)", title: "FIBRA OPTICA (OPGW)", cql_filter:"Tipo='FIBRA OPTICA (OPGW)'", active:true},
		{id:"mo_analog", name: "MICRO ONDAS ANALOGICA", title: "MICRO ONDAS ANALOGICA", cql_filter:"Tipo='MICRO ONDAS ANALOGICA'", active:true},
		{id:"mo_digital", name: "MICRO ONDAS DIGITAL", title: "MICRO ONDAS DIGITAL", cql_filter:"Tipo='MICRO ONDAS DIGITAL'", active:true},
		{id:"op", name: "ONDA PORTADORA", title: "ONDA PORTADORA", cql_filter:"Tipo='ONDA PORTADORA'", active:true},
	]
};

sadi.settings.layers.mastiles.legend = {show: true, filter: true, style: "mastiles", 
	full_filter: "Regional='NON'",
	rules:[
		{id:"metropolitana", name: "Metropolitana", title: "Regional Metropolitana", cql_filter:"Regional='Metropolitana'", active:true},
		{id:"norte", name: "Norte", title: "Regional Norte", cql_filter:"Regional='Norte'", active:true},
		{id:"sur", name: "Sur", title: "Regional Sur", cql_filter:"Regional='Sur'", active:true},
	]
};