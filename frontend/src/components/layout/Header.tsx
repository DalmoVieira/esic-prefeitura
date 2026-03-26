import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="header" style={{
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" onClick={() => setIsMenuOpen(false)} style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldCheck size={32} />
          <div>
            <div style={{ fontSize: '1.25rem', lineHeight: '1.1' }}>e-SIC</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: '0.8' }}>Rio Claro - RJ</div>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="btn" 
          style={{ display: 'none', backgroundColor: 'transparent', padding: '0.5rem' }} 
          id="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={isMenuOpen ? 'nav-active' : ''} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '500', color: 'var(--text-main)' }}>Home</Link>
          <Link to="/transparencia" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '500', color: 'var(--text-main)' }}>Transparência</Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setIsMenuOpen(false)} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'var(--primary)', 
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                <LayoutDashboard size={18} />
                Painel
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <UserIcon size={16} />
                <span className="user-name-header">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--danger)',
                padding: '0.4rem 0.8rem',
                border: '1px solid var(--danger)',
                backgroundColor: 'transparent'
              }}>
                <LogOut size={18} />
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={18} />
              Entrar
            </Link>
          )}
        </nav>
      </div>

      <style>{`
        #mobile-menu-toggle {
          display: none;
        }

        @media (max-width: 768px) {
          #mobile-menu-toggle {
            display: block;
          }

          nav {
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background-color: white;
            padding: 2rem;
            border-bottom: 2px solid var(--primary);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            gap: 1.5rem !important;
          }

          nav > div {
            flex-direction: column;
            width: 100%;
            align-items: flex-start !important;
          }

          .user-name-header {
            display: inline;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
