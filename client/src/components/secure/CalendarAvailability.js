import React, {useEffect, useState} from 'react';
import {Calendar, Checkbox, List, Button, Card, message} from 'antd';
import moment from 'moment';
import axios from "axios";

const CalendarAvailability = () => {
    const [checkedOutDates, setCheckedOutDates] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    // Fetch the checked-out dates from the backend when the component mounts
    useEffect(() => {
        axios
            .get(`${apiUrl}/availability/dates`)
            .then((response) => {
                setCheckedOutDates(response.data);
            })
            .catch((error) => {
                console.error('Error fetching checked-out dates:', error);
                message.error('Failed to load data.');
            });
    }, []); // Empty dependency array means this effect runs only once on mount

    // Handle checkbox change to update the checked-out dates list
    const handleCheckboxChange = (value, checked) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const newCheckedOutDates = checked
            ? [...checkedOutDates, formattedDate] // Add to list if checked
            : checkedOutDates.filter((date) => date !== formattedDate); // Remove from list if unchecked

        setCheckedOutDates(newCheckedOutDates);
    };

    // Send the updated list to the backend via PUT request
    const updateCheckedOutDates = () => {
        axios
            .put(`${apiUrl}/availability/dates`, checkedOutDates)
            .then(() => {
                message.success('Checked-out dates updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating checked-out dates:', error);
                message.error('Failed to update checked-out dates.');
            });
    };

    // Custom rendering of dates in the calendar with checkboxes
    const dateCellRender = (value) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const isCheckedOut = checkedOutDates.includes(formattedDate);

        return (
            <div className="custom-date-cell  center-text">
                {/* Date with Checkbox */}
                <Checkbox
                    checked={isCheckedOut}
                    onChange={(e) => handleCheckboxChange(value, e.target.checked)}
                >
                </Checkbox>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Monthly Calendar Availability</h2>

            {/* Calendar Component with custom date rendering */}
            <Card className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Select Dates to Check Out</h3>
                <Calendar
                    dateCellRender={dateCellRender} // Render dates with custom visual feedback
                    fullscreen={true} // Display the full month view
                />
            </Card>

            {/* List of Checked-Out Dates */}
            <Card>
                <h3 className="text-xl font-semibold mb-4">Checked-Out Dates</h3>
                <List
                    bordered
                    dataSource={checkedOutDates}
                    renderItem={(date) => (
                        <List.Item>
                            {date}
                        </List.Item>
                    )}
                    locale={{ emptyText: 'No checked-out dates' }}
                />
                <Button
                    type="primary"
                    onClick={() => updateCheckedOutDates([])}
                    disabled={checkedOutDates.length === 0}
                    className="mt-4"
                    ghost
                >
                    Submit dates
                </Button>
            </Card>
        </div>
    );
};

export default CalendarAvailability;
