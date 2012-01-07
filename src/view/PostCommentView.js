Ext.define('thumbs.view.PostCommentView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'postcommentview',
		items : [{
			xtype: 'fieldset',
			title: 'Post a Comment',
			items: [{
				xtype: 'textareafield',
				itemId: 'contentfield'
			}]
		}, {
			xtype: 'button',
			text: 'Post',
			handler : function(){
				var p = this.up('panel'),
					set = p.down('fieldset'),
					content = set.getComponent('contentfield');
				p.fireEvent('postcomment', p.likeableId, content.getValue());
				content.setValue('');
			}
		}]
	},
	
	setLikeableId : function(id){
		this.likeableId = id;
	}
});
