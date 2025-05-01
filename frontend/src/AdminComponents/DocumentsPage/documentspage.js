import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./documentspage.css"; // Adjust styles as needed
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-toggle/css/bootstrap-toggle.min.css";
import "bootstrap-toggle/js/bootstrap-toggle.min";
// import UploadDocumentModal from "../UploadDocumentModal/uploaddocument"; // Adjust path as needed

const AdminDocumentsDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [isCreateDocumentOpenModal, setIsCreateDocumentOpenModal] = useState(false);

  // Open/Close Upload Document Modal
  const openCreateDocumentModal = () => setIsCreateDocumentOpenModal(true);
  const closeCreateDocumentModal = () => setIsCreateDocumentOpenModal(false);

  // Refresh documents after upload
  const handleSaveCreateDocument = () => {
    console.log("Document uploaded successfully");
    closeCreateDocumentModal();
    fetchDocuments();
  };

  // Fetch documents from backend
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/documents");
      console.log("Documents API response:", response.data);
      setDocuments(response.data.data || []); // Ensure it's always an array
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Toggle document status
  const handleToggle = (docId, currentStatus) => {
    const newStatus = currentStatus === "on" ? "off" : "on";

    // Update UI first
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc._id === docId ? { ...doc, status: newStatus } : doc
      )
    );

    // Send update request to backend
    axios
      .put(`http://localhost:5000/api/documents/update/${docId}`, { status: newStatus })
      .then(() => console.log("Document status updated successfully"))
      .catch((err) => console.error("Error updating document status", err));
  };

  return (
    <div className="container">
      <div className="row align-items-center" style={{ marginTop: "20px" }}>
        <div className="col-md-6">
          <h1 style={{ textAlign: "left" }}>Uploaded Documents</h1>
        </div>

       {/*
        <div className="col-md-6 text-end">
          <button className="btn btn-success" type="button" onClick={openCreateDocumentModal}>
            Add Document
          </button>
        </div>
        */}

      </div>

      <p className="container" style={{ textAlign: "left", marginTop: "10px", fontSize: "18px" }}>
        <b>Total Documents:</b> {documents.length}
      </p>

      <table className="table table-bordered container" style={{ marginBottom: "80px", marginTop: "40px" }}>
        <thead>
          <tr>
            <th scope="col">Document Title</th>
            <th scope="col">Description</th>
            <th scope="col">Document File</th>
            <th scope="col">Thumbnail</th>
            <th scope="col">Uploaded At</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => {
              const documentURL = doc.documentURL || ""; // Ensure a valid string
              const ext = documentURL ? documentURL.split('.').pop().toLowerCase() : "";
              const isPDF = ext === "pdf";
              const fileName = doc.documentName || "Untitled";
              const documentLink = documentURL ? `http://localhost:5000${documentURL}` : "#";
              const thumbnailURL = doc.documentThumbnailURL ? `http://localhost:5000${doc.documentThumbnailURL}` : null;

              return (
                <tr key={doc.id}>
                  <td>{fileName}</td>
                  <td>{doc.documentDescription || "No Description"}</td>
                  <td>
                    {documentURL ? (
                      <a
                        href={documentLink}
                        target={isPDF ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        {...(!isPDF && { download: true })}
                        style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}
                      >
                        View {fileName}.{ext}
                      </a>
                    ) : (
                      <span style={{ color: "red" }}>No File Available</span>
                    )}
                  </td>
                  <td>
                    {thumbnailURL ? (
                      <img
                        src={thumbnailURL}
                        alt="Thumbnail"
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    ) : (
                      <span style={{ color: "red" }}>No Thumbnail</span>
                    )}
                  </td>
                  <td>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`flexSwitchCheck${doc.id}`}
                        checked={doc.status === "on"}
                        onChange={() => handleToggle(doc.id, doc.status)}
                      />
                      <label className="form-check-label" htmlFor={`flexSwitchCheck${doc.id}`}>
                        {doc.status === "on" ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">No documents found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Upload Document Modal 
      <UploadDocumentModal
        show={isCreateDocumentOpenModal}
        onClose={closeCreateDocumentModal}
        onSave={handleSaveCreateDocument}
        title="Upload Document"
      /> */}
    </div>
  );
};

export default AdminDocumentsDashboard;
