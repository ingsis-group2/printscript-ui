import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import ProtectedRoute from "./components/route/ProtectedRoute.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><HomeScreen/></ProtectedRoute>
    },
    {
        path: '/rules',
        element: <ProtectedRoute><RulesScreen/></ProtectedRoute>
    },
    {
        path: '/login',
        element: <LoginScreen/>
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

export default App;
