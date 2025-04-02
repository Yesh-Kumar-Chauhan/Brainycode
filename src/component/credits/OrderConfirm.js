import React, { useState, useEffect } from 'react'
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { Link, useNavigate } from "react-router-dom"
import moment from 'moment';

const OrderConfirm = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        userData: {},
        orderNumber: '',
        orderSummaryData: {}
    });
    const [load, setload] = useState(false);
    const [shippingDate, setShippingDate] = useState("");
    const [noOfDays, setnoOfDays] = useState("");
    const [credits, setCredits] = useState('');
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const orderNumber = JSON.parse(localStorage.getItem("orderNumber"));
        const orderSummaryData = JSON.parse(localStorage.getItem("orderSummaryData"));
        const shippingDate = orderSummaryData.description;
        const totalCredits = parseInt(orderSummaryData.credit) + 20;
        setCredits(totalCredits)
        const matchResult = shippingDate.match(/-(\d+)\s*days$/);
        if (matchResult) {
            const lastDigit = matchResult[1];
            setnoOfDays(lastDigit);
        } else {
            console.log("No digit found in the shipping date.");
        }
        setShippingDate(shippingDate);
        setOrderData({
            userData: userData ? userData : {},
            orderNumber: orderNumber ? orderNumber : '',
            orderSummaryData: orderSummaryData ? orderSummaryData : 0,
        });
        getOrderData();
    }, []);
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    const getOrderData = async () => {
        setload(true)
        try {
            const { data } = await api.get(
                // `subscription/last-order`
                `subscription/last-order?userId=${userData.id}`
            );
            setOrderData(data.lastOrder.order);

        } catch (error) {
            // toast.error(error.response.data.message);
        }
        setload(false);
    };

    const handleRemoveLocalStorage = (e) => {
        e.preventDefault()
        localStorage.removeItem("orderNumber");
        localStorage.removeItem("orderSummaryData");
        localStorage.removeItem("shippingData");
        localStorage.removeItem("customBoard");
        localStorage.removeItem("customPromptObject");
        localStorage.removeItem("customBoardPromptId");
        navigate("/code")
    };

    console.log("orserData", orderData);

    return (
        <>
            {load ? (
                <div className="w-100 page_loader align-items-center d-flex justify-content-center">
                    <h1
                        className="loading-spinner"
                        style={{
                            color: "#101A36",
                            margin: "0",
                            backdropFilter: "blur(8px)",
                        }}
                    ></h1>
                </div>
            ) : (
                ""
            )}
            <section class="board_section py-5">
                <div class="container">
                    <div
                        class="row g-3 flex-lg-row flex-md-column-reverse flex-column-reverse">
                        <div
                            class="col-lg-6 d-flex align-items-center col-md-12 col-sm-12 col-12 d-flex align-items-center">
                            <div class="inner_text">
                                <h2 class="mb-0">Thank you, {userData?.firstName}! <br />
                                    Your order is confirmed.</h2>
                                <div class="my-4 py-lg-3">
                                    <p class="m-0">We're getting your custom
                                        embedded board
                                        ready to be shipped. Here are the details of
                                        your order.</p>
                                </div>
                                <div class="row g-2 mb-4 pb-lg-3">
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Order number:</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0">{orderData?.id}</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Order date:</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"> {moment(orderData.createdAt).format('DD/MM/YYYY')}</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Status:</b></p>
                                    </div>

                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0">{orderData?.status}</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Credits used:</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0">{credits}</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Shipping:</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0">Standard shipping at 55.00 Credits ({shippingDate})</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Paid with:</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p class="m-0">Credit card</p>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <p class="m-0"><b>Est. delivery date :</b></p>
                                    </div>
                                    <div
                                        class="col-lg-8 col-md-12 col-sm-12 col-12">
                                        <p className="m-0">{moment(orderData.updatedAt).add(parseInt(noOfDays), 'days').format('DD/MM/YYYY')}</p>
                                    </div>
                                </div>
                                <button type='button' class="btn btn-primary" onClick={(e)=> {handleRemoveLocalStorage(e)}}>Back to homepage</button>
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-12 col-sm-12 offset-lg-1 col-12 d-flex align-items-center">
                            <div class="pro_img Order_confirmation w-100">
                                <img src="images/Order_confirmation.png" alt />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderConfirm
