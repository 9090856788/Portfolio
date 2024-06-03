/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "/6310507.jpg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import provideLoginDetailsForUser from "../redux/Login/dispatchActionProvider";
import { CirclesWithBar } from "react-loader-spinner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginDetailsForUserState = useSelector(
    (RootState) => RootState.loginDetailsForUserState
  );

  // state
  const {
    email,
    password,
    isAuthenticated,
    loading,
    error,
    message,
    isUpdated,
    token,
    user,
  } = loginDetailsForUserState;

  // actions
  const {
    setEmail,
    setPassword,
    setIsAuthenticated,
    setLoading,
    setError,
    setMessage,
    setIsUpdated,
    setToken,
    setUser,
  } = provideLoginDetailsForUser();

  const handleLogin = async () => {
    try {
      if (email.length === 0) {
        toast.error("Email is Required");
        return;
      } else if (password.length === 0) {
        toast.error("Password is Required");
        return;
      }
      setLoading(true);
      const loginApiData = {
        email: loginDetailsForUserState.email,
        password: loginDetailsForUserState.password,
      };

      let config = {
        method: "post",
        url: `http://localhost:3000/api/v1/user/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: loginApiData,
      };
      let response = await axios(config);
      let updateReduxData = response.data;
      console.log("Response is :", response.data);

      // Dispatch actions to update Redux store
      dispatch(setEmail(updateReduxData.email));
      dispatch(setPassword(updateReduxData.password));
      dispatch(setIsAuthenticated(true));
      dispatch(setLoading(loading));
      dispatch(setError(error));
      dispatch(setMessage(updateReduxData.message));
      dispatch(setIsUpdated(true));
      dispatch(setToken(updateReduxData.token));
      dispatch(setUser(updateReduxData.user));
      navigate("/");
    } catch (error) {
      toast.error("Unable to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
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
                  placeholder="something@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/password/forgot"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
            {error && <p>{error}</p>}
          </div>
        )}
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={loginImage}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Login;
