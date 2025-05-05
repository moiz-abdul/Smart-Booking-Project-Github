import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';

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
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch categories
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


   // Debug function to log service object
   const logServiceObject = (serviceObj) => {
    console.log('Full Service Object:', serviceObj);
    Object.keys(serviceObj).forEach(key => {
      console.log(`${key}: ${serviceObj[key]}`);
    });
  };

  // Populate form when service prop changes
  useEffect(() => {
    if (service) {
      // Log the entire service object for debugging
      logServiceObject(service);

      // Create a comprehensive mapping with multiple fallback options
      const updatedServiceData = {
        // Service Title
        serviceTitle: 
          service.serviceTitle || 
          service.service_title || 
          service.title || 
          '',

        // Category ID
        categoryId: 
          service.categoryId || 
          service.category_id || 
          service.category || 
          '',

        // Description
        description: 
          service.serviceDescription || 
          service.description || 
          service.desc || 
          '',

        // Duration
        duration: 
          service.serviceDuration || 
          service.duration_minutes || 
          service.duration || 
          '',

        // Regular Price
        regularPrice: 
          service.serviceFee || 
          service.regular_price || 
          service.price || 
          '',

        // Member Price
        memberPrice: 
          service.discountedFee || 
          service.member_price || 
          service.memberPrice || 
          '',

        // Available Days
        availableDays: Array.isArray(service.availableDays) 
          ? service.availableDays 
          : (typeof service.available_days === 'string'
              ? service.available_days.split(',').map(day => day.trim())
              : []),

        // Time Slots
        timeSlots: [
          service.slot_1_time || 
          service.timeSlots?.[0] || 
          service.firstTimeSlot || 
          '',
          
          service.slot_2_time || 
          service.timeSlots?.[1] || 
          service.secondTimeSlot || 
          '',
          
          service.slot_3_time || 
          service.timeSlots?.[2] || 
          service.thirdTimeSlot || 
          ''
        ],

        // Location
        location: 
          service.location || 
          service.serviceLocation || 
          ''
      };

      // Log the mapped data for verification
      console.log('Mapped Service Data:', updatedServiceData);

      // Set the state with the mapped data
      setServiceData(updatedServiceData);
    }
  }, [service]);

  // Handle input changes
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

  // Handle time slot changes
  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...serviceData.timeSlots];
    newTimeSlots[index] = value;
    setServiceData(prev => ({
      ...prev,
      timeSlots: newTimeSlots
    }));
  };

  // Handle form submission
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

      const response = await axios.put(
        `http://localhost:5000/api/services/${service.id}`, 
        payload
      );

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
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-md-4">
              <Form.Label>Service Title*</Form.Label>
              <Form.Control
                type="text"
                name="serviceTitle"
                value={serviceData.serviceTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group col-md-4">
              <Form.Label>Category*</Form.Label>
              <Form.Select
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

            <div className="form-group col-md-4">
              <Form.Label>Duration (mins)*</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={serviceData.duration}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <Form.Label>Service Description*</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="form-group col-md-4">
              <Form.Label>Regular Price ($)*</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
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

            <div className="form-group col-md-4">
              <Form.Label>Member Price ($)</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="memberPrice"
                  value={serviceData.memberPrice || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </InputGroup>
            </div>

            <div className="form-group col-md-4">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={serviceData.location || ''}
                onChange={handleChange}
                placeholder="Optional location"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-6">
              <Form.Label>Available Days*</Form.Label>
              <div className="d-flex flex-wrap">
                {daysOfWeek.map(day => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    id={`day-${day}`}
                    label={day.substring(0, 3)}
                    value={day}
                    checked={serviceData.availableDays.includes(day)}
                    onChange={handleChange}
                    className="mr-2 mb-2"
                  />
                ))}
              </div>
            </div>

            <div className="form-group col-md-6">
              <Form.Label>Time Slots*</Form.Label>
              <div className="d-flex">
                {[0, 1, 2].map((index) => (
                  <Form.Control
                    key={index}
                    type="time"
                    value={serviceData.timeSlots[index] || ''}
                    onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                    className="mr-2"
                    required={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
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