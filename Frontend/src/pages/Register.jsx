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
        phone_number: "",
        created_at: ""
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

            await registerService(formData);

            alert("Registration successful! Please login.");
            navigate("/");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Registration failed"
            );
        }
    };

    return (

        <div className="
            min-h-screen
            bg-gray-100
            flex
            items-center
            justify-center
            px-4
        ">

            <div className="
                bg-white
                w-full
                max-w-lg
                p-8
                rounded-2xl
                shadow-xl
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                ">
                    Create Account
                </h1>

                <p className="
                    text-gray-500
                    text-center
                    mb-8
                ">
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
                        autoComplete="username"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter Email"
                        autoComplete="email"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter Password"
                        autoComplete="new-password"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        value={formData.role}
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
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
                        autoComplete="street-address"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        placeholder="Enter Phone Number"
                        autoComplete="tel"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-black
                            text-white
                            p-3
                            rounded-lg
                            hover:bg-gray-800
                            transition
                            duration-300
                            font-semibold
                        "
                    >
                        Register
                    </button>

                    <p className="
                        text-center
                        text-gray-600
                    ">
                        Already have an account?{" "}

                        <Link
                            to="/"
                            className="
                                text-black
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