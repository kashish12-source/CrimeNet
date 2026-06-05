import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser as registerService } from "../../Services/authService";

function Register() {


const navigate = useNavigate();

const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    address: "",
    phone_number: ""
});

const handleChange = (e) => {

    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

const registerUser = async (e) => {

    e.preventDefault();

    try {

        console.log(formData);

        const response = await registerService(formData);

        console.log(response.data);

        alert("Registration successful! Please login.");

        navigate("/");

    } catch (error) {

        console.log(error);

        console.log(error?.response?.data);

        alert(
            error?.response?.data?.detail ||
            "Registration failed"
        );
    }
};

return (

    <div
        className="
            min-h-screen
            bg-slate-100
            dark:bg-slate-800
            flex
            items-center
            justify-center
            px-4
        "
    >

        <div
            className="
                bg-white
                dark:bg-slate-700
                w-full
                max-w-lg
                p-8
                rounded-2xl
                shadow-xl
            "
        >

            <h1
                className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                    text-slate-900
                    dark:text-slate-100
                "
            >
                Create Account
            </h1>

            <p
                className="
                    text-slate-500
                    dark:text-slate-300
                    text-center
                    mb-8
                "
            >
                Register to continue
            </p>

            <form
                onSubmit={registerUser}
                className="space-y-5"
            >

                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Enter Username"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                />

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter Password"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                >
                    <option value="">
                        Select Role
                    </option>

                    <option value="citizen">
                        Citizen
                    </option>

                    <option value="officer">
                        Officer
                    </option>

                    <option value="admin">
                        Admin
                    </option>
                </select>

                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="Enter Address"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                />

                <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    placeholder="Enter Phone Number"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        bg-white
                        dark:bg-slate-900
                        dark:text-slate-100
                        dark:border-slate-600
                        p-3
                        rounded-lg
                    "
                    required
                />

                <button
                    type="submit"
                    className="
                        w-full
                        bg-blue-600
                        dark:bg-blue-500
                        text-white
                        p-3
                        rounded-lg
                        hover:bg-blue-700
                        dark:hover:bg-blue-600
                        transition
                    "
                >
                    Register
                </button>

                <p
                    className="
                        text-center
                        text-slate-600
                        dark:text-slate-300
                    "
                >
                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="
                            text-blue-600
                            dark:text-blue-400
                            font-semibold
                            hover:underline
                        "
                    >
                        Login
                    </Link>
                </p>

            </form>

        </div>

    </div>
);


}

export default Register;
