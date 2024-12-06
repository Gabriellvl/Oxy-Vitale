import React, { useState, useEffect } from 'react';
import { Calendar, Button, Card, Row, Col, message, Badge } from 'antd';
import axios from 'axios';
import moment from 'moment';
import {
    isDateBlocked,
    generateAvailableSlots,
    disablePastDates,
    getDayOfWeek, isSlotBooked, getBookedSlotsForRoom
} from './availabilityUtils';
import {useParams} from "react-router-dom"; // Import the utility functions

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const CalendarSelector = () => {
    const { roomId } = useParams();
    const today = moment().startOf('day').format('DD-MM-YYYY');
    const [weeklyAvailability, setWeeklyAvailability] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(today);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlotsForRoom, setBookedSlotsForRoom] = useState([]);

    useEffect(() => {
        fetchAvailabilityData();
    }, []);

    useEffect(() => {
        if (roomId) {
            fetchBookedSlots();
        }
    }, [roomId]);

    useEffect(() => {
        if (weeklyAvailability.length > 0) {
            determineAvailableSlots(moment().format('YYYY-MM-DD'));
            setSelectedDate(moment().format('DD-MM-YYYY'));
        }
    }, [weeklyAvailability, blockedDates]);

    const fetchAvailabilityData = () => {
        axios
            .get(`${apiUrl}/availability/week`)
            .then((response) => {
                setWeeklyAvailability(response.data);
            })
            .catch((error) => {
                console.error('Error fetching weekly availability:', error);
                message.error('Failed to load weekly availability data.');
            });

        axios
            .get(`${apiUrl}/availability/dates`)
            .then((response) => {
                setBlockedDates(response.data);
            })
            .catch((error) => {
                console.error('Error fetching blocked dates:', error);
                message.error('Failed to load blocked dates.');
            });
    };

    const fetchBookedSlots = async () => {
        try {
            const bookedSlots = await getBookedSlotsForRoom(roomId); // Fetching booked slots for room
            setBookedSlotsForRoom(bookedSlots);
        } catch (error) {
            message.error('Failed to load bookings for this room.');
        }
    };

    const handleDateSelect = async (date) => {
        let currentDate;
        if (date && date.$d) {
            currentDate = moment(date.$d);
        } else {
            currentDate = moment();
            console.warn("Date invalid or not accessible, using today's date");
        }

        const newDate = currentDate.clone().startOf('day').format('DD-MM-YYYY');
        setSelectedDate(newDate);

        const newDateForComparison = currentDate.clone().startOf('day').format('YYYY-MM-DD');

        if (isDateBlocked(blockedDates, currentDate)) {
            message.warning(`The selected date ${newDate} is blocked!`);
            setAvailableSlots([]);
        } else {
            determineAvailableSlots(newDateForComparison);
        }
    };

    const determineAvailableSlots = (dateStr) => {
        if (!dateStr) return;

        const dayOfWeek = getDayOfWeek(dateStr);
        const dayAvailability = weeklyAvailability.find((day) => day.day === dayOfWeek);

        if (!dayAvailability || (!dayAvailability.morning && !dayAvailability.evening)) {
            setAvailableSlots([]);
            return;
        }

        let slots = generateAvailableSlots(dayAvailability);
        console.log("temp slots", slots)

        // Filter out already booked slots for this room
        slots = slots.filter(slot => !isSlotBooked(bookedSlotsForRoom, dateStr, slot.split(' -')[0]));

        setAvailableSlots(slots);
    };

    const cellRender = (value) => {
        const isBlocked = isDateBlocked(blockedDates, value);
        return isBlocked ? <Badge status="error" text="Booked out" /> : null;
    };

    const handleSlotClick = (slot) => {
        window.location.hash = `#/confirm-booking?date=${selectedDate}&slot=${slot}&roomId=${roomId}`;
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Select a Date to View Available Slots</h2>

            <Card className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Pick a Date</h3>
                <Calendar
                    disabledDate={disablePastDates}
                    onSelect={handleDateSelect}
                    cellRender={cellRender}
                    fullscreen={true}
                />
            </Card>

            <Card>
                <h3 className="text-xl font-semibold mb-4">Available Slots for {selectedDate ? selectedDate : 'Selected Day'}</h3>

                {availableSlots.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {availableSlots.map((slot, index) => (
                            <Col key={index} span={6}>
                                <Button type="primary" style={{ width: '100%' }} onClick={() => handleSlotClick(slot)} ghost>
                                    {slot}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center text-lg font-semibold text-red-500">Fully Booked</div>
                )}
            </Card>
        </div>
    );
};

export default CalendarSelector;
