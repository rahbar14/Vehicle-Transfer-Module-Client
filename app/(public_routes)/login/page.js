"use client"
import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

const Login = () => {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const successMessage = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
        });
    };
    const errorMessage = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };
    const onFinish = async (values) => {
        try {
            const res = await axios.post("/user/login", values, { withCredentials: true });
            if (res.data.status) {
                successMessage("Login successful");
                router.push("/dashboard")
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error.response.data.message)
            }
            else {
                errorMessage("something went wrong")
            }
        }
    };
    return (
        <>
            {contextHolder}
            <Form
                name="login"
                initialValues={{
                    remember: true,
                }}
                style={{
                    maxWidth: 360,
                }}
                onFinish={onFinish}
                className='ml-auto mr-auto text-center'
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Log in
                    </Button>
                    or <a href="/register">Register now!</a>
                </Form.Item>
            </Form>
        </>
    );
};
export default Login;