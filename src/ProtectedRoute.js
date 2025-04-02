import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const { Component,allowWithoutAuth  } = props;
    const navigate = useNavigate();
    useEffect(() => {
        if (!allowWithoutAuth) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                navigate('/signin');
            }
        }
    }, [allowWithoutAuth, navigate]);

    return (
        <> <Component /> </>
    );
};

export default ProtectedRoute;

