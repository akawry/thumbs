Ext.define('thumbs.view.LikeableView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'likeableview',
		layout : {
			type: 'vbox',
			align: 'stretch'
		},
		items : [
			{
				itemId: 'detailview',
				xtype: 'dataview',
				store: 'thumbs.store.LikeableDetail',
				itemTpl: [
					'<H3>{name}</H3>',
					'{description}<P>',
					'<a href="#" id="likelink">{likes} people like this.</a>',
					'&nbsp;&nbsp;',
					'<a href="#" id="dislikelink">{dislikes} people dislike this.</a>'
				],
				flex: 2,
				styleHtmlContent: true,
				listeners : {
					painted : function(){
						var el = Ext.get('likelink');
						if (!el.hasListener('click')){
							el.on('click', this.up('panel').onViewLikes, this.up('panel'));
						}
						el = Ext.get('dislikelink');
						if (!el.hasListener('click')){
							el.on('click', this.up('panel').onViewDislikes, this.up('panel'));
						}
					}
				}
			},
			{
				xtype: 'button',
				ui: 'confirm',
				text: 'Like',
				itemId: 'likebtn',
				flex: 1,
				handler : function(){
					var p = this.up('panel');
					p.fireEvent('like', p.model, this);
				}
			},
			{
				xtype: 'button',
				ui: 'action',
				text: 'Dislike',
				itemId: 'dislikebtn',
				flex: 1,
				handler : function(){
					var p = this.up('panel');
					p.fireEvent('dislike', p.model, this);
				}
			},
			{
				xtype: 'button',
				text: 'Comments',
				handler : function(){
					var p = this.up('panel');
					p.fireEvent('viewcomments', p.model);
				}
			}
		]
	},
	setLikeable : function(model){
		if (this.model !== model){
			this.model = model;
			var store = Ext.data.StoreManager.lookup('thumbs.store.LikeableDetail');
			store.remove(store.getRange());
			store.loadRecords([model]);
			this.getComponent('detailview').refresh();
			
			var likebtn = this.getComponent('likebtn'),
				dislikebtn = this.getComponent('dislikebtn');
			likebtn.enable();
			dislikebtn.enable();
			
			if (model.get('likers').indexOf(localStorage['user']) !== -1){
				likebtn.disable();
			}
			if (model.get('dislikers').indexOf(localStorage['user']) !== -1){
				dislikebtn.disable();
			}
		}
	},
	onViewLikes : function(){
		if (!Ext.isDefined(this.likeView)){
			this.likeView = Ext.create('Ext.Panel', {
				floating: true,
				modal: true,
				centered: true,
				width: Ext.Element.getViewportWidth() * 0.9,
				height: Ext.Element.getViewportHeight() * 0.7,
				layout : {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'list',
					store: 'thumbs.store.LikerStore',
					itemTpl: [
						'<div style="display: inline-block; float: left;">{_id}</div>',
						'<div style="display: inline-block; float: right;">{name} ({email})</div>'
					],
					flex: 1
				}]
			});
		}
		var me = this;
		Ext.Ajax.request({
			method: 'GET',
			url: '/user',
			params: {
				q: me.model.get('likers')
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				Ext.data.StoreManager.lookup('thumbs.store.LikerStore').loadData(res);
			}
		});
		this.likeView.show();
	},
	onViewDislikes : function(){
		if (!Ext.isDefined(this.dislikeView)){
			this.dislikeView = Ext.create('Ext.Panel', {
				floating: true,
				modal: true,
				centered: true,
				width: Ext.Element.getViewportWidth() * 0.9,
				height: Ext.Element.getViewportHeight() * 0.7,
				layout : {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'list',
					store: 'thumbs.store.DislikerStore',
					itemTpl: [
						'<div style="display: inline-block; float: left;">{_id}</div>',
						'<div style="display: inline-block; float: right;">{name} ({email})</div>'
					],
					flex: 1
				}]
			});
		}
		var me = this;
		Ext.Ajax.request({
			method: 'GET',
			url: '/user',
			params: {
				q: me.model.get('dislikers')
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				Ext.data.StoreManager.lookup('thumbs.store.DislikerStore').loadData(res);
			}
		});
		this.dislikeView.show();
	}
});
