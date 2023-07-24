import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({today}) {
  const query = useQuery();
  let date = query.get("date");
  
  if (!date){
    date = today;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

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


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <p>
      <Link to={`/dashboard?date=${addDays(date, -1)}`} className="btn btn-secondary m-1">
          Previous
        </Link>
        <Link to={`/dashboard`} className="btn btn-primary m-1">
          Today
        </Link>
        <Link to={`/dashboard?date=${addDays(date, 1)}`} className="btn btn-secondary m-1">
          Next
        </Link>
      </p>
    </main>
  );
}

export default Dashboard;
