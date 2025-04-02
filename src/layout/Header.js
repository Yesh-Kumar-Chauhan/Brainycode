import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Profile from './Profile';
import { Link, useNavigate } from 'react-router-dom';
import api from "../services/axios-config";
// import { useUser, UserProvider } from '../../UserContext';
import { useUser } from '../UserContext';
const Header = () => {
  const { currentStep } = useUser();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const token = localStorage.getItem("token")
  const userData = JSON.parse(localStorage.getItem("userData"))
  const {userCredit, setUserCredit} = useUser();

  useEffect(() => {
    setActiveLink(location.pathname);
    getUserData()
  }, [location.pathname, setUserCredit,currentStep]);

  const getUserData = async () => {
    try {
      const response = await api.get(`/subscription/credit?userId=${userData.id}`);
      localStorage.setItem('userCredit', JSON.stringify(response.data.userCredit.credits));
      setUserCredit(response.data.userCredit.credits)
    } catch (error) {
      //  toast.error(error);
    }
  }

  const headerRoutes = ['/buy-credit', '/custom-board', '/custom-board-order', '/order-confirm', '/profile', '/signup', '/forgot-password', '/success-password', '/reset-password', '/verification-code', '/code']

  // Function to check if the current path matches any of the header routes or dynamic routes
  const isHeaderRoute = (pathname) => {
    // Check if the path exactly matches any of the static routes
    const exactMatch = headerRoutes.some(route => pathname === route);
    if (exactMatch) return true;

    // Check for dynamic route '/custom-board/:id'
    const dynamicMatch = pathname.startsWith('/custom-board/') && pathname.split('/').length === 3;
    return dynamicMatch;
  }
  let headerClassNames;

  if (location.pathname.trim() === '/signup') {
    headerClassNames = 'inner';
  } else {
    headerClassNames = `inner ${isHeaderRoute(location.pathname.trim()) ? 'position-relative white_header' : ''}`;
  }

  console.log('currentState', currentStep);
  return (
    <>
      <header className={headerClassNames}>
      {/* <header className={`inner ${isHeaderRoute(location.pathname.trim()) ? 'position-relative white_header' : ' '}`}> */}
    
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav
                className="navbar navbar-expand-lg navbar-light p-0">
                <div className="container-fluid">
                  {
                    // location.pathname != '/thread' && (
                      // <a className="navbar-brand logo thread_logo">
                      // <a className={`navbar-brand ${location.pathname === '/thread' ? 'logo thread_logo' : 'logo'}`}>
                        
                        
                      //   <img 
                      //     src={(
                      //     (!userData && location.pathname != '/generaldetails') 
                      //     && (!userData && location.pathname !== '/verification-code') 
                      //     && (!userData && location.pathname !== '/forgot-password') 
                      //     && (!userData && location.pathname !== '/success-password') 
                      //     && (!userData && location.pathname !== '/reset-password')
                      //     && (!userData && location.pathname == '/signup' && (currentStep == -1)) 
                      //     && (!userData && location.pathname !== '/buy-credit') 
                      //     && (!userData && location.pathname !== '/custom-board-order') 
                      //     && (!userData && location.pathname !== '/code') 
                      //     && !userData) ? "/images/inner_logo.png" : "/images/inner_logo_dark.png"
                      //   }
                      //     height="40px"
                      //   />
                      // </a>
                      <a className={`navbar-brand ${location.pathname === '/thread' ? 'logo thread_logo' : 'logo'}`}>
                      <img 
                        src={
                          location.pathname === '/signin' || location.pathname === '/'
                            ? "/images/inner_logo.png"
                            : (
                              (!userData && location.pathname !== '/generaldetails') 
                              && (!userData && location.pathname !== '/verification-code') 
                              && (!userData && location.pathname !== '/forgot-password') 
                              && (!userData && location.pathname !== '/success-password') 
                              && (!userData && location.pathname !== '/reset-password')
                              && (!userData && location.pathname !== '/signup' || (currentStep === -1)) 
                              && (!userData && location.pathname !== '/buy-credit') 
                              && (!userData && location.pathname !== '/custom-board-order') 
                              && (!userData && location.pathname !== '/code') 
                              && !userData
                            ) ? "/images/inner_logo.png" : "/images/inner_logo_dark.png"
                        }
                        height="40px"
                      />
                    </a>
                    

                    // )
                    
                  }
                  {
                    (token || userData) && (
                      <div className="collapse ps-5 justify-content-end navbar-collapse"
                        id="navbarSupportedContent">
                        {
                          location.pathname != '/review' && location.pathname != '/profile' && (
                            <ul className="navbar-nav ms-5 ps-5 me-auto mb-lg-0 mt-0">
                              <li className="nav-item">
                                <Link to="/code"
                                  className={activeLink === "/code" ? 'nav-link active' : 'nav-link'}
                                  aria-current= "page"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12" height="14"
                                    viewBox="0 0 12 14"
                                    fill="none">
                                    <path
                                      d="M6.7714 0L0.536498 7.4816C0.292898 7.7742 0.170398 7.9212 0.168998 8.0444C0.168079 8.09751 0.179263 8.15014 0.2017 8.19828C0.224137 8.24643 0.257239 8.28884 0.298498 8.3223C0.395098 8.4 0.585498 8.4 0.966998 8.4H6.0714L5.3714 14L11.6063 6.5184C11.8499 6.2258 11.9724 6.0788 11.9738 5.9556C11.9747 5.90249 11.9635 5.84986 11.9411 5.80172C11.9187 5.75357 11.8856 5.71116 11.8443 5.6777C11.7477 5.6 11.5573 5.6 11.1758 5.6H6.0714L6.7714 0Z"
                                      fill="#B4F43D" />
                                  </svg>
                                  Generate</Link>
                              </li>
                              <li className="nav-item">
                                <Link to="/thread"
                                  className={activeLink === "/thread" ? 'nav-link active' : 'nav-link'}
                                >All threads</Link>
                              </li>
                            </ul>
                          )
                        }
                        <div class="avaliable_credits d-flex align-items-center me-lg-5 pe-lg-4">
                          <img src="/images/Credits.png" alt="" />
                          <h6 class="m-0 mx-2 px-1">{Math.floor(userCredit)} credits available</h6>
                          <div class="add">
                            <Link className="nav-link" to="/buy-credit"
                            > <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25" height="24"
                              viewBox="0 0 25 24"
                              fill="none">
                                <path
                                  d="M12.3162 4.79999L12.3162 19.2M19.5162 12L5.11621 12"
                                  stroke="#271353"
                                  stroke-width="2"
                                  stroke-linecap="round" />
                              </svg></Link>
                          </div>
                        </div>
                        <Profile />
                      </div>
                    )
                  }
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header;
