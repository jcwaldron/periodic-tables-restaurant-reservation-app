import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function NewReservation({ reservations,
  error, setError, setReservations
}) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const abortController = new AbortController();
    formData.people = Number(formData.people);
  
    try {
      const response = await createReservation(
        formData,
        abortController.signal
      );
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        setReservationsError(error);
      }
    }
    return () => abortController.abort();
  };
  
  return (
    <>
      <ErrorAlert error={reservationsError} />
      <ReservationForm
        initialformData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}