import React, { Fragment, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//internal imports
import homeHero from "../images/cta-background.jpg";

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (key, val) => {
    setContactData({ ...contactData, [key]: val });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (contactData.name == "" || contactData.email == "") {
      setMessage("Fill in required fields");
      return;
    }
    fetch("/contact_form/entries", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(contactData),
    }).then((response) => {
      if (response) {
        if (response.status === 201) {
          setMessage(
            "Thank you for your message. We will be in touch shortly."
          );
        } else {
          setMessage("Your message was unsuccessful. Please resubmit.");
        }
      }
    });
  };
  return (
    <>
      <Container className="hero">
        <Row>
          <Col className="welcome-section">
            <h1>Heading One Here.</h1>
            <h2>Heading two here.</h2>
            <p className="hero-p">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </Col>
          <Col>
              <img src={homeHero}/>
            </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <h1>Contact Us For More Information.</h1>
          </Col>
        </Row>

        <form className="form">
          <Row>
            <Col>
              <label htmlFor="name">Name:</label>
              <input
                value={contactData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                type="text"
                id="name"
                name="name"
                required
              />
            </Col>
            <Col>
              <label htmlFor="email">Email:</label>
              <input
                value={contactData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                type="email"
                id="email"
                required
              />
            </Col>
            <Col>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                value={contactData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                type="phoneNumber"
                id="phoneNumber"
                placeholder="xxx-xxx-xxxx"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <label htmlFor="content">Content</label>
              <textarea
                type="text"
                value={contactData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows="3"
                cols="30"
                name="content"
                id="content"
                required
              ></textarea>
            </Col>
          </Row>

          <Row>
            <Col>
              <input
                type="submit"
                onClick={onSubmit}
                value="Submit"
                className="button-contact"
              />
              <p>{message}</p>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  );
};

export default Contact;
