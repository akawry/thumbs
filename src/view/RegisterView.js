Ext.define('thumbs.view.RegisterView', {
	extend: 'Ext.Panel',
	config : {
		itemId: 'registerview',
		items: [{
			xtype: 'fieldset',
			title: 'Register',
			items: [
				{
					xtype: 'textfield',
					itemId: 'userfield',
					label: 'User: '
				},
				{
					xtype: 'textfield',
					itemId: 'namefield',
					label: 'Name: '
				},
				{
					xtype: 'textfield',
					itemId: 'emailfield',
					label: 'Email: '
				},
				{
					xtype: 'passwordfield',
					itemId: 'passwordfield',
					label: 'Pass: '
				},
				{
					xtype: 'passwordfield',
					itemId: 'confirmfield',
					label: 'Confirm'
				}
			]
		}, {
			xtype: 'button',
			text: 'Register',
			handler : function(){
				var panel = this.up('panel'),
					set = panel.down('fieldset'),
					user = set.getComponent('userfield'),
					pass = set.getComponent('passwordfield'),
					confirm = set.getComponent('confirmfield'),
					name = set.getComponent('namefield'),
					email = set.getComponent('emailfield');
				if (user.length === 0){
					Ext.Msg.alert("Error", "Username is required.");
				} else if (pass.length === 0){
					Ext.Msg.alert("Error", "Password is required.");
				} else if (confirm.length === 0){
					Ext.Msg.alert("Error", "Please confirm your password.");
				} else if (pass.getValue() !== confirm.getValue()){
					Ext.Msg.alert("Error", "Passwords do not match.");
					pass.setValue('');
					confirm.setValue('');
				} else {
					panel.fireEvent('register', {
						user: user.getValue(),
						pass: pass.getValue(),
						email: email.getValue(),
						name: name.getValue()
					});
					user.setValue('');
					pass.setValue('');
					confirm.setValue('');
					email.setValue('');
					name.setValue('');
				}
			}
		}]
	}
});
