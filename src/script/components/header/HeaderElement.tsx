import { Button, Flex } from 'antd';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { setIsAuthorized } from '../../store/loginSlice';

export const HeaderElement = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const keyFromPathName = location.pathname.split('/')[1];

  const logOut = () => {
    dispatch(setIsAuthorized(false));
    navigate('/');
  };

  return (
    <>
      <Flex style={{ maxHeight: '100%' }} justify="space-between" align="center">
        <h1>Super Table</h1>
        {keyFromPathName && (
          <Button onClick={logOut} type="primary">
            Log out
          </Button>
        )}
      </Flex>
    </>
  );
};
