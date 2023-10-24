import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { LoginPage, TablePage } from './pages';
import { HeaderElement } from './components';

const { Header, Content } = Layout;

export const App = () => {
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
