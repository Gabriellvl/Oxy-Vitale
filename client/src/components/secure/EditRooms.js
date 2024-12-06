import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const EditRooms = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${apiUrl}/room`);
            setRooms(response.data);
        } catch (error) {
            message.error('Failed to load rooms.');
        }
    };

    const handleCardClick = (roomId) => {
        window.location.hash = `/edit-room/${roomId}`
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Edit Rooms</h2>
            <Row gutter={[16, 16]}>
                {rooms.map((room) => (
                    <Col key={room._id} span={8}>
                        <Card
                            hoverable
                            cover={<img alt={room.name} src={room.image} style={{ height: '200px', objectFit: 'cover' }} />}
                            onClick={() => handleCardClick(room._id)}
                        >
                            <Card.Meta title={room.name} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default EditRooms;
