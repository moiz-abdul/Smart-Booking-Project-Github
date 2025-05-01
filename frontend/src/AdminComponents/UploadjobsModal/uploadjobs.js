import React, { useState } from "react";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "./uploadjobs.css";

const UploadJobsModal = ({ show, onClose, title }) => {
  const [JobData, setJobData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: "Permanent",
    seniority: "Naib Qasid",
    vacancies: "",
    lastDate: null,
    experience: "",
    ageLimit: { isOpen: true, min: 18, max: 55 },
    ageRelaxation: "",
    adFile: null,
  });

  const HandleDataChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setJobData((prev) => ({ ...prev, adFile: file }));
  };

  const HandleAgeLimitChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      ageLimit: {
        ...prev.ageLimit,
        [name]: name === "isOpen" ? value === "true" : parseInt(value, 10),
      },
    }));
  };
  
  const FormDataSave = async () => {
    const formData = new FormData();
    Object.entries(JobData).forEach(([key, value]) => {
      if (key === "ageLimit") {
        formData.append("ageLimitIsOpen", value.isOpen);
        formData.append("ageLimitMin", value.min);
        formData.append("ageLimitMax", value.max);
      } else if (key !== "adFile") {
        formData.append(key, value);
      }
    });
    if (JobData.adFile) {
      formData.append("adFile", JobData.adFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/jobs/registeradmins/addjobs",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.message) {
        alert(response.data.message);
        onClose();
      }
    } catch (error) {
      alert( "Upload failed");
    }
  };

  return (
    <Modal open={show} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Job Title" fullWidth name="jobTitle" value={JobData.jobTitle} onChange={HandleDataChange} /></Grid>
          <Grid item xs={6}><TextField label="Job Description" fullWidth multiline rows={2} name="jobDescription" value={JobData.jobDescription} onChange={HandleDataChange} /></Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Job Type</InputLabel>
              <Select name="jobType" value={JobData.jobType} onChange={HandleDataChange}>
                {["Permanent", "Contract", "Daily Basis"].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Seniority</InputLabel>
              <Select name="seniority" value={JobData.seniority} onChange={HandleDataChange}>
                {["Naib Qasid", "UDC", "LDC", "Consultant", "Programmer", "Assistant", "Networking Expert"].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}><TextField label="Vacancies" fullWidth type="number" name="vacancies" value={JobData.vacancies} onChange={HandleDataChange} /></Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Last Date"
                value={JobData.lastDate}
                onChange={(newValue) => setJobData((prev) => ({ ...prev, lastDate: newValue }))}
                disablePast
                format="YYYY-MM-DD"
              />
            </LocalizationProvider>
          </Grid>


          <Grid item xs={6}><TextField label="Experience (Years)" fullWidth type="number" name="experience" value={JobData.experience} onChange={HandleDataChange} /></Grid>
          <Grid item xs={6}><TextField label="Age Relaxation" fullWidth type="number" name="ageRelaxation" value={JobData.ageRelaxation} onChange={HandleDataChange} /></Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Age Limit</Typography>
              <RadioGroup row value={JobData.ageLimit.isOpen.toString()} onChange={HandleAgeLimitChange} name="isOpen">
                <FormControlLabel value="true" control={<Radio />} label="Open" />
                <FormControlLabel value="false" control={<Radio />} label="Not Open" />
              </RadioGroup>
              {!JobData.ageLimit.isOpen && (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Min Age</InputLabel>
                      <Select name="min" value={JobData.ageLimit.min} onChange={HandleAgeLimitChange}>
                        {Array.from({ length: 38 }, (_, i) => i + 18).map((age) => (
                          <MenuItem key={age} value={age}>{age}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Max Age</InputLabel>
                      <Select name="max" value={JobData.ageLimit.max} onChange={HandleAgeLimitChange}>
                        {Array.from({ length: 38 }, (_, i) => i + 18).map((age) => (
                          <MenuItem key={age} value={age}>{age}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </FormControl>
          </Grid>
          
          {/* Upload Ad File */}
          <Grid item xs={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Ad File
              <input type="file" hidden onChange={HandleFileChange} />
            </Button>
            {JobData.adFile && <Typography mt={1}>Selected: {JobData.adFile.name}</Typography>}
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={FormDataSave}>Submit</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadJobsModal;

