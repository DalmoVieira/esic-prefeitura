import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';

const Footer: React.FC = () => {
  const { config } = useConfig();
  return (
    <footer style={{
      backgroundColor: 'var(--dark)',
      color: 'var(--white)',
      padding: '3rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h3>{config.cityName} - {config.state}</h3>
            {config.address && (
              <p style={{ color: '#bbb', fontSize: '0.9rem' }}>{config.address}</p>
            )}
            {config.cnpj && (
              <p style={{ color: '#bbb', fontSize: '0.85rem' }}>CNPJ: {config.cnpj}</p>
            )}
            {config.slogan && (
              <p style={{ color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem' }}>"{config.slogan}"</p>
            )}
          </div>
          <div>
            <h4>Links Úteis</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {config.website && (
                <li><a href={config.website} target="_blank" rel="noopener noreferrer" style={{ color: '#bbb' }}>Portal da Prefeitura</a></li>
              )}
              <li><a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#bbb' }}>Lei de Acesso à Informação</a></li>
              <li><Link to="/faq" style={{ color: '#bbb' }}>Perguntas Frequentes</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <p style={{ color: '#bbb' }}>Ouvidoria Geral do Município</p>
            {config.email && <p style={{ color: '#bbb' }}>Email: <a href={`mailto:${config.email}`} style={{ color: '#bbb' }}>{config.email}</a></p>}
            {config.phone && <p style={{ color: '#bbb' }}>Telefone: {config.phone}</p>}
            {config.website && <p style={{ color: '#bbb' }}>Site: <a href={config.website} target="_blank" rel="noopener noreferrer" style={{ color: '#bbb' }}>{config.website.replace('https://', '')}</a></p>}
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #444',
          color: '#888',
          fontSize: '0.85rem'
        }}>
          &copy; {new Date().getFullYear()} Prefeitura Municipal de {config.cityName} - {config.state}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
