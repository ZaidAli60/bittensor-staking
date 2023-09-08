import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Frontend from './Frontend'


export default function Index() {
    return (
        <Routes>
            <Route path='/*' element={<Frontend />} />
        </Routes>
    )
}
