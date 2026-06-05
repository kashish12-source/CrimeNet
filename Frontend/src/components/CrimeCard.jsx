import { useNavigate } from "react-router-dom";

function CrimeCard({ crime }) {

    const navigate = useNavigate();

    return (

        <div
            onClick={() =>
                navigate(`/crime/${crime.id}`)
            }
            className="
                bg-white
                dark:bg-slate-700
                p-5
                rounded-xl
                shadow-md
                cursor-pointer
                hover:shadow-xl
                transition
            "
        >

            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                {crime.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mb-3">
                {crime.description}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                Location: {crime.location}
            </p>

            <div className="mt-4">

                <span className="
                    bg-yellow-100
                    dark:bg-yellow-900
                    text-yellow-700
                    dark:text-yellow-100
                    px-3
                    py-1
                    rounded-full
                    text-sm
                ">
                    {crime.status}
                </span>

            </div>

        </div>
    );
}

export default CrimeCard;