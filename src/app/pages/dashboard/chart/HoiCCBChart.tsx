import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography, Card } from "antd";
import { hoiCCBChart } from "./configs/hoiCCBChart";


function HoiCCBChart() {
    const { Title, Paragraph } = Typography;

    return (
        <>
            <div className="card my-24 h-500px">
                <div className="card-header">
                    <h3 className="card-title">Hội Cựu chiến binh</h3>

                </div>
                <div className="card-body">
                    <ReactApexChart
                        className=""
                        options={hoiCCBChart.options}
                        series={hoiCCBChart.series}
                        type="bar"
                        height={320}
                    />
                </div>

            </div>

        </>
    );
}

export default HoiCCBChart;
