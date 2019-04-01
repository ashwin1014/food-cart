import "babel-polyfill";
import './style.css';
import M from 'materialize-css';

window.addEventListener('load', ()=>{
    foodApp.fetchFood("http://temp.dash.zeta.in/food.php");    
});


let foodApp = (()=> {    
  "use strict";
    
    let cart = [];
    let count = 0;
    
    let fetchFood = async (url) => {
        let response = await fetch(url).catch(err=>console.log(err));
        let foodData = await response.json();
        
         let recipeGrid = foodData.recipes.map((item, index)=>{
                return `
                <div class="col s12 m6">
                <div class="card">
                  <div class="card-image">
                    <img src=${item.image}>
                  </div>
                  <div class="card-action">
                    <div style="width: 50%" class="item_detail"> 
                        <p class="" title=${item.name}>${item.name}</p>
                        <p class="">&#8377; ${item.price}</p>                       
                    </div>
                    <div class="item_btn">
                        <button class="btn btn_add_cart" data-name=${item.name} data-image=${item.image} data-price=${item.price} data-category=${item.category} data-rating=${item.rating} data-detail="${item.details}" data-review=${item.reviews}>ADD TO BAG</button>
                    </div>
                  </div>
                </div>
              </div>`;
         });

         document.getElementById('recipes_card').innerHTML = recipeGrid.join('');

         let favourites = foodData.recipes.filter(item => {
             return item.isFavourite;
         });

         let favouriteGrid = favourites.map((item, index)=>{
            return `
            <div class="col m6 card_content">
            <div class="card">
              <div class="card-image">
                <img src=${item.image}>
              </div>
              <div class="card-action">
                <div style="width: 50%" class="item_detail"> 
                    <p class="truncate" title=${item.name}>${item.name}</p>
                    <p class="">&#8377; ${item.price}</p>
                </div>
                <div class="item_btn">
                   <button class='btn btn_add_cart' data-name=${item.name} data-image=${item.image} data-price=${item.price} data-category=${item.category} data-rating=${item.rating} data-detail="${item.details}" data-review=${item.reviews}>ADD TO BAG</button>
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
            
              let name = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.name;
              let category = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.category;
              let detail = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.detail;
              let price = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.price;
              let rating = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.rating;
              let review = e.target.parentElement.nextElementSibling.lastElementChild.firstElementChild.dataset.review;        
 
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
                     <button class='btn btn_add_cart' data-name=${name} data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>+</button>
                      <p id="c_count" class="d-inline">0</p>
                     <button class='btn btn_add_cart' data-name=${name} data-image=${e.target.src} data-price=${price} data-category=${category} data-rating=${rating} data-detail="${detail}" data-review=${review}>-</button>
                 </div>
                 <div class="d-inline" style="margin-top: 50px">
                  <p style="width: 50%" class="d-inline">Category: ${category}</p> <p class="d-inline">${rating} Rating (${review} Reviews)</p>
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


   const cartBtn = (e) => {
      if(e.target.nodeName === 'BUTTON'){
        let name = e.target.dataset.name;
        let category = e.target.dataset.category;
        let image = e.target.dataset.image;
        let detail = e.target.dataset.detail;
        let price = e.target.dataset.price;
        let rating = e.target.dataset.rating;
        let review = e.target.dataset.review;              
        addToCart(name, category, image, detail, price, rating, review);
        count++;
        document.querySelector('.cart_count').innerHTML = count;
        // if(document.querySelector('#c_count')) document.querySelector('#c_count').innerHTML = count;
        console.log(count)
      }
   };

    const addToCart = (...args) => {
      console.log(args)
    };

    document.querySelector('nav > div > button:last-child').addEventListener('click', ()=> {      
        let cartItemHolder = document.createElement('ul');
        cartItemHolder.setAttribute('class','dropdown-content');
        cartItemHolder.setAttribute('id','dropdown-cart');
        
        cartItemHolder.appendChild(document.createElement('li').appendChild(document.createTextNode('Item1')));
        cartItemHolder.appendChild(document.createElement('li').appendChild(document.createTextNode('Item2')));
        cartItemHolder.appendChild(document.createElement('li').appendChild(document.createTextNode('Item3')));
        cartItemHolder.appendChild(document.createElement('li').appendChild(document.createTextNode('Item4')));
       

       document.body.appendChild(cartItemHolder);
       M.Dropdown.init(document.querySelector('.dropdown-trigger'));
    });
    
    //reveal functions
    return {
      fetchFood: fetchFood,     
    };
    
  })();



 