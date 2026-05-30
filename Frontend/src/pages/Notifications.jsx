import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

import {
    getNotifications
} from "../../Services/notificationService";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        fetchNotifications();

    }, []);

    const fetchNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="flex bg-slate-100 dark:bg-slate-900 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                        Notifications
                    </h1>

                    <div className="space-y-4">

                        {
                            notifications.length > 0 ? (
                                notifications.map((item) => (

                                    <div
                                        key={item.id}
                                        className="
                                            bg-white
                                            dark:bg-slate-700
                                            dark:text-slate-100
                                            p-5
                                            rounded-xl
                                            shadow-md
                                        "
                                    >

                                        <p>
                                            {item.message}
                                        </p>

                                    </div>

                                ))
                            ) : (
                                <div className="
                                    bg-white
                                    dark:bg-slate-700
                                    dark:text-slate-100
                                    p-5
                                    rounded-xl
                                    shadow-md
                                ">
                                    <p>No notifications available.</p>
                                </div>
                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Notifications;