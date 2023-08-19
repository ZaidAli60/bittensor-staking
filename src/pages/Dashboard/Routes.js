import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import TaoStake from './TaoStake/TaoStake'
import Vote from './Vote/Vote'

export default function Index() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path='/tao-stake' element={<TaoStake />} />
            <Route path='/vote' element={<Vote />} />
        </Routes>
    )
}
