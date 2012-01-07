Ext.define('thumbs.model.Comment', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'author'
	}, {
		name: 'content'
	}, {
		name: 'posted',
		type: 'date'
	}]
});
