/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import {
  setLoading,
  setUser,
  setIsAuthenticated,
  setError,
  setMessage,
  setIsUpdated,
  setEmail,
  setPassword,
} from "./reducer";

const provideLoginDetailsForUser = () => {
  const dispatch = useDispatch();
  return {
    setLoading: (loading) => dispatch(setLoading(loading)),
    setUser: (user) => dispatch(setUser(user)),
    setIsAuthenticated: (isAuthenticated) =>
      dispatch(setIsAuthenticated(isAuthenticated)),
    setError: (error) => dispatch(setError(error)),
    setMessage: (message) => dispatch(setMessage(message)),
    setIsUpdated: (isUpdated) => dispatch(setIsUpdated(isUpdated)),
    setEmail: (email) => dispatch(setEmail(email)),
    setPassword: (password) => dispatch(setPassword(password)),
  };
};

export default provideLoginDetailsForUser;
