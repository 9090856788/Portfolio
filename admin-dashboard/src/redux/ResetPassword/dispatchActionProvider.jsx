/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { setNewPassword, setConfirmPassword } from "./reducers";

const provideResetPasswordForUser = () => {
    const dispatch = useDispatch();
    return {
        setNewPassword: (newPassword) => dispatch(setNewPassword(newPassword)),
        setConfirmPassword: (confirmPassword) => dispatch(setConfirmPassword(confirmPassword)),
    }
}

export default provideResetPasswordForUser;