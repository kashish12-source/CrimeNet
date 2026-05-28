import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");
    };

    return (

        <div className="bg-white shadow-md p-4 flex justify-between items-center">

            <h1 className="text-2xl font-bold">
                Crime Management System
            </h1>

            <div className="flex items-center gap-4">

                <div className="text-right">

                    <p className="font-semibold">
                        {user?.username}
                    </p>

                    <p className="text-sm text-gray-500 capitalize">
                        {user?.role}
                    </p>

                </div>

                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Navbar;