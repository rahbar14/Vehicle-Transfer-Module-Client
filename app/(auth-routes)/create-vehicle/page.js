"use client";
import React, { useState } from 'react';
import { Button, Form, Input, Upload, Select, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const { Option } = Select;
const { Text } = Typography;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const beforeUpload = (file) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
        message.error('You can only upload PDF files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
    }
    return isPdf && isLt5M;
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
    },
};

const CreateVehicle = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [pucFile, setPucFile] = useState(null);
    const [insuranceFile, setInsuranceFile] = useState(null);
    const [pucFileName, setPucFileName] = useState('');
    const [insuranceFileName, setInsuranceFileName] = useState('');


    const successMessage = (message) => {
        messageApi.open({ type: 'success', content: message });
    };

    const errorMessage = (message) => {
        messageApi.open({ type: 'error', content: message });
    };  

    const handlePucChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setPucFile(info.file.originFileObj);
            setPucFileName(info.file.name);
            form.setFieldsValue({ puc_certificate: info.file.originFileObj });
        } else if (info.file.status === 'error') {
            setLoading(false);
        }
    };

    const handleInsuranceChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setInsuranceFile(info.file.originFileObj);
            setInsuranceFileName(info.file.name);
            form.setFieldsValue({ insurance_cert: info.file.originFileObj });
        } else if (info.file.status === 'error') {
            setLoading(false);
        }
    };

    const validateFile = (_, file) => {
        if (!file) {
            return Promise.reject('Please upload a file!');
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        try {
            const { vehicle_number, vehicle_type } = values;
            const formData = new FormData();
            formData.append('vehicle_number', vehicle_number);
            formData.append('vehicle_type', vehicle_type);
            if (pucFile) {
                formData.append('puc_certificate', pucFile);
            }
            if (insuranceFile) {
                formData.append('insurance_cert', insuranceFile);
            }

            const res = await axios.post("/vehicle/create-vehicle", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.status) {
                successMessage("Vehicle created successfully");
                router.push("/vehicles");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error.response?.data?.message || "Failed to create vehicle");
            } else {
                errorMessage("Something went wrong");
            }
        }
    };

    return (
        <>
            {contextHolder}
            <h1 className='text-center mb-5 font-bold text-lg'>Create Vehicle</h1>
            <Form
                {...formItemLayout}
                form={form}
                name="create_vehicle"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                scrollToFirstError
            >
                <Form.Item
                    name="vehicle_number"
                    label="Vehicle Number"
                    rules={[
                        { required: true, message: 'Please input the vehicle number!' },
                        { whitespace: true, message: 'Vehicle number cannot be empty' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="vehicle_type"
                    label="Vehicle Type"
                    rules={[{ required: true, message: 'Please select the vehicle type!' }]}
                >
                    <Select placeholder="Select a vehicle type">
                        <Option value="scooter">Scooter</Option>
                        <Option value="bike">Bike</Option>
                        <Option value="car">Car</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="puc_certificate"
                    label="PUC Certificate"
                    rules={[{ validator: validateFile }]}
                >
                    <Upload
                        name="puc_certificate"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handlePucChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload PUC Certificate</Button>
                    </Upload>
                    {pucFileName && <Text type="secondary" className='ml-2'>{pucFileName}</Text>}
                </Form.Item>

                <Form.Item
                    name="insurance_cert"
                    label="Insurance Certificate"
                    rules={[{ validator: validateFile }]}
                >
                    <Upload
                        name="insurance_cert"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleInsuranceChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Insurance Certificate</Button>
                    </Upload>
                    {insuranceFileName && <Text type="secondary" className='ml-2'>{insuranceFileName}</Text>}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Create Vehicle
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateVehicle;
