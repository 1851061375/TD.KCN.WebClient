import clsx from 'clsx'
import {
    Card,
    Col,
    Row,
    Typography
} from "antd";
import { useEffect, useState } from 'react';
import { requestGET } from '@/utils/baseAPI';
import { IPaginationResponse, IResult } from '@/models';
import { IDashboard } from '@/models/Dashboard';

const count = [
    {
        sub: "Tổng số",
        title: "100",
        icon: 'fa-solid fa-users',
        background: '#0076ff'
    },
    {
        sub: "Nam",
        title: "60",
        icon: 'fa-solid fa-person',
        background: '#04aa6d'
    },
    {
        sub: "Nữ",
        title: "40",
        icon: 'fa-solid fa-person-dress',
        background: '#ff9140'
    },
    {
        sub: "Độ tuổi trung bình",
        title: "80",
        icon: 'fa-solid fa-circle-user',
        background: '#ff6c00'
    },
    {
        sub: "Số hội viên mới kết nạp",
        title: "20",
        icon: 'fa-solid fa-user-plus',
        background: '#3ce407c2'
    },
    {
        sub: "Số hội viên chờ kết nạp",
        title: "10",
        icon: 'fa-solid fa-person-circle-question',
        background: '#b03bff'
    },
    {
        sub: "Số hội viên ra khỏi hội",
        title: "5",
        icon: 'fa-solid fa-user-minus',
        background: '#ea2e0e'
    },

    {
        sub: "Chưa có thẻ hội viên",
        title: "35",
        icon: 'fa-solid fa-id-badge',
        background: '#ffdf8c'
    },
];
const CardDashboard = () => {
    const { Title, Text } = Typography;
    const [data, setData] = useState<IDashboard[] | any>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGET<IPaginationResponse<IDashboard[]>>(`api/v1/hosos/dashboardthongkechitiethoivien`);
            if (res && Array.isArray(res.data)) {
                const enrichedData = res.data.map(item => {
                    const match = count.find(c => c.sub === item.ten);
                    return {
                        ...item,
                        icon: match?.icon || '',
                        background: match?.background || ''
                    };
                });
                setData(enrichedData);
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <Row gutter={[24, 0]} className='mb-5'>
                {data.map((c, index) => (
                    <Col
                        key={index}
                        xs={24}
                        sm={24}
                        md={12}
                        lg={6}
                        xl={6}
                        className="mt-5"
                    >
                        <Card bordered={false} className="criclebox">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={19}>
                                        <span className='fs-6 text-muted'>{c.ten}</span>
                                        <Title level={2}>
                                            {c.value ? c.value : 0}
                                        </Title>
                                    </Col>
                                    <Col xs={5}>
                                        <div className="icon-box" style={{ background: `${c.background}` }}><i className={`${c.icon} text-white fs-1`}></i></div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default CardDashboard;
