import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import Seat from "../reservations/Seat";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

const { REACT_APP_API_BASE_URL } = process.env;

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  
  // state holders for reservations and errors
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [error, setError] = useState();
  
  // tables state holder
  const [tables, setTables] = useState([]);

  // load tables table
  async function fetchTables() {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/tables`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });  
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const tablesData = await response.json();
      return tablesData; // Return the fetched data
      
    } catch (error) {
      console.log("Error fetching data:", error);
      return error; // Return an empty array in case of error
    }
  };

  useEffect(() => {
  fetchTables()
    .then(({data}) => setTables(data))
    .catch((error) => console.error("Error setting tables:", error));
  }, []);
  

  // ROUTES
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard today={today()}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError} 
          tables={tables} setTables={setTables}
          fetchTables={fetchTables}
          error={error}
          setError={setError}
          />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <Seat        
        reservations={reservations} 
        setReservations={setReservations}
        tables={tables} setTables={setTables}
        fetchTables={fetchTables}
        error={error}
        setError={setError}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
