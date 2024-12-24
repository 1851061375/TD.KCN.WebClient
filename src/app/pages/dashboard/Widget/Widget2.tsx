import { Card, Col, Row } from 'antd'
import EChart from '../chart/EChart';
import BieChart from '../chart/BieChart';
import HoiCCBChart from '../chart/HoiCCBChart';


const Widget2 = () => {
    return (
        <>
            <Row gutter={[24, 0]} className='mt-5'>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} className="mb-24">
                    <HoiCCBChart />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                    <BieChart />
                </Col>
            </Row>
            <Row gutter={[24, 0]} className='mt-5'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                    <EChart />
                </Col>

            </Row>
        </>
    );
};

export { Widget2 };
