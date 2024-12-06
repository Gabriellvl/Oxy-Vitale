import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Meta } = Card;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const RoomsPage = () => {
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
        navigate(`/rooms/${roomId}`);
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Our Rooms</h2>
            <Row gutter={[16, 16]}>
                {rooms.map((room) => (
                    <Col span={8} key={room._id}>
                        <Card
                            hoverable
                            cover={<img alt={room.name} src={room.image} />} // Display room image
                            onClick={() => handleCardClick(room._id)}
                        >
                            <Meta title={room.name} description={room.shortDescription} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default RoomsPage;
