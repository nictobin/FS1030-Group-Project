import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

const Contact =(props)=>(
  <div>
    <p>Name:{props.data.name}</p>
    <p>Email:{props.data.email}</p>
    <p>Phone Number:{props.data.phoneNumber}</p>
    <br/>
  </div>
)

const ContactEntries = () => {
  const [contacts, setContacts]=useState([])
  
  
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    fetch("/contact_form/entries", {
      headers: {
        token: access_token,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setContacts(response)
      });
  }, []);

  return (
    <>
      <div>
        <h1>Contact Entries</h1>
        <p>Please see below for entries list.</p>
        {
          contacts.map(contact=>(
            <Contact key={contact.id} data={contact} />
          ))
        }
      </div>
    </>
  );
};

export default ContactEntries;
