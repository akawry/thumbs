Ext.define('thumbs.view.NearView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'nearview',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [
			{
				xtype: 'list',
				store: 'thumbs.store.LikeableStore',
				itemSelector: 'div',
				disableSelection: true,
				itemTpl: [
					'<div style="display: inline-block;">{name}</div>',
					'<div style="display: inline-block; float: right;">({likes} Likes, {dislikes} Dislikes)</div>'
				],
				flex: 1,
				listeners : {
					itemtap : function(list, idx){
						var model = list.getStore().getAt(idx),
							p = this.up('panel');
						p.fireEvent('viewlikeable', model);
					}
				}
				//emptyText: 'No one has liked anything near you. How about you post something?'
			}
		]
	}
});
