import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import { registerUser, clearAuthError } from "../features/auth/authSlice.js";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "employe",
    skills: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [formError, setFormError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    dispatch(clearAuthError());

    if (form.role === "employe" && !resume) {
      setFormError("Resume is required for employee accounts");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (profileImage) formData.append("profileImage", profileImage);
    if (resume) formData.append("resume", resume);

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate("/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <p className="stamp text-gray-mid mb-2">Step 1 of 2</p>
      <h1 className="font-display text-3xl mb-1">Create your account</h1>
      <p className="text-gray-mid text-sm mb-8">
        Already registered?{" "}
        <Link to="/login" className="underline underline-offset-2 text-ink">
          Log in
        </Link>
      </p>

      {(error || formError) && (
        <div className="mb-5">
          <Alert
            type="error"
            message={formError || error}
            onClose={() => {
              setFormError("");
              dispatch(clearAuthError());
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange("role", "employe")}
            className={`border py-2.5 text-sm font-medium cursor-pointer ${form.role === "employe" ? "border-ink bg-ink text-paper" : "border-line text-gray-mid"}`}
          >
            I'm a job seeker
          </button>
          <button
            type="button"
            onClick={() => handleChange("role", "employer")}
            className={`border py-2.5 text-sm font-medium cursor-pointer ${form.role === "employer" ? "border-ink bg-ink text-paper" : "border-line text-gray-mid"}`}
          >
            I'm an employer
          </button>
        </div>

        <Input
          id="fullName"
          label="Full name"
          required
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <Input
          id="phoneNumber"
          label="Phone number"
          type="tel"
          required
          value={form.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />

        {form.role === "employe" && (
          <Input
            id="skills"
            label="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
        )}

        <Input
          as="textarea"
          id="bio"
          label="Short bio (optional)"
          rows={3}
          value={form.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="stamp text-gray-mid">Profile photo</span>
            <span className="input-field flex items-center gap-2 px-3.5 py-2.5 text-sm cursor-pointer text-gray-mid">
              <FiUpload size={14} />
              {profileImage ? profileImage.name.slice(0, 14) : "Optional"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
            </span>
          </label>

          {form.role === "employe" && (
            <label className="flex flex-col gap-1.5">
              <span className="stamp text-gray-mid">Resume *</span>
              <span className="input-field flex items-center gap-2 px-3.5 py-2.5 text-sm cursor-pointer text-gray-mid">
                <FiUpload size={14} />
                {resume ? resume.name.slice(0, 14) : "Required"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
              </span>
            </label>
          )}
        </div>
        <Button
          type="submit"
          loading={status === "loading"}
          className="mt-2 w-full"
        >
          Create account
        </Button>
      </form>
    </div>
  );
}

export default RegisterPage;
