import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { modifyReservation, findReservation } from "../utils/api";

function ReservationForm({
  initialformData,
  handleFormChange,
  handleSubmit, error, setError
}) {
  const history = useHistory();
  const {reservation_id} = useParams();
  const [reservationData, setReservationData] = useState();

  const handleCancelReservation = async () => {
    const abortController = new AbortController();
    try {
      await modifyReservation(reservation_id, { status: "cancelled" }, abortController.signal);
      // Refresh the reservation data
      const updatedReservation = await findReservation(reservation_id, abortController.signal);
      setReservationData(updatedReservation);
    } catch (error) {
      setError(error);
    } finally {
      abortController.abort();
      history.push("/dashboard")
    }
  };

  const handleCancel = () => {
    history.goBack();
  };
  

  return (
    initialformData && (
      <form onSubmit={handleSubmit} className="form-group">
        <fieldset>
          <legend className="d-flex">
            <h3>Create Reservation</h3>
          </legend>
          <div className="pb-1">
            <input
              type="text"
              name="first_name"
              className="formInput"
              id="first_name"
              placeholder={initialformData?.first_name || "First Name"}
              value={initialformData?.first_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-1">
            <input
              type="text"
              name="last_name"
              className="formInput"
              id="last_name"
              placeholder={initialformData?.last_name || "Last Name"}
              value={initialformData?.last_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-1">
            <input
              type="tel"
              name="mobile_number"
              className="formInput"
              id="mobile_number"
              placeholder={initialformData?.mobile_number || "Mobile number"}
              value={initialformData?.mobile_number}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-1">
            <input
              type="number"
              name="people"
              className="formInput"
              id="people"
              placeholder="Party"
              value={initialformData?.people === 0 ? "" : initialformData?.people}
              onChange={handleFormChange}
            />
          </div>

          <input
            type="date"
            name="reservation_date"
            className="formInput mb-1"
            id="reservation_date"
            placeholder={initialformData?.reservation_date || "YYY-MM-DD"}
            value={initialformData?.reservation_date}
            onChange={handleFormChange}
            required
          />
          <input
            type="time"
            name="reservation_time"
            className="formInput"
            id="reservation_time"
            placeholder={initialformData?.reservation_time || "HH:MM"}
            value={initialformData?.reservation_time}
            onChange={handleFormChange}
            required
          />
        </fieldset>
        <div className="d-flex pt-2">
        <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
          {!reservation_id && (
            <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          )}
          {reservation_id && (
            <button type="button" className="btn btn-danger" onClick={handleCancelReservation}>
            Cancel Reservation
            </button>
          )}
        </div>
      </form>
    )
  );
}

export default ReservationForm;