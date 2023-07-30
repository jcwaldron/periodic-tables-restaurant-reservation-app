import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

const {REACT_APP_API_BASE_URL} = process.env;

function Seat({tables, setTables, reservations}){
    const { reservationId } = useParams();
    const history = useHistory();
    const [error, setError] = useState();

    // handles submitting the form
   async function handleSubmit(event){
        event.preventDefault();
        const tableId = event.target.table_id.value;

        try {
            const response = await fetch(`${REACT_APP_API_BASE_URL}/tables/${tableId}/seat`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  reservation_id: reservationId
                },
              }),
            });
        
            if (response.ok) {
              // Handle success
              const updatedTable = await response.json();
              // Update UI or perform any necessary actions
              console.log("Table updated:", updatedTable);
        
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
    history.goBack();
  }


    return (
        <form onSubmit={handleSubmit} onCancel={handleCancel}>
            <div className="selector">
                <h1>Seating Reservation {reservationId}</h1>
                <label htmlFor="table_id">Choose table for party:</label>
                <div>
                    <select name="table_id" id="table_id">
                    {/* Generate options dynamically based on the tables data */}
                    {tables.map((table) => (
                    <option key={table.table_id} value={table.table_id}>
                        {table.table_name} - {table.capacity}
                    </option>
                    ))}
                     </select>
                </div>
                <button className="mt-2" type="submit">Submit</button>
                <button className="mt-2 ml-2" type="cancel">Cancel</button>
            </div>
        </form>
    )
}

export default Seat;