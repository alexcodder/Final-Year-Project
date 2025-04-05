import { Navigate } from 'react-router-dom';

function PrivateRoute({ element: Element, isAdminRequired, ...rest }) {
    const isLoggedIn = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role"); 

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (isAdminRequired && userRole !== 'admin') {
        return <Navigate to="/Admin" />;
    }

    return Element;
}

export default PrivateRoute;
