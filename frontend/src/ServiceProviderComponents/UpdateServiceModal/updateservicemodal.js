import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import './updateservicemodal.css';

const UpdateServiceModal = ({ show, onClose, service, onUpdateSuccess }) => {
  const [serviceData, setServiceData] = useState({
    serviceTitle: '',
    categoryId: '',
    description: '',
    duration: '',
    regularPrice: '',
    memberPrice: '',
    availableDays: [],
    timeSlots: ['', '', ''],
    location: ''
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [reservedWarnings, setReservedWarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        if (response.data && response.data.success) {
          setCategories(response.data.data || []);
        } else {
          setError('Invalid categories data format');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const logServiceObject = (serviceObj) => {
    console.log('Full Service Object:', serviceObj);
    Object.keys(serviceObj).forEach(key => {
      console.log(`${key}: ${serviceObj[key]}`);
    });
  };
  const checkReservedPeriods = async () => {
    const warnings = [];
  
    for (let day of serviceData.availableDays) {
      for (let i = 0; i < 3; i++) {
        const time = serviceData.timeSlots[i];
        if (!time) continue;
  
        const [hour, minute] = time.split(':').map(Number);
        const start = new Date();
        start.setHours(hour);
        start.setMinutes(minute);
  
        const end = new Date(start.getTime() + serviceData.duration * 60000);
        const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  
        try {
          const res = await axios.post('http://localhost:5000/api/bookform/check-reserved-period', {
            selected_day: day,
            selected_start_time: time,
            selected_end_time: endTime,
          });
  
          if (res.data.success && res.data.is_reserved) {
            warnings.push(
              `⚠️ Reserved: ${day} ${formatTime(time)} - ${formatTime(endTime)} → ${res.data.reason}`
            );
          }
        } catch (err) {
          console.error('Reserved period check failed for update:', err);
        }
      }
    }
  
    setReservedWarnings(warnings);
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (
      serviceData &&
      serviceData.duration &&
      serviceData.availableDays.length &&
      (serviceData.timeSlots[0] || serviceData.timeSlots[1] || serviceData.timeSlots[2])
    ) {
      checkReservedPeriods();
    } else {
      setReservedWarnings([]);
    }
  }, [serviceData.availableDays, serviceData.timeSlots, serviceData.duration]);

  useEffect(() => {
    if (service) {
      logServiceObject(service);

      const updatedServiceData = {
        serviceTitle: service.serviceTitle || service.service_title || service.title || '',
        categoryId: service.categoryId || service.category_id || service.category || '',
        description: service.serviceDescription || service.description || service.desc || '',
        duration: service.serviceDuration || service.duration_minutes || service.duration || '',
        regularPrice: service.serviceFee || service.regular_price || service.price || '',
        memberPrice: service.discountedFee || service.member_price || service.memberPrice || '',
        availableDays: Array.isArray(service.availableDays)
          ? service.availableDays
          : (typeof service.available_days === 'string'
              ? service.available_days.split(',').map(day => day.trim())
              : []),
        timeSlots: [
          service.slot_1_time || service.timeSlots?.[0] || service.firstTimeSlot || '',
          service.slot_2_time || service.timeSlots?.[1] || service.secondTimeSlot || '',
          service.slot_3_time || service.timeSlots?.[2] || service.thirdTimeSlot || ''
        ],
        location: service.location || service.serviceLocation || ''
      };

      console.log('Mapped Service Data:', updatedServiceData);
      setServiceData(updatedServiceData);
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setServiceData(prev => ({
        ...prev,
        availableDays: checked
          ? [...prev.availableDays, value]
          : prev.availableDays.filter(day => day !== value)
      }));
    } else {
      setServiceData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...serviceData.timeSlots];
    newTimeSlots[index] = value;
    setServiceData(prev => ({
      ...prev,
      timeSlots: newTimeSlots
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const payload = {
        service_title: serviceData.serviceTitle,
        category_id: serviceData.categoryId,
        description: serviceData.description,
        duration_minutes: serviceData.duration,
        regular_price: serviceData.regularPrice,
        member_price: serviceData.memberPrice || null,
        available_days: serviceData.availableDays.join(','),
        slot_1_time: serviceData.timeSlots[0] || null,
        slot_2_time: serviceData.timeSlots[1] || null,
        slot_3_time: serviceData.timeSlots[2] || null,
        location: serviceData.location || null,
        user_id: userData.id
      };
      console.log('Payload being sent to API:', payload);
      const response = await axios.put(
        `http://localhost:5000/api/services/${service.id}`, 
        payload
      );
      console.log('API Response:', response);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error('Update Service Error:', err);
      setError(err.response?.data?.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      size="lg"
      dialogClassName="update-modal"
    >
      <Modal.Header className="update-modal-header">
        <Modal.Title className="update-modal-title">Update Service</Modal.Title>
      </Modal.Header>
      <Modal.Body className="update-modal-body">
        {error && <Alert variant="danger" className="update-alert">{error}</Alert>}
              {reservedWarnings.length > 0 && (
        <Alert variant="warning" className="update-alert">
          <strong>Admin Reserved Time Warnings:</strong>
          <ul className="mb-0 mt-1">
            {reservedWarnings.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </Alert>
      )}
        <Form onSubmit={handleSubmit}>
          <div className="update-row">
            <div className="update-col">
              <Form.Label>Service Title*</Form.Label>
              <Form.Control
                className="update-input"
                type="text"
                name="serviceTitle"
                value={serviceData.serviceTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="update-col">
              <Form.Label>Category*</Form.Label>
              <Form.Select
                className="update-select"
                name="categoryId"
                value={serviceData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryname}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="update-col">
              <Form.Label>Duration (mins)*</Form.Label>
              <Form.Control
                className="update-input"
                type="number"
                name="duration"
                value={serviceData.duration}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="update-group">
            <Form.Label>Service Description*</Form.Label>
            <Form.Control
              className="update-textarea"
              as="textarea"
              rows={2}
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="update-row">
            <div className="update-col">
              <Form.Label>Regular Price ($)*</Form.Label>
              <InputGroup className="update-input-group">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  className="update-input"
                  type="number"
                  name="regularPrice"
                  value={serviceData.regularPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </InputGroup>
            </div>

            <div className="update-col">
              <Form.Label>Member Price ($)</Form.Label>
              <InputGroup className="update-input-group">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  className="update-input"
                  type="number"
                  name="memberPrice"
                  value={serviceData.memberPrice || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </InputGroup>
            </div>

            <div className="update-col">
              <Form.Label>Location</Form.Label>
              <Form.Control
                className="update-input"
                type="text"
                name="location"
                value={serviceData.location || ''}
                onChange={handleChange}
                placeholder="Optional location"
              />
            </div>
          </div>

          <div className="update-row">
            <div className="update-col">
              <Form.Label>Available Days*</Form.Label>
              <div className="update-checkbox-group">
                {daysOfWeek.map(day => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    id={`day-${day}`}
                    label={day.substring(0, 3)}
                    value={day}
                    checked={serviceData.availableDays.includes(day)}
                    onChange={handleChange}
                    className="update-checkbox"
                  />
                ))}
              </div>
            </div>

            <div className="update-col">
              <Form.Label>Time Slots*</Form.Label>
              <div className="update-time-slots">
                {[0, 1, 2].map((index) => (
                  <Form.Control
                    key={index}
                    className="update-time-input"
                    type="time"
                    value={serviceData.timeSlots[index] || ''}
                    onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                    required={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="update-actions">
            <Button variant="secondary" onClick={onClose} className="update-button cancel">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="update-button submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Service'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateServiceModal;
