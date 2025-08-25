import React from 'react';
import { Duration } from 'luxon';
import { useTravel } from '../context/TravelContext';
import { useCart } from '../context/CartContext';
import '../../styles/Travel.css';
const env = await import.meta.env;
const clockFormat = env.VITE_CLOCK_FORMAT;
const durationFormat = env.VITE_DURATION_FORMAT;
const distanceFormat = env.VITE_DISTANCE_FORMAT;
const priceFormat = env.VITE_PRICE_FORMAT;

const Travel = () => {
  const { 
    travelRoutes, filteredTravels, sortData, columnNames, sortOrder, sortKey, 
    searchFrom, setSearchFrom, searchTo, setSearchTo, searchCompany, setSearchCompany, 
    fromOptions, setFromOptions, toOptions, visibleCount, setVisibleCount, companyOptions 
  } = useTravel();
  const { addToCart } = useCart();

  return (
    <div className="container">
      <h4 className="mb-4">Search Travel</h4>
      <div className="filters-container">
        <Dropdown 
          value={searchFrom} 
          onChange={setSearchFrom} 
          options={Object.keys(travelRoutes)} 
          disabled={searchTo !== ''} 
          placeholder="From..."
        />
        <Dropdown 
          value={searchTo} 
          onChange={setSearchTo} 
          options={toOptions} 
          disabled={searchFrom === ''} 
          placeholder="To..."
        />
        <Dropdown 
          value={searchCompany} 
          onChange={setSearchCompany} 
          options={companyOptions} 
          placeholder="Company..."
        />
      </div>
      {filteredTravels.length > 0 ? (
        <>
          <TravelTable travels={filteredTravels} sortData={sortData} sortKey={sortKey} sortOrder={sortOrder} columnNames={columnNames} addToCart={addToCart} visibleCount={visibleCount} />
          {visibleCount < filteredTravels.length ? (
            <button className="show-more-button" onClick={() => setVisibleCount(visibleCount + 10)}>Show More</button>
          ) : (
            <p>No more travels to load</p>
          )}
        </>
      ) : (
        <p>No valid travels found</p>
      )}
    </div>
  );
};

const Dropdown = ({ value, onChange, options, disabled = false, placeholder }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="dropdown">
    <option value="">{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={option}>{option}</option>
    ))}
  </select>
);

const TravelTable = ({ travels, sortData, sortKey, sortOrder, columnNames, addToCart, visibleCount }) => (
  <table className="table">
    <thead>
      <tr>
      <th style={{ width: '40px' }}>#</th >
        {['company', "planetFrom", "planetTo", "distance", 'price', 'flightStart', 'flightEnd', 'flightDuration'].map((key) => (
          <th key={key} style={{ width: '94px' }}>
            <button className="sort-button" onClick={() => sortData(key)}>
              {columnNames[key]} {sortKey === key ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </button>
          </th>
        ))}
        <th>Add to cart</th>
      </tr>
    </thead>
    <tbody>
      {travels.slice(0, visibleCount).map((travel, index) => (
        <tr key={travel.offerId} className={index % 2 === 0 ? "even-row" : "odd-row"}>
          <td>{index + 1}</td>
          <td>{travel.company}</td>
          <td>{travel.planetFrom}</td>
          <td>{travel.planetTo}</td>
          <td>{travel.distance.toLocaleString(distanceFormat)} km</td>
          <td>€{travel.price.toLocaleString(priceFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>{travel.flightStart.toLocaleString(clockFormat)}</td>
          <td>{travel.flightEnd.toLocaleString(clockFormat)}</td>
          <td>{Duration.fromMillis(travel.flightDuration).toFormat(durationFormat)}</td>
          <td>
            <button className="add-button" onClick={() => addToCart(travel)}>Add</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


export default Travel;