import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'


export default function Index() {
    return (
        <Routes>
            <Route path='/*' element={<Dashboard />} />
            {/* <Route path='/auth/*' element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" replace />} />
            <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} allowedRoles={["superAdmin", "admin"]} />} /> */}
        </Routes>
    )
}
