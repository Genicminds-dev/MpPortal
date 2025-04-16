import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Main from './components/Main/Main';
import Header from './components/Heading/Heading';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin';
import AddNewEntry from './components/AddNewEntry/addNewEntry';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import ScanGallary from './components/ScanGallary/ScanGallary';
import AddNewGrievance from './components/AddNewGrievance/AddNewGrievance';
import AllGrievanceList from './components/AllGrievanceList/AllGrievanceList';
import Footer from './components/Footer/Footer';
import FooterAdmin from './components/FooterAdmin/FooterAdmin';
import Sidebar from './components/Sidebar/Sidebar';
import AddPersonalAssistant from "./components/AddPersonalAssistant/AddPersonalAssistant";
import CompletedGrievance from "./components/CompletedGrievance/CompletedGrievance";
import InProgressGrievance from "./components/InProgressGrievance/InProgressGrievance";
import RejectedGrievance from "./components/RejectedGrievance/RejectedGrievance";
import AddBoothNo from "./components/AddBoothNo/AddBoothNo";
import AddSubject from "./components/AddSubject/AddSubject";
import AddComplaintSender from "./components/AddComplaintSender/AddComplaintSender";
import AddAppStatus from "./components/AddApplicationStatus/AddApplicationStatus";
import AddWhatsAppGroup from "./components/AddWhatsAppGroup/AddWhatsAppGroup";
import AddUser from "./components/AddUser/AddUser";
import ViewApplication from './components/ViewApplication/ViewApplication';
import EditApplication from './components/EditApplication/EditApplication';
import AddTaluka from './components/AddTaluka/AddTaluka';

function Layout({ children }) {
  const location = useLocation();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { user_permission } = user;

  // List of protected routes
  const clerkRoutes = [
    '/dashboard',
    '/add-new-entry',
    '/scan-gallary',
    '/add-new-grievance'
  ];

  const adminRoutes = [
    '/dashboard',
    '/add-new-entry',
    '/add-new-grievance',
    '/scan-gallary',
    '/all-grievance-list',
    '/completed-grievance',
    '/in-progress-grievance',
    '/rejected-grievance',
    '/add-personal_assistance',
    '/add-booth-number',
    '/add-subject',
    '/add-taluka',
    '/add-complaint-sender',
    '/add-app-status',
    '/add-whatsapp-group',
    '/add-user',
    '/view-application/:id',
    '/edit-application/:id'
  ];

  const protectedRoutes = user_permission === "Clerk" ? clerkRoutes : adminRoutes;

  // Handle protected routes
  if (!isLoggedIn && protectedRoutes.some(route => location.pathname.startsWith(route.split('/:')[0]))) {
    return <Navigate to="/login" />;
  }

  if (isLoggedIn && !protectedRoutes.some(route => location.pathname.startsWith(route.split('/:')[0]))) {
    return <Navigate to="/dashboard" />;
  }

  const getLayout = () => {
    const path = location.pathname;
    const isEditOrViewApplication = path.startsWith('/edit-application/') || path.startsWith('/view-application/');

    switch (true) {
      case path === '/login':
        return <>{children}</>;
      case path === '/': // Default root path
        return (
          <>
            <Header />
            <div className="content-wrapper">{children}</div>
            <Footer />
          </>
        );
      default: // Protected routes with admin or user layouts
        return (
          <>
            <HeaderAdmin />
            <div className="d-flex" style={{ minHeight: '100vh', flexDirection: 'column' }}>
              <div className="d-flex flex-grow-1">
                <Sidebar user={user_permission} />
                <div className={`content-wrapper flex-grow-1 ${isEditOrViewApplication ? '' : ''}`}>
                  {children}
                </div>
              </div>
              <FooterAdmin />
            </div>
          </>
        );
    }
  };

  return <>{getLayout()}</>;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-new-entry" element={<AddNewEntry />} />
          <Route path="/scan-gallary" element={<ScanGallary />} />
          <Route path="/add-new-grievance" element={<AddNewGrievance />} />
          <Route path="/all-grievance-list" element={<AllGrievanceList />} />
          <Route path="/completed-grievance" element={<CompletedGrievance />} />
          <Route path="/in-progress-grievance" element={<InProgressGrievance />} />
          <Route path="/rejected-grievance" element={<RejectedGrievance />} />
          <Route path="/add-personal_assistance" element={<AddPersonalAssistant />} />
          <Route path="/add-booth-number" element={<AddBoothNo />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/add-taluka" element={<AddTaluka />} />
          <Route path="/add-complaint-sender" element={<AddComplaintSender />} />
          <Route path="/add-app-status" element={<AddAppStatus />} />
          <Route path="/add-whatsapp-group" element={<AddWhatsAppGroup />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/view-application/:id" element={<ViewApplication />} />
          <Route path="/edit-application/:id" element={<EditApplication />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
