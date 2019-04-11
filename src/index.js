import "babel-polyfill";
import './style.css';
import {addToCart, clearAllFromCart, removeSingleItemFromCart,removeItemAllFromCart, getCurrentItemCout, cart, updateCartView} from './common';
// import M from 'materialize-css';
import checkout from './checkout';

window.addEventListener('load', ()=>{
    // foodApp.fetchFood("http://temp.dash.zeta.in/food.php");    
    foodApp.fetchFood("https://cors-anywhere.herokuapp.com/http://temp.dash.zeta.in/food.php");    
});

// block browser back button
history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
};


let foodApp = (()=> {    
  "use strict";
    
    let cartItemsIsVisible = false;

    let fetchFood = async (url) => {
      let foodData;

       try {
         let response = await fetch(url)
         foodData = await response.json();
       } catch (err) {
         throw new Error('Unable to fetch data');         
       }

      
        
         let recipeGrid = foodData.recipes.map(item=>{
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
                     <button class='btn btn_counter_u' data-name="${name}" data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>+</button>
                      <p id="c_count" class="d-inline">0</p>
                     <button class='btn btn_counter_d' data-name="${name}" data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>-</button>
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
           getCurrentItemCout(name);
          }
    };

    document.querySelector('.brand-logo').addEventListener('click',()=>{
      if(document.querySelector('#checkoutDisplay')) document.querySelector('#checkoutDisplay').style.display = 'none';
      
      document.querySelector('#food_detail_container').style.display = 'none';
      document.querySelector('#food_item_container').style.display = 'block';
      document.querySelector('.dropdown-trigger').style.display = 'block';
      cartItemsIsVisible = !cartItemsIsVisible;
    })

    
    document.querySelector('#recipes_card').addEventListener('click',  (e)=> {
      cartBtn(e);
    });

    document.querySelector('#food_detail_container').addEventListener('click',  (e)=> {
      if(e.target.className.includes('btn_counter_u')) cartBtn(e);
      else removeSingleItemFromCart(e.target.dataset.name);      
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

    
    document.querySelector('nav > div > button:nth-child(2)').addEventListener('click', ()=> {  

      let cartItems = document.querySelector('#cart-items');

      if(cartItems.children.length === 0) cartItems.innerHTML = '<p class="center">No items in cart</p>';
      
      if(cartItemsIsVisible) cartItems.style.display = 'none';
      else cartItems.style.display = 'block';
      
      cartItemsIsVisible = !cartItemsIsVisible;

    });

    document.querySelector('#cart-items').addEventListener('click', (e)=>{
        let text = e.target.parentElement.innerText;
        if(text ==='clear'){
          clearAllFromCart();
          updateCartView(cart);
          if(document.querySelector('#c_count')) document.querySelector('#c_count').textContent = '0';
          document.querySelector('#cart-items').innerHTML = '<p class="center">No items in cart</p>';
        }else if(text ==='exposure_neg_1'){
           removeSingleItemFromCart(e.target.parentElement.parentElement.parentElement.children[0].innerText);
        }else if(text === 'delete'){
           removeItemAllFromCart(e.target.parentElement.parentElement.parentElement.children[0].innerText);
        }else if(text === 'exposure_plus_1'){
          addToCart(e.target.parentElement.parentElement.parentElement.children[0].innerText, e.target.parentElement.parentElement.parentElement.children[1].innerText.replace('₹','').trim());
        }else if(e.target.id === 'btn_checkout') {
          checkout(cart);
        }

    });
         
    //reveal functions
    return {
      fetchFood: fetchFood,     
    };
    
  })();



 