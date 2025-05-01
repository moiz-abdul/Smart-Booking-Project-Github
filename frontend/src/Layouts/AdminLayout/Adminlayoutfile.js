import react,{ children } from 'react';
import { useState } from 'react';
import AdminNavbar from './AdminNavbar';
// import AdminFooter from './AdminFooter';
import { useLocation } from 'react-router-dom';


const AdminLayout = ({children}) =>{

    const location = useLocation(); 
    const username = location.state?.username || 'Guest'; // If no username get then display Guest.

    


    return(
        <div>
            <AdminNavbar username ={username}/>  
            <div className='admin-middle-content'>
                {children}  {/* Here show a data of User Records Table */}
            </div>
            {/*<AdminFooter/>  */}


        </div>
    );
};
export default AdminLayout;