import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Aboutus.css';

export default function AboutUs ()  {
    return (
      <section className="about-us py-4 alignment text-center">
  <div className="">
    <h2 className="section-title mb-4 heading">About Us</h2>

    <div className="row align-items-center about-row container">
      <div className="col-md-6">
        <img
          src="/assets/images/aboutimg1.jpeg"
          alt="About Image 1"
          className="img-fluid about-img"
        />
      </div>
      <div className="col-md-6">
        <div className="about-text">
          <h3>Our Mission</h3>
          <p>
            We are committed to driving positive change through innovative projects and solutions. 
            Our mission is to make a significant impact on the world, one step at a time.
          </p>
        </div>
      </div>
    </div>

    <div className="row align-items-center about-row container">
   
      <div className="col-md-6 order-md-2">
        <img
          src="/assets/images/aboutimg2.jpeg"
          alt="About Image 2"
          className="img-fluid about-img"
        />
      </div>
      <div className="col-md-6 order-md-1">
        <div className="about-text">
          <h3>Our Vision</h3>
          <p>
            To be a leading organization in innovation and technology, working towards a better future for everyone.
          </p>
        </div>
      </div>
    </div>

    <div className="row align-items-center about-row container">
      
      <div className="col-md-6">
        <img
          src="/assets/images/aboutimg1.jpeg"
          alt="About Image 3"
          className="img-fluid about-img"
        />
      </div>
      <div className="col-md-6">
        <div className="about-text">
          <h3>Our Values</h3>
          <p>
            We believe in integrity, innovation, and inclusivity as the cornerstones of our work, ensuring a sustainable impact.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    );
  };

