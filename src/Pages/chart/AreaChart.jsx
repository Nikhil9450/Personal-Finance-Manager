import React, { useRef, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({ Chart_data }) => {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (chartRef.current) {
  //       setChartWidth(chartRef.current.offsetWidth);
  //     }
  //   };

  //   // Set initial width and add resize listener
  //   handleResize();
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth);

      // Attach resize listener
      const handleResize = () => setChartWidth(chartRef.current.offsetWidth);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // useEffect(()=>{
  //   console.log("chartRef.current.offsetWidth------------>",chartRef.current.offsetWidth)
  //   console.log("chartWidth------------>",chartWidth)
  // },[chartWidth])

  // Render chart only if data is available
  if (!Chart_data || Chart_data.length === 0) return <p>No chart data available</p>;

  const categories = Chart_data.map((item) => item.name || "");
  const expenses = Chart_data.map((item) => item.expense || 0);

  console.log("categoriess--------------->",categories)
  
  console.log("expenses--------------->",expenses)
  const chartOptions = {
    chart: { id: "apex-area-chart", type: "area", toolbar: { show: false } },
    xaxis: { categories },
    stroke: { curve: "smooth", width: 2 },
    fill: { opacity: 0.2 },
    dataLabels: { enabled: false },
    title: { text: "Expenses Overview", align: "left", style: { fontSize: "16px" } },
  };

  const chartSeries = [{ name: "Expenses", data: expenses }];

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
