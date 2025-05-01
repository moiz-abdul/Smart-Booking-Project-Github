import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/projectmis.css";

const ProjectMis = () => {
  return (
    <div className="project-mis-section">
      {/* Hero Section */}
      <div className="mis-hero text-center text-white">
        <h1 className="display-4">Project Management Information System</h1>
        <p className="lead">
          Track, manage, and optimize your projects with efficiency.
        </p>
      </div>

      {/* MIS Content Section */}
      <div className="container-fluid mis-content py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="mis-card">
              <h3 className="mis-card-title">Project Overview</h3>
              <p className="mis-card-text">
                Get a bird's eye view of all your projects with detailed
                insights and status tracking.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="mis-card">
              <h3 className="mis-card-title">Resource Management</h3>
              <p className="mis-card-text">
                Allocate and manage your resources effectively for maximum
                productivity.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="mis-card">
              <h3 className="mis-card-title">Performance Analytics</h3>
              <p className="mis-card-text">
                Analyze performance metrics and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mis-cta text-center py-4">
        <h2 className="mb-3">Ready to Transform Your Workflow?</h2>
        <button className="btn btn-primary btn-lg px-5">Get Started</button>
      </div>
    </div>
  );
};

export default ProjectMis;
