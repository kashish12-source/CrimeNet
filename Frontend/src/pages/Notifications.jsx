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

        <div className="flex bg-gray-100 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Notifications
                    </h1>

                    <div className="space-y-4">

                        {
                            notifications.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                        bg-white
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
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Notifications;