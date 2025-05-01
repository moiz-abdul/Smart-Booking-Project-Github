import react, { children } from 'react';
import UserNavbar from "./UserNavbar";
import UserFooter from './UserFooter';
import UserTopRibbon from './UserTopRibbon';
import UserBottomRibbon from "./UserBottomRibbon";


const UserLayout = ({children}) =>{
    return(
        <div>
            <UserNavbar/>
            <div className='user-middle-content'>
                {children}
            </div>
            <UserBottomRibbon/>
            <UserFooter/>
        </div>
    );
};
export default UserLayout;
