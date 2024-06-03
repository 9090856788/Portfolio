/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { setSuccess, setMessage, setToken } from "./reducers";

const provideForgotPasswordForUser = () => {
    const dispatch = useDispatch();

    return {
        setSuccess: (success) => dispatch(setSuccess(success)),
        setMessage: (message) => dispatch(setMessage(message)),
        setToken: (token) => dispatch(setToken(token))
    }
}

export default provideForgotPasswordForUser;