import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){

      // find the item in the cart based o item id
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    
    if(alreadyExistsInCart){
      // increment the quantity
      existingCartItem.quantity++;
    }
    else{
      // ust add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals(){

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the ne values ... all subsribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){

    console.log("Contents of the cart");
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity= ${tempCartItem.quantity}, unitPrice= ${tempCartItem.unitPrice}, subTotalPrice= ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-----')
  }

  decrementQuantity(theCartItem: CartItem){
     
    theCartItem.quantity--;

    if(theCartItem.quantity === 0)
      this.remove(theCartItem);
    else
      this.computeCartTotals();
  }

  remove(theCartItem: CartItem){

    // const itemIndex = this.cartItems.indexOf( (tempCartItem: { id: number; }) => {
    //   tempCartItem.id === theCartItem.id;
    // });

    // is not working

    let itemIndex: number;

    for(let index in this.cartItems){
      if(this.cartItems[index].id === theCartItem.id){
        itemIndex = +index;
      }
    }

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
