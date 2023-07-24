import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const { REACT_APP_API_BASE_URL } = process.env;



function NewReservation(){
  const history = useHistory();


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
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    }
  
    async function handleFormSubmit(event) {
      event.preventDefault();
    
      try {
        const response = await fetch(`${REACT_APP_API_BASE_URL}/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
          console.log("Error creating reservation");
        }
      } catch (error) {
        // Handle network or other errors
        console.log("Error:", error.message);
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
             <input id="people" name="people" placeholder="number of guests" required={true} onChange={handleInput} />
            </td>
            <td id="submBtnID">
              <button type="submit">Create</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <td id="cancelBtnID">
              <button type="cancel" onClick={() => handleCancel()}>Cancel</button>
            </td>
        </main>
    )
}

export default NewReservation;