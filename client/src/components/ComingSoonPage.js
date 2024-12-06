import React from 'react';
import { SettingFilled, HomeOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const ComingSoonPage = () => {
    return (
        <div>
            <Result
                icon={<SettingFilled spin style={{fontSize: '124px', color: '#5A67D8'}}/>}
                subTitle={
                    <div className="flex justify-center items-center">
                        <div
                            className="text-center space-y-6 p-8 bg-white bg-opacity-80 rounded-lg shadow-lg md:max-w-lg md:mb-10 mb-6">
                            <h1 className="md:text-4xl text-xl font-bold text-gray-800">Page en construction</h1>
                            <p className="md:text-lg text-gray-700">
                                Cette page sera bientôt disponible! Dans un futur proche, vous pourrez réserver des
                                salles
                                de sauna privées pour une expérience de détente ultime.
                            </p>
                        </div>
                    </div>
                }
            />
            <button
                onClick={() => (window.location.href = '/')}
                className="mb-40 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
                <HomeOutlined style={{marginRight: '8px', fontSize: '24px'}}/>
                Retour à l'accueil
            </button>



        </div>
    );
};

export default ComingSoonPage;
