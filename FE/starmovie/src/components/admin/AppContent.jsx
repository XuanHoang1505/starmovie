import React, { Suspense } from 'react'
import {  Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import routes from "../../routes/admin/adminRoutes"

const AppContent = () => {
    return (
        <CContainer className="px-4" lg>
            <Suspense fallback={<CSpinner color="primary" />}>
                <Routes>
                    {routes.map((route, index) => {
                        return(
                            route.element && (
                                <Route
                                    key={index}
                                    path={route.path}
                                    name={route.name}
                                    element={<route.element/>}
                                />
                            )
                        )
                    })}
                </Routes>
            </Suspense>
        </CContainer>
    )
}

export default React.memo(AppContent)