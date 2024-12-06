import React, { useState, useEffect } from 'react';
import { Button, message, Card } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const RoomPage = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        fetchRoomDetails();
    }, [roomId]);

    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(`${apiUrl}/room/${roomId}`);
            setRoom(response.data);
        } catch (error) {
            message.error('Failed to load room details.');
        }
    };

    const handleBookingClick = () => {
        window.location.hash = `#/calendar-selector/${roomId}`;
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <Card>
                <h2 className="text-center text-2xl font-bold mb-4">{room.name}</h2>
                <p className="text-lg text-center">{room.description}</p>
                <div className="flex justify-center mt-8">
                    <Button type="primary" size="large" onClick={handleBookingClick} ghost>
                        Book
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default RoomPage;
