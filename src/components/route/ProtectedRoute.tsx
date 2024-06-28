import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import {CircularProgress} from "@mui/material";

const ProtectedRoute = ({ children }: { children: any }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return (
        <CircularProgress
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-20px',
                marginLeft: '-20px'
            }}
        />
    )
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;