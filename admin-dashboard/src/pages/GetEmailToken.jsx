/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import forgotPassword from "/forgot_password.jpg"; // Fix image import path
import { toast } from "react-toastify";
import { TiArrowBack } from "react-icons/ti";
import { useSelector } from "react-redux";
import provideForgotPasswordForUser from "@/redux/ForgotPassword/dispatchActionProvider";
const GetEmailToken = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const forgotPasswordForUserState = useSelector(
    (RootState) => RootState.forgotPasswordForUserState
  );

  // state
  const { token } = forgotPasswordForUserState;

  // actions
  const { setToken } = provideForgotPasswordForUser();

  const emailTokenHandler = () => {
    if (!forgotPasswordForUserState.token) {
      toast.error("Enter Valid token");
    }
    toast.success("Token Submitted");
    navigate(`/password/reset/${token}`);
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
        <div className="min-h-[100vh] flex items-center justify-center py-12">
          <div className="flex justify-center">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Token</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your token that you received on your email.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Token</Label>
                  <Input
                    id="email"
                    type="text"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                    }}
                    placeholder="Paste token here ..."
                    required
                  />
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                  onClick={emailTokenHandler}
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
          </div>
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

export default GetEmailToken;
