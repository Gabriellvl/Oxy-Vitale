import {AuthProvider} from "react-auth-kit";
import React, {useState} from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,

    FormOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';


function HomeSecure() {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const items = [
        {
            key: 'sub1',
            label: 'Articles',
            icon: <FormOutlined />,
            children: [
                { key: '1', label: 'Add', path: 'add'},
                { key: '2', label: 'Edit', path: 'edit'},
                { key: '3', label: 'Publish', path: 'publish' },
                { key: '4', label: 'View', path: 'view' },
            ],
        },
        {
            key: 'sub2',
            label: 'Subscriptions',
            icon: <TeamOutlined />,
            children: [
                { key: '5', label: 'Add Client', path: 'client/add'},
                { key: '6', label: 'View Clients', path: 'client'},
            ],
        },
        {
            key: 'sub3',
            label: 'Bookings',
            icon: <BookOutlined />,
            children: [
                { key: '7', label: 'Week Schedule', path: 'daily-availability'},
                { key: '8', label: 'Date Management', path: 'calendar-checkout'},
                { key: '10', label: 'Book rooms', path: 'rooms'},
                { key: '11', label: 'Overview Bookings', path: 'bookings'},
                { key: '12', label: 'Add Room', path: 'add-room'},
                { key: '13', label: 'Edit Rooms', path: 'edit-rooms'},
            ],
        }
    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleClick = (e) => {
        const clickedItem = items
            .map((item) => (item.children ? item.children : [item])) // Flatten the array with children
            .flat()
            .find((i) => i.key === e.key);

        if (clickedItem && clickedItem.label) {
            window.location.hash = `#${clickedItem.path}`;
        }
    };

    return (
        <div className="w-1/2 flex justify-center">
            <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }} ghost>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                activeBarBorderWidth={4}
                theme={"dark"}
                onClick={handleClick}

            />
        </div>
    );

}
export default HomeSecure;

