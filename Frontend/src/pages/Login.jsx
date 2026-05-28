import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser as loginService } from "../../Services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        try {

            const formData = {
                email,
                password
            };

            const response = await loginService(formData);

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                "Login failed. Please check your credentials."
            );
        }
    };

    return (

        <div className="
            min-h-screen
            flex
            justify-center
            items-center
            bg-gray-100
            px-4
        ">

            <form
                onSubmit={loginUser}
                className="
                    bg-white
                    p-10
                    rounded-2xl
                    shadow-lg
                    w-full
                    max-w-md
                "
            >

                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                ">
                    Welcome Back
                </h1>

                <p className="
                    text-gray-500
                    text-center
                    mb-8
                ">
                    Login to continue
                </p>

                <div className="mb-5">

                    <input
                        type="email"
                        placeholder="Enter Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                    />

                </div>

                <div className="mb-6">

                    <input
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
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
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="
                        w-full
                        bg-black
                        text-white
                        py-3
                        rounded-lg
                        hover:bg-gray-800
                        transition
                        font-semibold
                    "
                >
                    Login
                </button>

                <p className="
                    text-center
                    text-gray-600
                    mt-5
                ">
                    Don’t have an account?{" "}

                    <Link
                        to="/register"
                        className="
                            text-black
                            font-semibold
                            hover:underline
                        "
                    >
                        Register
                    </Link>
                </p>

            </form>

        </div>
    );
}

export default Login;