import react, { children } from 'react';
import ProviderNavbar from './ProviderNavbar';
import { useLocation } from 'react-router-dom';

const ServiceProviderLayout = ({ children }) => {
    const location = useLocation();
    const username = location.state?.username || 'Guest'; // If no username get then display Guest.

    return (
        <div>
            <ProviderNavbar username={username} />
            <div className='admin-middle-content'>
                {children}
            </div>

        </div>
    );
};

export default ServiceProviderLayout;