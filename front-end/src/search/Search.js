import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationList";

function Search({
  error, setError, reservations, setReservations
}) {
    const [display, setDisplay] = useState(false);
    const [mobile, setMobile] = useState("");
  
    const handleInputChange = (event) => {
      setMobile(event.target.value);
    };
  

    async function handleSearch(event) {
      event.preventDefault();
      const abortCont = new AbortController();
      try {
        const reservations = await listReservations(
          { mobile_number: mobile },
          abortCont.signal
        );
        setReservations(reservations);
        setDisplay(true);
      } catch (error) {
        setError(error);
      }
      return () => abortCont.abort();
    }
  
    return (
      <>
        <div className="d-flex pt-3">
          <h3>Search</h3>
        </div>
        <div className="pt-3 pb-3">
          <form className="formInput" onSubmit={handleSearch}>
            <input
              name="mobile_number"
              id="mobile_number"
              onChange={handleInputChange}
              placeholder="Enter a customer's phone number"
              value={mobile}
              className="form-control"
              required
            />
            <div className="pt-2">
              <button type="submit" className="btn btn-primary">
                Find
              </button>
            </div>
          </form>
        </div>
        {display && (
          <div>
            {reservations.length ? (
              <ReservationsList
                reservations={reservations}
                setReservations={setReservations}
                setError={setError}
              />
            ) : (
              <h3>No reservations found</h3>
            )}
          </div>
        )}
      </>
    );
}

export default Search;