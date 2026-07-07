import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import Alert from "../components/common/Alert"
import {verifyOtp, clearAuthError} from "../features/auth/authSlice.js"

function VerifyOtpPage() {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(verifyOtp({ email, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <p className="stamp text-gray-mid mb-2">Step 2 of 2</p>
      <h1 className="font-display text-3xl mb-1">Verify your email</h1>
      <p className="text-gray-mid text-sm mb-8">
        Enter the 6-digit code sent to your inbox. It expires in 5 minutes.
      </p>
      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} onClose={() => dispatch(clearAuthError())} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="otp"
          label="OTP code"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="tracking-[0.5em] text-center font-mono text-lg"
        />
        <Button type="submit" loading={status === "loading"} className="w-full">
          Verify & continue
        </Button>
      </form>
    </div>
  )
}

export default VerifyOtpPage
