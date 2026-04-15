import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Clock, Shield } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const Home: React.FC = () => {
  const { config } = useConfig();
  return (
    <div className="container">
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '800' }}>
          Bem-vindo ao <span style={{ color: 'var(--primary)' }}>e-SIC</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 0.75rem' }}>
          {config.slogan || 'Solicite informações públicas, acompanhe seus pedidos e exerça seu direito de cidadania com transparência e agilidade.'}
        </p>
        {config.cityName !== 'Minha Cidade' && (
          <p style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '2rem' }}>
            Prefeitura Municipal de {config.cityName} - {config.state}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Fazer um Pedido
          </Link>
          <Link to="/transparencia" className="btn" style={{ padding: '1rem 2rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
            Consultar Transparência
          </Link>
        </div>
      </section>

      <section className="grid-3" style={{ margin: '4rem 0' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <FileText size={48} />
          </div>
          <h3>Novos Pedidos</h3>
          <p style={{ color: 'var(--text-muted)' }}>Envie sua solicitação diretamente para o setor responsável da prefeitura.</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Search size={48} />
          </div>
          <h3>Acompanhamento</h3>
          <p style={{ color: 'var(--text-muted)' }}>Consulte o status do seu pedido em tempo real usando o número do protocolo.</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--success)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Clock size={48} />
          </div>
          <h3>Prazos Legais</h3>
          <p style={{ color: 'var(--text-muted)' }}>Garantimos resposta em até 20 dias, conforme a Lei de Acesso à Informação.</p>
        </div>
      </section>

      <section style={{
        backgroundColor: 'rgba(0, 86, 179, 0.05)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        marginTop: '4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={32} color="var(--primary)" />
            Lei de Acesso à Informação (LAI)
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            A Lei Estadual nº 12.527/2011 regulamenta o direito constitucional de acesso às informações públicas. É um instrumento fundamental para a consolidação da democracia.
          </p>
          <a href="#" className="btn-primary btn" style={{ fontSize: '0.9rem' }}>Saiba mais sobre a LAI</a>
        </div>
        <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary)' }}>20+10</div>
          <p style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Dias de Prazo</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
