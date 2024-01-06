"use client"
import React, { useState, useEffect } from 'react';
import { config } from '@/config/config';
import {

  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SolutionOutlined,

} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation'
import AppTable from '@/components/table';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
interface TeacherData {
  fullName: string;
  maGv: BigInteger;
  sdt: string;
  userName: string;
}
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Trang Money Love', '1', <HomeOutlined />),
  getItem('Admin', 'sub1', <UserOutlined />, [
    getItem('Đăng xuất', '3', <LogoutOutlined />),
    getItem('Đổi mật khẩu', '4', <UserSwitchOutlined />),
  ]),
  getItem('Menu', 'sub2', <TeamOutlined />, [
    getItem('Tài khoản', '5', <SolutionOutlined />),
  ]),


];
interface AdminData {
    id: BigInteger;
    email: string;
    username: string;
    phoneNumber: string;
    fullName: string;
  }
const App: React.FC = () => {
  const router = useRouter();
  const [usersData, setUsersData] = useState(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('1'); // Default to the home item

  const reloadTableData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${config.apiUrl}/admin/allUser`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setUsersData(data);
      console.log("userData:", usersData);
    }
  }


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${config.apiUrl}/admin/logout`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.clear();
    router.push('/login');
  }
  const handleClick = ({ key }: { key: React.Key }) => {
    setActiveMenuItem(key.toString());
    if (key === '3') {
        logout();
        router.push('/login');
    } else if (key === '5') {
      reloadTableData();
    }  else if (key === '4') {
      router.push('/changePassword');
    } else {
      router.push('/admin');
    }
  };

  return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div style={{ height: '60px',display: 'flex', justifyContent: 'center' }}>
              <h1>10</h1>
            </div>
            <Menu onClick={handleClick} theme="dark" selectedKeys={[activeMenuItem]} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Header style={{ padding: '10px 20px', background: colorBgContainer }}>
              <h3>Chào mừng {localStorage.getItem('fullName')} đến với trang quản trị</h3>
            </Header>
            <Content style={{margin: '0 16px'}}>
              <Breadcrumb style={{margin: '10px 0'}}></Breadcrumb>
              <div
                  style={{
                    padding: 24,
                    minHeight: 60,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
              >
                {activeMenuItem === '5' && usersData ? (
                    <div>
                      <h3>Danh sách người dùng</h3>
                      <AppTable blogs={usersData} customFunction={reloadTableData}/>
                    </div>
                ) : null}
                {activeMenuItem === '1' && (
                    <h3>Trang chủ</h3>
                )}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về (Money Love)</Footer>
          </Layout>
        </Layout>
      </>
  );
};

export default App;