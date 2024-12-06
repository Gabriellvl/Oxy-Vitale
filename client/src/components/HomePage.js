import React, { useRef } from "react";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const HomePage = () => {
    const discoverRef = useRef(null);
    const reserveRef = useRef(null);
    const contactRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="snap-y snap-mandatory h-screen overflow-hidden">
            {/* Découvrir Plus */}
            <div
                ref={discoverRef}
                className="snap-start h-screen flex justify-center items-center bg-gradient-to-b from-green-100 via-green-300 to-green-150 relative"
            >
                <div>
                    {/* Warm Welcome Section */}
                    <div
                        className="text-center space-y-6 p-8 bg-white bg-opacity-80 rounded-lg shadow-lg md:max-w-lg md:mb-20 mb-12">
                        <h1 className="md:text-4xl text-xl font-bold text-gray-800">Bienvenue chez Oxyvitale</h1>
                        <p className="md:text-lg text-gray-700">
                            Toute l'équipe d'Oxyvitale vous souhaite la bienvenue et vous invite à explorer notre
                            univers de détente et de bien-être.
                        </p>
                    </div>

                    {/* Discover More Section */}
                    <div
                        className="text-center space-y-6 p-8 bg-white bg-opacity-80 rounded-lg shadow-lg md:max-w-lg mb-4">
                        <h1 className="md:text-4xl text-xl font-bold text-gray-800">Découvrez Plus</h1>
                        <p className="md:text-lg text-gray-700">
                            Apprenez tout sur les expériences et les services uniques que nous proposons.
                        </p>
                        <div className="flex space-x-4 justify-center">
                            <Button type="primary" size="large" href="#/articles">
                                Découvrez Plus
                            </Button>
                            <Button type="default" size="large" href="/flyer.pdf">
                                Voir le Flyer
                            </Button>
                        </div>
                    </div>
                </div>

                <DownOutlined
                    onClick={() => scrollToSection(reserveRef)}
                    className="absolute bottom-5 text-4xl text-gray-500 cursor-pointer"
                />
            </div>

    {/* Réservez une Salle de Sauna */
    }
    <div
        ref={reserveRef}
        className="snap-start h-screen flex justify-center items-center bg-gradient-to-b from-gray-100 via-blue-400 to-gray-100 relative"
    >
        <UpOutlined
            onClick={() => scrollToSection(discoverRef)}
            className="absolute top-5 text-4xl text-gray-500 cursor-pointer"
        />
        <div className="text-center space-y-4 p-8 bg-white bg-opacity-80 rounded-lg shadow-lg max-w-lg">
            <h1 className="md:text-4xl text-xl font-bold text-gray-800">Réservez une Salle de Sauna</h1>
            <p className="md:text-lg text-gray-700">
                Vivez une détente ultime dans nos salles de sauna privées.
            </p>
            <Button type="primary" size="large" href="#/coming-soon">
                Réservez Maintenant
            </Button>
        </div>
        <DownOutlined
            onClick={() => scrollToSection(contactRef)}
            className="absolute bottom-5 text-4xl text-gray-500 cursor-pointer"
        />
    </div>

    {/* Contactez-Nous */
    }
    <div
        ref={contactRef}
        className="snap-start h-screen flex justify-center items-center bg-gradient-to-b from-indigo-100 via-green-300 to-gray-100 relative"
    >
        <UpOutlined
            onClick={() => scrollToSection(reserveRef)}
            className="absolute top-5 text-4xl text-gray-500 cursor-pointer"
        />
        <div className="text-center space-y-4 p-8 bg-white bg-opacity-80 rounded-lg shadow-lg max-w-lg">
            <h1 className="md:text-4xl text-xl font-bold text-gray-800">Contactez-Nous</h1>
                    <p className="md:text-lg text-gray-700">
                        Vous avez des questions ? Nous serions ravis de vous entendre !
                    </p>
                    <Button type="primary" size="large" href="#/contact">
                        Contactez-Nous
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
