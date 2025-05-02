import React, { useState, useEffect } from "react";
import './addprofile.css'; // keep your styles if needed

export default function ProfileModal({ isOpen, onClose, onSave, currentName }) {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Reset form data when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    // Business Name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={backdropStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>Business Profile</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>
              Business Name <span style={requiredStyle}>*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              style={errors.businessName && isSubmitted ? errorInputStyle : inputStyle}
              required
            />
            {errors.businessName && isSubmitted && (
              <p style={errorMessageStyle}>{errors.businessName}</p>
            )}
          </div>
          
          <div>
            <label style={labelStyle}>
              Email <span style={requiredStyle}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={errors.email && isSubmitted ? errorInputStyle : inputStyle}
              required
            />
            {errors.email && isSubmitted && (
              <p style={errorMessageStyle}>{errors.email}</p>
            )}
          </div>
          
          <div>
            <label style={labelStyle}>
              Phone <span style={requiredStyle}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={errors.phone && isSubmitted ? errorInputStyle : inputStyle}
              required
            />
            {errors.phone && isSubmitted && (
              <p style={errorMessageStyle}>{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label style={labelStyle}>
              Address <span style={requiredStyle}>*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={errors.address && isSubmitted ? {...errorInputStyle, resize: 'vertical'} : {...inputStyle, resize: 'vertical'}}
              rows={2}
              required
            />
            {errors.address && isSubmitted && (
              <p style={errorMessageStyle}>{errors.address}</p>
            )}
          </div>
          
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{...inputStyle, resize: 'vertical'}}
              rows={2}
            />
          </div>
          
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={closeBtnStyle}>
              Cancel
            </button>
            <button type="submit" style={saveBtnStyle}>
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// CSS-in-JS styles
const backdropStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '28px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  width: '100%',
  maxWidth: '450px',
};

const headerStyle = {
  margin: '0 0 20px 0',
  fontSize: '22px',
  fontWeight: '600',
  color: '#333',
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '6px',
  display: 'block',
  color: '#444',
};

const requiredStyle = {
  color: '#e53935',
  marginLeft: '2px',
};

const inputStyle = {
  padding: '12px 14px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};

const errorInputStyle = {
  padding: '12px 14px',
  border: '1px solid #e53935',
  borderRadius: '8px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(229, 57, 53, 0.05)',
};

const errorMessageStyle = {
  color: '#e53935',
  fontSize: '12px',
  margin: '4px 0 0 0',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '10px',
  gap: '12px',
};

const closeBtnStyle = {
  padding: '10px 18px',
  backgroundColor: '#f1f1f1',
  color: '#444',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s ease',
};

const saveBtnStyle = {
  padding: '10px 18px',
  backgroundColor: '#007bff',
  color: '#fff',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s ease',
};