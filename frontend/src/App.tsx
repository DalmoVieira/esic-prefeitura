import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import NewRequest from './pages/NewRequest.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import TriageRequest from './pages/TriageRequest.tsx';
import RespondRequest from './pages/RespondRequest.tsx';
import NewAppeal from './pages/NewAppeal.tsx';
import Transparency from './pages/Transparency.tsx';
import RequestDetail from './pages/RequestDetail.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import Register from './pages/Register.tsx';
import UserManagement from './pages/UserManagement.tsx';
import DepartmentManagement from './pages/DepartmentManagement.tsx';
import MunicipalConfigPage from './pages/MunicipalConfigPage.tsx';
import FAQ from './pages/FAQ.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<Dashboard />} />
            <Route path="/novo-pedido" element={<NewRequest />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<UserManagement />} />
            <Route path="/admin/setores" element={<DepartmentManagement />} />
            <Route path="/admin/config" element={<MunicipalConfigPage />} />
            <Route path="/admin/triage/:id" element={<TriageRequest />} />
            <Route path="/admin/respond/:id" element={<RespondRequest />} />
            <Route path="/recorrer/:id" element={<NewAppeal />} />
            <Route path="/transparencia" element={<Transparency />} />
            <Route path="/pedido/:id" element={<RequestDetail />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<div className="container"><h1>404 - Página Não Encontrada</h1><p>Caminho: {window.location.pathname}</p><Link to="/">Voltar para Home</Link></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
