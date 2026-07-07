import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import { loginUser, clearAuthError } from "../features/auth/authSlice.js";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || "/");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-1">Welcome back</h1>
      <p className="text-gray-mid text-sm mb-8">
        New here?{" "}
        <Link to="/register" className="underline underline-offset-2 text-ink">
          Create an account
        </Link>
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
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" loading={status === "loading"} className="w-full mt-2">
          Log in
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
