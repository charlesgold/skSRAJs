      
      /*
      initiate shopify api integration custom object      
      */

      if((typeof Store) === 'undefined'){
          Store = {};
      }


      /*
        Theme Colors #NOT USED in this Version#
      */
      Store.theme = {
                              'background'   : '#000'
                              ,'border'         : '#9E0FFF'

      };

      /*
      Invoke and initate 
      */
      Store.initiate =  function(callback)  {

          //addButton ID variable
          Store.addButton       = '.add-item-to-cart';
          //Item added text
          Store.itemAddText  =  '[item-title] has been added to your cart.';

          //Cart Total span
          Store.cartTotalId     =   '#cart-total';
          //Cart Count span
          Store.cartCountId     =   '#cart-count';
          //mobile
          Store.cartMobileTotalId   = '#mobile-cart-total';
          Store.cartMobileCountId   = '#mobile-cart-count';

          //Cart count
          Store.cartCount         =   '0';
          //Cart total    
          Store.cartTotal          =    '0';
        
          //** cart discount beta **
          Store.discountEnabled = 0;
          Store.discountIcon    = '<i class="fa fa-star"></i> ';
          Store.discountId    = '#checkout-discount';
          Store.discountRange1  = 10;
          Store.discountRange2  = 20;
        
          Store.discountRange1Percent = 10;
          Store.discountRange2Percent = 15;        
        
          Store.discountOne   = 'U1BFTkQxMFNBVkUxMA==';
          Store.discountTwo   = 'TU9WSUVHT0QxNQ==';
        
          Store.discountCopy1   = 'SWYgeW91ciBvcmRlciBpcyAkW2Rpc2NvdW50LXJhbmdlXSBvciBtb3JlLCB3ZSB3aWxsIGdpdmUgeW91IGEgPHN0cm9uZz5EaXNjb3VudCBDb2RlPC9zdHJvbmc+IGZvciA8c3Ryb25nPltkaXNjb3VudC1wZXJjZW50XSVPRkY8L3N0cm9uZz4geW91ciBwdXJjaGFzZSE=';
          Store.discountCopy2   = 'V293ISBMb29rcyBsaWtlIHlvdXIgb3JkZXIgaXMgZ2V0dGluZyBjbG9zZSB0byAkW2Rpc2NvdW50LXJhbmdlXS4gSWYgeW91ciBvcmRlciBpcyAkW2Rpc2NvdW50LXJhbmdlXSBvciBtb3JlIHdlIHdpbGwgPHN0cm9uZz51cGdyYWRlPC9zdHJvbmc+IHlvdXIgPHN0cm9uZz5EaXNjb3VudCBDb2RlPC9zdHJvbmc+IHRvIGJlIHdvcnRoIDxzdHJvbmc+W2Rpc2NvdW50LXBlcmNlbnRdJU9GRjwvc3Ryb25nPiB5b3VyIHB1cmNoYXNlIQ==';
        
          Store.discountReached1  = 'QXdlc29tZSEgVXNlIERpc2NvdW50IENvZGU6IDxzdHJvbmc+W2Rpc2NvdW50LWNvZGVdPC9zdHJvbmc+IGF0IGNoZWNrb3V0IHRvIHNhdmUgW2Rpc2NvdW50LXBlcmNlbnRdJSBvbiB5b3VyIG9yZGVyLg==';
          Store.discountReached2  = 'TW92aWUgR29kISBTaW5jZSB5b3VyIG9yZGVyIGlzICRbZGlzY291bnQtcmFuZ2VdIG9yIG1vcmUsIHlvdSBjYW4gdXNlIHRoaXMgRGlzY291bnQgQ29kZTogPHN0cm9uZz5bZGlzY291bnQtY29kZV08L3N0cm9uZz4gdG8gc2F2ZSBbZGlzY291bnQtcGVyY2VudF0lIG9uIHlvdXIgb3JkZXIgYXQgY2hlY2tvdXQh';
        
        //Store.start_watch();
        callback();

      };


      /*
        uses JQuery to wait for events on store, to invoke Shopify object.
      */
      Store.start_watch = function(){
          //console.log(Store.theme.background);
          $(document).ready(function(){
              //Handle the "Buy" button being clicked
              $(Store.addButton).on('click',function(){
                var prodId  = $('#variant_id').val();
                  Shopify.addItem(prodId,1);
              });
            
            $('.tile-add-product').on('click', function(){
              var prodId  = $(this).attr('data-variant-id');
                  
                Shopify.addItem(prodId,1);
            });
            
             Shopify.onItemAdded = function(line_item) {                  
                  Store.cartNotify(line_item);

                  //get the cart, and update the nav and other vars
                  Shopify.getCart(Store.updateCartVisual);
             }
          });

      }     

      /*
        create notify div and show it.
      */
      Store.cartNotify  =   function(line_item) {

          if(!$('.store-notify').length){
            console.log('required bootstrap modal');
          }  else {
            //console.log(line_item);

            $('.store-notify .modal-body p').html(Store.itemAddText.replace('[item-title]',line_item.title));
            $('.store-notify').modal('show');
          }

      }

      /*
        update visuals associated with cart
        */
      Store.updateCartVisual  = function(cart) {
          Store.cartTotal   =   Shopify.formatMoney(cart.total_price);
          Store.cartCount   =   cart.item_count;

          //update elements
          $(Store.cartTotalId).html(Store.cartTotal);
          $(Store.cartCountId).html(Store.cartCount);
          $(Store.cartMobileCountId).html(Store.cartCount);
          $(Store.cartMobileTotalId).html(Store.cartTotal);

          //**Discount Beta **
          if(Store.discountEnabled == 1){
	          var discountMsg = Store.discounts(cart);
	          $(Store.discountId).html(Store.discountIcon + discountMsg);
	          $(Store.discountId).show();
      	  }
      }
      
      
      Store.discounts = function(cart){
          var currentCartTotal = (cart.total_price/100);
          var discountMsg = '';

          switch(true){
            
              //get range2 code
            case (currentCartTotal >= Store.discountRange2):
              var reached = Store.dcode(Store.discountReached2);
              reached = reached.replace(/\[discount-range\]/g,Store.discountRange2);              
              reached = reached.replace(/\[discount-code\]/g,Store.dcode(Store.discountTwo));
              reached   = reached.replace(/\[discount-percent\]/g,Store.discountRange2Percent);
              console.log(reached);
              
              discountMsg = reached;
              
              break;
              
              //display message about reaching range1
            case (currentCartTotal < Store.discountRange1):
              var encourage = Store.dcode(Store.discountCopy1);
              encourage = encourage.replace(/\[discount-range\]/g,Store.discountRange1);
              encourage = encourage.replace(/\[discount-percent\]/g,Store.discountRange1Percent);
              console.log(encourage);
              
              discountMsg = encourage;
              
              break;
              
              //display message about reaching range2
            case (currentCartTotal < Store.discountRange2 && currentCartTotal > Store.discountRange1):
              var reached = Store.dcode(Store.discountReached1);
              reached = reached.replace(/\[discount-code\]/g,Store.dcode(Store.discountOne));
              reached   = reached.replace(/\[discount-percent\]/g,Store.discountRange1Percent);
              console.log(reached);
              
              var encourage = Store.dcode(Store.discountCopy2);
              encourage = encourage.replace(/\[discount-range\]/g,Store.discountRange2);
              encourage = encourage.replace(/\[discount-percent\]/g,Store.discountRange2Percent);
              console.log(encourage);
                            
              discountMsg = reached + '<br/><br/> <i class="fa fa-info-circle"></i> ' + encourage;
              
              break;
              
            default:
              //console.log(currentCartTotal);
              discountMsg = '';
              break;
          }          
        
          return discountMsg;
      }
      Store.dcode =  function(raw){
        var dc = atob(raw);
        return dc;
      }

      /* Invoke object */
      Store.initiate(Store.start_watch);