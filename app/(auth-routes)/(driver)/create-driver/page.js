"use client"
import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
    message,
    Upload,
} from 'antd';
import {
    PlusOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

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
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
    },
};

const App = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const uploadButton = (
        <button
            style={{ border: 0, background: 'none' }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const successMessage = (message) => {
        messageApi.open({ type: 'success', content: message });
    };

    const errorMessage = (message) => {
        messageApi.open({ type: 'error', content: message });
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setFile(info.file.originFileObj); // Store the file object
        }
    };

    const onFinish = async (values) => {
        try {
            const { name, phone } = values;
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('photo', file); // Append the file to the formData

            const res = await axios.post("/driver/create-driver", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.status) {
                successMessage("Driver created successfully");
                router.push("/drivers");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error.response?.data?.message || "Failed to create driver");
            } else {
                errorMessage("Something went wrong");
            }
        }
    };

    return (
        <>
            {contextHolder}
            <h1 className='text-center mb-5 font-bold text-lg'>Create Driver</h1>
            <Form
                {...formItemLayout}
                form={form}
                name="create_driver"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        { required: true, message: 'Please input the driver\'s name!' },
                        { whitespace: true, message: 'Name cannot be empty' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please input the phone number!' },
                        { pattern: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' },
                    ]}
                >
                    <Input
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="photo"
                    label="Profile Photo"
                    rules={[{ required: true, message: 'Please upload a profile photo!' }]}
                >
                    <Upload
                        name="photo"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="avatar"
                                style={{ width: '100%' }}
                                className='rounded-full p-1'
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Create Driver
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default App;
