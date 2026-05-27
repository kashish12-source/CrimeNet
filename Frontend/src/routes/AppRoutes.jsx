import {Routes,Route} from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import ProtectedRoute from "../components/ProtectedRoute"

import ReportCrime from "../pages/ReportCrime";
import AllCrimes from "../pages/AllCrimes";
import AssignedCrimes from "../pages/AssignedCrime";

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
            <Route path="/report-crime" element={<ReportCrime />} />

            <Route path="/all-crimes" element={<AllCrimes />} />
            <Route
                path="/assigned-crimes"
                element={<AssignedCrimes />}
            />
        </Routes>
    )
}

export default AppRoutes