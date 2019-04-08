import "babel-polyfill";
import './style.css';
// import M from 'materialize-css';

window.addEventListener('load', ()=>{
    foodApp.fetchFood("http://temp.dash.zeta.in/food.php");    
});


let foodApp = (()=> {    
  "use strict";
    
    let cart = [];
    let cartItemsIsVisible = false;

    let fetchFood = async (url) => {
        let response = await fetch(url).catch(err=>console.log(err));
        let foodData = await response.json();
        
         let recipeGrid = foodData.recipes.map((item, index)=>{
                return `
                <div class="col s12 m6">
                <div class="card hoverable">
                  <div class="card-image">
                    <img src=${item.image}>
                  </div>
                  <div class="card-action">
                    <div style="width: 50%" class="item_detail"> 
                        <p class="" title=${item.name}>${item.name}</p>
                        <p class="">&#8377; ${item.price}</p>                       
                    </div>
                    <div class="item_btn">
                        <button class="btn btn_add_cart" data-name="${item.name}" data-image=${item.image} data-price=${item.price} data-category=${item.category} data-rating=${item.rating} data-detail="${item.details}" data-review=${item.reviews}>ADD TO BAG</button>
                    </div>
                  </div>
                </div>
              </div>`;
         });

         document.getElementById('recipes_card').innerHTML = recipeGrid.join('');

         let favourites = foodData.recipes.filter(item => item.isFavourite);

         let favouriteGrid = favourites.map((item, index)=>{
            return `
            <div class="col m6 card_content">
            <div class="card hoverable">
              <div class="card-image">
                <img src=${item.image}>
              </div>
              <div class="card-action">
                <div style="width: 50%" class="item_detail"> 
                    <p class="truncate" title="${item.name}">${item.name}</p>
                    <p class="">&#8377; ${item.price}</p>
                </div>
                <div class="item_btn">
                   <button class='btn btn_add_cart' data-name="${item.name}" data-image=${item.image} data-price=${item.price} data-category=${item.category} data-rating=${item.rating} data-detail="${item.details}" data-review=${item.reviews}>ADD TO BAG</button>
                </div>
              </div>
            </div>
          </div>`;
     });

     document.getElementById('favourite_holder').innerHTML = favouriteGrid.join('');     

    };

    document.querySelector('#recipes_card').addEventListener('click', (e)=>{
        renderDetailView(e);
    });

    document.querySelector('#favourite_holder').addEventListener('click', (e)=>{
        renderDetailView(e);
    });


    const renderDetailView = (e) => {
        
        if(e.target.nodeName === 'IMG') {              
              
              let {name, category, detail, price, rating, review} = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset
 
             document.querySelector('#food_detail_container').style.display = 'block';
             document.querySelector('#food_item_container').style.display = 'none';
 
             document.querySelector('#food_detail_container .container').innerHTML = `
             
             <div class="col m6 card_content">
             <div class="card">
               <div class="card-image">
                 <img src=${e.target.src}>
               </div>
               <div class="card-action">
                 <div style="width: 50%; margin-bottom: 50px" class="item_detail"> 
                     <p class="truncate">${name}</p>
                     <p class="">&#8377; ${price}</p>
                 </div>
                 <div class="item_btn">
                     <button class='btn btn_counter' data-name="${name}" data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>+</button>
                      <p id="c_count" class="d-inline">0</p>
                     <button class='btn btn_counter' data-name="${name}" data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>-</button>
                 </div>
                 <div style="margin-top: 50px">
                  <p style="width: 50%" >Category: ${category}</p>
                  <p>Rating: ${rating}<i class="material-icons rating">star</i> (${review} Reviews)</p>
                 </div>
                 <h6>DETAILS</h6> 
                 <p>${detail}</p>
               </div>
             </div>
           </div>`;          

          }
    };

    document.querySelector('.brand-logo').addEventListener('click',()=>{
      document.querySelector('#food_detail_container').style.display = 'none';
      document.querySelector('#food_item_container').style.display = 'block';
    })

    
    document.querySelector('#recipes_card').addEventListener('click',  (e)=> {
      cartBtn(e);
    });

    document.querySelector('#food_detail_container').addEventListener('click',  (e)=> {
      cartBtn(e);
    });

    document.querySelector('#favourite_holder').addEventListener('click',  (e)=> {
      cartBtn(e);
    });



   const cartBtn = (e) => {
      if(e.target.nodeName === 'BUTTON'){
        let {name, price} = e.target.dataset;      
        addToCart(name, price);
      }
   };

    const addToCart = (name, price) => {
     for(let i in cart) {
       if(cart[i].name === name) {
          cart[i].quantity = cart[i].quantity+1;
          updateCartView(cart);
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
    };

    const clearAllFromCart = () => cart.length=0;

    const removeSingleItemFromCart = (name) => {
      for(let i in cart) {
        if(cart[i].name === name){
          cart[i].quantity = cart[i].quantity-1;
          updateCartView(cart);
          if(cart[i].quantity === 0){
            cart.splice(i,1);
            updateCartView(cart);
            break;
          }
        }
      }
    };

    const removeItemAllFromCart = (name) => {
      for(let i in cart){
        if(cart[i].name === name){
          cart.splice(i,1);
          updateCartView(cart);
          break;
        }
      }
    };

    const getCartItemsCount = () =>{
      let totalCount = 0;
      cart.map((ele)=>{
        totalCount += ele.quantity;
      });  
      return totalCount;
    };
    

    const getTotalCost = () =>{
      let totalCost = 0;
      cart.map((ele)=>{
        totalCost += ele.quantity*ele.price;
      });  
      return totalCost;
    };

    const updateCartView = (cart) => {
      let cartItems = document.querySelector('#cart-items');
      cartItems.innerHTML = '';     

      let cartContent = cart.map((ele,i)=>{
          return `
             <tr key=${i}>
                 <td>${ele.name}</td>
                 <td>&#8377; ${ele.price}</td>
                 <td>${ele.quantity}</td>
                 <td>&#8377; ${ele.quantity*ele.price}</td>
                 <td><a class="btn-floating btn-small red darken-2" title="Remove current all items"><i class="material-icons">delete</i></a></td>
                 <td><a class="btn-floating btn-small red darken-2" title="Remove single item"><i class="material-icons">exposure_neg_1</i></a></td>
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
       <div><strong>Total:</strong> &#8377; ${getTotalCost()}</div>`;

      cartItems.innerHTML = cartContentHolder;
      document.querySelector('.cart_count').innerHTML = getCartItemsCount();
      if(document.querySelectorAll('.responsive-table tbody tr').length === 0)  document.querySelector('#cart-items').innerHTML = '<p class="center">No items in cart</p>';
    };

    document.querySelector('nav > div > button:nth-child(2)').addEventListener('click', ()=> {  

      let cartItems = document.querySelector('#cart-items');

      if(cartItems.innerHTML==='') cartItems.innerHTML = '<p class="center">No items in cart</p>';
      
      if(cartItemsIsVisible) cartItems.style.display = 'none';
      else cartItems.style.display = 'block';
      
      cartItemsIsVisible = !cartItemsIsVisible;

    });

    document.querySelector('#cart-items').addEventListener('click', (e)=>{
        let text = e.target.parentElement.innerText;

        if(text==='clear'){
          clearAllFromCart();
          updateCartView(cart);
          document.querySelector('#cart-items').innerHTML = '<p class="center">No items in cart</p>';
        }else if(text==='exposure_neg_1'){
           removeSingleItemFromCart(""+e.target.parentElement.parentElement.parentElement.children[0].innerText+"");
        }else if(text==='delete'){
           removeItemAllFromCart(""+e.target.parentElement.parentElement.parentElement.children[0].innerText+"");
        }

    });
    
    //reveal functions
    return {
      fetchFood: fetchFood,     
    };
    
  })();



 