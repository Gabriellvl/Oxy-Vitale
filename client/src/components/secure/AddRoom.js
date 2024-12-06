import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Popconfirm } from 'antd';
import axios from 'axios';
import FileUploader from '../article/add/components/FileUploader';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AddRoom = ({ edit = false, roomData = {} }) => {
    const [imageUrl, setImageUrl] = useState(roomData.image || null);  // State to store the uploaded image URL
    const [form] = Form.useForm();  // Ant Design form instance for editing

    // If in edit mode, populate the form with existing room data
    useEffect(() => {
        if (edit && roomData) {
            form.setFieldsValue({
                title: roomData.name,
                description: roomData.description,
            });
            setImageUrl(roomData.image);
        }
    }, [edit, roomData, form]);

    // Handle form submission
    const onFinish = async (values) => {
        const roomDetails = {
            name: values.title,
            description: values.description,
            image: imageUrl
        };

        try {
            if (edit) {
                // If editing, send a PUT request to update the room
                await axios.put(`${apiUrl}/room/${roomData._id}`, roomDetails);
                message.success('Room updated successfully!');
            } else {
                // If adding, send a POST request to create a new room
                await axios.post(`${apiUrl}/room`, roomDetails);
                message.success('Room added successfully!');
            }
            window.location.hash = "/secure";
        } catch (error) {
            console.error('Error saving room:', error);
            message.error(`Failed to ${edit ? 'update' : 'add'} room. Please try again.`);
        }
    };

    // Handle image upload and set the URL
    const handleImageUpload = (url) => {
        setImageUrl(url);
    };

    // Handle image deletion (if needed)
    const handleImageDelete = () => {
        setImageUrl(null);
    };

    // Handle room deletion
    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/room/${roomData._id}`);
            message.success('Room deleted successfully!');
            window.location.hash = "/secure";  // Redirect after deletion
        } catch (error) {
            console.error('Error deleting room:', error);
            message.error('Failed to delete room. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-4 max-w-4xl mb-8">
            <h2 className="text-center text-2xl font-bold mb-4">
                {edit ? 'Edit Room' : 'Add a New Room'}
            </h2>

            {/* Room Form */}
            <Card>
                <Form
                    form={form}
                    name="addRoomForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* Title Input */}
                    <Form.Item
                        label="Room Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter the room title!' }]}
                    >
                        <Input placeholder="Enter the room title" />
                    </Form.Item>

                    {/* Image Upload */}
                    <Form.Item label="Upload Room Image" name="image">
                        <FileUploader
                            type="Image"
                            allowedFormats="image/*"
                            onFileUploaded={handleImageUpload}
                            onDelete={handleImageDelete}
                            title="Room Image"
                            fileUrlEdit={imageUrl}
                        />
                    </Form.Item>

                    {/* Description Input */}
                    <Form.Item
                        label="Room description URL of article"
                        name="description"
                    >
                        <Input placeholder="Enter the URL" />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block ghost>
                            {edit ? 'Update Room' : 'Add Room'}
                        </Button>
                    </Form.Item>

                    {/* Delete Button (only in edit mode) */}
                    {edit && (
                        <Form.Item>
                            <Popconfirm
                                title="Are you sure you want to delete this room?"
                                onConfirm={handleDelete}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{
                                    ghost: true,
                                }}
                            >
                                <Button type="danger" block>
                                    Delete Room
                                </Button>
                            </Popconfirm>
                        </Form.Item>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default AddRoom;
