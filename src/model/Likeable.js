Ext.require('thumbs.model.Comment');

Ext.define('thumbs.model.Likeable', {
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [{
		name: '_id'
	}, {
		name: 'name'
	}, {
		name: 'description'
	}, {
		name: 'likes'
	}, {
		name: 'likers'
	}, {
		name: 'dislikes'
	}, {
		name: 'dislikers'
	}, {
		name: 'loc'
	}, {
		name: 'comments'
	}],
	
	hasMany : [{
		model: 'thumbs.model.Comment', name: 'comments'
	}]
});
