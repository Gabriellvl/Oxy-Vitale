import React, { useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import logo from '../logo.png';

function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();
    const location = useLocation();

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className="fixed top-0 nav-bar w-full z-50">
            <nav className="bg-[#36afe3]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <a href={"/"}>
                                    <img src={logo} alt="logo" className="h-16 w-40"/>
                                </a>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a
                                        href="/"
                                        className={`hover:bg-[#C492B1] px-3 py-2 rounded-md text-lg font-medium ${location.pathname === '/' ? 'text-white' : 'text-gray-300'}`}
                                    >
                                        Home
                                    </a>

                                    <a
                                        href="/#horaires"
                                        className={`hover:bg-[#C492B1] px-3 py-2 rounded-md text-lg font-medium ${location.pathname === '/#horaires' ? 'text-white' : 'text-gray-300'}`}
                                    >
                                        Horaires
                                    </a>

                                    <a
                                        href="/#tarifs"
                                        className={`hover:bg-[#C492B1] px-3 py-2 rounded-md text-lg font-medium ${location.pathname === '/#tarifs' ? 'text-white' : 'text-gray-300'}`}
                                    >
                                        Tarifs
                                    </a>

                                    <a
                                        href="/#articles"
                                        className={`hover:bg-[#C492B1] px-3 py-2 rounded-md text-lg font-medium ${location.pathname === '/#articles' ? 'text-white' : 'text-gray-300'}`}
                                    >
                                        Articles
                                    </a>

                                    <a
                                        href="/#contact"
                                        className={`hover:bg-[#C492B1] px-3 py-2 rounded-md text-lg font-medium ${location.pathname === '/#contact' ? 'text-white' : 'text-gray-300'}`}
                                    >
                                        Contact
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className=" -mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="md:hidden" id="mobile-menu">
                        <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="/"
                                className={`hover:bg-[#C492B1] text-white block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-white' : 'text-gray-300'}`}
                                onClick={handleLinkClick}
                            >
                                Home
                            </a>

                            <a
                                href="/#horaires"
                                className={`hover:bg-[#C492B1] text-white block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/#articles' ? 'text-white' : 'text-gray-300'}`}
                                onClick={handleLinkClick}
                            >
                                Horaires
                            </a>

                            <a
                                href="/#tarifs"
                                className={`hover:bg-[#C492B1] text-white block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/#articles' ? 'text-white' : 'text-gray-300'}`}
                                onClick={handleLinkClick}
                            >
                                Tarifs
                            </a>

                            <a
                                href="/#articles"
                                className={`hover:bg-[#C492B1] text-white block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/#articles' ? 'text-white' : 'text-gray-300'}`}
                                onClick={handleLinkClick}
                            >
                                Articles
                            </a>

                            <a
                                href="/#contact"
                                className={`hover:bg-[#C492B1] text-white block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/#contact' ? 'text-white' : 'text-gray-300'}`}
                                onClick={handleLinkClick}
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                </Transition>
            </nav>
        </div>
    );
}

export default Nav;
