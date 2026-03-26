import React from 'react';

const Footer: React.FC = () => {
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
            <h3>Rio Claro - RJ</h3>
            <p style={{ color: '#bbb', fontSize: '0.9rem' }}>
              Av. João Baptista Portugal, 230 - Centro<br />
              CEP: 27.460-000 RJ
            </p>
          </div>
          <div>
            <h4>Links Úteis</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="https://rioclaro.rj.gov.br" target="_blank" rel="noopener noreferrer" style={{ color: '#bbb' }}>Portal da Prefeitura</a></li>
              <li><a href="#" style={{ color: '#bbb' }}>Lei de Acesso à Informação</a></li>
              <li><a href="#" style={{ color: '#bbb' }}>Perguntas Frequentes</a></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <p style={{ color: '#bbb' }}>Ouvidoria Geral do Município</p>
            <p style={{ color: '#bbb' }}>Email: esic@rioclaro.rj.gov.br</p>
            <p style={{ color: '#bbb' }}>Site: rioclaro.rj.gov.br</p>
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
          &copy; {new Date().getFullYear()} Prefeitura Municipal de Rio Claro - RJ. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
