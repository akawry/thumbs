Ext.define('thumbs.store.LikeableStore', {
	extend: 'Ext.data.Store',
	model: 'thumbs.model.Likeable'
});

Ext.create('thumbs.store.LikeableStore', {
	storeId: 'thumbs.store.LikeableStore'
});

Ext.create('thumbs.store.LikeableStore', {
	storeId: 'thumbs.store.LikeableDetail'
});
