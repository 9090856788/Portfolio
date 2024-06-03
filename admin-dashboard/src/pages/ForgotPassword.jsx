/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { DNA } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import forgotPassword from "/forgot_password.jpg";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const loginDetailsForUserState = useSelector(
    (RootState) => RootState.loginDetailsForUserState
  );

  const {
    password,
    isAuthenticated,
    loading,
    error,
    message,
    isUpdated,
    token,
    user,
  } = loginDetailsForUserState;

  const forgotPasswordHandler = async () => {
    try {
      let forgotApiData = {
        email: email,
      };
      let config = {
        method: "post",
        url: `http://localhost:3000/api/v1/password/forgot`,
        headers: {
          "Content-Type": "application/json",
        },
        data: forgotApiData,
      };
      let response = await axios(config);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Email is: ", email);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12">
        {loading ? (
          <div className="flex justify-center">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Forgot Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email and We will send you instructions to reset your
                password
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
          </div>
        )}
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={forgotPassword}
          alt="Image"
          width="1920"
          height="1080"
          className="w-800 h-800 object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
