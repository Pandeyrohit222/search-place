import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [citiesToShow, setCitiesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const searchInputRef = useRef(null);

  // Function to handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCitiesData([]);
      setNoResults(false);
      return;
    }

    setLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      // Simulated data
      const data = [
        { place: "New York", country: "US", countryId: "US-sky" },
        { place: "London", country: "UK", countryId: "GB-sky" },
        { place: "Paris", country: "France", countryId: "FR-sky" }
      ];

      setCitiesData(data);
      setTotalPages(Math.ceil(data.length / citiesToShow));
      setCurrentPage(1);
      setNoResults(data.length === 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle changing number of cities to show
  const handleCitiesToShowChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setCitiesToShow(value);
      setTotalPages(Math.ceil(citiesData.length / value));
      setCurrentPage(1);
    }
  };

  // Function to handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Event listener for "Enter" key press in the search box
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  
  const handleShortcutKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      searchInputRef.current.focus();
      e.preventDefault(); 
    }
  };

  // Add event listeners when the component mounts
  useEffect(() => {
    document.addEventListener('keydown', handleShortcutKeyPress);
    return () => {
      document.removeEventListener('keydown', handleShortcutKeyPress);
    };
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      {/* Search box */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={searchInputRef}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {/* Show "Start searching" if searchQuery is blank */}
      {searchQuery.trim() === '' && <div>Start searching</div>}
      
      {/* Show spinner while data is fetching */}
      {loading && <div>Loading...</div>}
      
      {/* Show "No result found" if no results */}
      {noResults && <div>No result found</div>}
      
      {/* Table */}
      {!loading && !noResults && (
        <div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {/* Render rows based on fetched data */}
              {citiesData.slice((currentPage - 1) * citiesToShow, currentPage * citiesToShow).map((city, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * citiesToShow + index + 1}</td>
                  <td>{city.place}</td>
                  <td>
                    {city.country ? (
                      <img
                        src={`https://www.countryflags.io/${city.countryId.split('-')[0].toLowerCase()}/flat/64.png`}
                        alt={city.country}
                        style={{ width: '30px', height: 'auto' }}
                      />
                    ) : (
                      "No Country"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !noResults && totalPages > 1 && (
        <div>
          {/* Render pagination component */}
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            {/* Render pagination buttons based on total pages */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)} disabled={currentPage === i + 1}>{i + 1}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
      
      {/* User input for number of cities */}
      <div>
        <label htmlFor="citiesToShow">Cities to Show:</label>
        <input
          type="number"
          id="citiesToShow"
          min="1"
          max="10"
          value={citiesToShow}
          onChange={handleCitiesToShowChange}
        />
      </div>
    </div>
  );
};

export default App;
