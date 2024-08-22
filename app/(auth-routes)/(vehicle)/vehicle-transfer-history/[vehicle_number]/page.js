"use client"
import { Table } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CONFIG from "@/config/config"


const Page = ({params}) => {
    const [data, setData] = useState([]);


    const columns = [
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
        },
        {
            title: 'Profile Photo',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'entity_type',
            key: 'entity_type',
        },
        {
            title: 'Transfer Date',
            dataIndex: 'transfer_date',
            key: 'transfer_date',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/vehicle/transfer-history", { params, withCredentials: true });
                if (res.data.status) setData(res.data.data.map((obj) => {
                    obj.image = <Image src={CONFIG.API_BASE_URL + obj.image} width={50} height={50} className='rounded-full' />
                    obj.transfer_date = new Date(obj.transfer_date).toLocaleString()
                    return obj
                }))
            } catch (error) { console.log(error) }
        }
        fetchData();
    }, [])


    return (
        <>
            <Table dataSource={data} columns={columns} pagination={{ pageSize: 10 }} />
        </>
    );
};
export default Page;