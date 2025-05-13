import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./VoteByProvinceChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, ChartDataLabels);

const VoteByProvinceChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3333/polls", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        // Group vote counts by province
        const provinceVotes = {};

        data.forEach(poll => {
          const province = poll.address;
          const pollVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          provinceVotes[province] = (provinceVotes[province] || 0) + pollVotes;
        });

        const labels = Object.keys(provinceVotes);
        const values = Object.values(provinceVotes);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Votes",
              data: values,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return "#00b894"; // fallback
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, "#00cec9");
                gradient.addColorStop(1, "#0984e3");
                return gradient;
              },
              borderRadius: 10,
              hoverBackgroundColor: "#81ecec",
              barThickness: 40
            }
          ]
        });
      } catch (err) {
        console.error("Error loading vote data:", err);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        labels: { color: "#fff" }
      },
      title: {
        display: true,
        text: "Votes by Province",
        color: "#fff",
        font: { size: 22 }
      },
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold"
        },
        formatter: Math.round
      }
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: {
          color: "rgba(255,255,255,0.1)"
        },
        title: {
          display: true,
          text: "Province",
          color: "#fff",
          font: { weight: "bold" }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
          stepSize: 10
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        },
        title: {
          display: true,
          text: "Vote Count",
          color: "#fff",
          font: { weight: "bold" }
        }
      }
    }
  };

  return (
    <div className="chart-page">
      <button className="back-button" onClick={() => navigate("/admin/analytics")}>
        ← Back to Analytics
      </button>

      <div className="chart-scroll-wrapper">
        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VoteByProvinceChart;
