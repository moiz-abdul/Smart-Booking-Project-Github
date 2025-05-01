import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopRibbon.css";

const TopRibbon = () => {
  return (
    <>
      {/* Ribbon */}
      <div className="container-fluid bg-light top-ribbon " >
          <div className="row d-flex justify-content-center align-items-center ">
            {/* Logo Section */}
            <div className="col-md-2 text-center">
                <img src="/assets/images/logo.png" alt="Organization Logo" className="logo"/>
            </div>
            {/* Oganization Name  */}
            <div className="col-md-3 text-start">
            <h1 className="org-name">Pakistan Meteorological Department</h1>
            <p className="org-subtitle">Government of Pakistan</p>
            </div>
            {/* Contact Details Section */}
            <div className="col-md-3">
              <ul className="contact-details list-unstyled">
                    <li>
                    <span className="material-symbols-outlined">call</span> Phone: 021-34166274
                  </li>
                  <li>
                    <span className="material-symbols-outlined">mail</span> info@pmd.gov.pk
                  </li>
                  <li>
                    <span className="material-symbols-outlined">location_on</span> Pitras Bukhari Rd, H-8/2, Islamabad
                  </li>
              </ul>
            </div>

                  {/* Organization Picture Section */}
              <div className="col-md-2 text-center">
                <img src="/assets/images/pmdu.jpg" alt="Organization" className="org-picture" />
              </div>
          </div>
      </div>
    </>
  );
};

export default TopRibbon;
