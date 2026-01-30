
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default theme
    const [theme, setTheme] = useState(localStorage.getItem("chat-theme") || "default");

    useEffect(() => {
        localStorage.setItem("chat-theme", theme);
    }, [theme]);

    const themes = {
        default: "bg-[#1e1e2d]",
        ocean: "bg-gradient-to-br from-blue-900 to-cyan-800",
        sunset: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
        forest: "bg-gradient-to-br from-gray-900 to-emerald-900",
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
