import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Avatar, Typography, Popover, Button } from "@mui/material";
import { AUTH0_AUDIENCE } from "../../utils/constants.ts";

const Profile = () => {
    const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const getUserToken = async () => {
            if (isAuthenticated && user) {
                try {
                    const accessToken = await getAccessTokenSilently({
                        authorizationParams: { audience: AUTH0_AUDIENCE },
                    });
                    Cookies.set("accessToken", accessToken, { expires: 3 });
                    console.log(accessToken);
                } catch (e: unknown) {
                    console.error(e);
                }
            }
        };

        getUserToken().then(r => r);
    }, [getAccessTokenSilently, isAuthenticated, user]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'profile-popover' : undefined;

    if (!isAuthenticated) {
        return <Typography>Loading...</Typography>;
    }

    return (
        isAuthenticated && user && (
            <Box sx={{ display: 'inline-block', position: 'relative' }}>
                <Avatar
                    src={user.picture}
                    alt={user.name}
                    onClick={handleClick}
                    sx={{
                        width: 48,
                        height: 48,
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                />
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        boxShadow: 3,
                        width: 250,
                    }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
                            {user.name}
                        </Typography>
                        <Button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 2 }}
                        >
                            Log Out
                        </Button>
                    </Box>
                </Popover>
            </Box>
        )
    );
};

export default Profile;
