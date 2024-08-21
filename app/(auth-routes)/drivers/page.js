"use client"
import { Table } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CONFIG from "../../../config/config"


const Page = () => {

    const [data, setData] = useState([]);


    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profile_photo',
            key: 'profile_photo',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/driver/drivers-list", { withCredentials: true });
                if (res.data.status) setData(res.data.data.map((obj) => {
                    obj.profile_photo = <Image src={CONFIG.API_BASE_URL + obj.profile_photo} width={50} height={50} className='rounded-full' />
                    return obj
                }))
            } catch (error) { console.log(error) }
        }
        fetchData();
    }, [])


    return (
        <>
            <Table dataSource={data} columns={columns} pagination={{pageSize:10}} />
        </>
    );
};
export default Page;