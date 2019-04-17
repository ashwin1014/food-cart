import "babel-polyfill";
import './style.css';
import {addToCart, clearAllFromCart, removeSingleItemFromCart,removeItemAllFromCart, getCurrentItemCout, cart, updateCartView} from './cartActions';
import M from 'materialize-css';
import checkout from './checkout';

window.addEventListener('load', ()=>{
    foodApp.fetchFood("https://cors-anywhere.herokuapp.com/http://temp.dash.zeta.in/food.php");    
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems,{
      edge: 'right',
      draggable: false
    });
});

// block browser back button
history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
};


let foodApp = (()=> {    
  "use strict";
    
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
            <div class="col s12 m6 item" data-name="${item.name}" data-category="${item.category}">
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
           document.querySelector('.back-btn').style.visibility = 'visible';
          }
    };

    document.querySelector('.brand-logo').addEventListener('click',()=> {
      if(document.querySelector('#checkoutDisplay')) document.querySelector('#checkoutDisplay').style.display = 'none';
      
      document.querySelector('#food_detail_container').style.display = 'none';
      document.querySelector('#food_item_container').style.display = 'block';
      document.querySelector('.i_cart').style.visibility = 'visible';   
      document.querySelector('.back-btn').style.visibility = 'hidden';   
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
        let {name, price, image} = e.target.dataset;      
        addToCart(name, price, image);
      }
   };

 
    document.querySelector('#cart-items').addEventListener('click', (e)=>{

        if(e.target.className === 'btn-link'){
          clearAllFromCart();
          updateCartView(cart);
          if(document.querySelector('#c_count')) document.querySelector('#c_count').textContent = '0';
          document.querySelector('.collection').innerHTML = '<p class="center">No items in cart</p>';
          document.querySelector('#btn_checkout').classList.add('disabled');
        }else if(e.target.nodeName === 'I' && e.target.textContent === 'exposure_neg_1'){
           removeSingleItemFromCart(e.target.parentElement.dataset.name);
        }else if(e.target.nodeName === 'I' && e.target.textContent === 'delete'){
           removeItemAllFromCart(e.target.parentElement.dataset.name);
        }else if(e.target.nodeName === 'I' && e.target.textContent === 'exposure_plus_1'){
          addToCart(e.target.parentElement.dataset.name, e.target.parentElement.dataset.price, null);
        }else if(e.target.id === 'btn_checkout') {
          checkout(cart);
        }

    });
         
    let timeout = null;
    document.querySelector('#foodSearch').addEventListener('keydown', ()=> {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        let searchedItem = document.getElementById('foodSearch').value.toUpperCase();
          document.querySelectorAll('.item').forEach((item)=>{
            if(item.getAttribute('data-name').toUpperCase().indexOf(searchedItem) === -1){
              item.style.display = 'none'
            } else item.style.display = 'block'
        })
      }, 400);
    });

    document.querySelector('button[type=reset]').addEventListener('click', ()=> {
      document.querySelectorAll('.item').forEach((item)=>{
        item.style.display = 'block';
      })
    });

    if(document.querySelector('.back-btn')) {
      document.querySelector('.back-btn').addEventListener('click', ()=> {
        if(document.querySelector('#checkoutDisplay')) document.querySelector('#checkoutDisplay').style.display = 'none';
      
        document.querySelector('#food_detail_container').style.display = 'none';
        document.querySelector('#food_item_container').style.display = 'block';
        document.querySelector('.i_cart').style.visibility = 'visible';   
        document.querySelector('.back-btn').style.visibility = 'hidden';   
      });
    }


    //reveal functions
    return {
      fetchFood: fetchFood,     
    };
    
  })();



 