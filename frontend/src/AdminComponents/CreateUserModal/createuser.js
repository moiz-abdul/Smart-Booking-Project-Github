import {useState} from 'react';
import './createuser.css';
import axios from 'axios';

const CreateUserModal = ({ show, onClose, title }) => {

  const [UserData, SetUserData] = useState(
    {
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'on',
    });

  const HandleDataChange = (e) =>
  {
    const {name, value} = e.target;
    SetUserData({...UserData, [name]:value});
  };


  const FormDataSave = async() =>
  {
      try{
        const response = await axios.post('http://localhost:5000/api/users/superadmin/create', UserData);
        console.log(response?.data);
        alert('User Created Successfully');
        onClose();
      }catch(error)
      {
        console.error(error.response?.data || 'Unknown Error');
        alert(error.response?.data?.message || 'Error Found! User Not Created');
      }
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form>
              {['fullName', 'username', 'email', 'phoneNumber', 'password', 'createdAt'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                    type={field === 'password' ? 'password' : field.includes('date') ? 'date' : 'text'}
                    className="form-control"
                    id={field}
                    name={field}
                    value={UserData[field]}
                    onChange={HandleDataChange}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Status:</label>
                <div>
                  <label>
                    <input type="radio" name="status" value="on" checked={UserData.status === 'on'} onChange={HandleDataChange} />
                    On
                  </label>
                  <label>
                    <input type="radio" name="status" value="off" checked={UserData.status === 'off'} onChange={HandleDataChange} />
                    Off
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={FormDataSave}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  };
  
  export default CreateUserModal;