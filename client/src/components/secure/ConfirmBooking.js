import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { isSlotBooked, getBookedSlotsForRoom } from './availabilityUtils'; // Import utility functions
import moment from 'moment';
import emailjs from 'emailjs-com'; // Import EmailJS

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const serviceId = process.env.REACT_APP_SERVICE_ID;
const templateId = process.env.REACT_APP_TEMPLATE_ID2;
const publicKey = process.env.REACT_APP_PK_EMAIL;

const ConfirmBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date');
    const slot = searchParams.get('slot');
    const roomId = searchParams.get('roomId')
    const time = slot.split(' -')[0];

    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        fetchBlockedDates();
    }, []);

    const fetchBlockedDates = async () => {
        try {
            const bookedSlots = await getBookedSlotsForRoom(roomId);
            setBookedSlots(bookedSlots);
        } catch (error) {
            message.error('Failed to load bookings for this room.');
        }
    };

    // Handle form submission
    const onFinish = async (values) => {
        try {
            const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            if (isSlotBooked(bookedSlots, formattedDate, time)) {
                message.error('This slot is no longer available.');
                return;
            }

            // Prepare booking data
            const bookingDetails = {
                time: {
                    date,
                    timestamp: time,
                },
                name: {
                    first: values.firstName,
                    last: values.lastName,
                },
                contact: {
                    email: values.email,
                    number: values.telephone,
                },
                comment: values.comments || '',
                room: roomId
            };

            // Send POST request to create a booking
            await axios.post(`${apiUrl}/book`, bookingDetails);

            // Send email confirmation via EmailJS
            await sendConfirmationEmail(bookingDetails);

            message.success('Booking confirmed! Email has been sent.');
            navigate('/thank-you'); // Redirect to a thank-you page or the homepage
        } catch (error) {
            console.error('Error booking the slot:', error);
            message.error('An error occurred while booking. Please try again.');
        }
    };

    // Function to send confirmation email using EmailJS
    const sendConfirmationEmail = async (bookingDetails) => {
        try {
            // Prepare the email parameters for EmailJS
            const emailParams = {
                first_name: bookingDetails.name.first,
                last_name: bookingDetails.name.last,
                to_email: bookingDetails.contact.email,
                booking_date: bookingDetails.time.date,
                booking_time: bookingDetails.time.timestamp,
            };

            // Send the email using EmailJS
            await emailjs.send( serviceId, templateId, emailParams, publicKey);

            message.success('Confirmation email sent successfully!');
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            message.error('Failed to send confirmation email. Please contact support.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please complete the required fields.');
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">Confirm Your Booking</h2>
            <p className="text-lg text-center mb-6">
                You are booking for {date} during the {slot} slot.
            </p>

            {/* Form to collect user details */}
            <Card>
                <Form
                    name="bookingForm"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* First Name Field */}
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please enter your first name!' }]}
                    >
                        <Input placeholder="Enter your first name" />
                    </Form.Item>

                    {/* Last Name Field */}
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please enter your last name!' }]}
                    >
                        <Input placeholder="Enter your last name" />
                    </Form.Item>

                    {/* Email Address Field */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email address!' },
                            { type: 'email', message: 'Please enter a valid email address!' },
                        ]}
                    >
                        <Input placeholder="Enter your email address" />
                    </Form.Item>

                    {/* Telephone Number Field */}
                    <Form.Item
                        label="Telephone Number"
                        name="telephone"
                        rules={[
                            { required: true, message: 'Please enter your telephone number!' },
                            { pattern: /^[0-9]+$/, message: 'Please enter a valid telephone number!' },
                        ]}
                    >
                        <Input placeholder="Enter your telephone number" />
                    </Form.Item>

                    {/* Comment Section (Optional) */}
                    <Form.Item label="Comments" name="comments">
                        <Input.TextArea placeholder="Enter any comments or special requests (optional)" rows={3} />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-1/2" block ghost>
                            Confirm Booking
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ConfirmBooking;
