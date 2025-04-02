import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../UserContext';
import { Dropdown, Button } from 'react-bootstrap';

const Profile = () => {
  const { userData, profile } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("userCredit");
    localStorage.removeItem("shippingData");
    localStorage.removeItem("formData");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userCredit");
    localStorage.removeItem("customBoardPromptId");
    navigate('/signin')

  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    // const { firstName, lastName } = userData || {};
    // const username = `${firstName} ${lastName}`;
    setUsername(userData);
  }, []);

  return (
    <div className="d-flex user_info dropdown" >
      <div className="img me-3">
        <Link to='/profile'>
          {profile ? (
            <img src={profile}
              width="40px" height="40px"
            />
          ) : (
            username.profileUrl ? (
              <img src={username.profileUrl} width="40px" height="40px" />
            ) : (
              <img src="images/blank-profile-picture.jpg" width="40px" height="40px" />
            )
          )}

        </Link>
      </div>
      <div class="dropdown profile d-flex align-items-center">
        <Link to='/profile'>
          {userData ? (
            <h4 className="m-0" type="button" aria-expanded="false">{userData.firstName} {userData.lastName}</h4>
          ) : (
            <h4 className="m-0" type="button" aria-expanded="false">{username.firstName}{username.lastName}</h4>
          )}
        </Link>
      </div>

      <div
        class="logout ms-3 d-flex align-items-center ps-1">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24" fill="none"
            >
              <path
                d="M14.6471 7.79998V5.69998C14.6471 5.14302 14.424 4.60888 14.0268 4.21505C13.6297 3.82122 13.091 3.59998 12.5294 3.59998H5.11765C4.55601 3.59998 4.01738 3.82122 3.62024 4.21505C3.22311 4.60888 3 5.14302 3 5.69998V18.3C3 18.8569 3.22311 19.3911 3.62024 19.7849C4.01738 20.1787 4.55601 20.4 5.11765 20.4H12.5294C13.091 20.4 13.6297 20.1787 14.0268 19.7849C14.424 19.3911 14.6471 18.8569 14.6471 18.3V16.2M8.29412 12H21M21 12L17.8235 8.84998M21 12L17.8235 15.15"
                stroke="#271353"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSignOut()}>Confirm Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default Profile;