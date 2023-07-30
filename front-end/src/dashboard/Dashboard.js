import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
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
    tables, setTables
}) {
  const query = useQuery();
  let date = query.get("date");
 
  // if no date is queried, dashboard loads today as date
  if (!date){
    date = today;
  }

  // load dashboard based on date
  useEffect(loadDashboard, [date]);

  // fetch reservations for queried date
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // Helper function to add or subtract days from a date
  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  }

  // create display for reservations
  const listOfReservations = reservations.map(({
      reservation_id, first_name, last_name, reservation_date, reservation_time, mobile_number, people
  })=>{
    return (

        <div key={reservation_id} className="mr-4"> 
          <div>Reservation ID: {reservation_id}</div>
          <div>{first_name} {last_name}</div>
          <div>Date: {reservation_date}</div>
          <div>Time: {reservation_time}</div>
          <div>Mobile: {mobile_number}</div>
          <div>Party: {people}</div>
          <div>
            <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-primary mr-1 mt-1">Seat</Link>
          </div>
        </div>

    )
  })

// create display for tables
  const listOfTables = tables.map(({table_name, table_id, capacity, reservation_id}) => {

    // create a display to indicate the table booking status
    const tableStatus = (table) => {
      if (reservation_id) {
        // If a reservation is seated at the table
        return (
          <div data-table-id-status={table_id} className="occupied">Occupied</div>
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
  });

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
          {listOfReservations}
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
