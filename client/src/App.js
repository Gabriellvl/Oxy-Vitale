import './App.css';
import Articles from "./components/article/view/Articles";
import { HashRouter, Route, Routes, Outlet } from 'react-router-dom';
import CreateArticle from "./components/article/add/CreateArticle";
import Article from "./components/article/view/Article";
import Login from "./components/Login";
import HomeSecure from "./components/secure/HomeSecure";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import AuthProvider from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';
import EditArticles from "./components/secure/EditArticles";
import Publish from "./components/secure/Publish";
import ViewArticles from "./components/secure/ViewArticles";
import EmailsView from "./components/secure/EmailsView";
import ContactPage from "./components/ContactPage";
import ComingSoonPage from "./components/ComingSoonPage";
import ArticleAdded from "./components/article/add/ArticleAdded";
import Timetable from "./components/TimeTable";
import Prices from "./components/Prices";
import HomePage from "./components/HomePage";
import Footer from './components/Footer';
import ClientAdd from "./components/secure/ClientAdd";

import {HomeOutlined} from "@ant-design/icons";
import {Button} from "antd";
import Clients from "./components/secure/Clients";
import ClientEdit from "./components/secure/ClientEdit";
import Availability from "./components/secure/Availability";
import CalendarAvailability from "./components/secure/CalendarAvailability";
import CalendarSelector from "./components/secure/CalendarSelector";
import ConfirmBooking from "./components/secure/ConfirmBooking";
import RoomsPage from "./components/secure/RoomsPage";
import RoomPage from "./components/secure/RoomPage";
import BookingTable from "./components/secure/BookingTable";
import AddRoom from "./components/secure/AddRoom";
import EditRoom from "./components/secure/EditRoom";
import EditRooms from "./components/secure/EditRooms";

// Non-Secure Layout (with NavBar)
function NonSecureLayoutNoFooter() {
    return (
        <div className="flex flex-col">
            <NavBar className="z-50 fixed"/>
            <div className="h-0"></div>
            <div className="snap-y snap-mandatory overflow-hidden">
                <Outlet/> {/* Content for each route */}
            </div>
        </div>
    );
}

function NonSecureLayout() {
    return (
        <>
            <NavBar className="navbar sm:mb-20 z-50" />
            <div className="main-content">
                <Outlet /> {/* This is where the content for each route will be rendered */}
            </div>
            <Footer />
        </>
    );
}

// Secure Layout (without NavBar or with a different NavBar)
function SecureLayout() {
    return (
        <>
            <div>
                <a href={"/#secure"}>
                    <Button icon={<HomeOutlined/>}> Home </Button>
                </a>
                <br/>
                <br/>
                <hr/>
            </div>

            <div className="main-content">
                <Outlet /> {/* This is where the content for each secure route will be rendered */}
            </div>
            <Footer />
        </>
    );
}

function App() {
    const store = createStore({
        authName: '_auth',
        authType: 'cookie',
        cookieDomain: window.location.hostname,
        cookieSecure: false
    });

    return (
        <div className="App pt-24">
            <HashRouter>
                <AuthProvider store={store}>
                    <Routes>

                        /*

                        <Route element={<NonSecureLayoutNoFooter />}>
                            <Route path="/" element={<HomePage/>} />
                        </Route>

                        {// Non-secure routes with NavBar }
                        <Route element={<NonSecureLayout />}>
                            <Route path="/articles" element={<Articles />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/articles/:urlId" element={<Article />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/coming-soon" element={<ComingSoonPage />} />
                            <Route path="/horaires" element={<Timetable />} />
                            <Route path="/tarifs" element={<Prices />} />
                        </Route>

                        {// Secure routes without NavBar }
                        <Route element={<RequireAuth fallbackPath="/login"><SecureLayout /></RequireAuth>}>
                            <Route path="/secure" element={<HomeSecure />} />
                            <Route path="/add" element={<CreateArticle />} />
                            <Route path="/added" element={<ArticleAdded />} />
                            <Route path="/edit/:urlId" element={<CreateArticle edit={true} />} />
                            <Route path="/edit" element={<EditArticles />} />
                            <Route path="/publish" element={<Publish />} />
                            <Route path="/view/:urlId" element={<Article hide={false} />} />
                            <Route path="/view" element={<ViewArticles />} />
                            <Route path="/emails" element={<EmailsView />} />
                            <Route path="/client/add" element={<ClientAdd />} />
                            <Route path="/client" element={<Clients />} />
                            <Route path="/client/edit/:id" element={<ClientEdit/>} />
                            <Route path="/daily-availability" element={<Availability />} />
                            <Route path="/calendar-checkout" element={<CalendarAvailability />} />
                            <Route path="/calendar-selector/:roomId" element={<CalendarSelector />} />
                            <Route path="/confirm-booking" element={<ConfirmBooking />} />
                            <Route path="/rooms" element={<RoomsPage/>} />
                            <Route path="/rooms/:roomId" element={<RoomPage/>} />
                            <Route path="/bookings" element={<BookingTable/>} />
                            <Route path="/add-room" element={<AddRoom />} />
                            <Route path="/edit-room/:roomId" element={<EditRoom />} />
                            <Route path="/edit-rooms" element={<EditRooms/>} />
                        </Route>

                        {// 404 Not Found route }
                        <Route path="*" element={<NotFound />} />

                        */
                    </Routes>
                </AuthProvider>
            </HashRouter>
        </div>
    );
}

export default App;
