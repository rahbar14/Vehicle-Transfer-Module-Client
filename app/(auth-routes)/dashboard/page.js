"use client"
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';


const Dashboard = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("/user/dashboard", { withCredentials: true });
                if (res.data.status) setData(res.data.data)
            } catch (error) { console.log(error) }
        }
        getData()
    }, [])

    return (
        <>
            <Row gutter={20}>
                <Col 
                    xs={{flex: '100%'}}
                    sm={{flex: '50%'}}
                    md={{flex: '50%'}}
                    lg={{flex: '50%'}}
                    xl={{flex: '50%'}}
                >
                    <Card title="Total Vehicles" className='text-lg'>{data?.vehicles_count ?? 0}</Card>
                </Col>
                <Col
                    xs={{ flex: '100%' }}
                    sm={{ flex: '50%' }}
                    md={{ flex: '50%' }}
                    lg={{ flex: '50%' }}
                    xl={{ flex: '50%' }}
                >
                    <Card title="Total Drivers" className='text-lg'>{data?.drivers_count ?? 0}</Card>
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;