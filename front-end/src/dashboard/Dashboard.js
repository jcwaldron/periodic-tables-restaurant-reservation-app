import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationList";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
const { REACT_APP_API_BASE_URL } = process.env;

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({today,
    reservations, setReservations,
    reservationsError, setReservationsError,
    tables, setTables, fetchTables, error, setError
}) {
  const query = useQuery();
  let date = query.get("date");
 
  // if no date is queried, dashboard loads today as date
  if (!date){
    date = today;
  }

  // load dashboard based on date
  useEffect(loadDashboard, [date, setReservations, setReservationsError]);

  // fetch reservations for queried date
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  // fetch tables

  async function fetchTables() {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/tables`);
      const {data} = await response.json();
      setTables(data);
      return data;
    } catch (error) {
      console.error("Error fetching tables:", error.message);
      setError("Error fetching tables.");
      return [];
    }
  }
  
  
  // Helper function to add or subtract days from a date
  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  }

    // changes reservation status from seated to finished
  async function finishedStatus(reservationId){

    try {
        const response = await fetch(`${REACT_APP_API_BASE_URL}/reservations/${reservationId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              status: "finished"
            },
          }),
        });

        const {data} = await listReservations();
        setReservations(data);
    
        if (response.ok) {
          // Handle success
          const finishedReservation = await response.json();
          // Update UI or perform any necessary actions
          console.log("Reservation finished:", finishedReservation);       
          
        } else {
          // Handle error
          try {
            const errorData = await response.json();
            setError(errorData.message);
          } catch (error) {
            setError("An error occurred while processing the request.");
          }
        }
      } catch (error) {
        // Handle network or other errors
        setError(error.message);
      }
}

// Function to handle table finish confirmation
async function handleFinishConfirmation(table_id) {
  if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
    try {
      // Send a DELETE request to remove the table assignment
      const response = await fetch(`${REACT_APP_API_BASE_URL}/tables/${table_id}/seat`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Table is not occupied.");
      }

      // Call finishedStatus here with the reservation_id as an argument
      const reservation_id = tables.find((table) => table.table_id === table_id)?.reservation_id;
      console.log("Found Reservation ID:", reservation_id); // Debugging statement
      if (reservation_id) {
        await finishedStatus(reservation_id);
      }

      // Fetch the updated table data
      await fetchTables();
      loadDashboard();
      console.log("Table unseated successfully.");
    } catch (error) {
      console.error("Error removing table assignment:", error.message);
    }
  }
}




// create display for tables
  const listOfTables = tables.map(({table_name, table_id, capacity, reservation_id}) => {

    // create a display to indicate the table booking status
    const tableStatus = (table) => {
      if (reservation_id) {
        // If a reservation is seated at the table
        return (
          <div>
            <div data-table-id-status={table_id} className="occupied">Occupied</div>
            <button data-table-id-finish={table.table_id} className="mt-1" onClick={() => handleFinishConfirmation(table_id)}>Finish</button>
          </div>
        );
      } else {
        // If no reservation is seated at the table
        return (
          <div data-table-id-status={table_id} className="free">Free</div>
        );
      }
    };

    return (

        <div key={table_id} className="indTable">
          <div>Table: {table_name}</div>
          <div>Capacity: {capacity}</div>
          <div>{tableStatus(table_id)}</div> 
         </div>

    )
  }) 


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
      <Link to={`/dashboard?date=${addDays(date, -1)}`} className="btn btn-secondary m-1">
          Previous
        </Link>
        <Link to={`/dashboard`} className="btn btn-primary m-1">
          Today
        </Link>
        <Link to={`/dashboard?date=${addDays(date, 1)}`} className="btn btn-secondary m-1">
          Next
        </Link>
      </div>
      <div className="d-md-flex mb-3">
        <div id="reservationsSection" className="d-md-flex mb-3">
          <ReservationsList reservations={reservations}/>
        </div>
        <div className="tablesSection">
          <h4>Tables</h4>
          <div className="tableContainer">
            {listOfTables}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
