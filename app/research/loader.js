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
	version: 1,
	initiate: function() {
		//callback in params if necessary
		//
		//Set styles to head or to elements
		//Create elements (if page specified)
		//Is shipping rules enabled?


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
	}
};
skShippingRulesApp.settings = {};

skShippingRulesApp.settings.db = [
	'76227'
	,'90210'
	,'92660'
];

console.log(skShippingRulesApp.searchDb('96227'));
console.log(skShippingRulesApp.searchDb('92660'));
