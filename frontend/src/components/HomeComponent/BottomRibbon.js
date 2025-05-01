import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './BottomRibbon.css';

const BottomRibbon = () =>
{
    return(
        <section className="bottomRibbon container-fluid py-4">
  <div className="row text-white container">
    {/* Column 1 */}
    <div className="col-md-4">
      <h3 className="mb-3">About Our Platform</h3>
      <p>
        Our platform provides exceptional services and features designed to enhance your experience. 
        Stay connected, informed, and up-to-date with our latest innovations. 
        Discover opportunities and solutions tailored to your needs.
      </p>
    </div>

    {/* Column 2 */}
    <div className="col-md-4 text-center">
      <h3 className="mb-3">Quick Links</h3>
      <a href="/register" className="text-white d-block mb-2">Register</a>
      <a href="/login" className="text-white d-block">Login</a>
    </div>

    {/* Column 3 */}
    <div className="col-md-4">
      {/* Row 1: Contact Details */}
      <h3 className="mb-3">Contact Us</h3>
      <p><span className="material-symbols-outlined">call</span> 021-34166274</p>
      <p><span className="material-symbols-outlined">call</span> 0800-90090</p>
      <p><span className="material-symbols-outlined">email</span> info@sferp.gos.pk</p>
      <p><span className="material-symbols-outlined">home</span> House#D1, Street-1, Block-3 Clifton, Karachi Sindh</p>

      {/* Row 2: Visitor Details */}
      <div className="visitor-details mt-3 p-3 text-left">
        <h4 ><b>Total Visitors</b></h4>
        <div className="visitor-count bg-black text-white">1289530</div>
        <p className="mt-3">
          <span className="material-symbols-outlined">person</span> Users Today:
          <span className="visitor-today ms-2">150</span>
        </p>
      </div>
    </div>
  </div>
</section>
    );
};
export default BottomRibbon;