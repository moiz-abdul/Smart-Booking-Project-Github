import React, { useState, useEffect } from "react";
import "./Crousel.css";


export default function Carousel ()
{
  return(
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>

  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="/assets/images/crouselimg1.jpeg" class="d-block w-100" alt="First Slide" />
      <div class="info-box">
        <h2>Slide 1 Project</h2>
        <img src="/assets/images/zigzagline.png" alt="Divider" class="line-image" />
        <p>This is a detailed explanation of the first project. It explains key points about the image.</p>
        <button class="read-more-btn">Read More</button>
      </div>
    </div>

    <div class="carousel-item">
      <img src="/assets/images/crouselimg2.jpeg" class="d-block w-100" alt="Second Slide" />
      <div class="info-box">
        <h2>Slide 2 Project</h2>
        <img src="/assets/images/zigzagline.png" alt="Divider" class="line-image" />
        <p>This is a detailed explanation of the second project. It explains key points about the image.</p>
        <button class="read-more-btn">Read More</button>
      </div>
    </div>

    <div class="carousel-item">
      <img src="/assets/images/crouselimg3.jpeg" class="d-block w-100" alt="Third Slide" />
      <div class="info-box">
        <h2>Slide 3 Project</h2>
        <img src="/assets/images/zigzagline.png" alt="Divider" class="line-image" />
        <p>This is a detailed explanation of the third project. It explains key points about the image.</p>
        <button class="read-more-btn">Read More</button>
      </div>
    </div>
  </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

  )
}
