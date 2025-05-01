import react,{ children } from 'react';
import CustomerNavbar from './CustomerNavbar';
import { useLocation } from 'react-router-dom';

const CustomerLayout = ({children}) =>
{
    const location = useLocation(); 
    const username = location.state?.username || 'Guest'; // If no username get then display Guest.

    return (
        <div>
        <CustomerNavbar username ={username}/>
        <div className='admin-middle-content'>
                {children}
            </div>
        
        </div>
    );
};

export default CustomerLayout;