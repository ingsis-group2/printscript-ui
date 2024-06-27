import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {Container, Typography, CircularProgress, Box, Paper, Button} from '@mui/material';

const LoginScreen = () => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) navigate('/');

    return (
        <Container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px' }}>
                <Typography component="h1" variant="h5">
                    Welcome to Snippet Searcher
                </Typography>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body1" gutterBottom>
                            Please log in to continue
                        </Typography>
                        <Box display="flex" justifyContent="center">
                            <Button
                                id={"login-button"}
                                onClick={() => loginWithRedirect()}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: "center",
                                    gap: "4px",
                                    backgroundColor: 'primary.light',
                                    "&:hover": {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                            >
                                Log In
                            </Button>
                        </Box>
                    </Box>
            </Paper>
        </Container>
    );
};

export default LoginScreen;