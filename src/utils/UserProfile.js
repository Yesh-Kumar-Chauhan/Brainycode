import { useEffect, useState } from "react";

const UserProfile = () => {
    const [user, setUser] = useState();
    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        const token = localStorage.getItem("token")
        if (storedUserData || token) {
            const userData = JSON.parse(storedUserData);
            setUser({ ...userData, token });
        }
    }, [])


    if (!user) {
        return null;
    }

    return user;
}

export default UserProfile