var sadi = window.sadi || {};

sadi.faq = {};

sadi.faq.show = function(){
	var paqs = new Ext.panel.Panel({
            layout: 'accordion',
			defaults: {
                layout: 'fit',
                hideHeaders: true,
				border: false,
				bodyStyle: 'padding: 10px;',
				autoScroll: true,
            },
            items: [{
                id: 'faq_que-info',
				title: '¿Qu&eacute; informaci&oacute;n puedo encontrar?',				
				html:  sadi.faq.loadURL('faqs/que_info_v2.htm', 'faq_que-info'),				
            }, {
				id: 'faq_encender_capas',
                title: '¿C&oacute;mo encender o apagar capas?',
				html:  sadi.faq.loadURL('faqs/encender_capas_v2.htm', 'faq_encender_capas'),
            }, {
                id: 'faq_interpretacion',
				title: '¿C&oacute;mo interpreto una capa?',
				html:  sadi.faq.loadURL('faqs/interpretacion_v2.htm', 'faq_interpretacion'),
            }, {
                id: 'faq_zoom',
				title: '¿C&oacute;mo acerco o alejo el mapa?',
				html:  sadi.faq.loadURL('faqs/zoom_v2.htm', 'faq_zoom'),
            }, {
                id: 'faq_medidas',
				title: '¿C&oacute;mo puedo tomar medidas sobre el mapa?',
				html:  sadi.faq.loadURL('faqs/medidas_v2.htm', 'faq_medidas'),
            }, {
                id: 'faq_datos',
				title: '¿C&oacute;mo puedo consultar datos de capa?',
				html:  sadi.faq.loadURL('faqs/datos_v2.htm', 'faq_datos'),
            }]
        });
		
		
	var win = Ext.create('Ext.window.Window', {
        title: "Preguntas frecuentes",
        height: Ext.getBody().getViewSize().height*0.8,
        width: Ext.getBody().getViewSize().width*0.8,
        minWidth:'500',
        //minHeight:'450',
        layout: 'fit',
        itemId : 'popUpWin',        
        modal:true,
        shadow:false,
        resizable:false,
        constrainHeader:true,
		defaults: {
                
				border: 0
            },
        items:[paqs]   
    }).show();
	
}

sadi.faq.loadURL = function(url, id) {	
	Ext.Ajax.request({
		loadMask: true,
		url: url,
		method: 'GET',
		success: function(response) {
			var comp = Ext.getCmp(id);
		    comp.setHtml(response.responseText);
		},
		failure: function(response, callOptions) {
		   console.log("Could not read file");
		}
	});	
};