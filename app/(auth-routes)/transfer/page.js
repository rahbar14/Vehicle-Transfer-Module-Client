// pages/transfer-form.js
"use client"
import React, { useState, useEffect } from 'react';
import { Button, Form, Select, message, Spin } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const { Option } = Select;

const TransferForm = () => {
    const [form] = Form.useForm();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const fetchVehicles = async (search) => {
        try {
            const response = await axios.get('/vehicle/vehicles-list', { params: { search }, withCredentials: true });
            setVehicles(response.data.data);
        } catch (error) {
            message.error('Failed to load vehicles');
        }
    };

    const fetchDrivers = async (search) => {
        try {
            const response = await axios.get('/driver/drivers-list', { params: { search }, withCredentials: true });
            setDrivers(response.data.data.map((obj) => {
                obj.name = `${obj.name}-${obj.phone_number}`;
                return obj
            }));
        } catch (error) {
            message.error('Failed to load drivers');
        }
    };

    const onFinish = async (values) => {
        try {
            await axios.post('/api/transfer', values);
            message.success('Transfer successful');
            router.push('/dashboard');
        } catch (error) {
            message.error('Transfer failed');
        }
    };

    useEffect(() => {
        fetchVehicles('');
        fetchDrivers('');
    }, []);

    const handleSearch = (value, type) => {
        if (type === 'vehicle') {
            fetchVehicles(value);
        } else if (type === 'driver') {
            fetchDrivers(value);
        }
    };

    return (
        <>
            {contextHolder}
            <h1 className='text-center mb-3'>Transfer Vehicle</h1>
            <Form
                form={form}
                name="transfer"
                onFinish={onFinish}
                style={{ maxWidth: 600, margin: '0 auto' }}
                scrollToFirstError
            >
                <Form.Item
                    name="vehicle"
                    label="Select Vehicle"
                    rules={[{ required: true, message: 'Please select a vehicle!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a vehicle"
                        onSearch={(value) => handleSearch(value, 'vehicle')}
                        filterOption={false}
                    >
                        {vehicles.map(vehicle => (
                            <Option key={vehicle.vehicle_number} value={vehicle.vehicle_number}>
                                {vehicle.vehicle_number}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="driver"
                    label="Select Driver"
                    rules={[{ required: true, message: 'Please select a driver!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a driver"
                        onSearch={(value) => handleSearch(value, 'driver')}
                        filterOption={false}
                    >
                        {drivers.map(driver => (
                            <Option key={driver.id} value={driver.id}>
                                {driver.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Transfer
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default TransferForm;
