import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, UPLOADS_URL } from '../services/api';

export interface MunicipalConfig {
  id: string;
  cityName: string;
  state: string;
  cnpj?: string | null;
  slogan?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  coatOfArmsFile?: string | null;
  faviconFile?: string | null;
  primaryColor?: string | null;
}

const defaultConfig: MunicipalConfig = {
  id: '1',
  cityName: 'Minha Cidade',
  state: 'SP',
};

interface ConfigContextType {
  config: MunicipalConfig;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  refreshConfig: async () => {},
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MunicipalConfig>(defaultConfig);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/config`);
      if (res.ok) {
        const data: MunicipalConfig = await res.json();
        setConfig(data);

        // Apply primary color override if set
        if (data.primaryColor) {
          document.documentElement.style.setProperty('--primary', data.primaryColor);
        }

        // Set page title
        document.title = `e-SIC | ${data.cityName} - ${data.state}`;

        // Apply favicon if configured
        const faviconUrl = data.faviconFile
          ? `${UPLOADS_URL}/${data.faviconFile}`
          : null;
        if (faviconUrl) {
          let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
        }
      }
    } catch {
      // Keep default config silently
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, refreshConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
