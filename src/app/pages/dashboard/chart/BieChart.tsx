import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
import { bieChartDanToc, bieChartTonGiao } from "./configs/bieChart";
import { ChartsWidget1 } from "@/_metronic/partials/widgets";
import { Tab, Tabs } from "react-bootstrap";

function BieChart() {

    return (
        <>
            <div className="card card-custom h-500px">
                <div className="card-body">
                    <Tabs
                        defaultActiveKey="dantoc"
                        id="justify-tab-example"
                        className="mb-3 border-bottom pb-5"
                        variant='pills'
                    >
                        <Tab eventKey="dantoc" title="Hội viên chia theo dân tộc">
                            <ReactApexChart
                                options={bieChartDanToc.options}
                                series={bieChartDanToc.series}
                                type="pie"
                                height={400}
                            />
                        </Tab>
                        <Tab eventKey="tongiao" title="Hội viên chia theo tôn giáo">
                            <ReactApexChart
                                options={bieChartTonGiao.options}
                                series={bieChartTonGiao.series}
                                type="pie"
                                height={400}
                            />
                        </Tab>

                    </Tabs>
                </div>
            </div>
        </>
    );
}

export default BieChart;
