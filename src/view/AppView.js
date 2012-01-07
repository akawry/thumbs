Ext.define('thumbs.view.AppView', {
	extend: 'Ext.tab.Panel',
	config : {
		fullscreen: true,
		tabBar : {
			docked: 'bottom',
			layout: {
				pack: 'center'
			}
		},
		items: [{
				xtype: 'toolbar',
				title: 'Thumbs',
				docked: 'top'
			}, 
			Ext.create('thumbs.view.NearView'),
			Ext.create('thumbs.view.MapView'),
			Ext.create('thumbs.view.PostView')
		]
	}
});
