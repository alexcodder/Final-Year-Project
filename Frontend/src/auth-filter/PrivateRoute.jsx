import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function PrivateRoute({ element: Element, isAdminRequired, ...rest }) {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        userRole: null
    });

    useEffect(() => {
        // Function to check authentication with the server
        const checkAuthentication = async () => {
            // Log current localStorage values
            console.log("Current localStorage values:", {
                userId: localStorage.getItem("userId"),
                role: localStorage.getItem("role"),
                username: localStorage.getItem("username")
            });
            
            try {
                console.log("Making authentication check request...");
                
                // Create axios instance with interceptors for debugging
                const instance = axios.create();
                
                // Add request interceptor for debugging
                instance.interceptors.request.use(config => {
                    console.log('Request Config:', {
                        url: config.url,
                        method: config.method,
                        headers: config.headers,
                        withCredentials: config.withCredentials
                    });
                    return config;
                });
                
                // Add response interceptor for debugging
                instance.interceptors.response.use(
                    response => {
                        console.log('Response Data:', response.data);
                        return response;
                    },
                    error => {
                        console.log('Response Error:', {
                            message: error.message,
                            status: error.response?.status,
                            data: error.response?.data
                        });
                        return Promise.reject(error);
                    }
                );
                
                // Make the request with detailed error handling
                const response = await instance.get('http://localhost:3001/api/v1/users/check-auth', { 
                    withCredentials: true
                });
                
                if (response.data.success) {
                    // User is authenticated
                    console.log("Authentication successful. User role:", response.data.user.role);
                    
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: true,
                        userRole: response.data.user.role
                    });
                    
                    // Update localStorage with latest user data
                    localStorage.setItem("userId", response.data.user.id);
                    localStorage.setItem("role", response.data.user.role);
                    localStorage.setItem("username", response.data.user.username);
                } else {
                    // Unexpected success response with no data
                    console.log('Authentication check returned success but no user data');
                    clearUserData();
                }
            } catch (error) {
                // If the request fails, the user is not authenticated
                console.log('Authentication check failed:', error.message);
                
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log('Error status:', error.response.status);
                    console.log('Error data:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Error request:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error message:', error.message);
                }
                
                clearUserData();
            }
        };

        const clearUserData = () => {
            console.log("Clearing user data from localStorage");
            // Clear localStorage since the session is invalid
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                userRole: null
            });
        };

        checkAuthentication();
    }, []); // Run once when component mounts

    // Show loading state while checking authentication
    if (authState.isLoading) {
        console.log("PrivateRoute: Still loading authentication state...");
        return <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying your session...</p>
        </div>;
    }

    // Redirect to login if not authenticated
    if (!authState.isAuthenticated) {
        console.log("PrivateRoute: Not authenticated, redirecting to login");
        return <Navigate to="/login" />;
    }

    console.log("PrivateRoute: User is authenticated with role:", authState.userRole);
    
    // User is authenticated, check role-based access
    const allowedRoles = ["admin", "hospital", "ambulance", "bloodbank"];
    const isNonPatientUser = allowedRoles.includes(authState.userRole);
    console.log("Is non-patient user?", isNonPatientUser);
    
    // Current path being accessed
    const currentPath = window.location.pathname.toLowerCase();
    
    // For the admin dashboard, only allow non-patient users
    if (currentPath === '/admin-dashboard' && !isNonPatientUser) {
        console.log("Patient trying to access admin dashboard, redirecting to home");
        return <Navigate to="/home" />;
    }
    
    // If the user is admin or other staff and trying to access a regular page, allow it
    if (isNonPatientUser) {
        console.log("Non-patient user accessing a page, allowing access");
    }
    
    // User is authenticated and has proper permissions, render the protected component
    console.log("PrivateRoute: Rendering protected component");
    return Element;
}

export default PrivateRoute;
