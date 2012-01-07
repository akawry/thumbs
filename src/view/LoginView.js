Ext.define('thumbs.view.LoginView', {
	extend: 'Ext.Panel',
	config : {
		items: [
			{
				xtype: 'fieldset',
				title: 'Login',
				items: [{
					xtype: 'textfield',
					itemId: 'userfield',
					label: 'User: '
				}, {
					xtype: 'passwordfield',
					itemId: 'passwordfield',
					label: 'Pass: '
				}]
			}, {
				xtype : 'button',
				text: 'Login',
				handler : function(){
					var p = this.up('panel'),
						set = p.down('fieldset'),
						user = set.getComponent('userfield'),
						pass = set.getComponent('passwordfield');
					p.fireEvent('login', user.getValue(), pass.getValue());
					user.setValue('');
					pass.setValue('');
				}
			}, {
				xtype: 'button',
				text: 'Login with Facebook',
				handler : function(){
					var me = this;
					FB.login(function(response) { 
						me.up('panel').fireEvent('fblogin', response);
					}, {
						scope:'email'
					});
				}
			}
		],
		html: 'Not registered yet? Click <a href="#" id="reglink">here</a>'
	},
	initialize : function(){
		var me = this;
		this.on('painted', function(){
			Ext.get('reglink').on('click', function(){
				me.fireEvent('viewregister');
			});
		});
		this.callParent();
	}
});
