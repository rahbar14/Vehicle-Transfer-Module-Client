"use client"
import axios from "axios";

const BaseUrl = () => {
    axios.defaults.baseURL = "http://localhost:8000/api";
    return <></>
};

export default BaseUrl;
