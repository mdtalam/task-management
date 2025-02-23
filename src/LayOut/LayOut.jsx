import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Component/Navbar';

const LayOut = () => {
    return (
        <div>
            <section>
                <Navbar></Navbar>
            </section>
            <section>
                <Outlet></Outlet>
            </section>
            <section>
        
            </section>
        </div>
    );
};

export default LayOut;