import M from 'materialize-css';

export let cart = [];

export  const updateCartView = (cart) => {
  let cartItems = document.querySelector('#cart-items .collection');
  cartItems.innerHTML = '';     

  let cartContent = cart.map((ele,i)=> {
      return `
         <li class="collection-item avatar" key=${i}>
              <img src="${ele.image}" alt="" class="circle">
              <span class="title">${ele.name}</span>
              <p>Price: &#8377; ${ele.quantity*ele.price}</p>
              <p>Quantity: ${ele.quantity} </p>
              <div class="d-inline">
                  <a class="btn-floating btn-small red darken-2" title="Remove current all items" data-name="${ele.name}"><i class="material-icons">delete</i></a>
                  <a class="btn-floating btn-small red darken-2" title="Decrease item quantity" data-name="${ele.name}"><i class="material-icons">exposure_neg_1</i></a>
                  <a class="btn-floating btn-small red darken-2" title="Increase item quantity" data-price="${ele.price}" data-name="${ele.name}"><i class="material-icons">exposure_plus_1</i></a>
              </div>
         </li>
      `;
  });

  // cartContent = cartContent.join('');   

  cartItems.innerHTML =  cartContent.join('');
  document.querySelector('.t_cost').innerHTML = getTotalCost();
  document.querySelector('.cart_count').innerHTML = getCartItemsCount();
  // if(document.querySelectorAll('table.highlight tbody tr').length === 0)  document.querySelector('#cart-items').innerHTML = '<p class="center">No items in cart</p>';      
};

export const itemAlert = (item, isAdded) => {
  if(isAdded) M.toast({html: `${item} added to cart`, displayLength: '1500'});      
};

export const addToCart = (name, price, image) => {
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
        image,
        quantity: 1
     };
    
     if(Array.from(document.querySelector('#btn_checkout').classList).includes('disabled')){
      document.querySelector('#btn_checkout').classList.remove('disabled');
     }
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
    if(document.querySelector('#c_count')) document.querySelector('#c_count').textContent = '0';
   };

   export  const getCartItemsCount = () => {
     let totalCount = 0;
     cart.map((ele)=>{
       totalCount += ele.quantity;
     }); 
     if(totalCount === 0) {
       document.querySelector('#btn_checkout').classList.add('disabled'); 
       document.querySelector('.collection').innerHTML = '<p class="center">No items in cart</p>';
     }
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
