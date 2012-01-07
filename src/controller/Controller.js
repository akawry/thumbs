Ext.define('thumbs.controller.Controller', {
	extend : 'Ext.app.Controller',
	init: function(){
		this.geo = new Ext.util.GeoLocation({
			autoUpdate : false,
			listeners: {
		        locationupdate: this.onLocationUpdate,
		        locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
		        	/**
		        	 * TODO: Handle this 
		        	 */
		        },
		        scope : this
		    }
		});		
		this.geo.updateLocation();
		
		this.control({
			'panel' : {
				'login' : this.onLogin,
				'fblogin' : this.onFBLogin,
				'post' : this.onPost,
				'register' : this.onRegister,
				'like' : this.onLike,
				'dislike' : this.onDislike,
				'postcomment' : this.onPostComment
			}
		});
	},
	
	onLogin : function(user, pass){
		var me = this;
		Ext.Ajax.request({
			method: 'GET',
			url: '/login',
			params: {
				user: user,
				password: pass
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				if (res.error){
					Ext.Msg.alert("Error", res.error);
				} else {
					localStorage['user'] = user;
					me.getController('ViewController').onViewNear();
				}
			}
		});
	},
	
	onPost : function(name, desc){
		var me = this;
		Ext.Ajax.request({
			method: 'POST',
			url: '/likeables',
			params: {
				lat: this.position.getLatitude(),
				lon: this.position.getLongitude(),
				name: name,
				description: desc,
				author: localStorage['user']
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				if (!res.error){
					var rec = Ext.create('thumbs.model.Likeable', res);
					Ext.data.StoreManager.lookup('thumbs.store.LikeableStore').loadRecords([
						rec
					], true);
					var mapview = Ext.ComponentQuery.query('mapview');
					if (mapview)
						mapview.onInsertMarker(rec);
					me.getController('ViewController').onViewNear();
				}
			}
		});
	},
	
	onLocationUpdate : function(pos){
		console.log(this);
		this.position = pos;
		this.getLikeables();
	},
	
	getLikeables : function(){
		Ext.Ajax.request({
			method: 'GET',
			url: '/likeables',
			params: {
				lat: this.position.getLatitude(),
				lon: this.position.getLongitude()
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				var store = Ext.data.StoreManager.lookup('thumbs.store.LikeableStore');
				store.loadData(res);
				// for now, do this ugly hack
				store.each(function(rec){
					rec.comments().filterOnLoad = false;
					rec.comments().loadData(rec.get('comments'));
				});
			}
		}, this);
	},
	
	onRegister : function(args){
		var me = this;
		Ext.Ajax.request({
			method: 'POST',
			url: '/register',
			params: args,
			success : function(res){
				res = Ext.decode(res.responseText);
				if (res.error){
					Ext.Msg.alert("Error", res.err);
				} else {
					localStorage['user'] = args.user;
					me.getController('ViewController').onViewNear();
				}
			}
		});
	},
	
	onFBLogin : function(res){
		if (res.status === "connected"){
			//localStorage['user'] = res.authResponse.userID;
			FB.api('/me', function(response) {
		       console.log(response);
		       //document.getElementById('user-info').innerHTML = '<img src="https://graph.facebook.com/' + response.id + '/picture">' + response.name;
		    });
			this.getController('ViewController').onViewNear();
		}
	},
	
	onLike : function(model, btn){
		console.log("Gonna like the shit out of ", model, model.getId());
		Ext.Ajax.request({
			method: 'POST',
			url: '/like',
			params: {
				id: model.getId(),
				user: localStorage['user']
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				if (res.error){
					Ext.Msg.alert("Error", res.error);
				} else {
					model.set('likes', model.get('likes') + 1);
					model.get('likers').push(localStorage['user']);
					btn.disable();
				}
			}
		});
	},
	
	onDislike : function(model, btn){
		console.log("Gonna dislike the shit out of", model, model.getId());
		Ext.Ajax.request({
			method: 'POST',
			url: '/dislike',
			params : {
				id: model.getId(),
				user: localStorage['user']
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				if (res.error){
					Ext.Msg.alert("Error", res.error);
				} else {
					model.set('dislikes', model.get('dislikes') + 1);
					model.get('dislikers').push(localStorage['user']);
					btn.disable();
				}
			}
		});
	},
	
	onPostComment : function(id, content){
		console.log("About to post ", content, "by", localStorage['user'], "for likeable with id", id);
		var me = this;
		Ext.Ajax.request({
			method: 'POST',
			url: '/comment',
			params: {
				likeableId : id,
				user: localStorage['user'],
				content: content
			},
			success : function(res){
				res = Ext.decode(res.responseText);
				if (res.error){
					Ext.Msg.alert("Error", res.error);
				} else {
					// TODO: get the time posted from the server !
					Ext.data.StoreManager.lookup('thumbs.store.LikeableStore').getById(id).comments().add({
						author: localStorage['user'],
						content: content,
						posted: new Date()
					});
					me.getController('ViewController').onViewComments();
				}
			}
		});
	}
});
