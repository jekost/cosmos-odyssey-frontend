import React, { useState, useEffect } from 'react';
import { Duration } from 'luxon';
import { useCart } from '../context/CartContext';


const travelRoutes = {
  "Mercury": ["Venus"],
  "Venus": ["Mercury", "Earth"],
  "Earth": ["Uranus", "Jupiter"],
  "Mars": ["Venus"],
  "Jupiter": ["Venus", "Mars"],
  "Saturn": ["Earth", "Neptune"],
  "Uranus": ["Saturn", "Neptune"],
  "Neptune": ["Mercury", "Uranus"]
};

const Travel = ({items}) => {
  const [sortedItems, setSortedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortKey, setSortKey] = useState(null);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [companyOptions, setCompanyOptions] = useState([]);

  const { cart, addToCart, removeFromCart } = useCart();


  const columnNames = {
    offerId: "Offer ID",
    fromName: "From",
    toName: "To",
    distance: "Distance",
    price: "Price",
    flightStart: "Flight Start",
    flightEnd: "Flight End",
    companyName: "Company Name",
    flightDuration: "Flight Duration",
  };

  useEffect(() => {
    const travelsData = items.map((item) => ({
      offerId: item.offerId,
      priceListId: item.priceListId,
      legId: item.legId,
      fromName: item.fromName,
      toName: item.toName,
      distance: item.distance,
      price: item.price,
      flightStart: new Date(item.flightStart),
      flightEnd: new Date(item.flightEnd),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      companyName: item.companyName,
      flightDuration: item.flightDuration
    }));
    setSortedItems(travelsData);
    setCompanyOptions([...new Set(travelsData.map(item => item.companyName))]);
  }, [items]);

  useEffect(() => {
    if (searchFrom) {
      setToOptions(travelRoutes[searchFrom] || []);
    } else if (searchTo) {
      const availableFrom = Object.keys(travelRoutes).filter(from => travelRoutes[from].includes(searchTo));
      setFromOptions(availableFrom);
    } else {
      setToOptions([]);
      setFromOptions([]);
    }
  }, [searchFrom, searchTo]);

  

  const sortData = (key) => {
    setSortKey(key);
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortedItems((prevItems) => {
      const sorted = [...prevItems].sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];

        if (valueA instanceof Date && valueB instanceof Date) {
          return order === 'asc' ? valueA - valueB : valueB - valueA;
        }
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return order === 'asc' ? valueA - valueB : valueB - valueA;
        }
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        return 0;
      });
      return sorted;
    });
  };

  const filteredTravels = sortedItems.filter(travel => {
    return ((!searchFrom || travel.fromName === searchFrom) &&
           (!searchTo || travel.toName === searchTo) &&
           (!searchCompany || travel.companyName === searchCompany)
          )
});

  return (
    <div style={{fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <h3>Search Travel</h3>
      <div>
      <div style={{ marginBottom: '20px' }}>
  <select 
    value={searchFrom} 
    onChange={(e) => setSearchFrom(e.target.value)} 
    disabled={searchTo !== ''} 
    style={{
      padding: '10px 15px', 
      fontSize: '12px', 
      border: '2px solid #666666', 
      borderRadius: '5px', 
      background: '#f2f2f2', 
      color: '#000', 
      cursor: 'pointer', 
      width: '200px', 
      transition: 'all 0.3s ease',
      marginRight: '10px',
    }}
  >
    <option value="">From...</option>
    {Object.keys(travelRoutes).map((from, index) => (
      <option key={index} value={from}>{from}</option>
    ))}
  </select>

  <select 
    value={searchTo} 
    onChange={(e) => setSearchTo(e.target.value)} 
    disabled={searchFrom === ''} 
    style={{
      padding: '10px 15px', 
      fontSize: '12px', 
      border: '2px solid #666666', 
      borderRadius: '5px', 
      background: '#f2f2f2', 
      color: '#000', 
      cursor: 'pointer', 
      width: '200px', 
      transition: 'all 0.3s ease',
      marginRight: '10px',
    }}
  >
    <option value="">To...</option>
    {toOptions.map((to, index) => (
      <option key={index} value={to}>{to}</option>
    ))}
  </select>

  <select 
    value={searchCompany} 
    onChange={(e) => setSearchCompany(e.target.value)} 
    style={{
      padding: '10px 15px', 
      fontSize: '12px', 
      border: '2px solid #666666', 
      borderRadius: '5px', 
      background: '#f2f2f2', 
      color: '#000', 
      cursor: 'pointer', 
      width: '200px', 
      transition: 'all 0.3s ease',
    }}
  >
    <option value="">Company...</option>
    {companyOptions.map((company, index) => (
      <option key={index} value={company}>{company}</option>
    ))}
  </select>
</div>
      </div>
      {filteredTravels.length > 0 && (
        <>
        <table border="2" style={{ marginTop: '20px', width: '80%', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>#</th>
              {['companyName', 'fromName', 'toName', 'distance', 'price', 'flightStart', 'flightEnd', 'flightDuration'
              ].map((key) => (
                <th key={key}>
                  <button 
                    onClick={() => sortData(key)} 

                    onMouseEnter={(e) => e.target.style.background = '#d2d2d2'}
                    onMouseLeave={(e) => e.target.style.background = '#f2f2f2'}
                  >
                    {columnNames[key]} {sortKey === key ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
              ))}
              <th>Add to cart</th>
            </tr>
          </thead>
          <tbody>
          {filteredTravels.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', fontWeight: 'bold' }}>No events found</td>
            </tr>
          ) : (
            filteredTravels.slice(0, visibleCount).map((travel, index) => {
              return (
                <tr key={travel.offerId} style={{backgroundColor: 'lightgreen'}}>
                  <td>{index + 1}</td>
                  <td>{travel.companyName}</td>
                  <td>{travel.fromName}</td>
                  <td>{travel.toName}</td>
                  <td>{travel.distance}</td>
                  <td>{travel.price.toFixed(2)}</td>
                  <td>{travel.flightStart.toLocaleString()}</td>
                  <td>{travel.flightEnd.toLocaleString()}</td>

                  <td>{Duration.fromMillis(travel.flightDuration).toFormat("d 'days' h 'hours' m 'minutes'")}</td>
                  <td>
                    <button onClick={() => addToCart(travel)}
                      onMouseEnter={(e) => e.target.style.background = '#d2d2d2'}
                      onMouseLeave={(e) => e.target.style.background = '#f2f2f2'}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              );
            })
          )}
            </tbody>
        </table>
        {visibleCount < filteredTravels.length && (
          <button onClick={() => setVisibleCount(visibleCount + 10)} style={{ margin: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            Show More
          </button>
        )}
        {visibleCount >= filteredTravels.length && (
          <p>No more travels to load</p>
        )}
        </>
      )}
      {filteredTravels.length < 0 && (
        <p>No valid Travels found</p>
      )}
    </div>
  );
};

export default Travel;
