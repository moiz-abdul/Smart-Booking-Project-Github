import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './addservicemodal.css';

const AddServiceModal = ({ show, onClose, title, onSaveSuccess, editData = null }) => {
  const modalRef = useRef(null);
  const initialState = {
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
  };

  const [serviceData, setServiceData] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/categories');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
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
    if (show) {
      fetchCategories();

      // If editData is provided, use it to populate the form
      if (editData) {
        // Convert comma-separated days to array if needed
        const availableDays = typeof editData.available_days === 'string'
          ? editData.available_days.split(',')
          : editData.available_days || [];

        setServiceData({
          ...editData,
          available_days: availableDays
        });
      } else {
        // Reset form and fetch user data for new service
        setServiceData(initialState);
        fetchUserData();
      }
    }
  }, [show, editData]);

  const validateForm = () => {
    const requiredFields = [
      'service_title',
      'category_id',
      'description',
      'duration_minutes',
      'regular_price',
      'available_days',
      'slot_1_time'
    ];

    for (let field of requiredFields) {
      if (!serviceData[field] ||
        (field === 'available_days' && serviceData[field].length === 0)) {
        return `Please fill in all required fields`;
      }
    }

    if (isNaN(serviceData.duration_minutes) || serviceData.duration_minutes <= 0) {
      return 'Invalid duration';
    }

    if (isNaN(serviceData.regular_price) || serviceData.regular_price <= 0) {
      return 'Invalid price';
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...serviceData,
        available_days: serviceData.available_days.join(','),
        member_price: serviceData.member_price || null,
        location: serviceData.location || null
      };

      let response;

      if (editData && editData.id) {
        // Update existing service
        response = await axios.put(
          `http://localhost:5000/api/services/${editData.id}`,
          payload
        );
      } else {
        // Add new service
        response = await axios.post(
          'http://localhost:5000/api/addservice/serviceprovider',
          payload
        );
      }

      // Call the success callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Service Operation Error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to process service. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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

  // Prevent default event behavior to ensure clicks work
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Handle click outside of modal to close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className={`modal fade ${show ? 'show' : ''}`}
      style={{ display: show ? 'block' : 'none', zIndex: 1050 }}
      onClick={handleOutsideClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content1" ref={modalRef} onClick={stopPropagation}>
          <div className="modal-header">
            <h5 className="modal-title">{editData ? 'Edit Service' : (title || 'Add New Service')}</h5>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <div className="text-center">Loading...</div>}

            <form>
              <div className="row">
                <div className="form-group col-md-4">
                  <label>Service Title*</label>
                  <input
                    type="text"
                    className="form-control compact"
                    name="service_title"
                    value={serviceData.service_title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group col-md-4">
                  <label>Category*</label>
                  <select
                    className="form-control compact"
                    name="category_id"
                    value={serviceData.category_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-md-4">
                  <label>Duration (mins)*</label>
                  <input
                    type="number"
                    className="form-control compact"
                    name="duration_minutes"
                    value={serviceData.duration_minutes}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Service Description*</label>
                <textarea
                  className="form-control compact-textarea"
                  rows="2"
                  name="description"
                  value={serviceData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="form-group col-md-4">
                  <label>Regular Price ($)*</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">$</span>
                    </div>
                    <input
                      type="number"
                      className="form-control compact"
                      name="regular_price"
                      value={serviceData.regular_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Member Price ($)</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">$</span>
                    </div>
                    <input
                      type="number"
                      className="form-control compact"
                      name="member_price"
                      value={serviceData.member_price || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-group col-md-4">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control compact"
                    name="location"
                    value={serviceData.location || ''}
                    onChange={handleChange}
                    placeholder="Optional location"
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Available Days*</label>
                  <div className="d-flex flex-wrap day-checkboxes">
                    {daysOfWeek.map(day => (
                      <div key={day} className="form-check mr-2 mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`day-${day}`}
                          value={day}
                          checked={serviceData.available_days.includes(day)}
                          onChange={handleChange}
                          style={{ zIndex: 1055, position: 'relative', cursor: 'pointer' }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`day-${day}`}
                          style={{ cursor: 'pointer', zIndex: 1055, position: 'relative' }}
                        >
                          {day.substring(0, 3)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group col-md-6">
                  <label>Time Slots*</label>
                  <div className="d-flex time-slots-container">
                    {[0, 1, 2].map((index) => (
                      <input
                        key={index}
                        type="time"
                        className="form-control compact mr-2"
                        value={timeSlots[index] || ''}
                        onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                        required={index === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (editData ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;