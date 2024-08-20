"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthUser = ({children, setUser}) => {
    const router = useRouter();
    const [auth, setAuth] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get("/user/get-user", { withCredentials: true });
                if (res.data.status) {
                    setAuth(true);
                    setUser(res.data.data);
                }
            } catch (error) {
                router.push("/login")
            }
        }
        getUser();
    }, [])

    return <>{auth && children}</>
};

export default AuthUser;
