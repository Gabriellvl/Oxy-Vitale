import React, { useState, useEffect } from 'react';
import {Table, Button, Select, Tooltip, Space, message, Modal} from 'antd';
import { EyeOutlined, DeleteOutlined,  ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
const { confirm } = Modal;


const apiUrl = process.env.REACT_APP_BACKEND_URL;

const BookingTable = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('all'); // Default to 'all' rooms
    const [bookingType, setBookingType] = useState('upcoming'); // Default to 'upcoming' bookings
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null); // To store the booking being viewed
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fetch bookings and rooms on component mount
    useEffect(() => {
        fetchRooms();
        fetchBookings();
    }, []);

    // Refetch bookings when room or booking type changes
    useEffect(() => {
        fetchBookings();
    }, [selectedRoom, bookingType]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${apiUrl}/room`);
            setRooms(response.data);
        } catch (error) {
            message.error('Failed to load rooms.');
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let fetchedBookings = []
            if (selectedRoom === 'all') {
                const response = await axios.get(`${apiUrl}/book`);
                fetchedBookings = response.data;
            } else {
                // Fetch bookings for the specific room
                const bookingsResponse = await axios.get(`${apiUrl}/book/room/${selectedRoom}`);
                fetchedBookings = bookingsResponse.data;
            }

            // Filter bookings based on 'upcoming', 'past', or 'today'
            if (bookingType === 'upcoming') {
                // Include today's bookings regardless of the time
                fetchedBookings = fetchedBookings.filter(booking =>
                    moment(booking.time.date, 'DD-MM-YYYY').isSameOrAfter(moment(), 'day')
                );
            } else if (bookingType === 'past') {
                // Only include bookings before today
                fetchedBookings = fetchedBookings.filter(booking =>
                    moment(booking.time.date, 'DD-MM-YYYY').isBefore(moment(), 'day')
                );
            } else if (bookingType === 'today') {
                // Include only bookings from today, regardless of the time
                fetchedBookings = fetchedBookings.filter(booking =>
                    moment(booking.time.date, 'DD-MM-YYYY').isSame(moment(), 'day')
                );
            }

            setBookings(fetchedBookings);
        } catch (error) {
            message.error('Failed to load bookings.');
        }
        setLoading(false);
    };

    const handleRoomChange = (value) => {
        setSelectedRoom(value);
    };

    const handleBookingTypeChange = (value) => {
        setBookingType(value);
    };

    const handleViewBooking = (booking) => {
        setSelectedBooking(booking); // Set the booking details
        setIsModalVisible(true); // Open the modal
    };

    // Function to close the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null); // Clear the selected booking when the modal is closed
    };

    const handleDeleteBooking = (bookingId) => {
        confirm({
            title: 'Are you sure you want to delete this booking?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await axios.delete(`${apiUrl}/book/${bookingId}`);
                    message.success('Booking deleted successfully.');
                    fetchBookings(); // Refresh the bookings list after deletion
                } catch (error) {
                    message.error('Failed to delete the booking.');
                }
            },
            onCancel() {
                console.log('Deletion canceled');
            },
        });
    };

    // Columns for the bookings table
    const columns = [
        {
            title: 'Date',
            dataIndex: ['time', 'date'],
            key: 'date',
            sorter: (a, b) => moment(a.time.date, 'DD-MM-YYYY').unix() - moment(b.time.date, 'DD-MM-YYYY').unix(),
            render: date => date
        },
        {
            title: 'Slot',
            dataIndex: ['time', 'timestamp'],
            key: 'slot',
            sorter: (a, b) => moment(a.time.timestamp, 'HH:mm').unix() - moment(b.time.timestamp, 'HH:mm').unix(),
            render: timestamp => moment(timestamp, 'HH:mm').format('HH:mm'),
        },
        {
            title: 'Room',
            dataIndex: ['room', 'name'],
            key: 'room',
        },
        {
            title: 'First Name',
            dataIndex: ['name', 'first'],
            key: 'firstName',
        },
        {
            title: 'Email',
            dataIndex: ['contact', 'email'],
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Booking">
                        <Button icon={<EyeOutlined />} onClick={() => handleViewBooking(record)} />
                    </Tooltip>
                    <Tooltip title="Delete Booking">
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteBooking(record._id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Bookings</h2>

            {/* Room and Booking Type Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                {/* Room Selector */}
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={handleRoomChange}
                >
                    <Select.Option value="all">All Rooms</Select.Option>
                    {rooms.map((room) => (
                        <Select.Option key={room._id} value={room._id}>
                            {room.name}
                        </Select.Option>
                    ))}
                </Select>

                {/* Upcoming/Past/Today Selector */}
                <Select
                    defaultValue="upcoming"
                    style={{ width: 200 }}
                    onChange={handleBookingTypeChange}
                >
                    <Select.Option value="upcoming">Upcoming</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="past">Past</Select.Option>
                </Select>
            </div>

            {/* Booking Table */}
            <Table
                columns={columns}
                dataSource={bookings.map(booking => ({ ...booking, key: booking._id }))}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal to view booking details */}
            <Modal
                title={`Booking - Room ${selectedBooking?.room?.name}`}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div>
                        <br/>
                        <p><strong>First Name:</strong> {selectedBooking.name.first}</p>
                        <p><strong>Last Name:</strong> {selectedBooking.name.last}</p>
                        <br/>

                        <h2>Contact Information</h2>
                        <p><strong>Email:</strong> {selectedBooking.contact.email}</p>
                        <p><strong>Telephone:</strong> {selectedBooking.contact.number}</p>

                        <p><strong>Comment:</strong> {selectedBooking.comment  || "no comment" }</p>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default BookingTable;
