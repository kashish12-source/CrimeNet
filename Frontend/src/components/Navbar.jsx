function Navbar() {

    return (

        <div className="bg-white shadow-md p-4 flex justify-between items-center">

            <h1 className="text-2xl font-bold">
                Crime Management System
            </h1>

            <div className="flex items-center gap-4">

                <p className="font-semibold">
                    Admin
                </p>

                <button className="bg-black text-white px-4 py-2 rounded-lg">

                    Logout

                </button>

            </div>

        </div>
    );
}

export default Navbar;