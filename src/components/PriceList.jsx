import React, { useState } from 'react';

const PriceList = ({ items }) => {
  const [sortedItems, setSortedItems] = useState(items);
  const [sortOrder, setSortOrder] = useState('asc');

  const sortData = (key) => {
    const sorted = [...sortedItems].sort((a, b) => {
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setSortedItems(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return ( 
    <div>
      <div>
        <button onClick={() => sortData('validUntil')}>Sort by Valid Until</button>
        <button onClick={() => sortData('createdAt')}>Sort by Created At</button>
        <button onClick={() => sortData('updatedAt')}>Sort by Updated At</button>
      </div>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Valid Until</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.id}</td>
              <td>{new Date(item.validUntil).toLocaleString()}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceList;
