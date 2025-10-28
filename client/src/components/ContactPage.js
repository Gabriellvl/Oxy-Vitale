import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Form, Input, Button, message, Space } from 'antd';
import whatsapp from "../whatsapp.png";
import facebook from "../facebook.png";
import insta from "../Insta.png";
import {Helmet} from "react-helmet";
import MapComponent from "./MapComponent";


const ContactPage = () => {
    const formRef = useRef();
    const [form] = Form.useForm();

    const serviceId = process.env.REACT_APP_SERVICE_ID;
    const templateId = process.env.REACT_APP_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_PK_EMAIL;

    const onFinish = async (values) => {
        console.log("form", values);
        emailjs.send(serviceId, templateId, values, publicKey)
            .then((result) => {
                console.log(result.text);
                message.success('Message sent successfully!');
                form.resetFields();
            }, (error) => {
                console.log(error.text);
                message.error('Failed to send.');
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please fill all the required fields correctly!');
    };


    const iconStyle = {
        height: '72px',
        width: 'auto',
    };

    const iconStyleMedium = {
        width: '52px',
        height: 'auto',
    };

    const SocialIcons = () => {
        return (
            <div className="flex flex-row md:flex-col h-20 md:h-auto w-auto md:w-28 md:border-l-2 border-gray-300 pl-4 sticky top-0 gap-4 md:gap-0">
                <a href="https://www.facebook.com/p/Oxy-Vitale-61553602740795/">
                    <img src={facebook} alt="Facebook" style={iconStyle} className="md:hidden" />
                    <img src={facebook} alt="Facebook" style={iconStyleMedium} className="hidden md:inline-block" />
                </a>
                <a href="https://wa.me/32470841339">
                    <img src={whatsapp} alt="Whatsapp" style={iconStyle} className="md:hidden" />
                    <img src={whatsapp} alt="Whatsapp" style={iconStyleMedium} className="hidden md:inline-block" />
                </a>
                <a href="https://www.instagram.com/oxyvitale_fitness/&ved=2ahUKEwjwkNzdvMaQAxUD0AIHHWkIOGIQFnoECA0QAQ&usg=AOvVaw3ikAWyLEgIw6po_gAgzWiV" target="_blank" rel="noopener noreferrer">
                    <img src={insta} alt="Instagram" style={iconStyle} className="md:hidden" />
                    <img src={insta} alt="Instagram" style={iconStyleMedium} className="hidden md:inline-block" />
                </a>
            </div>
        );
    };


    return (
        <div>
            <Helmet>
                <title>Oxy-vitale - Contacte</title>
            </Helmet>
            <div className="flex-row md:flex justify-center items-start py-6 px-4 gap-8 relative z-1 ">
                <div className="flex flex-col  w-full md:w-4/5 lg:w-2/3 xl:w-1/2">
                    <h1 className="text-2xl font-bold mb-4">Contactez-nous</h1>
                    <p>Vous souhaitez en savoir plus sur notre fonctionnement ?</p>
                    <p className="text-sm text-gray-600">Envoyez-nous un message en utilisant l'une des plateformes
                        fournies
                        ci-dessous et commencez la conversation !</p>
                    <p className="text-sm text-gray-600">Nous vous répondrons dans les 24 heures.</p>
                    <Form
                        ref={formRef}
                        form={form}
                        name="contact"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="user_name"
                            label="Nom"
                            rules={[{required: true, message: 'Please input your name!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="user_email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!'
                                },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email!',
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="message"
                            label="Message"
                            rules={[{required: true, message: 'Please input your message!'}]}
                        >
                            <Input.TextArea rows={4}/>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" ghost>
                                    Envoie
                                </Button>
                                <Button htmlType="button" onClick={() => form.resetFields()}>
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <br/>
                <SocialIcons/>
            </div>

            <MapComponent />

            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
};

export default ContactPage;
