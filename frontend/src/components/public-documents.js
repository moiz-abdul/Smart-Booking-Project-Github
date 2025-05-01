import React from "react";
import "./css/publicdocument.css";

export default function Public_Documents()
{
    return (
        <div className="public-documents-section">
      <div className="documents-hero">
        <h1 className="title">Public Documents</h1>
        <p className="subtitle">
          Access and download important public documents for your reference.
        </p>
      </div>
      <div className="documents-content">
        <div className="documents-list">
          <div className="document-card">
            <img
              className="document-image"
              src="https://via.placeholder.com/150"
              alt="Annual Report"
            />
            <div className="document-details">
              <h3 className="document-title">Annual Report 2024</h3>
              <p className="document-description">
                View the detailed financial and operational summary for the
                year 2024.
              </p>
            </div>
            <button className="cta-button">Download</button>
          </div>

          <div className="document-card">
            <img
              className="document-image"
              src="https://via.placeholder.com/150"
              alt="Procurement Guidelines"
            />
            <div className="document-details">
              <h3 className="document-title">Procurement Guidelines</h3>
              <p className="document-description">
                Learn more about our procurement processes and policies.
              </p>
            </div>
            <button className="cta-button">Download</button>
          </div>

          <div className="document-card">
            <img
              className="document-image"
              src="https://via.placeholder.com/150"
              alt="Compliance Documentation"
            />
            <div className="document-details">
              <h3 className="document-title">Compliance Documentation</h3>
              <p className="document-description">
                Review the guidelines for maintaining compliance with industry
                standards.
              </p>
            </div>
            <button className="cta-button">Download</button>
          </div>

          <div className="document-card">
            <img
              className="document-image"
              src="https://via.placeholder.com/150"
              alt="Financial Statements"
            />
            <div className="document-details">
              <h3 className="document-title">Financial Statements</h3>
              <p className="document-description">
                Access our detailed financial reports and performance reviews.
              </p>
            </div>
            <button className="cta-button">Download</button>
          </div>
    </div> </div>
    </div>
    )
}