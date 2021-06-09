import { BiPlusMedical } from "react-icons/bi";
import "tailwindcss/tailwind.css"
import Search from "./component/Search"
import AddAppointment from "./component/AddAppointment"
import AppointmentInfo from "./component/AppointmentInfo"
import { useState, useEffect, useCallback } from 'react'
import './App.css';

function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("ownerName");
  let [orderBy, setOrderBy] = useState("asc");
  const filteredAppointments = appointmentList.filter(
    item => {
      return(
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a,b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return(
      a[sortBy].toLowerCase() <
      b[sortBy].toLowerCase() ? -1*order : 1*order
    )
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      setAppointmentList(data)
    });
  }, [])
  
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div className="App cotainer mx-auto mt-3 font-thin">
      <h1 className ="text-5xl"> 
      <BiPlusMedical className = "inline-block text-red-400"/> Your Appointments 
      </h1> 
      <AddAppointment onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])} 
      lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id): max, 0)}
      />
      <Search query={query}
      onQueryChange={myQuery => setQuery(myQuery)}
      orderBy={orderBy}
      onOrderByChange={mySort => setOrderBy(mySort)}
      sortBy={sortBy}
      onSortByChange={mySort => setSortBy(mySort)}
      
      />

      <ul className="divide-y divide-gray">
        {filteredAppointments.map(appointment => (
          <AppointmentInfo appointment={appointment}
          onDeleteAppointment = {
            appointmentId => 
            setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId  ))
          } />
        ))}


      </ul>

      
    </div>
  );
}

export default App;
