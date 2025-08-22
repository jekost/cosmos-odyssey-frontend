import axios from 'axios';
import { useState } from 'react';
import { Duration } from 'luxon';
import { useCart } from '../context/CartContext.jsx';
import '../../styles/Cart.css';
const env = await import.meta.env;
const url = env.VITE_API_URL;
const durationFormat = env.VITE_DURATION_FORMAT;
const priceFormat = env.VITE_PRICE_FORMAT;

export const Cart = () => {

    const { cart, setCart, addToCart, removeFromCart, removeOne, totalPrice, totalDurationMillis, errorMessage, setErrorMessage } = useCart();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const buyCart = async () => {
        setErrorMessage('');
        if (!firstName.trim() || !lastName.trim()) {
            setErrorMessage("First Name and Last Name are required for booking.");
            return;
        }
        if (!cart || cart.length === 0) {
            setErrorMessage("Your cart is empty. Add some items before buying.");
            return;
        }
        console.log("Processing your purchase...");

        const bookings = cart.map(item => ({
            priceListId: item.priceListId,
            offerId: item.offerId,
            companyName: item.company.name,
            fromName: item.fromName,
            toName: item.toName,
            amount: item.amount
        }));

        try {

            //check if purchase has any bookings from invalid pricelists
            try{
                const response = await axios.get(`${url}/api/pricelists/invalid`);    
                const invalidPriceListIds = response.data.map(pricelist => pricelist.id);
                bookings.reduce((booking) => {
                    if (invalidPriceListIds.includes(booking.priceListId)) {
                        setErrorMessage("You tried to purchase a ticket that from a previous pricelist")
                        throw Error;
                    }
                }, 0);
            }catch (error){
                //if it gets here this probably means there are no invalid pricelist ids => no invalid travels in cart
                true;
            }
            
    


            //get the pricelist id which is gonna expire the earliest, later we will delete invalid bookings using this value
            const responseGetPricelists = await axios.get(`${url}/api/pricelists`);
            const priceLists = responseGetPricelists.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const oldestMatchingPriceListId = priceLists.find(priceList => 
                bookings.some(booking => booking.priceListId === priceList.id)
            )?.id;
        
            const responsePostReservations = await axios.post(`${url}/api/reservations`, {
                firstName: firstName,
                lastName: lastName,
                totalPrice: totalPrice.toFixed(2),
                totalDurationMillis: totalDurationMillis,
                oldestPriceListId: oldestMatchingPriceListId,
                bookings
            });

            console.log("Purchase successful!", responsePostReservations.data);


            setFirstName('');
            setLastName('');
            setCart([]);
        } catch (error) {
            setErrorMessage('Error during purchase');
            console.error("Error during purchase:", error.responsePostReservations?.data || error.message);
        }
    };

    return (
        <div className="container">
        <h4 className="heading mt-2 mb-4" >Shopping Cart</h4>
        <div>
            <table className="table table-bordered table-hover">
            <thead className="table-header">
                <tr>
                <th>#</th >
                {['Company Name', 'From', 'To', 'Price', 'Flight Duration', 'Price Total', 'Duration Total', 'Amount', 'Action', 'Remove'].map((key) => (
                    <th key={key} className='table-column'>
                    {key}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {[...cart, ...Array(Math.max(0, 3 - cart.length)).fill(null)].map((item, index) => (
                <tr key={item ? item.offerId : `empty-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item?.companyName || ""}</td>
                    <td>{item?.fromName || ""}</td>
                    <td>{item?.toName || ""}</td>
                    <td>{item ? `€${item.price.toLocaleString(priceFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}</td>
                    <td>{item ? Duration.fromMillis(item.flightDuration).toFormat(durationFormat) : ""}</td>
                    <td>{item ? `€${(item.amount * item.price).toLocaleString(priceFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}</td>
                    <td>
                        {item
                            ? item.amount > 0
                            ? Duration.fromMillis(item.amount * item.flightDuration).toFormat(durationFormat)
                            : "Invalid duration"
                            : ""}
                    </td>
                    <td>{item?.amount || ""}</td>
                    <td>
                    {item && (
                        <div className="d-flex justify-content-center">
                        <button className="btn btn-success btn-sm me-1" onClick={() => addToCart(item)}>+</button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeOne(item.offerId)}>-</button>
                        </div>
                    )}
                    </td>
                    <td>
                    {item && (
                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.offerId)}>Delete</button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                <td colSpan="6" className="total-row"><strong>Total</strong></td>
                <td><strong>€{totalPrice.toLocaleString(priceFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><strong>{Duration.fromMillis(totalDurationMillis).toFormat(durationFormat)}</strong></td>
                <td colSpan="3"></td>
                </tr>
            </tfoot>
            </table>

            <div className="d-flex flex-column align-items-center mt-">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="form-control mb-2 w-50 input"
                id="firstNameField"
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="form-control mb-3 w-50 input"
                id="firstNameField"
            />
            <button
                onClick={buyCart}
                className="button"
            >
                Book Flight
            </button>
            </div>
        </div>
        </div>
    );
};

export default Cart;
