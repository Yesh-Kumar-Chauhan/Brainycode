import React, { useState } from 'react'
import Account from '../../component/profile/Account'
import Activity from '../../component/profile/Activity'
import Orders from '../../component/profile/Orders'
import ChangePassword from '../../component/profile/ChangePassword'

const ProfilePage = () => {
    return (
        <section
            className="banner_section generate_banner account_overview login_section sign_up_screen position-relative align-items-start">
            <div className="container position-relative" style={{ zindex: 9 }}>
                <div className="row">
                    <div className="col-lg-2 col-md-12 col-sm-12 col-12 pe-lg-3">
                        <ul className="nav flex-lg-column nav-tabs py-3 pe-lg-3"
                            id="myTab"
                            role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active"

                                    id="account-overview-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#account-overview"
                                    type="button" role="tab"
                                    aria-controls="account-overview"
                                    aria-selected="true" 
                                     >Account
                                    overview</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link"

                                 id="activity-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#activity" type="button"
                                    role="tab" aria-controls="activity"
                                    aria-selected="false"  
                                    >Activity</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="orders-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#orders" type="button"
                                    role="tab" aria-controls="orders"
                                    aria-selected="false"  
                                    >Your orders</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link"
                                    id="change-password-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#change-password"
                                    type="button"
                                    role="tab" aria-controls="change-password"
                                    aria-selected="false"  
                                    >Change
                                    password</button>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="col-lg-10 col-md-12 col-sm-12 col-12 ps-lg-4 d-flex align-items-start">
                        <div
                            className="prifile_seprator d-lg-block d-md-none d-none ms-1">
                        </div>
                        <div className="tab-content ps-lg-5 py-4 w-100"
                            id="myTabContent">
                            <Account/>
                            <Activity />
                            <Orders />
                            <ChangePassword />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProfilePage


