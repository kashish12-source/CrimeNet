import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Officers from "../pages/Officers";
import Notifications from "../pages/Notifications";
import AdminAssignCrime from "../pages/AdminAssignCrime";


import ProtectedRoute from "../components/ProtectedRoute";
import CrimeDetails from "../pages/CrimeDetails";
import ReportCrime from "../pages/ReportCrime";
import AllCrimes from "../pages/AllCrimes";
import AssignedCrimes from "../pages/AssignedCrime";

function AppRoutes() {

    return (

        <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Login />} />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* CITIZEN ONLY */}
            <Route
                path="/report-crime"
                element={
                    <ProtectedRoute allowedRoles={["citizen"]}>
                        <ReportCrime />
                    </ProtectedRoute>
                }
            />

            {/* ALL AUTHENTICATED USERS */}
            <Route
                path="/all-crimes"
                element={
                    <ProtectedRoute>
                        <AllCrimes />
                    </ProtectedRoute>
                }
            />

            {/* OFFICER ONLY */}
            <Route
                path="/assigned-crimes"
                element={
                    <ProtectedRoute allowedRoles={["officer"]}>
                        <AssignedCrimes />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/officers"
                element={
                    <ProtectedRoute>
                        <Officers />
                    </ProtectedRoute>
                }
            />
            <Route
    path="/assign-crime"
    element={<AdminAssignCrime />}
/>

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crime/:id"
                element={
                    <ProtectedRoute>
                        <CrimeDetails />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;