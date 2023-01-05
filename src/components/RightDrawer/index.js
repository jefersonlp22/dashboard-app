import React from 'react'

import "./styles.scss";

const RightDrawer = ({toggleActive, children,...props}) =>{

    return (
        <>
            <div className={`rightDrawer ${toggleActive? 'drawerOpen' : ''}`}>                    
                {children}                    
            </div>
        </>
    )
}

export { RightDrawer };