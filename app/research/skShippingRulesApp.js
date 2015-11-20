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

		//start watch
		this.runApp();

	},
	setup: function(){
	    var notificationDiv = document.createElement('div');
	    notificationDiv.id = 'skSRA-main';
	    notificationDiv.className = 'skSRA-notify';
	    document.body.appendChild(notificationDiv);
	    this.notificationDiv = document.getElementById('skSRA-main');
	    this.notificationDiv.style.display = "none";	
	    //apply styles
	    this.applyDefaultStyling();
	},
	runApp: function() {
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
      });		
	},
	excludeDb: [
				'76227'
				,'90210'
				,'92660'
	],
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
	,displayNotify: function(message){		
		var m = document.createElement('P');
		var t = document.createTextNode(message);
		m.appendChild(t); //set message to m node
		this.notificationDiv.appendChild(m);
		this.notificationDiv.style.display = "block";
	},
    applyDefaultStyling: function() {
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
skShippingRulesApp.settings.zipField 	= '.skSRA-zipField';
skShippingRulesApp.settings.zipBtn 		= '.skSRA-zipBtn';
skShippingRulesApp.settings.message		= 'We do not ship to { zip } currently.';
skShippingRulesApp.settings.db 			= [
											'76227'
											,'90210'
											,'92660'
];
skShippingRulesApp.settings.themeCss	= '{{ themeCss }}';
skShippingRulesApp.initiate();
//Tests
console.log(skShippingRulesApp.searchDb('96227'));
console.log(skShippingRulesApp.searchDb('92660'));
