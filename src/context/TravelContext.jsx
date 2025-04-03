import { createContext, useState, useContext, useEffect } from 'react';
const TravelContext = createContext();

export const TravelProvider = ({ children, items }) => {
  const travelRoutes = {
    "Mercury": ["Venus"],
    "Venus": ["Mercury", "Earth"],
    "Earth": ["Uranus", "Jupiter"],
    "Mars": ["Venus"],
    "Jupiter": ["Venus", "Mars"],
    "Saturn": ["Earth", "Neptune"],
    "Uranus": ["Saturn", "Neptune"],
    "Neptune": ["Mercury", "Uranus"],
  };

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
      ...item,
      flightStart: new Date(item.flightStart),
      flightEnd: new Date(item.flightEnd),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
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
      return [...prevItems].sort((a, b) => {
        if (a[key] instanceof Date && b[key] instanceof Date) {
          return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return order === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        }
        return 0;
      });
    });
  };

  const filteredTravels = sortedItems.filter(travel => (
    (!searchFrom || travel.fromName === searchFrom) &&
    (!searchTo || travel.toName === searchTo) &&
    (!searchCompany || travel.companyName === searchCompany)
  ));

  return (
    <TravelContext.Provider value={{
      travelRoutes,
      filteredTravels,
      sortData,
      columnNames,
      sortedItems,
      setSortedItems,
      sortOrder,
      setSortOrder,
      sortKey,
      setSortKey,
      searchFrom,
      setSearchFrom,
      searchTo,
      setSearchTo,
      searchCompany,
      setSearchCompany,
      fromOptions,
      setFromOptions,
      toOptions,
      setToOptions,
      visibleCount,
      setVisibleCount,
      companyOptions,
      setCompanyOptions,
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);
