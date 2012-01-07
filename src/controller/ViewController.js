Ext.define('thumbs.controller.ViewController', {
	extend: 'Ext.app.Controller',
	init : function(){
		this.control({
			'tab' : {
				'viewnear' : this.onViewNear,
				'viewmap' : this.onViewMap,
				'viewpost' : this.onViewPost
			},
			'panel' : {
				'viewlikeable' : this.onViewLikeable,
				'viewregister' : this.onViewRegister,
				'viewpost' : this.onViewPost,
				'viewcomments' : this.onViewComments,
				'viewpostcomment' : this.onViewPostComment
			},
			'button' : {
				'back' : this.onBack
			}
		});
		
		this.stack = [];
	},
	
	onClearStack : function(){
		this.stack = [];
		Ext.Viewport.getComponent('topbar').down('button').hide();
	},
	
	onPushView : function(){
		this.stack.push(Ext.Viewport.getActiveItem());
		if (this.stack.length > 0){
			Ext.Viewport.getComponent('topbar').down('button').show();
		}
	},
	
	onBack : function(){
		var view = this.stack.pop();
		Ext.Viewport.setActiveItem(view);
		if (this.stack.length === 0){
			Ext.Viewport.getComponent('topbar').down('button').hide();
		}
	},
	
	onViewPost : function(bar, tab){
		var view = Ext.Viewport.getComponent('postview') || Ext.create('thumbs.view.PostView');
		Ext.Viewport.setActiveItem(view);
		bar = bar || Ext.Viewport.getComponent('bottombar');
		tab = tab || bar.getComponent('posttab');
		bar.getItems().each(function(i){
			i.setActive(false);
		});
		tab.setActive(true);
		this.onClearStack();
	},
	
	onViewNear : function(bar, tab){
		var view = Ext.Viewport.getComponent('nearview') || Ext.create('thumbs.view.NearView');
		Ext.Viewport.setActiveItem(view);
		bar = bar || Ext.Viewport.getComponent('bottombar');
		tab = tab || bar.getComponent('neartab');
		bar.getItems().each(function(i){
			i.setActive(false);
		});
		tab.setActive(true);
		this.onClearStack();
	},
	
	onViewMap : function(bar, tab){
		var view = Ext.Viewport.getComponent('mapview') || Ext.create('thumbs.view.MapView');
		Ext.Viewport.setActiveItem(view);
		bar = bar || Ext.Viewport.getComponent('bottombar');
		tab = tab || bar.getComponent('maptab');
		bar.getItems().each(function(i){
			i.setActive(false);
		});
		tab.setActive(true);
		this.onClearStack();
	},
	
	onViewLikeable : function(model){
		var view = Ext.Viewport.getComponent('likeableview') || Ext.create('thumbs.view.LikeableView');
		view.setLikeable(model);
		this.onPushView();
		Ext.Viewport.setActiveItem(view);
	},
	
	onViewRegister : function(){
		var view = Ext.Viewport.getComponent('registerview') || Ext.create('thumbs.view.RegisterView');
		this.onPushView();
		Ext.Viewport.setActiveItem(view);
	},
	
		
	onViewComments : function(model){
		console.log("Gonna view the shit out of the comments for", model);
		var view = Ext.Viewport.getComponent('commentview') || Ext.create('thumbs.view.CommentView');
		if (!Ext.isEmpty(model)){
			view.setModel(model);
		}
		this.onPushView();
		Ext.Viewport.setActiveItem(view);
	},
	
	onViewPostComment : function(id){
		var view = Ext.Viewport.getComponent('postcommentview') || Ext.create('thumbs.view.PostCommentView');
		view.setLikeableId(id);
		this.onPushView();
		Ext.Viewport.setActiveItem(view);
	}
});
