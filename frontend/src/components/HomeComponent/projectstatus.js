import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './projectstatus.css';
import ProjectStatusPage from "../ProjectStatusComponent/projectstatus";
import { Route, Routes, Link } from "react-router-dom";

// Project Status Section ( Added below Crousel Section)
export default function ProjectStatus () {
    return (
      <section className="container-fluid project-status alignment">
  <div className="">
    <h2 className="text-center heading">Projects Status</h2>
    <div className="row container ">
      {/* First Project */}
      <div className="col-md-6 mb-4">
        <div className="project-container">
          <img src="/assets/images/projectimg1.jpeg" alt="Project One" className="project-image" />
          <h3 className="project-title">Project One</h3>
          <p className="project-details">The Pakistan Meteorological Department (PMD) has decided to purchase the most advanced equipment for early forecasting of weather change and unexpected situation.</p>
          <button className="btn btn-read-more">Read More</button>
        </div>
      </div>
      {/* Second Project */}
      <div className="col-md-6 mb-4">
        <div className="project-container">
          <img src="/assets/images/projectimg2.jpeg" alt="Project Two" className="project-image" />
          <h3 className="project-title">Project Two</h3>
          <p className="project-details">The Pakistan Meteorological Department (PMD) has decided to purchase the most advanced equipment for early forecasting of weather change and unexpected situation.</p>
          <button className="btn btn-read-more">Read More</button>
        </div>
      </div>
      {/* Third Project */}
      <div className="col-md-6 mb-4">
        <div className="project-container">
          <img src="/assets/images/projectimg3.jpeg" alt="Project Three" className="project-image" />
          <h3 className="project-title">Project Three</h3>
          <p className="project-details">The Pakistan Meteorological Department (PMD) has decided to purchase the most advanced equipment for early forecasting of weather change and unexpected situation.</p>
          <button className="btn btn-read-more">Read More</button>
        </div>
      </div>
      {/* Fourth Project */}
      <div className="col-md-6 mb-4">
        <div className="project-container">
          <img src="/assets/images/projectimg4.jpeg" alt="Project Four" className="project-image" />
          <h3 className="project-title">Project Four</h3>
          <p className="project-details">The Pakistan Meteorological Department (PMD) has decided to purchase the most advanced equipment for early forecasting of weather change and unexpected situation.</p>
          <button className="btn btn-read-more">Read More</button>
        </div>
      </div>
    </div>
    <div className="text-center mt-4">
      <Link style={{ textDecoration: "none" }} to="/projectstatus">
      <button className="btn btn-view-more">View More</button>
      </Link>
    </div>
  </div>
     
  <div>
        <Routes>
          <Route path="/projectstatus" element={<ProjectStatusPage/>} />
        </Routes>
  </div>
</section>

    );
  };