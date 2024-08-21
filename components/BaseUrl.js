"use client"
import axios from "axios";
import CONFIG from "../config/config"

const BaseUrl = () => {
    axios.defaults.baseURL = CONFIG.API_BASE_URL + "/api";
    return <></>
};

export default BaseUrl;
