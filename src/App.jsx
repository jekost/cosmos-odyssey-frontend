import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceList from './components/PriceList'; // Importing the PriceList component
import Travel from './components/Travel'; // Importing the PriceList component

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pricelists, setPricelists] = useState([]);
  const [travels, setTravels] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/pricelists')
      .then((response) => {
        setPricelists(response.data);  // Set the fetched data into state
        setLoading(false);         // Set loading to false once data is fetched
      })
      .catch((error) => {
        setError(error.message);   // Set the error message if an error occurs
        setLoading(false);         // Set loading to false if there's an error
      });
      axios
      .get('http://localhost:5000/api/travels')
      .then((response) => {
        setTravels(response.data);  // Set the fetched data into state
        setLoading(false);         // Set loading to false once data is fetched
      })
      .catch((error) => {
        setError(error.message);   // Set the error message if an error occurs
        setLoading(false);         // Set loading to false if there's an error
      });


  }, []); // Empty dependency array, this runs only once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/*
      <h1>Price Lists</h1>
      <PriceList items={pricelists} /> {/* Passing the data as props to PriceList */}
      <h2 style={{ textAlign: 'center'}}>Space Travel Listings</h2>
      <Travel items={travels} />
    </div>
    
  );
};

export default App;
