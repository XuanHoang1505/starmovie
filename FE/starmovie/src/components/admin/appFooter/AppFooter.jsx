import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="" target="_blank" rel="noopener noreferrer">
          Star Movie
        </a>
        <span className="ms-1">&copy; 2025 Star Movie Team. All rights reserved.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          Star Movie Admin
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
