Ext.define('thumbs.view.PostView', {
	extend: 'Ext.Panel',
	config: {
		itemId: 'postview',
		items: [
			{
				xtype: 'fieldset',
				title: 'Post',
				items: [
					{
						xtype: 'textfield',
						label: 'What?',
						itemId: 'namefield'
					}, {
						xtype: 'textareafield',
						label: 'Describe: ',
						itemId: 'describefield'
					}
				]
			}, {
				xtype : 'button',
				text: 'Post',
				listeners : {
					tap : function(){
						var p = this.up('panel'),
							set = p.down('fieldset'),
							name = set.getComponent('namefield'),
							desc = set.getComponent('describefield');
						p.fireEvent('post', name.getValue(), desc.getValue());
						name.setValue('');
						desc.setValue('');
					}
				}
			}
		]
	}
});
