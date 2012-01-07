Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false,
	paths : {
		'thumbs' : '.'
	}
});

Ext.application({
	appFolder: '.',
	name: 'thumbs',
	controllers : ['thumbs.controller.ViewController', 'thumbs.controller.Controller'],
	stores: ['LikeableStore', 'UserStore'],
	models: ['Likeable', 'Comment'],
	launch : function(){	
		console.log("Launching ... ");
		Ext.Viewport.add({
			xtype: 'navigationbar',
			docked: 'top',
			itemId: 'topbar',
			title: 'Thumbs',
			items: [{
				xtype: 'button',
				text: 'Back',
				hidden: true,
				handler : function(){
					this.fireEvent('back');
				}
			}]
		});
	
		var fn = function(){
			console.log(this.up('tabbar'));
			this.fireEvent(this.evt, this.up('tabbar'), this);
		};
	
		Ext.Viewport.add({
			itemId: 'bottombar',
			xtype: 'tabbar',
			docked: 'bottom',
			defaults : {
				ui: 'plain',
				iconMask: true
			},
			items : [
				{
					iconCls: 'locate',
					title: 'Near Me',
					evt : 'viewnear',
					itemId: 'neartab',
					handler : fn
				}, 
				{
					iconCls: 'maps',
					title: 'View Map',
					evt: 'viewmap',
					itemId: 'maptab',
					handler : fn
				},
				{
					iconCls: 'compose',
					title: 'Post',
					evt: 'viewpost',
					itemId: 'posttab',
					handler : fn
				}
			]
		});
		
		var user = localStorage['user'];
		if (!Ext.isDefined(user)){
			var loginView = Ext.create('thumbs.view.LoginView');
			Ext.Viewport.setActiveItem(loginView);
		} else {
			var bar = Ext.Viewport.getComponent('bottombar');
			fn.call(bar.down('tab')); //switch to near view 
		}
	}
});
