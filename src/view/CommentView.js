Ext.define('thumbs.view.CommentView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'commentview',
		layout : {
			type: 'vbox',
			align: 'stretch'
		},
		items: [
			{
				xtype: 'list',
				store: 'NoComments',
				itemTpl: [
					'<div style="display: inline-block; float: left;">Posted: {posted:date("m/d/Y")}</div>',
					'<div style="display: inline-block; float: right;">By: {author}</div>',
					'<br /><div>{content}</div>'
				],
				itemSelector: 'div',
				//emptyText: 'No one has posted any comments yet. Be the first!',
				flex: 1
			}, 
			{
				xtype: 'button',
				text: 'Post a Comment',
				handler : function(){
					var p = this.up('panel');
					p.fireEvent('viewpostcomment', p.model.getId());
				}
			}
		]
	},
	setModel : function(model) { 
		this.model = model;
		this.down('list').setStore(model.comments());
	}
});
