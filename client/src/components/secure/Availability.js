import React, {useEffect, useState} from 'react';
import { TimePicker, Button, Checkbox, message, Card } from 'antd';
import moment from 'moment';
import { ScheduleView } from 'react-schedule-view';
import { Helmet } from 'react-helmet';
import 'antd/dist/reset.css';
import axios from "axios"; // Ant Design CSS reset

const defaultData = [
    { day: 'monday', morning: { start: "09:00", end: "12:00" }, evening: { start: "16:00", end: "19:00" } },
    { day: 'tuesday', morning: { start: "09:00", end: "12:00" }, evening: null },
    { day: 'wednesday', morning: null, evening: { start: "16:00", end: "19:00" } },
    { day: 'thursday', morning: { start: "09:00", end: "12:00" }, evening: { start: "16:00", end: "19:00" } },
    { day: 'friday', morning: { start: "09:00", end: "12:00" }, evening: null },
    { day: 'saturday', morning: null, evening: { start: "10:00", end: "13:00" } },
    { day: 'sunday', morning: null, evening: null }
];

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Availability = () => {
    const [availability, setAvailability] = useState(defaultData);

    useEffect(() => {
        axios
            .get(`${apiUrl}/availability/week`)
            .then((response) => {
                const data = response.data;

                if (Array.isArray(data)) {
                    // Set the state with the new array format directly
                    setAvailability(data);

                    // Update the time intervals based on the new structure
                    setTimeIntervals(
                        data.map((day) => ({
                            morning: day.morning ? {
                                startTime: moment(day.morning.start, 'HH:mm'),
                                endTime: moment(day.morning.end, 'HH:mm'),
                                available: true,
                            } : { startTime: moment('09:00', 'HH:mm'), endTime: moment('12:00', 'HH:mm'), available: false },
                            evening: day.evening ? {
                                startTime: moment(day.evening.start, 'HH:mm'),
                                endTime: moment(day.evening.end, 'HH:mm'),
                                available: true,
                            } : { startTime: moment('16:00', 'HH:mm'), endTime: moment('19:00'), available: false },
                        }))
                    );
                } else {
                    console.error('Invalid data format for weekly availability');
                }
            })
            .catch((error) => {
                console.error('Error fetching weekly availability:', error);
                message.error('Failed to load weekly availability data.');
            });
    }, []);

    // State to manage the time intervals for each day
    const [timeIntervals, setTimeIntervals] = useState(
        defaultData.map(() => ({
            morning: { startTime: moment('09:00', 'HH:mm'), endTime: moment('12:00', 'HH:mm'), available: true },
            evening: { startTime: moment('16:00', 'HH:mm'), endTime: moment('20:00', 'HH:mm'), available: true },
        }))
    );

    // Handle TimePicker changes
    const handleTimeChange = (time, dayIndex, interval) => {
        const newIntervals = [...timeIntervals];
        newIntervals[dayIndex][interval].startTime = time[0];
        newIntervals[dayIndex][interval].endTime = time[1];
        setTimeIntervals(newIntervals);
    };

    // Handle availability toggle
    const toggleAvailability = (dayIndex, interval) => {
        const newIntervals = [...timeIntervals];
        newIntervals[dayIndex][interval].available = !newIntervals[dayIndex][interval].available;
        setTimeIntervals(newIntervals);
    };

    const confirmSchedule = () => {
        const newAvailability = availability.map((day, index) => ({
            day: day.day, // Use the `day` field as the key
            morning: timeIntervals[index].morning.available
                ? { start: timeIntervals[index].morning.startTime.format('HH:mm'), end: timeIntervals[index].morning.endTime.format('HH:mm') }
                : null,
            evening: timeIntervals[index].evening.available
                ? { start: timeIntervals[index].evening.startTime.format('HH:mm'), end: timeIntervals[index].evening.endTime.format('HH:mm') }
                : null
        }));

        setAvailability(newAvailability);

        axios
            .put(`${apiUrl}/availability/week`, newAvailability)
            .then(() => {
                message.success('Weekly availability updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating weekly availability:', error);
                message.error('Failed to update weekly availability.');
            });
    };


    const customTheme = {
        timeFormatter: (time) => `${time}:00`,
        timeRangeFormatter: (startTime, endTime) => `${startTime}:00 - ${endTime}:00`,
        style: {
            root: { backgroundColor: '#fff' },
            dayLabels: { color: '#000', fontWeight: 'bold' },
            timeScaleLabels: { color: '#666' },
            majorGridlinesBorder: 'solid 1px #e0e0e0',
            minorGridlinesBorder: 'solid 1px #f0f0f0',
            verticalGridlinesBorder: 'solid 1px #e0e0e0',
        },
        hourHeight: '60px',
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <Helmet>
                <title>Oxy-vitale - Set Availability</title>
            </Helmet>

            <h2 className="text-center text-2xl font-bold mb-4">Set Daily Availability</h2>
            <h4 className="text-center text-lg mb-4  text-red-500">Hit enter button after date</h4>

            {/* Availability Form */}
            {availability.map((day, index) => (
                <Card key={day.day} title={day.day.charAt(0).toUpperCase() + day.day.slice(1)} className="mb-4">
                {/* Morning Time Picker */}
                    <div className="mb-2">
                        <Checkbox
                            checked={timeIntervals[index].morning.available}
                            onChange={() => toggleAvailability(index, 'morning')}
                            style={{marginRight: 8}}
                        >
                            Morning Session
                        </Checkbox>
                        <TimePicker.RangePicker
                            value={[timeIntervals[index].morning.startTime, timeIntervals[index].morning.endTime]}
                            onChange={(time) => handleTimeChange(time, index, 'morning')}
                            format="HH:mm"
                            disabled={!timeIntervals[index].morning.available}
                            allowClear={false}
                            minuteStep={30}
                            open={false}
                        />
                    </div>

                    {/* Evening Time Picker */}
                    <div>
                        <Checkbox
                            checked={timeIntervals[index].evening.available}
                            onChange={() => toggleAvailability(index, 'evening')}
                            style={{marginRight: 8}}
                        >
                            Evening Session
                        </Checkbox>
                        <TimePicker.RangePicker
                            value={[timeIntervals[index].evening.startTime, timeIntervals[index].evening.endTime]}
                            onChange={(time) => handleTimeChange(time, index, 'evening')}
                            format="HH:mm"
                            disabled={!timeIntervals[index].evening.available}
                            allowClear={false}
                            minuteStep={30}
                            open={false}
                        />
                    </div>
                </Card>
            ))}

            <div className="flex justify-center my-4">
                <Button type="primary" onClick={confirmSchedule} ghost>
                    Confirm Schedule
                </Button>
            </div>

            {/* Schedule View */}
            <div className="mt-8">
                <h2 className="text-center text-2xl font-bold mb-4">Weekly Schedule</h2>
                <ScheduleView
                    daySchedules={availability.map(day => ({
                        name: day.day.charAt(0).toUpperCase() + day.day.slice(1), // Convert to "Monday" format
                        events: [
                            day.morning ? { startTime: parseInt(day.morning.start.split(':')[0]), endTime: parseInt(day.morning.end.split(':')[0]), title: 'Morning Session', color: 'lightblue' } : null,
                            day.evening ? { startTime: parseInt(day.evening.start.split(':')[0]), endTime: parseInt(day.evening.end.split(':')[0]), title: 'Evening Session', color: 'lightgreen' } : null
                        ].filter(Boolean) // Remove null events
                    }))}
                    viewStartTime={7}
                    viewEndTime={23}
                    theme={customTheme}
                />
            </div>
        </div>
    );
};

export default Availability;
