import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const { REACT_APP_API_BASE_URL } = process.env;

function Search() {
    const history = useHistory();
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [noReservationsFound, setNoReservationsFound] = useState(false);
  
    const handleInputChange = (event) => {
      setMobileNumber(event.target.value);
    };
  
    const handleSearch = async (event) => {
      event.preventDefault();
  
      // Remove all non-numeric characters from the mobile number
      const formattedMobileNumber = mobileNumber.replace(/\D/g, "");
  
      try {
        const response = await fetch(`/reservations?mobile_number=${formattedMobileNumber}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
          setNoReservationsFound(data.length === 0);
        } else {
          setReservations([]);
          setNoReservationsFound(true);
        }
      } catch (error) {
        console.error("Error occurred while searching:", error);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            value={mobileNumber}
            onChange={handleInputChange}
          />
          <button type="submit">Find</button>
        </form>
        {noReservationsFound && <p>No reservations found</p>}
        {/* Display the reservations using the same component as the /dashboard page */}
        {/* Render the reservations list here */}
      </div>
    );
}

export default Search;