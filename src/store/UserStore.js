Ext.define('thumbs.store.UserStore', {
	extend: 'Ext.data.Store',
	model: 'thumbs.model.User'
});

Ext.create('thumbs.store.UserStore', {
	storeId: 'thumbs.store.LikerStore'
});

Ext.create('thumbs.store.UserStore', {
	storeId: 'thumbs.store.DislikerStore'
});
