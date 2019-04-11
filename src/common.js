import M from 'materialize-css';

export let cart = [];

export  const updateCartView = (cart) => {
  let cartItems = document.querySelector('#cart-items');
  cartItems.innerHTML = '';     

  let cartContent = cart.map((ele,i)=> {
      return `
         <tr key=${i}>
             <td>${ele.name}</td>
             <td>&#8377; ${ele.price}</td>
             <td>${ele.quantity}</td>
             <td>&#8377; ${ele.quantity*ele.price}</td>
             <td><a class="btn-floating btn-small red darken-2" title="Remove current all items"><i class="material-icons">delete</i></a></td>
             <td><a class="btn-floating btn-small red darken-2" title="Decrease item quantity"><i class="material-icons">exposure_neg_1</i></a></td>
             <td><a class="btn-floating btn-small red darken-2" title="Increase item quantity"><i class="material-icons">exposure_plus_1</i></a></td>
         </tr>
      `;
  });

  cartContent = cartContent.join('');
 
  let cartContentHolder = `
  <table class="highlight responsive-table">
      <thead>
        <tr>
            <th>Item Name</th>
            <th>Item Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th><a class="btn-floating btn-small red darken-2" title="Clear entire cart"><i class="material-icons">clear</i></a></th>
        </tr>
      </thead>
      <tbody>
          ${cartContent}
      </tbody>
   </table>
   <div><strong>Total:</strong> &#8377; ${getTotalCost()}</div>
   <div><button class="btn" id="btn_checkout">Checkout</button></div>
   `;
   

  cartItems.innerHTML = cartContentHolder;
  document.querySelector('.cart_count').innerHTML = getCartItemsCount();
  if(document.querySelectorAll('.responsive-table tbody tr').length === 0)  document.querySelector('#cart-items').innerHTML = '<p class="center">No items in cart</p>';      
};

export const itemAlert = (item, isAdded) => {
  if(isAdded) M.toast({html: `${item} added to cart`, displayLength: '1500'});      
};

export const addToCart = (name, price) => {
    for(let i in cart) {
      if(cart[i].name === name) {
         cart[i].quantity = cart[i].quantity+1;
         updateCartView(cart);
         getCurrentItemCout(cart[i].name);
         return;
      }
    }

     let cartItem = {
        name,
        price,
        quantity: 1
     };

     cart.push(cartItem);
     updateCartView(cart);
     getCurrentItemCout(cartItem.name);
     itemAlert(name, true);
   };

   export const clearAllFromCart = () => cart.length=0;

   export const removeSingleItemFromCart = (name) => {
     for(let i in cart) {
       if(cart[i].name === name){
         cart[i].quantity = cart[i].quantity-1;
         updateCartView(cart);
         if(cart[i].quantity === 0){
           cart.splice(i,1);
           document.querySelector('#c_count').textContent = '0';
           updateCartView(cart);
           break;
         }
       }
     }
     getCurrentItemCout(name);
   };

   export const removeItemAllFromCart = (name) => {
     for(let i in cart){
       if(cart[i].name === name){
         cart.splice(i,1);
         updateCartView(cart);
         break;
       }
     }
     document.querySelector('#c_count').textContent = '0';
   };

   export  const getCartItemsCount = () =>{
     let totalCount = 0;
     cart.map((ele)=>{
       totalCount += ele.quantity;
     });  
     return totalCount;
   };

   export const getCurrentItemCout = (name) => {
     if(cart !== undefined) {
       for(let i in cart){
         if(cart[i].name === name && document.querySelector('#c_count')){
           document.querySelector('#c_count').textContent = cart[i].quantity;
         } else if(cart[i].name !== name &&  document.querySelector('#c_count')){
           document.querySelector('#c_count').textContent = '0';
         }
       }
     }
   };
   

   export const getTotalCost = () => {
     let totalCost = 0;
     cart.map((ele)=>{
       totalCost += ele.quantity*ele.price;
     });  
     return totalCost;
   };
