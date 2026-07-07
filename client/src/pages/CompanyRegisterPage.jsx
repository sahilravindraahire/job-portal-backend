import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import Alert from "../components/common/Alert"
import {registerCompany, clearCompanyError} from "../features/company/companySlice"

function CompanyRegisterPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, error } = useSelector((state) => state.company);

    const [form, setForm] = useState({ name: "", description: "", location: "", website: "" });
    const [image, setImage] = useState(null);

    const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearCompanyError());
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("companyProfileImage", image);

    const result = await dispatch(registerCompany(formData));
    if (registerCompany.fulfilled.match(result)) {
      navigate("/employer/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-1">Register your company</h1>
      <p className="text-gray-mid text-sm mb-8">
        This profile appears on every job you post.
      </p>

      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} onClose={() => dispatch(clearCompanyError())} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Company name"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Input
          as="textarea"
          id="description"
          label="Description"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Input
          id="location"
          label="Location"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <Input
          id="website"
          label="Website"
          type="url"
          placeholder="https://"
          value={form.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
        <label className="flex flex-col gap-1.5">
          <span className="stamp text-gray-mid">Logo (optional)</span>
          <span className="input-field flex items-center gap-2 px-3.5 py-2.5 text-sm cursor-pointer text-gray-mid">
            <FiUpload size={14} />
            {image ? image.name.slice(0, 20) : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </span>
        </label>
        <Button type="submit" loading={status === "loading"} className="w-full mt-2">
          Register company
        </Button>
      </form>
    </div>
  )
}

export default CompanyRegisterPage
