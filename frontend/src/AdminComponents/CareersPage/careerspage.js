import React, { useState, useEffect } from 'react';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './careerspage.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-toggle/css/bootstrap-toggle.min.css";
import "bootstrap-toggle/js/bootstrap-toggle.min";
import UploadJobsModal from "../UploadjobsModal/uploadjobs";

const sortIcon = <ArrowDownward />;

const AdminJobsDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isCreateJobOpenModal, setIsCreateJobOpenModal] = useState(false);

  const OpenCreateJobModal = () => setIsCreateJobOpenModal(true);
  const CloseCreateJobModal = () => setIsCreateJobOpenModal(false);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;  
  const handlePageChange = (event, value) => setPage(value);

  const paginatedData = filteredJobs.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  useEffect(() => {
    const FetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        console.log("API response is: ", response.data);
        setJobs(response.data.data);
        setFilteredJobs(response.data.data);
      } catch (err) {
        console.error('Error Fetching Data of Jobs:', err);
      }
    };
    FetchJobs();
  }, []);

  useEffect(() => {
    setFilteredJobs(
      jobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, jobs]);

  const handleToggle = (jobId, currentStatus) => {
    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );
    axios.put(`http://localhost:5000/api/jobs/update/${jobId}`, { status: newStatus })
      .then(response => console.log("Job status updated in backend"))
      .catch(err => console.error("Error updating job status in backend", err));
  };

  const handleUpdate = (jobId) => {
    console.log("Update job: ", jobId);
  };

  const handleDelete = (jobId) => {
    console.log("Delete job: ", jobId);
  };

  const columns = [
    { name: <b style={{ fontSize: '16px' }}>Job Title</b>, selector: row => row.jobTitle, sortable: true },
    { name: <b style={{ fontSize: '16px' }}>Job Type</b>, selector: row => row.jobType, sortable: true },
    { name: <b style={{ fontSize: '16px' }}>Seniority</b>, selector: row => row.seniority, sortable: true },
    { name: <b style={{ fontSize: '16px' }}>Vacancies</b>, selector: row => row.vacancies, sortable: true },
    { name: <b style={{ fontSize: '16px' }}>Last Date</b>, selector: row => new Date(row.lastDate).toLocaleDateString(), sortable: true },
    { name: <b style={{ fontSize: '16px' }}>Experience</b>, selector: row => `${row.experience} years`, sortable: true },
    {
      name: <b style={{ fontSize: '16px' }}>Status</b>,
      selector: row => row.status,
      cell: (row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={row.status === 'on'}
            onChange={() => handleToggle(row._id, row.status)}
          />
          <label className="form-check-label">{row.status === 'on' ? 'Active' : 'Inactive'}</label>
        </div>
      )
    },
    {
      name: <b style={{ fontSize: '16px' }}>Actions</b>,
      cell: (row) => (
        <div>
          <EditIcon style={{ color: 'blue', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleUpdate(row._id)} />
          <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(row._id)} />
        </div>
      )
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Job Postings</h1>
        <button className="btn btn-success" onClick={OpenCreateJobModal}>Add Job</button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Job Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <p><b>Total Job Postings:</b> {filteredJobs.length}</p>
      <DataTable
        columns={columns}
        data={filteredJobs}
        sortIcon={sortIcon}
        highlightOnHover
        pointerOnHover
        customStyles={{
          rows: {
            style: {
              border: '1px solid #ddd',
            }
          },
          headCells: {
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#f5f5f5',
            }
          },
        }}
      />
      <Stack spacing={2} className="d-flex justify-content-end mt-3"  >
  <Pagination count={Math.ceil(filteredJobs.length / rowsPerPage)} page={page} onChange={handlePageChange} variant="outlined" color="success" />
</Stack>

      <UploadJobsModal show={isCreateJobOpenModal} onClose={CloseCreateJobModal} onSave={CloseCreateJobModal} title="Create Job" />
    </div>
  );
};

export default AdminJobsDashboard;
