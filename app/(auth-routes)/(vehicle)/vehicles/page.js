"use client"
import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CONFIG from "@/config/config"
import Link from 'next/link';


const Page = () => {

    const [data, setData] = useState([]);


    const columns = [
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
        },
        {
            title: 'Vehicle type',
            dataIndex: 'vehicle_type',
            key: 'vehicle_type',
        },
        {
            title: 'PUC Certificate',
            dataIndex: 'puc_certificate',
            key: 'puc_certificate',
        },
        {
            title: 'Insurance Certificate',
            dataIndex: 'insurance_cert',
            key: 'insurance_cert',
        },
        {
            title: 'Transfer History',
            dataIndex: 'transfer_history',
            key: 'transfer_history',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/vehicle/vehicles-list", { withCredentials: true });
                if (res.data.status) setData(res.data.data.map((obj) => {
                    obj.puc_certificate = <a
                        href={CONFIG.API_BASE_URL + obj.puc_certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View
                    </a>
                    obj.insurance_cert = <a
                        href={CONFIG.API_BASE_URL + obj.insurance_cert}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View
                    </a>
                    obj.transfer_history = <Link href={`/vehicle-transfer-history/${obj.vehicle_number}`} >
                        View
                    </Link>
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