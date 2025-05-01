import { useState, useEffect } from 'react';
import axios from 'axios';
import './addservicemodal.css';

const AddServiceModal = ({ show, onClose, title }) => {
  const [serviceData, setServiceData] = useState({
    service_title: '',
    provider_name: '',
    user_id: '',
    category_id: '',
    description: '',
    duration_minutes: '',
    regular_price: '',
    member_price: null,
    available_days: [],
    slot_1_time: '',
    slot_2_time: '',
    slot_3_time: '',
    location: null
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/categories');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);  // Change here
      } else {
        setError('Invalid categories data format');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setServiceData(prev => ({
        ...prev,
        provider_name: userData.username || '',
        user_id: userData.id || ''
      }));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUserData();
  }, [show]);

  const validateForm = () => {
    if (!serviceData.service_title) {
      return 'Service title is required';
    }
    if (!serviceData.category_id) {
      return 'Please select a category';
    }
    if (!serviceData.description) {
      return 'Description is required';
    }
    if (!serviceData.duration_minutes || isNaN(serviceData.duration_minutes)) {
      return 'Valid duration is required';
    }
    if (!serviceData.regular_price || isNaN(serviceData.regular_price)) {
      return 'Valid price is required';
    }
    if (serviceData.available_days.length === 0) {
      return 'Please select at least one available day';
    }
    if (!serviceData.slot_1_time) {
      return 'Please provide at least one time slot';
    }
    return null;
  };

  const FormDataSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const payload = {
        ...serviceData,
        available_days: serviceData.available_days.join(','),
        member_price: serviceData.member_price || null,
        location: serviceData.location || null
      };

      const response = await axios.post(
        'http://localhost:5000/api/addservice/serviceprovider', 
        payload
      );
      
      alert('Service added successfully!');
      onClose();
    } catch (error) {
      console.error('Add Service Error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to add service. Please try again.';
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setServiceData(prev => ({
        ...prev,
        available_days: checked
          ? [...prev.available_days, value]
          : prev.available_days.filter(day => day !== value)
      }));
    } else {
      setServiceData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || '' : value
      }));
    }
  };

  const handleTimeSlotChange = (index, value) => {
    const slotName = `slot_${index + 1}_time`;
    setServiceData(prev => ({
      ...prev,
      [slotName]: value
    }));
  };

  // Create array of time slots for rendering
  const timeSlots = [
    serviceData.slot_1_time,
    serviceData.slot_2_time,
    serviceData.slot_3_time
  ];

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || 'Add New Service'}</h5>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <div className="text-center">Loading categories...</div>}
            
            <form>
              <input type="hidden" name="provider_name" value={serviceData.provider_name} />
              <input type="hidden" name="user_id" value={serviceData.user_id} />

              <div className="form-group">
                <label>Service Title*</label>
                <input
                  type="text"
                  className="form-control"
                  name="service_title"
                  value={serviceData.service_title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Category*</label>
                <select
                  className="form-control"
                  name="category_id"
                  value={serviceData.category_id}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.categoryname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Service Description*</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={serviceData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Duration (minutes)*</label>
                  <input
                    type="number"
                    className="form-control"
                    name="duration_minutes"
                    value={serviceData.duration_minutes}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Regular Price ($)*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">$</span>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      name="regular_price"
                      value={serviceData.regular_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Member Discount Price ($)</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">$</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    name="member_price"
                    value={serviceData.member_price || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Available Days*</label>
                <div className="d-flex flex-wrap">
                  {daysOfWeek.map(day => (
                    <div key={day} className="form-check mr-3 mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`day-${day}`}
                        value={day}
                        checked={serviceData.available_days.includes(day)}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={`day-${day}`}>
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Available Time Slots*</label>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="mb-2">
                    <label className="small text-muted">Slot {index + 1}</label>
                    <input
                      type="time"
                      className="form-control"
                      value={timeSlots[index] || ''}
                      onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                      required={index === 0}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={serviceData.location || ''}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={FormDataSave}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;