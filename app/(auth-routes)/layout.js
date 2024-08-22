"use client"
import React, { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    CarOutlined,
    LogoutOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, message, theme } from 'antd';
import AuthUser from '@/components/AuthUser';
import axios, { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

const LayoutComponent = ({ children }) => {
    const router = useRouter();
    const path = usePathname();

    const menuPathMap = {
        "/dashboard": { defaultSelectedKeys: ['0'] },
        "/create-driver": { defaultOpenKeys: ['1'], defaultSelectedKeys: ['2'] },
        "/drivers": { defaultOpenKeys: ['1'], defaultSelectedKeys: ['3'] },
        "/create-vehicle": { defaultOpenKeys: ['4'], defaultSelectedKeys: ['5'] },
        "/vehicles": { defaultOpenKeys: ['4'], defaultSelectedKeys: ['6'] },
        "/transfer": { defaultOpenKeys: ['4'], defaultSelectedKeys: ['7'] },
    };

    const [messageApi, contextHolder] = message.useMessage();
    const successMessage = (message) => {
        messageApi.open({ type: 'success', content: message });
    };
    const errorMessage = (message) => {
        messageApi.open({ type: 'error', content: message });
    };

    const logout = async () => {
        try {
            const res = await axios.get("/user/logout", { withCredentials: true });
            if (res.data.status) {
                successMessage("Logout successful");
                router.push("/login");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error.response.data.message);
            } else {
                errorMessage("Something went wrong");
            }
        }
    };

    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Automatically collapse sidebar on smaller screens
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check on mount

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {contextHolder}
            <AuthUser setUser={setUser}>
                <Layout className='min-h-screen'>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        breakpoint="md"
                        onBreakpoint={(broken) => {
                            if (broken) setCollapsed(true);
                        }}
                        style={{ position: 'fixed', height: '100vh', zIndex: 10 }}
                    >
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={menuPathMap?.[path]?.defaultSelectedKeys ?? []}
                            defaultOpenKeys={menuPathMap?.[path]?.defaultOpenKeys ?? []}
                            items={[
                                {
                                    key: '0',
                                    icon: <HomeOutlined />,
                                    label: 'Dashboard',
                                    onClick: () => router.push("/dashboard")
                                },
                                {
                                    key: '1',
                                    icon: <UserOutlined />,
                                    label: 'Drivers',
                                    children: [
                                        {
                                            key: "2",
                                            label: "Create Driver",
                                            onClick: () => router.push("/create-driver")
                                        },
                                        {
                                            key: "3",
                                            label: "Drivers List",
                                            onClick: () => router.push("/drivers")
                                        }
                                    ]
                                },
                                {
                                    key: '4',
                                    icon: <CarOutlined />,
                                    label: 'Vehicles',
                                    children: [
                                        {
                                            key: "5",
                                            label: "Create Vehicle",
                                            onClick: () => router.push("/create-vehicle")
                                        },
                                        {
                                            key: "6",
                                            label: "Vehicles List",
                                            onClick: () => router.push("/vehicles")
                                        },
                                        {
                                            key: "7",
                                            label: "Vehicle Transfer",
                                            onClick: () => router.push("/transfer")
                                        }
                                    ]
                                },
                                {
                                    key: "8",
                                    icon: <LogoutOutlined />,
                                    label: "Logout",
                                    onClick: logout,
                                }
                            ]}
                        />
                    </Sider>
                    <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.3s ease-in-out' }}>
                        <Header
                            style={{
                                padding: 0,
                                background: colorBgContainer,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                position: 'fixed',
                                width: `calc(100% - ${collapsed ? 80 : 200}px)`,
                                zIndex: 9,
                                left: collapsed ? 80 : 200,
                                transition: 'left 0.3s ease-in-out',
                            }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    marginLeft: '16px',
                                }}
                            />
                            <span style={{ marginRight: '16px' }}>Hello, {user?.username}</span>
                        </Header>

                        <Content
                            style={{
                                margin: '80px 16px 24px',
                                padding: 24,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </AuthUser>
        </>
    );
};

export default LayoutComponent;
