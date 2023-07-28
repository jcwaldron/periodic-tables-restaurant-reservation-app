import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const { REACT_APP_API_BASE_URL } = process.env;

function NewTable() {

    let initialFormData = {
        table_name: '',
        capacity: ''
      }

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);
    const history = useHistory();
    
    function handleInput(event) {
        const { name, value } = event.target;
      
        // Parse the "capacity" value to a number if the field name is "capacity"
        const parsedValue = name === "capacity" ? parseInt(value, 10) : value;
      
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: parsedValue,
        }));
      }

      async function handleFormSubmit(event) {
        event.preventDefault();
        const numberCapacity = parseInt(formData.capacity, 10);
  
        try {
          const response = await fetch(`${REACT_APP_API_BASE_URL}/tables/new`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                table_name: formData.table_name,
                capacity: numberCapacity // use parsed value
              },
            }),
          });
      
          if (response.ok) {
            // Handle success
            const newTable = await response.json();
            // Update UI or perform any necessary actions
            console.log("Table created:", newTable);
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
            <h1>Create Table</h1>
            <form name="create" onSubmit={handleFormSubmit}>
      <table>
        <tbody>
          <tr>
            <td id="table_nameId">
              <input id="table_name" name="table_name" required={true} placeholder="Table Name" onChange={handleInput} />
            </td>
            <td id="capacityId">
             <input id="capacity" name="capacity" required={true} type="number" placeholder="Capacity" onChange={handleInput} />
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
       
        );
}

export default NewTable;