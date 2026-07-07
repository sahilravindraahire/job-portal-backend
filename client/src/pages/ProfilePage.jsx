import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload, FiFileText } from "react-icons/fi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  clearAuthError,
} from "../features/auth/authSlice.js";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    skills: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        skills: user.skills || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (profileImage) formData.append("profileImage", profileImage);
    if (resume) formData.append("resume", resume);

    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) setSaved(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwSaved(false);
    const result = await dispatch(changePassword(pwForm));
    if (changePassword.fulfilled.match(result)) {
      setPwSaved(true);
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-8">Your profile</h1>

      {error && (
        <div className="mb-5">
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearAuthError())}
          />
        </div>
      )}
      {saved && (
        <div className="mb-5">
          <Alert
            type="success"
            message="Profile updated"
            onClose={() => setSaved(false)}
          />
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-paper-dim border border-line flex items-center justify-center font-display text-xl overflow-hidden">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            user.fullName?.[0]?.toUpperCase()
          )}
        </div>
        <div>
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-mid">{user.email}</p>
          <span className="stamp text-gray-soft">{user.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <Input
          id="fullName"
          label="Full name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
        <Input
          id="phoneNumber"
          label="Phone number"
          value={form.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
        {user.role === "employe" && (
          <Input
            id="skills"
            label="Skills"
            value={form.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
          />
        )}
        <Input
          as="textarea"
          id="bio"
          label="Bio"
          rows={3}
          value={form.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="stamp text-gray-mid">Profile photo</span>
            <span className="input-field flex items-center gap-2 px-3.5 py-2.5 text-sm cursor-pointer text-gray-mid">
              <FiUpload size={14} />
              {profileImage ? profileImage.name.slice(0, 14) : "Change"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
            </span>
          </label>
          {user.role === "employe" && (
            <label className="flex flex-col gap-1.5">
              <span className="stamp text-gray-mid">Resume</span>
              <span className="input-field flex items-center gap-2 px-3.5 py-2.5 text-sm cursor-pointer text-gray-mid">
                <FiUpload size={14} />
                {resume ? resume.name.slice(0, 14) : "Change"}
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

        {user.resume && (
          <a
            href={user.resume}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm underline underline-offset-2 w-fit"
          >
            <FiFileText size={14} /> Current resume
          </a>
        )}

        <Button
          type="submit"
          loading={status === "loading"}
          className="w-full mt-2"
        >
          Save changes
        </Button>
      </form>

      <div className="border-t border-line pt-8">
        <h2 className="font-display text-xl mb-4">Change password</h2>
        {pwSaved && (
          <div className="mb-4">
            <Alert
              type="success"
              message="Password changed"
              onClose={() => setPwSaved(false)}
            />
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            id="oldPassword"
            label="Current password"
            type="password"
            required
            value={pwForm.oldPassword}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, oldPassword: e.target.value }))
            }
          />
          <Input
            id="newPassword"
            label="New password"
            type="password"
            required
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, newPassword: e.target.value }))
            }
          />
          <Input
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            required
            value={pwForm.confirmPassword}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
          />
          <Button type="submit" variant="outline" className="w-full">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
