import React from "react";
import { Link } from "react-router-dom";

function ReservationItem({ reservation }) {
  const { reservation_id, first_name, last_name, reservation_date, reservation_time, mobile_number, people, status } = reservation;

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
        {status === "booked" || status === "seated" ? (
          <Link to={`/reservations/${reservation_id}/edit`} className="btn btn-secondary mt-1">
            Edit
          </Link>
        ) : null}

      </div>
    </div>
  );
}

export default function ReservationsList({ reservations }) {
  return reservations.map((reservation) => <ReservationItem key={reservation.reservation_id} reservation={reservation} />);
}
