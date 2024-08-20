"use client"
import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    CarOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, message, theme } from 'antd';
import AuthUser from '@/components/AuthUser';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
const { Header, Sider } = Layout;
const layout = ({ children }) => {
    const router = useRouter()
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

    const logout = async () => {
        try {
            const res = await axios.get("/user/logout", { withCredentials: true });
            if (res.data.status) {
                successMessage("Logout successful");
                router.push("/login")
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error.response.data.message)
            }
            else {
                errorMessage("something went wrong")
            }
        }
    }
    
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>
            { contextHolder }
            <AuthUser setUser={setUser}>
                <Layout className='min-h-screen'>
                    <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            items={[
                                {
                                    key: '1',
                                    icon: <UserOutlined />,
                                    label: 'Drivers',
                                    children: [
                                        {
                                            key: "2",
                                            label: "Create Driver"
                                        },
                                        {
                                            key: "3",
                                            label: "Drivers List"
                                        }
                                    ]
                                },
                                {
                                    key: '4',
                                    icon: <CarOutlined/>,
                                    label: 'Vehicles',
                                    children: [
                                        {
                                            key: "5",
                                            label: "Create Vehicle"
                                        },
                                        {
                                            key: "6",
                                            label: "Vehicles List"
                                        }
                                    ]
                                },
                                {
                                    key: "7",
                                    icon: <LogoutOutlined />,
                                    label: "Logout",
                                    onClick: logout,
                                }
                            ]}
                        />
                    </Sider>
                    <Layout>
                        <Header
                            style={{
                                padding: 0,
                                background: colorBgContainer,
                            }}
                        >
                            <div className='text-right flex'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                                <span>Hello, {user?.username}</span>
                            </div>
                        </Header>
                        {children}
                    </Layout>
                </Layout>
            </AuthUser>
        </>
    );
};
export default layout;