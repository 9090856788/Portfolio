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
import provideResetPasswordForUser from "@/redux/ResetPassword/dispatchActionProvider";
import { useDispatch, useSelector } from "react-redux";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetPasswordForUserState = useSelector((RootState) => RootState.resetPasswordForUserState);
  const forgotPasswordForUserState = useSelector((RootState) => RootState.forgotPasswordForUserState);

  console.log(resetPasswordForUserState);

  // state
  const { newPassword, confirmNewPassword } = resetPasswordForUserState;
  const { token } = forgotPasswordForUserState;

  // actions
  const { setNewPassword, setConfirmPassword } = provideResetPasswordForUser();

  const resetPasswordHandler = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        toast.error("New Password & Confirm Password does not match");
        return;
      }
      setLoading(true);
  
      let resetApiData = {
        newPassword: resetPasswordForUserState.newPassword,
        confirmNewPassword: resetPasswordForUserState.confirmNewPassword,
      };
  
      let config = {
        method: "post",
        url: `http://localhost:3000/api/v1/user/password/reset/${forgotPasswordForUserState.token}`,
        headers: {
          "content-type": "application/json",
        },
        data: resetApiData,
      };
      console.log("URL is: ", config.url);
      let response = await axios(config);
      console.log(response.data);
      dispatch(setNewPassword(response.data.newPassword));
      dispatch(setConfirmPassword(response.data.newPassword));
      toast.success(response.data.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  console.log("New Password: ", newPassword);
  console.log("Confirm Password: ", confirmNewPassword);

  return (
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
              {/* */}
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your New Password & Confirm Password below field.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  placeholder="Enter New Password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  id="password"
                  type="text"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Enter New Password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={resetPasswordHandler}
              >
                Reset Password
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Back to Login Page ?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
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
          className="w-800 object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
export default ResetPassword;
