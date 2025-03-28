import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Travel = () => {
  const [travels, setTravels] = useState([]);
  const [sortedTravels, setSortedTravels] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // Track sorting order

  // Fetch the data from the API
  useEffect(() => {
    axios.get('http://localhost:5000/api/travels')
      .then((response) => {
        const travelsData = response.data.map((item) => ({
          priceListId: item.priceListId,
          validUntil: new Date(item.validUntil),
          legId: item.legId,
          fromName: item.fromName,
          toName: item.toName,
          distance: item.distance,
          price: item.price,
          flightStart: new Date(item.flightStart),
          flightEnd: new Date(item.flightEnd),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setTravels(travelsData);
        setSortedTravels(travelsData); // Set the initial sorted travels to be the fetched travels
      })
      .catch((error) => {
        console.error('Error fetching travels:', error);
      });
  }, []);

  // Sort function to sort data by a specific key and toggle asc/desc
  const sortData = (key) => {
    const sorted = [...sortedTravels].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      // Handle date values (flightStart, flightEnd, etc.)
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Handle price value (numeric sorting)
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Handle string values (alphabetically)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return 0;
    });

    setSortedTravels(sorted); // Update state with sorted data
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };

  return (
    <div>
      <h2>Travel List</h2>
      <div>
        <button onClick={() => sortData('validUntil')}>Sort by Valid Until</button>
        <button onClick={() => sortData('flightStart')}>Sort by Flight Start</button>
        <button onClick={() => sortData('flightEnd')}>Sort by Flight End</button>
        <button onClick={() => sortData('price')}>Sort by Price</button>
      </div>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Price List ID</th>
            <th>From</th>
            <th>To</th>
            <th>Distance</th>
            <th>Price</th>
            <th>Flight Start</th>
            <th>Flight End</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {sortedTravels.map((travel, index) => (
            <tr key={travel.priceListId}>
              <td>{index + 1}</td> {/* Counter Column */}
              <td>{travel.priceListId}</td>
              <td>{travel.fromName}</td>
              <td>{travel.toName}</td>
              <td>{travel.distance}</td>
              <td>{travel.price.toFixed(2)}</td>
              <td>{travel.flightStart.toLocaleString()}</td>
              <td>{travel.flightEnd.toLocaleString()}</td>
              <td>{travel.createdAt.toLocaleString()}</td>
              <td>{travel.updatedAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Travel;
