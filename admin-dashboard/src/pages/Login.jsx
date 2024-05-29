/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "/6310507.jpg";
import { useDispatch, useSelector } from "react-redux";
import provideLoginDetailsForUser from "../redux/Login/dispatchActionProvider";

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
  } = provideLoginDetailsForUser();

  const handleLogin = async () => {
    try {
      if (email.length === 0) {
        setError("Email is required");
        return;
      } else if (password.length === 0) {
        setError("Password is required");
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
      console.log("Response is :", response.data);
      // const { token, message } = response.data;

      // Dispatch actions to update Redux store
      dispatch(setToken(token));
      dispatch(setIsAuthenticated(true));
      dispatch(setMessage(message));
      dispatch(setIsUpdated(true));

      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
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
                  href="/forgot-password"
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
            <Button
              variant="outline"
              type="button"
              className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 18 19"
              ></svg>
              Sign in with Google
            </Button>
          </div>
          {error && <p>{error}</p>}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
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
