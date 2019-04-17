import {getTotalCost} from './cartActions';

export default (cart) => {

    document.querySelector('#food_item_container').style.display = 'none';
    document.querySelector('#food_detail_container').style.display = 'none';
    document.querySelector('.i_cart').style.visibility = 'hidden';
    document.querySelector('.back-btn').style.visibility = 'visible'; 
    
    let cartContent = cart.map((ele,i)=> {
        return `
           <tr key=${i}>
               <td><img src="${ele.image}" class="circle"/></td>
               <td>${ele.name}</td>
               <td>&#8377; ${ele.price}</td>
               <td>${ele.quantity}</td>
               <td>&#8377; ${ele.quantity*ele.price}</td>
              <!-- <td><a class="btn-floating btn-small red darken-2" title="Remove current all items"><i class="material-icons">delete</i></a></td>
               <td><a class="btn-floating btn-small red darken-2" title="Decrease item quantity"><i class="material-icons">exposure_neg_1</i></a></td>
               <td><a class="btn-floating btn-small red darken-2" title="Increase item quantity"><i class="material-icons">exposure_plus_1</i></a></td> -->
           </tr>
        `;
    });

    cartContent = cartContent.join('');   

    let cartContentHolder = `
    <table class="highlight responsive-table">
        <thead>
          <tr>
              <th></th>
              <th>Item Name</th>
              <th>Item Price</th>
              <th>Quantity</th>
              <th>Item Total</th>
           <!--   <th><a class="btn-floating btn-small red darken-2" title="Clear entire cart"><i class="material-icons">clear</i></a></th>-->
          </tr>
        </thead>
        <tbody>
            ${cartContent}
        </tbody>
     </table>
     <div class="right" style="margin-right: 10%;"><strong>Total:</strong> &#8377; ${getTotalCost()}</div>
     `;

    if(!document.querySelector('#checkoutDisplay')) {
        let checkoutDisplay = document.createElement('section');
        checkoutDisplay.setAttribute('id','checkoutDisplay');
        checkoutDisplay.setAttribute('class','container');
        document.body.appendChild(checkoutDisplay);
        document.querySelector('#checkoutDisplay').style.display = 'block';      
        document.querySelector('#checkoutDisplay').innerHTML = cartContentHolder;
    } else if(document.querySelector('#checkoutDisplay')){
        document.querySelector('#checkoutDisplay').style.display = 'block';
        document.querySelector('#checkoutDisplay').innerHTML = '';
        document.querySelector('#checkoutDisplay').innerHTML = cartContentHolder;
    };
}