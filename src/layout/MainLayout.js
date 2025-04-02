import React, { useEffect } from 'react'
import Routing from '../routes';
import Header from './Header';
import { useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();


    // useEffect(() => {
    //     const excludedPaths = ['/buy-credit'];
    //     const customBoardRoute = ['/custom-board-order', '/custom-board'];
    //     const customFallbackURL = 'http://brainycode-client.s3-website-us-east-1.amazonaws.com/thread'; // or whatever your fallback is
    //     // Check if the current path is not in the excluded list
    //     if (!excludedPaths.concat(customBoardRoute).includes(location.pathname)) {
    //         const fullURL = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    //         sessionStorage.setItem('lastPageURL', fullURL);
    //     } else if (customBoardRoute.includes(location.pathname)) {
    //         sessionStorage.setItem('lastPageURL', customFallbackURL);
    //     }
    // }, [location]);

    useEffect(() => {
        const excludedPaths = ['/buy-credit'];
        const customBoardRoute = ['/custom-board-order', '/custom-board'];
        const customFallbackURL = 'https://brainycode.software/thread'; // or whatever your fallback is

        // Function to check if the current location matches any of the custom board routes
        const isCustomBoardRoute = (pathname) => {
            return customBoardRoute.some(route => pathname.startsWith(route));
        };

        // Check if the current path is not in the excluded list and does not start with any of the custom board routes
        if (!excludedPaths.includes(location.pathname) && !isCustomBoardRoute(location.pathname)) {
            const fullURL = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
            sessionStorage.setItem('lastPageURL', fullURL);
        } else if (isCustomBoardRoute(location.pathname)) {
            sessionStorage.setItem('lastPageURL', customFallbackURL);
        }
    }, [location]); 

    const lastPageURL = sessionStorage.getItem('lastPageURL');
    console.log('session last url', lastPageURL);
    return (
        <>
            <Header />
            <Routing />
        </>
    )
}

export default MainLayout;