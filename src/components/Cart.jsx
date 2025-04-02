import React from 'react';
import { Duration } from 'luxon';
import { useCart } from '../context/CartContext.jsx'; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const { cart, addToCart, removeFromCart, removeOne, totalPrice, totalDurationMillis, buyCart, firstName, setFirstName, lastName, setLastName, errorMessage } = useCart();

  return (
    
    <div style={{fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <h2 className="mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div>
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Offer ID</th>
                <th>Company Name</th>
                <th>From</th>
                <th>To</th>
                <th>Price</th>
                <th>Flight Duration</th>
                <th>Duration Total</th>
                <th>Price Total</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Remove</th>
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
                  <td>${(item.amount * item.price).toFixed(2)}</td>
                  <td>
                    {item.amount > 0 ? 
                      Duration.fromMillis(item.amount * item.flightDuration).toFormat("d 'd' h 'h' m 'm'") : 
                      "Invalid duration"}
                  </td>
                  <td>{item.amount}</td>
                  <td>

                    <button className="btn btn-success btn-sm w-100" onClick={() => addToCart(item)}>+</button>
                    <button className="btn btn-danger btn-sm w-100" onClick={() => removeOne(item.offerId)}>-</button>
                  </td>
                    <button className="btn btn-danger btn-xs me-2 w-2 h-2" onClick={() => removeFromCart(item.offerId)}>Delete</button>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7"><strong>Total</strong></td>
                <td><strong>${totalPrice.toFixed(2)}</strong></td>
                <td><strong>{Duration.fromMillis(totalDurationMillis).toFormat("d 'd' h 'h' m 'm'")}</strong></td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>

          <div className="d-flex flex-column align-items-center mt-4">
            {errorMessage && <p className="text-danger font-weight-bold">{errorMessage}</p>}
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="form-control mb-2 w-50"
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="form-control mb-3 w-50"
            />
            <button 
              onClick={buyCart} 
              className="btn btn-primary btn-lg"
            >
              Book Flight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
