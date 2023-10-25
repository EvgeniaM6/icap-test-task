import { Col, Row } from 'antd';
import GithubIcon from '../../../assets/images/svg/github.svg';

export const FooterElem = () => {
  return (
    <Row>
      <Col span={8}></Col>
      <Col span={8} className="footer__year">
        2023
      </Col>
      <Col span={8} className="footer__gh-link">
        <a href="https://github.com/EvgeniaM6">
          <img src={GithubIcon} alt="" className="footer__gh-link-img" />
        </a>
      </Col>
    </Row>
  );
};
