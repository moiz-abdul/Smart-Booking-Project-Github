import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Gallery.css';

const Gallery = () => {
    return (
      <section className="gallery py-5 alignment">
        <div className="text-center">
          <h2 className="section-title mb-4 heading">Photo Gallery</h2>
          <div className="row">
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg1.jpeg"
                alt="Gallery Image 1"
                className="img-fluid gallery-image mb-3"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg2.jpeg"
                alt="Gallery Image 2"
                className="img-fluid gallery-image mb-3"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg3.jpeg"
                alt="Gallery Image 3"
                className="img-fluid gallery-image mb-3"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg4.jpeg"
                alt="Gallery Image 4"
                className="img-fluid gallery-image mb-3"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg5.jpeg"
                alt="Gallery Image 5"
                className="img-fluid gallery-image mb-3"
              />
            </div>
            <div className="col-md-4">
              <img
                src="/assets/images/galleryimg6.jpeg"
                alt="Gallery Image 6"
                className="img-fluid gallery-image mb-3"
              />
            </div>
          </div>
          <div className="mt-3">
            <a href="/gallery" className="btn btn-outline-success">
              View More
            </a>
          </div>
        </div>
      </section>
    );
  };

  export default Gallery;