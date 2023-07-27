import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const { REACT_APP_API_BASE_URL } = process.env;


function NewReservation(){
  const history = useHistory();
  const [error, setError] = useState(null);

// v this section loads all reservations v
  const [reservations, setReservations] = useState([]);


  useEffect(()=>{
    async function loadReservations() {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/reservations/new`);
      const reservationList = await response.json();
      setReservations(reservationList);
    }
    loadReservations();
  }, [setReservations])


// ^ this section loads all reservations ^

    let initialFormData = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
      }

    const [formData, setFormData] = useState(initialFormData);

    function handleInput(event) {
      const { name, value } = event.target;
    
      // Parse the "people" value to a number if the field name is "people"
      const parsedValue = name === "people" ? parseInt(value, 10) : value;
    
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parsedValue,
      }));
    }
    
  
    async function handleFormSubmit(event) {
      event.preventDefault();
      const numberOfPeople = parseInt(formData.people, 10);

      // Combine date and time to form a complete datetime string
      const completeDateTime = `${formData.reservation_date}T${formData.reservation_time}:00.000Z`;

      try {
        const response = await fetch(`${REACT_APP_API_BASE_URL}/reservations/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name,
              mobile_number: formData.mobile_number,
              reservation_date: completeDateTime,
              reservation_time: formData.reservation_time,
              people: numberOfPeople, // Use the parsed value
            },
          }),
        });
    
        if (response.ok) {
          // Handle success
          const newReservation = await response.json();
          // Update UI or perform any necessary actions
          console.log("Reservation created:", newReservation);
          setFormData(initialFormData); // Reset the form after successful submission
    
          history.push("/dashboard");
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
    

// Event handler for the "Cancel" button
  function handleCancel() {
    history.push("/dashboard");
  }

    return (
        <main>

    <form name="create" onSubmit={handleFormSubmit}>
      <table>
        <tbody>
          <tr>
            <td id="first_nameId">
              <input id="first_name" name="first_name" required={true} placeholder="First Name" onChange={handleInput} />
            </td>
            <td id="last_nameId">
             <input id="last_name" name="last_name" required={true} placeholder="Last Name" onChange={handleInput} />
            </td>
            <td id="mobileId">
             <input id="mobile_number" name="mobile_number" required={true} placeholder="Mobile number" onChange={handleInput} />
            </td>
            <td id="dateId">
             <input id="reservation_date" name="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" required={true} onChange={handleInput} />
            </td>
            <td id="timeId">
             <input id="reservation_time" name="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" required={true} onChange={handleInput} />
            </td>
            <td id="peopleId">
             <input id="people" name="people" type="number" placeholder="number of guests" required={true} onChange={handleInput} />
            </td>
            <td id="submBtnID">
              <button type="submit">Create</button>
            </td>
            <td id="cancelBtnID">
              <button type="cancel" onClick={() => handleCancel()}>Cancel</button>
            </td>
          </tr>

        </tbody>
      </table>
    </form>

            {error && <ErrorAlert error={error} />}
        </main>
    )
}

export default NewReservation;