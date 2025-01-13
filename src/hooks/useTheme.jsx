import { useContext } from "react";
import ColorContext from "../context/ColorProvider";

const useTheme = () => {
    return useContext(ColorContext)
}

export default useTheme;
