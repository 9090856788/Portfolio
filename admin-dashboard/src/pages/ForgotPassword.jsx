/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import forgotPassword from "/forgot_password.jpg"; // Fix image import path
import axios from "axios";
import { toast } from "react-toastify";
import { TiArrowBack } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import provideForgotPasswordForUser from "@/redux/ForgotPassword/dispatchActionProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const forgotPasswordForUserState = useSelector(
    (RootState) => RootState.forgotPasswordForUserState
  );

  // state
  const { success, message, token } = forgotPasswordForUserState;

  // actions
  const { setSuccess, setMessage, setToken } = provideForgotPasswordForUser();

  const forgotPasswordHandler = async () => {
    let myEmail = `kanhucharansahoo595@gmail.com`;
    try {
      if (email !== myEmail) {
        toast.error("Please enter a valid email address");
        return;
      }
      setLoading(true); // Dispatch setLoading action to Redux
      let forgotApiData = {
        email: email,
      };
      let config = {
        method: "post",
        url: `http://localhost:3000/api/v1/user/password/forgot`,
        headers: {
          "Content-Type": "application/json",
        },
        data: forgotApiData,
      };
      let response = await axios(config);
      console.log(response.data);
      dispatch(setSuccess(response.data.success));
      dispatch(setMessage(response.data.message));
      toast.success(response.data.message);
      setLoading(false); // Dispatch setLoading action to Redux
      // navigate("/password/reset/:token");
    } catch (error) {
      toast.error(error);
    }
  };

  const resetPasswordHandler = () => {
    navigate(`/password/reset/${token}`);
  };

  console.log("Email is: ", email);

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
        <div className="min-h-[100vh] flex items-center justify-center py-12">
          {loading ? (
            <div className="flex justify-center">
              <CirclesWithBar
                height="100"
                width="100"
                color="#4fa94d"
                outerCircleColor="#4fa94d"
                innerCircleColor="#4fa94d"
                barColor="#4fa94d"
                ariaLabel="circles-with-bar-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            <div className="mx-auto grid w-[350px] gap-6">
              {/* {success ? (
                <>
                  <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
                    <div className="min-h-[100vh] flex items-center justify-center py-12">
                      {loading ? (
                        <div className="flex justify-center">
                          <CirclesWithBar
                            height="100"
                            width="100"
                            color="#4fa94d"
                            outerCircleColor="#4fa94d"
                            innerCircleColor="#4fa94d"
                            barColor="#4fa94d"
                            ariaLabel="circles-with-bar-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                          />
                        </div>
                      ) : (
                        <div className="mx-auto grid w-[350px] gap-6">
                          <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">
                              Reset Password
                            </h1>
                            <p className="text-balance text-muted-foreground">
                              Please check your Registered email & copy of the
                              token & paste on the below input field.
                            </p>
                          </div>

                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="email">Token</Label>
                              <Input
                                id="token"
                                type="text"
                                value={token}
                                onChange={(e) => {
                                  dispatch(setToken(e.target.value));
                                }}
                                placeholder="Paste token here"
                                required
                              />
                            </div>

                            <Button
                              variant="outline"
                              type="button"
                              className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                              onClick={resetPasswordHandler}
                            >
                              Submit
                            </Button>
                          </div>
                          <Link to="/password/forgot">
                            <Button
                              variant="outline"
                              type="button"
                              className="w-100 text-black border"
                            >
                              <TiArrowBack />
                              Back to Forgot Password Page
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null} */}
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email and We will send you instructions to reset
                  your password
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter Your Email"
                    required
                  />
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                  onClick={forgotPasswordHandler}
                >
                  Send Reset Link
                </Button>
              </div>
              <Link to="/login">
                <Button
                  variant="outline"
                  type="button"
                  className="w-100 text-black border"
                >
                  <TiArrowBack />
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="hidden bg-muted lg:block">
          <img
            src={forgotPassword}
            alt="Image"
            width="1920"
            height="1080"
            className="w-800 object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
