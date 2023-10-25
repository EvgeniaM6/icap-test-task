import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <Flex vertical align="center">
      <h2>Error 404</h2>
      <p>Oops! Specified page not found</p>
      <Button type="primary" onClick={goHome}>
        Home
      </Button>
    </Flex>
  );
};
