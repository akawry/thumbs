Ext.define('thumbs.view.MapView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'mapview',
		layout : {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
			xtype: 'map',
			useCurrentLocation: true,
			flex: 1,
			listeners : {
				'maprender' : function(){
					var store = Ext.data.StoreManager.lookup('thumbs.store.LikeableStore'),
						me = this.up('panel'),
						map = this.getMap();
					store.each(function(rec){
						me.onInsertMarker(rec);
					});
				}
			}
		}]
	},
	
	onInsertMarker : function(rec){
		var loc = rec.get('loc'),
			map = this.down('map').getMap(),
			marker = new google.maps.Marker({
			    position: new google.maps.LatLng(loc.lat, loc.lon),
			    title: rec.get('name'),
			    map: map
			});
	}
});
