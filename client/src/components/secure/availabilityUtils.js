import moment from 'moment';
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;


// Function to fetch booked slots for a room by room ID
export const getBookedSlotsForRoom = async (roomId) => {
    try {
        const response = await axios.get(`${apiUrl}/book/room/${roomId}`);
        const bookedSlots = response.data.map(booking => ({
            date: booking.time.date, // Date in 'YYYY-MM-DD' format
            timestamp: booking.time.timestamp, // Time slot like '09:00'
        }));
        console.log("slots", bookedSlots)
        return bookedSlots;
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        throw error;
    }
};

// Function to check if a specific slot is already booked for a given date and room
export const isSlotBooked = (bookedSlots, date, slot) => {
    const timestamp = slot.split(' -')[0];
    const dateFormat = moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
    return bookedSlots.some(booking => booking.date === dateFormat && booking.timestamp === timestamp);
};

// Function to check if a date is blocked
export const isDateBlocked = (blockedDates, date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    return blockedDates.includes(formattedDate);
};

// Function to generate 1-hour slots based on availability
export const generateAvailableSlots = (dayAvailability) => {
    const slots = [];

    const generateSlots = (startTime, endTime) => {
        const start = moment(startTime, 'HH:mm');
        const end = moment(endTime, 'HH:mm');
        while (start.isBefore(end)) {
            const slotEnd = start.clone().add(1, 'hours');
            slots.push(`${start.format('HH:mm')} - ${slotEnd.format('HH:mm')}`);
            start.add(1, 'hours');
        }
    };

    if (dayAvailability.morning) {
        generateSlots(dayAvailability.morning.start, dayAvailability.morning.end);
    }

    if (dayAvailability.evening) {
        generateSlots(dayAvailability.evening.start, dayAvailability.evening.end);
    }

    return slots;
};

// Function to disable dates before today
export const disablePastDates = (current) => {
    return current && current < moment().startOf('day');
};

// Function to determine the day of the week in lowercase
export const getDayOfWeek = (dateStr) => {
    const date = moment(dateStr, 'YYYY-MM-DD');
    return date.format('dddd').toLowerCase();
};
