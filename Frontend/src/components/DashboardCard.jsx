function DashboardCard({ title, value }) {

    return (

        <div className="
            bg-white
            dark:bg-slate-700
            dark:text-slate-100
            p-6
            rounded-2xl
            shadow-md
            hover:shadow-xl
            transition
        ">

            <h2 className="
                text-slate-500
                dark:text-slate-300
                text-lg
                font-medium
            ">
                {title}
            </h2>

            <p className="
                text-4xl
                font-bold
                mt-3
            ">
                {value}
            </p>

        </div>
    );
}

export default DashboardCard;