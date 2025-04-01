import React from 'react';
import { Duration } from 'luxon';
import { useCart } from '../context/CartContext.jsx'; // Adjust path as needed

const Cart = () => {
  const { cart, addToCart, removeFromCart, totalPrice, totalDurationMillis, buyCart } = useCart();


  

  return (
    <div style={{fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
            <table border="1" style={{ marginTop: '20px', width: '80%', textAlign: 'center', alignItems: 'center' }}>
            <thead>
                <tr>
                <th>#</th>
                <td>Offer ID</td>
                <td>Company Name</td>
                <td>From</td>
                <td>To</td>
                <td>Price</td>
                <td>Flight Duration</td>
                <th>Amount</th>
                <th>Price Total</th>
                <th>Duration Total</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item, index) => (
                <tr key={item.offerId}>
                    <td>{index + 1}</td>
                    <td>{item.offerId}</td>
                    <td>{item.companyName}</td>
                    <td>{item.fromName}</td>
                    <td>{item.toName}</td>
                    <td>${item.price}</td>
                    <td>{Duration.fromMillis(item.flightDuration).toFormat("d 'd' h 'h' m 'm'")}</td>
                    <td>{item.amount}</td>
                    <td>{(item.amount*item.price).toFixed(2)}</td>
                    <td>
                        {(() => {
                            try {
                            if (item.amount > 0) {
                                return Duration.fromMillis(item.amount * item.flightDuration).toFormat("d 'd' h 'h' m 'm'");
                            } else {
                                throw new Error("Amount must be greater than zero");
                            }
                            } catch (error) {
                            return "Invalid duration";
                            }
                        })()}
                    </td>
                    <td>
                    <button onClick={() => removeFromCart(item.offerId)}>Remove</button>
                    <button onClick={() => addToCart(item)}>Add</button>
                    


                    </td>
                </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                <td colSpan="8"><strong>Total</strong></td>
                <td><strong>${totalPrice.toFixed(2)}</strong></td>
                <td><strong>{Duration.fromMillis(totalDurationMillis).toFormat("d 'd' h 'h' m 'm'")}</strong></td>
                <td></td>
                </tr>
            </tfoot>  
            </table>


            <button onClick={() => buyCart()} style={{textAlign: 'center'}}>tere</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
