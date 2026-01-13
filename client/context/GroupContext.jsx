import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const { axios, socket, authUser } = useContext(AuthContext);

    const getGroups = async () => {
        try {
            const { data } = await axios.get("/api/groups");
            if (data.success) {
                setGroups(data.groups);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const createGroup = async (name, members) => {
        try {
            const { data } = await axios.post("/api/groups/create", { name, members });
            if (data.success) {
                setGroups((prev) => [data.group, ...prev]);
                toast.success("Group created successfully");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create group");
            return false;
        }
    };

    useEffect(() => {
        if (authUser) {
            getGroups();
        }
    }, [authUser]);

    return (
        <GroupContext.Provider value={{ groups, createGroup, getGroups }}>
            {children}
        </GroupContext.Provider>
    );
};
