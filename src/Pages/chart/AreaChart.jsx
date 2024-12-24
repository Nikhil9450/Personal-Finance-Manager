import React, { useRef, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({ Chart_data }) => {
  console.log("Chart_data------>",Chart_data)
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  // Dynamically update chart width
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth);
      }
    };

    // Set initial width and add resize listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const categories = Chart_data.map((item) => item.name || "");
  const expenses = Chart_data.map((item) => item.expense || 0);

  const chartOptions = {
    chart: {
      id: "apex-area-chart",
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ["No Data"],
    },
    yaxis: {
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth", // Options: 'smooth', 'straight', 'stepline'
      width: 2, // Stroke width
      colors: ["#124E66"],
     },
     fill: {
      type: "solid",
      colors: ["#124E66"], 
      opacity: 0.2, 
      // type: "gradient",
      // gradient: {
      //   shade: "light",
      //   type: "vertical",
      //   shadeIntensity: 0.5,
      //   gradientToColors: ["#124E66"],
      //   inverseColors: false,
      //   opacityFrom: 0.9,
      //   opacityTo: 0.4,
      //   stops: [0, 100],
      // },
    },
    title: {
      text: "Expenses Overview",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
  };

  const chartSeries = [
    {
      name: "Expenses",
      data: expenses.length > 0 ? expenses : [0],
    },
  ];

  return (
    <div ref={chartRef} style={{ width: "100%" }}>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        width={chartWidth}
        height={300}
      />
    </div>
  );
};

export default AreaChart;
