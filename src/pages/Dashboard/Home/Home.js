import React, { useEffect } from 'react'
import { Col, Row, Typography } from 'antd'
import { SiCoinmarketcap } from "react-icons/si"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
// import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'; // Remove .new

const { Title } = Typography;

export default function Home() {

    useEffect(() => {
        // Create root element
        const root = am5.Root.new('chartdiv');

        // Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true
        }));

        // Add cursor
        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        // Generate random data
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let value = 1000;
        let volume = 100000;

        const generateData = () => {
            value = Math.round((Math.random() * 10 - 5) + value);
            volume = Math.round((Math.random() * 1000 - 500) + volume);

            am5.time.add(date, "day", 1);
            if (date.getDay() === 6) {
                am5.time.add(date, "day", 1);
            }
            if (date.getDay() === 0) {
                am5.time.add(date, "day", 1);
            }

            return {
                date: date.getTime(),
                value: value,
                volume: volume
            };
        };

        const generateDatas = (count) => {
            const data = [];
            for (let i = 0; i < count; ++i) {
                data.push(generateData());
            }
            return data;
        };

        // Create axes
        const xAxis = chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
            maxDeviation: 0,
            baseInterval: {
                timeUnit: "day",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            extraMin: 0.2,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Add series
        const series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        // y axis for volume
        const volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});
        volumeAxisRenderer.grid.template.set("forceHidden", true);
        volumeAxisRenderer.labels.template.set("forceHidden", true);

        const volumeAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            height: am5.percent(25),
            y: am5.percent(100),
            centerY: am5.percent(100),
            panY: false,
            renderer: volumeAxisRenderer
        }));

        // Add series
        const volumeSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Volume Series",
            xAxis: xAxis,
            yAxis: volumeAxis,
            valueYField: "volume",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        volumeSeries.columns.template.setAll({ fillOpacity: 0.8, strokeOpacity: 0, width: am5.percent(40) });

        // Add scrollbar
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));

        // Set data
        const data = generateDatas(200);
        series.data.setAll(data);
        volumeSeries.data.setAll(data);

        // Make stuff animate on load
        series.appear(1000);
        chart.appear(1000, 100);

        // Clean up when the component unmounts
        return () => {
            root.dispose();
        };
    }, []);


    //   return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;

    return (
        <div className=''>
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <div className="card p-3 text-white mb-3" style={{ backgroundColor: "#fdedd4" }}>
                        <div className='align-center justify-content-between mb-3'>
                            <Title level={4} className='text-primary mb-0'>Maket Cap</Title>
                            <div>
                                <SiCoinmarketcap className='fs-5 text-primary' />
                            </div>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Current price</Title>
                            <Typography className='opacity-75'>$75.91</Typography>
                        </div>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className="card p-3 text-white" style={{ backgroundColor: "#e1f9f1" }}>
                        <div className='align-center justify-content-between mb-3'>
                            <Title level={4} className='text-primary mb-0'>Network Status</Title>
                            <div>
                                <TbBrandGoogleAnalytics className='fs-5 text-primary' />
                            </div>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                        <div className='align-center justify-content-between'>
                            <Title level={5} className='mb-0 opacity-75'>Block number</Title>
                            <Typography className='opacity-75'>$859.283</Typography>
                        </div>
                    </div>
                </Col>
            </Row>
            <div>

                <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
            </div>
        </div>
    )
}
