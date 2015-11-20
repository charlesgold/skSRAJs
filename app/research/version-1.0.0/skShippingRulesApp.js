/***
* Plugin for shopify stores. Capture customer location by zip code(US)
* Compare customer provided zip code to exclude list. If customer
* zip code is not on list, then allow customer to checkout. If true
* notify customer of restriction.
* @author Charlie Topjian [charlietopjian@gmail.com]
* @version 1.0.0
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
	version: "1.0.0",
	initiate: function() {
		//callback in params if necessary
		//
		//Set styles to head or to elements
		//Create elements (if page specified)
		//Is shipping rules enabled?

		this.curtainClass		=	'skSRA-curtain';
		this.notificationClass	=	'skSRA-notify';
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
	    this.notificationCurtainDiv.tabIndex = -1;
	    //notification
	    var notificationDiv = document.createElement('div');
	    notificationDiv.id = 'skSRA-main';
	    notificationDiv.className = 'skSRA-notify';
	    document.body.appendChild(notificationDiv);
	    this.notificationDiv = document.getElementById('skSRA-main');
	    this.notificationDiv.style.display = "none";

	}
	,createCloseBtn: function(){
	    //create close button
	    this.notificationClose	=	document.createElement('button');
	    this.notificationClose.className =	'notification-button';
	    this.notificationClose.id 		=	'skSRA-okButton';
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
				_this.settings.hideNotify();
          });                  
      });		
	},
	searchDb: function(searchData) {
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
		} else {
			//sorry can't checkout msg
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

		this.notificationDiv.innerHTML = '';

		this.notificationCurtainDiv.style.display = "block";
		this.notificationDiv.innerHTML = message;
		this.notificationDiv.style.display = "block";

		//close btn
		this.createCloseBtn();
		this.notificationDiv.appendChild(this.notificationClose);
		this.notificationCloseBtn = document.getElementById('skSRA-okButton');
		this.notificationCloseBtn.innerHTML = this.settings.okButtonTxt;
	}
	,hideNotify: function(){
		this.notificationCurtainDiv.style.display = "none";
		this.notificationDiv.style.display = "none";
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
skShippingRulesApp.settings.message		= 'We do not ship to { zip } currently.<br/>{ okButton }';
skShippingRulesApp.settings.db 			= [
											'76227'
											,'90210'
											,'92660'
];
skShippingRulesApp.settings.themeCss	= '.skSRA-curtain{position:absolute;top:0;right:0;left:0;background:rgba(0,0,0,0.7);z-index:10001;pointer-events:none;width:100%;height:100%;display:none;overflow:hidden;overflow-y:scroll;pointer-events:none}.skSRA-notify{padding:10px;border-radius:5px;background:#000;color:#FFF;display:none;position:absolute;margin:50px auto 30px auto;width:100%;max-width:610px;max-height:300px;top:0;bottom:0;left:0;right:0;z-index:10002;box-shadow:0 5px 15px rgba(0,0,0,0.5)}@media only screen and (min-width: 0px) and (max-width: 610px){.skSRA-notify{max-width:350px;margin-top:30px}}.skSRA-notify p{color:#FFF;text-align:left;font-size:1.5em}.notification-button{background:#0c416d;border:0;color:#FFF;font-size:1.5em;padding:10px 15px}.notification-button:hover{background:#b6c6d3}';
skShippingRulesApp.initiate();
//Tests
console.log(skShippingRulesApp.searchDb('96227'));
console.log(skShippingRulesApp.searchDb('92660'));
