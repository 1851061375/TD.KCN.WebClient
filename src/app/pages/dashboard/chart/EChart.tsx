import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography, Card } from "antd";
import { MixedWidget1, MixedWidget2, MixedWidget3 } from "@/_metronic/partials/widgets";
import { useEffect, useState } from "react";
import { requestGET } from "@/utils/baseAPI";
import { IPaginationResponse } from "@/models";
import { IDashboard } from "@/models/Dashboard";
import { ApexOptions } from "apexcharts";

function EChart() {
    const { Title, Paragraph } = Typography;
    const [dataEChart, setDataEChart] = useState<IDashboard[] | any>([])
    const [dataKeHoach, setDataKeHoach] = useState<IDashboard[] | any>([])



    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGET<IPaginationResponse<IDashboard[]>>(`api/v1/hosos/dashboardthongkehoivien`);
            if (res && Array.isArray(res.data)) {
                setDataEChart(res.data)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGET<IPaginationResponse<IDashboard[]>>(`api/v1/kehoachketnaphoiviens/dashboardtonghop`);
            if (res && Array.isArray(res.data)) {
                setDataKeHoach(res.data)
            }
        }
        fetchData()
    }, [])
    const eChart = {
        series: [
            {
                name: 'Hội viên',
                data: dataEChart.map(item => item.value),
                color: '#fff',
            },
        ],

        options: {
            chart: {
                type: 'bar' as ApexOptions['chart'],
                width: '100%',
                height: 'auto',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['transparent'],
            },
            grid: {
                show: true,
                borderColor: '#ccc',
                strokeDashArray: 2,
            },
            xaxis: {
                categories: dataEChart.map(item => item.ten),
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        colors: Array(11).fill('#fff'), // Simplified array creation
                    },
                },
            },
            yaxis: {
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        colors: Array(11).fill('#fff'),
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val: number) {
                        return `${val}`;
                    },
                },
            },
        } as ApexOptions,
    };
    return (
        <>
            <Card bordered={false} className="criclebox h-500px">

                <div id="chart">
                    <ReactApexChart
                        className="bar-chart"
                        options={eChart.options}
                        series={eChart.series}
                        type="bar"
                        height={320}
                    />
                </div>
                <div className="chart-vistior">
                    <Title level={5} className="text-muted">Danh sách đề nghị kết nạp hội viên năm 2024</Title>
                    <Row>
                        {dataKeHoach.map((v, index) => (
                            <Col xs={6} xl={6} sm={6} md={6} key={index}>
                                <div className="chart-visitor-count">
                                    <Title level={4}>{v.value ? v.value : 0}</Title>
                                    <span>{v.ten}</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Card>
        </>
    );
}

export default EChart;
