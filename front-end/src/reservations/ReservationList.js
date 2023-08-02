import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";

function ReservationItem({ reservation, setReservations, date}) {
  const { reservation_id, first_name, last_name, reservation_date, reservation_time, mobile_number, people, status } = reservation;

  const [error, setError] = useState(null);

  const history = useHistory();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    try {
      const data = await listReservations({date}, abortController.signal);
      setReservations(data);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  async function handleCancelReservation(e) {
    e.preventDefault();
    const ac = new AbortController();
    
    const confirm = window.confirm(
      "Are you sure you want to cancel this reservation? This cannot be undone."
    )

    if (confirm) {

    try {
      await cancelReservation(reservation_id, ac.signal);
      loadDashboard();
    } catch (error) {
      setError(error);
    }
    return () => ac.abort();
  }
}


  return (
    <div key={reservation_id} className="mr-4">
      <div>Reservation ID: {reservation_id}</div>
      <div>
        {first_name} {last_name}
      </div>
      <div>Date: {reservation_date}</div>
      <div>Time: {reservation_time}</div>
      <div>Mobile: {mobile_number}</div>
      <div>Party: {people}</div>
      <div data-reservation-id-status={reservation_id}>Status: {status}</div>
      <div>
        {status === "booked" && (
          <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-primary mr-1 mt-1">
            Seat
          </Link>
        )}
        {status === "booked" || status === "seated" || status === "canceled" ? (
          <Link to={`/reservations/${reservation_id}/edit`} className="btn btn-secondary mt-1 mr-1">
            Edit
          </Link>
        ) : null}
        {status === "booked" || status === "seated" ? (
          <button onClick={handleCancelReservation} className="btn btn-danger mt-1">
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function ReservationsList({ reservations, setReservations, setReservationsError, date }) {
  return reservations.map((reservation) => <ReservationItem key={reservation.reservation_id} 
  reservation={reservation} 
  setReservations={setReservations}
  setReservationsError={setReservationsError}
  date={date}/>);
}
