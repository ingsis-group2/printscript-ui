import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";
import {SnackbarProvider} from "./contexts/snackbarProvider.tsx";
import {Auth0Provider} from "@auth0/auth0-react";
import {AUTH0_CLIENT_ID} from "./utils/constants.ts";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PaginationProvider>
        <SnackbarProvider>
            <Auth0Provider
                domain="https://dev-77ie0xuayhhodlbg.us.auth0.com"
                clientId={AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                    audience: 'https://snippet-security/',
                    scope: 'openid profile email create:snippet read:snippet'
                }}
                cacheLocation={'localstorage'}
            >
                <App/>
            </Auth0Provider>
        </SnackbarProvider>
      </PaginationProvider>
    </React.StrictMode>,
)
