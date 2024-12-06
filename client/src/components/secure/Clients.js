import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm, message, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import moment from 'moment';
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Clients = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");  // State to hold search input
    const [filteredData, setFilteredData] = useState([]);  // State to hold filtered data

    useEffect(() => {
        axios.get(`${apiUrl}/client/`)
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);  // Initially, display all data
            })
            .catch((error) => console.error(error));
    }, []);

    // Function to handle search input change
    const handleSearch = (value) => {
        setSearchText(value);

        if (value) {
            const filtered = data.filter((client) =>
                client.first.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);  // Reset to full data if search is cleared
        }
    };

    // Function to calculate validity and return color status
    const getValidityStatus = (date) => {
        const expirationDate = moment(date);
        const today = moment();
        const daysDiff = expirationDate.diff(today, 'days');

        if (daysDiff > 30) {
            return { color: 'green', label: 'Valid  > 1M' };
        } else if (daysDiff > 0 && daysDiff <= 30) {
            return { color: 'orange', label: 'Valid  < 1M' };
        } else {
            return { color: 'red', label: 'Expired' };
        }
    };

    // Columns definition
    const columns = [
        {
            title: 'Validity',
            dataIndex: 'date',
            sorter: (a, b) => {
                const aStatus = getValidityStatus(a.date);
                const bStatus = getValidityStatus(b.date);
                return aStatus.color.localeCompare(bStatus.color); // Sort by color (red first)
            },
            render: (date) => {
                const { color, label } = getValidityStatus(date);
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'First Name',
            dataIndex: 'first',
            sorter: (a, b) => a.first.localeCompare(b.first),
        },
        {
            title: 'Last Name',
            dataIndex: 'last',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Telephone',
            dataIndex: 'number',
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record._id)}
                        ghost
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                    >
                        <Popconfirm
                            title="Are you sure you want to delete this client?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                                ghost: true,
                            }}
                        >
                            Delete
                        </Popconfirm>
                    </Button>
                </>
            ),
        }
    ];

    // Function to handle edit button click
    const handleEdit = (id) => {
        window.location.hash = `/client/edit/${id}`;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/client/${id}`);
            setData((prevData) => prevData.filter((client) => client._id !== id));
            setFilteredData((prevData) => prevData.filter((client) => client._id !== id));
            message.success("Successfully deleted client");
        } catch (error) {
            console.error(`Error deleting client with id ${id}:`, error);
            message.error("Failed to delete client");
        }
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by first name"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 300 }}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredData.map((client) => ({ ...client, key: client._id }))}
                onChange={(pagination, filters, sorter, extra) => {
                    console.log('params', pagination, filters, sorter, extra);
                }}
            />
        </div>
    );
};

export default Clients;
