import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import api from "../../services/axios-config";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from '@stripe/stripe-js'

const PurchaseCredits = () => {

  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [userDataDetails, setUserData] = useState('');
  const [plans, setPlan] = useState([])

  const userData = JSON.parse(localStorage.getItem('userData'));

  const Schema = z.object({
    amount: z.string().min(1, { message: "Please select amount" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(Schema),
  });

  const handleSelectChange = (value) => {
    const amount = JSON.parse(value)
    setSelectedAmount(amount);
  };

  const handleBackClick = () => {
    navigate("/code", { scroll: false });
  };

  useEffect(() => {
    getUserData()
    getPlan()
  }, [setPlan, setUserData]);

  const getUserData = async () => {
    try {
      const response = await api.get(`/subscription/credit?userId=${userData.id}`);
      setUserData(response.data.userCredit)
      // localStorage.setItem('userCredits', response.data.userCredit.credits)
    } catch (error) {
      // toast.error(error);
    }
  }

  const getPlan = async () => {
    try {
      const response = await api.get("/subscription/plan");
      setPlan(response.data.plan)
    } catch (error) {
      // toast.error(error);
    }
  }


  const onSubmit = async (value) => {
    try {
      console.log('userData', userDataDetails.credits)
      const obj = { amount: JSON.parse(value.amount) };
      const obj1 = {
        amount: {
          createdAt: obj.amount.createdAt,
          credit: obj.amount.credit,
          id: obj.amount.id,
          updatedAt: obj.amount.updatedAt,
          userId: userData.id,
          price: obj.amount.price
        },
      };
      console.log("obj.amount", obj.amount)
      const stripePromise = await loadStripe('pk_test_51Ok3mhSE6dF2qCWlCYT6iDk2fBA3AJN4X3eleq8PDBTe9h0u88WPydQw0LxiY4TDkHZz1DZ7u197A6lXOaQRTlKX00aRQGQcrg');
      const { data } = await api.post("/subscription/create-checkout-session", obj1.amount);
      if (!data) {
        console.log("error ")
      }
      stripePromise.redirectToCheckout({ sessionId: data.session.id })
    } catch (error) {
      // toast.error(error);
    }
  };

  return (
    <>
      <section className="generate_code_section">
        <div className="container">
          <form className="row justify-content-center" onSubmit={handleSubmit(onSubmit)} >
            <div className="col-lg-9 col-md-12 col-sm-12 col-12">
              <div className="inner_text text-center">
                <h2 className="mb-4 pb-lg-2">Buy Credits</h2>
                <div>
                  <div className="creadits text-center mb-4">
                    <h5 className="m-0">Your availbale <b>Credits {userDataDetails.credits}</b></h5>
                  </div>

                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-lg-5 col-md-5 col-sm-12 col-12 mt-lg-0">
                        <label className="label text-start w-100 mb-2"><b>Select the amount to buy</b></label>
                        <div className="position-relative select_outer">
                          <select className={`form-select ${errors.amount ? "is-invalid" : ""
                            }`} onChange={handleSelectChange}
                            id="amount"
                            {...register("amount", {
                              onBlur: () => trigger("amount"),
                              onChange: (e) => {
                                handleSelectChange(e.target.value);
                                trigger("amount");
                              },
                            })}>
                            <option value="" default>Select amount</option>
                            {plans.map((plan) => (
                              <option key={plan.credit} value={JSON.stringify(plan)}>
                                {plan.credit} for ${plan.price}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.amount && (
                          <div className="text-danger text-start mt-1">{errors.amount.message}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="container mt-4">
                    <div className="creadits text-center mb-4">
                      <h5 className="m-0">Your new credit <b> balance will be {selectedAmount ? (selectedAmount.credit + parseInt(userDataDetails.credits)) : userDataDetails.credits}</b></h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-3 generate_form pt-0 pb-0">
                <button className="btn w-auto btn-outline-primary" onClick={handleBackClick}>Back</button>
                <button
                  type="submit"
                  className="btn w-auto btn-primary align-items-center"
                >
                  Buy credits
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default PurchaseCredits