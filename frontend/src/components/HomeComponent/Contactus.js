import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Contactus.css';


const ContactUs = () => {
    return (
      <section className="contact-us py-4 alignment">
  <div className="">
    <h2 className="section-title mb-4 text-center heading">Contact Us</h2>
    <div className="row align-items-center container">
      <div className="col-md-6">
        <ul className="contact-details list-unstyled">
          <li className="contact-item">
            <span className="material-symbols-outlined contact-icon">call</span>
            021-34166274
          </li>
          <li className="contact-item">
            <span className="material-symbols-outlined contact-icon">call</span>
            0800-90090
          </li>
          <li className="contact-item">
            <span className="material-symbols-outlined contact-icon">mail</span>
            info@sferp.gos.pk
          </li>
          <li className="contact-item">
            <span className="material-symbols-outlined contact-icon">home</span>
            House#D1, Street-1, Block-3 Clifton, Karachi Sindh
          </li>
        </ul>
      </div> 
      <div className="col-md-6">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.2749703486583!2d67.02776941539185!3d24.861462984052834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ffdf850f30b%3A0x7d26a06f5c9fc7d0!2sClifton%2C%20Karachi%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1697997293983!5m2!1sen!2s"
            width="100%"
            height="300"
            style={{ border: "10", marginbottoom: "-2px"}} 
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Organization Location"
            className="frame"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

    );
  };

  export default ContactUs;