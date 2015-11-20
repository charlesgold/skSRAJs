/***
* Plugin for shopify stores. Capture customer location by zip code(US)
* Compare customer provided zip code to exclude list. If customer
* zip code is not on list, then allow customer to checkout. If true
* notify customer of restriction.
* @author Charlie Topjian [charlietopjian@gmail.com]
* @version 1.1.0
* @license
* Copyright (c) 2015 Charlie Topjian
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
var skShippingRulesApp = {
	version: "1.1.0",
	initiate: function() {
		//callback in params if necessary
		//
		//Set styles to head or to elements
		//Create elements (if page specified)
		//Is shipping rules enabled?

		this.curtainClass		=	'skSRA-curtain';
		this.notificationClass	=	'skSRA-notify';
		this.notificationBtnClass = 'notification-button';
		//kill checkout btn
		this.disableCheckoutBtn(this.settings.chkOutClass);
		//start watch
		this.runApp();

	},
	setup: function(){
		this.setupElements();
	    //apply styles
	    this.applyDefaultStyling();
	    
	}
	,setupElements: function(){
		//curtain
	    var notificationCurtainDiv = document.createElement('div');
	    notificationCurtainDiv.className  = 'skSRA-curtain';
	    document.body.appendChild(notificationCurtainDiv);
	    this.notificationCurtainDiv = document.getElementsByClassName('skSRA-curtain')[0];
	    //this.notificationCurtainDiv.tabIndex = -1;
	    //notification
	    var notificationDiv = document.createElement('div');
	    notificationDiv.id = 'skSRA-main';
	    notificationDiv.className = 'skSRA-notify';
	    //document.body.appendChild(notificationDiv);
	    this.notificationCurtainDiv.appendChild(notificationDiv);
	    this.notificationDiv = document.getElementById('skSRA-main');
	    this.notificationDiv.style.display = "none";
	    //setup message div
	    var notificationMessageDiv = document.createElement('div');
	    notificationMessageDiv.id = 'skSRA-notify-message-id';
	    notificationMessageDiv.className = 'skSRA-notify-message';
	    this.notificationDiv.appendChild(notificationMessageDiv);
	    this.notificationMessageDiv = document.getElementById('skSRA-notify-message-id');
	    //setup message controls div
	    var notificationControlsDiv = document.createElement('div');
	    notificationControlsDiv.id = 'skSRA-notify-controls-id';
	    notificationControlsDiv.className = 'skSRA-notify-controls';
	    this.notificationDiv.appendChild(notificationControlsDiv);	
	    this.notificationControlsDiv = document.getElementById('skSRA-notify-controls-id');
	    //create close button
	    var notificationCloseBtn	=	document.createElement('BUTTON');
	    notificationCloseBtn.className =	'notification-button';
	    notificationCloseBtn.id 		=	'skSRA-okButton';
	    this.notificationControlsDiv.appendChild(notificationCloseBtn);
	    this.notificationCloseBtn = document.getElementById('skSRA-okButton');    
	    this.notificationCloseBtn.innerHTML = this.settings.okButtonTxt;   
	}
	,runApp: function() {
		var _this = this;
		this.setup();
      $(document).ready(function(){
          //Handle the "Buy" button being clicked
          $(_this.settings.zipBtn).on('click',function(){
				//validate field
		  		var isValidValue = _this.validateField(_this.settings.zipField);
		  		if(isValidValue != false){
		  			//check against excludes
		  			_this.verifyRule(isValidValue);
		  		} else {
		  			//tell customer to enter valid info
		  		}
          });
          //Bind onChange
          $(_this.settings.zipField).bind('change keyup',function(){
				//validate field
		  		var isValidValue = _this.validateField(_this.settings.zipField);
		  		if(isValidValue != false){
		  			//check against excludes
		  			_this.verifyRule(isValidValue);
		  		} else {
		  			//tell customer to enter valid info
		  		}
          });
          //handle close notification
          $('.'+_this.curtainClass).on('click',function(){
				_this.hideNotify();
          });
          //close btn
          $('.'+_this.notificationBtnClass).on('click',function(){
				_this.hideNotify();
          });                             
      });		
	},
	searchDb: function(searchData) {
		this.focusSearch = searchData;
		var result = this.settings.db.indexOf(searchData);
		if(result != -1){
			return true; //found
		} else {
			return false; //not in dbase
		}
	},
	verifyRule: function(data){
		//* @param data field object
		if(!this.searchDb(data)){
			//show checkout, continue checkout
			this.hideNotify();
			this.enableCheckoutBtn(this.settings.chkOutClass);
		} else {
			//sorry can't checkout msg
			this.disableCheckoutBtn(this.settings.chkOutClass);
			this.displayNotify(this.settings.message);
		}
	},
	validateField: function(field){
		//check field for len & numbers only.
		var reg = new RegExp('^[0-9]+$');
		if($(field).val().length < 5 || $(field).val().length > 5 || reg.test($(field).val()) == false){
			return false;
		} else {
			return $(field).val();
		}
	}
	,disableCheckoutBtn: function(chkOutClass){
		var c = document.getElementsByClassName(chkOutClass)[0];
		//c.setAttribute('disabled','disabled'); //disable button
		c.disabled = true;
	}
	,enableCheckoutBtn: function(chkOutClass){
		var c = document.getElementsByClassName(chkOutClass)[0];
		c.disabled = false;
	}
	,repurposeCheckoutBtn: function(chkOutClass){
		var c = document.getElementsByClassName(chkOutClass)[0];
		//repurpose
		c.type = 'button';
	}
	,displayNotify: function(message){		
		var m = document.createElement('P');
		var t = document.createTextNode(message);

		this.notificationMessageDiv.innerHTML = '';

		this.notificationCurtainDiv.style.display = "block";
		var nM = this.generateMessage(message);
		this.notificationMessageDiv.innerHTML = nM;
		this.notificationDiv.style.display = "block";
	}
	,hideNotify: function(){
		this.notificationCurtainDiv.style.display = "none";
		this.notificationDiv.style.display = "none";
	}
	,generateMessage: function(message){
		var message = message.replace('{ zip }', this.focusSearch);
		return message;
	}
    ,applyDefaultStyling: function() {
        var myNav = navigator.userAgent.toLowerCase();
        if (myNav.indexOf('msie') != -1 && parseInt(myNav.split('msie')[1]) == 8) {
            var cssElement = document.createElement('link');
            cssElement.type = 'text/css';
            cssElement.rel = 'stylesheet';
            cssElement.href = this.settings.appAssetUrl + 'default-ie8-theme.css';
        } else {
            var cssElement = document.createElement('style');
            cssElement.innerHTML = this.settings.themeCss;
        }
        document.getElementsByTagName('head')[0].appendChild(cssElement);
    }	
};
//*Set on Server End
skShippingRulesApp.settings  			= {};
skShippingRulesApp.settings.appAssetUrl = 'css/';
skShippingRulesApp.settings.verifyBind	= 'change'; //change, click, enter
skShippingRulesApp.settings.zipField 	= '.skSRA-zipField';
skShippingRulesApp.settings.zipBtn 		= '.skSRA-zipBtn';
skShippingRulesApp.settings.chkOutClass = 'check_out';
skShippingRulesApp.settings.okButtonTxt = 'Close';
skShippingRulesApp.settings.message		= 'Sorry! We do not ship to { zip }. We are unable to place your Order.';
skShippingRulesApp.settings.db 			= [
											'76227'
											,'90210'
											,'92660'
];
skShippingRulesApp.settings.themeCss	= '.skSRA-curtain{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.7);z-index:10001;cursor:pointer;display:none;margin:0;padding:0}.skSRA-notify{position:absolute;padding:10px;border-radius:5px;background:#000;color:#FFF;display:none;min-width:250px;min-height:200px;max-width:610px;max-height:200px;top:50%;left:50%;transform:translate(-50%, -50%);box-shadow:0 5px 15px rgba(0,0,0,0.5);overflow:hidden}@media only screen and (min-width: 0px) and (max-width: 610px){.skSRA-notify{max-width:350px;margin-top:30px}}.skSRA-notify-message{padding:50px 20px 10px 20px;margin-bottom:15px;color:#FFF;text-align:left;font-size:1.2em;text-align:center;word-wrap:break-word}.skSRA-notify-controls{margin:auto}.notification-button{background:#0c416d;border:0;color:#FFF;font-size:1.5em;padding:10px 15px;cursor:pointer;margin:0 auto;width:100px;display:block}.notification-button:hover{background:#b6c6d3}.skSRA-form-field{display:block;width:100%;height:43px;padding:10px 15px;font-size:15px;line-height:1.42857143;color:#464545;background-color:#fff;background-image:none;border:1px solid #EFAA05;border-radius:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s}';
skShippingRulesApp.initiate();
//Tests
console.log(skShippingRulesApp.searchDb('96227'));
console.log(skShippingRulesApp.searchDb('92660'));
