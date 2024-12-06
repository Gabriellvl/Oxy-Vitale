import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AddRoom from './AddRoom';
import { message } from 'antd';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const EditRoom = () => {
    const { roomId } = useParams();  // Get roomId from URL
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoomData();
    }, [roomId]);

    const fetchRoomData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/room/${roomId}`);
            setRoomData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching room data:', error);
            message.error('Failed to load room data.');
        }
    };

    if (loading) return <p>Loading room data...</p>;

    return (
        <div>
            <AddRoom edit={true} roomData={roomData} />
        </div>
    );
};

export default EditRoom;
