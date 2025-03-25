import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import { useEffect, useRef } from "react";

const fetchRevenue = async () => {
  const { data } = await axios.get("http://localhost:3000/revenue?dateStart=2024-03-01&dateEnd=2024-03-31");
  return data;
};

const fetchBestSellers = async () => {
  const { data } = await axios.get("http://localhost:3000/best-sellers?dateStart=2024-03-01&dateEnd=2024-03-31");
  return data;
};

function Statistics() {
  const revenueChart = useRef(null);
  const bestSellersChart = useRef(null);

  // Lấy dữ liệu doanh thu
  const { data: revenueData } = useQuery({
    queryKey: ["revenue"],
    queryFn: fetchRevenue,
  });

  // Lấy dữ liệu sản phẩm bán chạy
  const { data: bestSellersData } = useQuery({
    queryKey: ["bestSellers"],
    queryFn: fetchBestSellers,
  });

  // Hiển thị biểu đồ doanh thu
  useEffect(() => {
    if (revenueData) {
      let root = am5.Root.new(revenueChart.current!);
      let chart = root.container.children.push(am5xy.XYChart.new(root, {}));

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, { categoryField: "date", renderer: am5xy.AxisRendererX.new(root, {}) })
      );
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {}));
      let series = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Revenue", xAxis, yAxis, valueYField: "total", categoryXField: "date" }));

      series.data.setAll(revenueData);
      xAxis.data.setAll(revenueData);
      return () => root.dispose();
    }
  }, [revenueData]);

  // Hiển thị biểu đồ sản phẩm bán chạy
  useEffect(() => {
    if (bestSellersData) {
      let root = am5.Root.new(bestSellersChart.current!);
      let chart = root.container.children.push(am5percent.PieChart.new(root, {}));

      let series = chart.series.push(am5percent.PieSeries.new(root, { valueField: "quantity", categoryField: "name" }));
      series.data.setAll(bestSellersData);

      return () => root.dispose();
    }
  }, [bestSellersData]);

  return (
    <div>
      <h2>Thống kê doanh thu</h2>
      <div ref={revenueChart} style={{ width: "100%", height: "400px" }}></div>

      <h2>Sản phẩm bán chạy</h2>
      <div ref={bestSellersChart} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}

export default Statistics;
