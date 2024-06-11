import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {Code, Rule} from "@mui/icons-material";
import {ReactNode} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useLocation, useNavigate} from "react-router-dom";
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN, SNIPPET_OPERATIONS_URL} from "../../utils/constants.ts";

type PageType = {
    title: string;
    path: string;
    icon: ReactNode;
}

const pages: PageType[] = [{
    title: 'Snippets',
    path: '/',
    icon: <Code/>
}, {
    title: 'Rules',
    path: '/rules',
    icon: <Rule/>
}];

export const Navbar = () => {
    const {loginWithRedirect, logout, isAuthenticated, user} = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    console.log(SNIPPET_OPERATIONS_URL, SNIPPET_OPERATIONS_URL, AUTH0_DOMAIN, AUTH0_CLIENT_ID);

    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{display: "flex", gap: "24px"}}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Printscript
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, gap: '4px'}}>
                        {pages.map((page) => (
                            <Button
                                key={page.title}
                                onClick={() => navigate(`${page.path}`)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: "center",
                                    gap: "4px",
                                    backgroundColor: location.pathname === page.path ? 'primary.light' : 'transparent',
                                    "&:hover": {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                            >
                                {page.icon}
                                <Typography>{page.title}</Typography>
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{display: {xs: 'none', md: 'flex'}, gap: '24px', alignItems: 'center'}}>
                    {isAuthenticated ? (
                        <>
                            <Typography sx={{color: 'white'}}>{user?.name}</Typography>
                            <Button sx={{color: 'white'}} onClick={() => logout()}>Logout</Button>
                        </>
                    ) : (
                        <Button sx={{color: 'white'}} onClick={() => loginWithRedirect()}>Login</Button>
                    )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
