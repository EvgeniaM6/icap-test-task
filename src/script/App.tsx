import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { LoginPage, TablePage } from './pages';
import { HeaderElement } from './components';
import { useEffect } from 'react';
import { useAppSelector } from './hooks';

const { Header, Content } = Layout;

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthorized } = useAppSelector((state) => state.login);

  useEffect(() => {
    if (location.pathname === '/table' && !isAuthorized) {
      navigate('/');
    } else if (location.pathname === '/' && isAuthorized) {
      navigate('/table');
    }
  }, [location, isAuthorized]);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header" style={{ backgroundColor: '#fff' }}>
          <HeaderElement />
        </Header>
        <Content className="main">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/table" element={<TablePage />} />
          </Routes>
        </Content>
        <Footer className="footer">footer</Footer>
      </Layout>
    </>
  );
};
