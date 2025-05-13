import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./VotePerPollChart.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VotePerPollChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch("http://localhost:3333/polls", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        const labels = data.map((poll) => poll.title);
        const voteCounts = data.map((poll) =>
          poll.options.reduce((sum, opt) => sum + opt.votes, 0)
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Votes",
              data: voteCounts,
              backgroundColor: "rgba(255, 99, 132, 0.8)",
              borderRadius: 8,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch polls:", err);
      }
    };

    fetchPolls();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          maxRotation: 40,
          minRotation: 30,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div className="chart-page">
      <h1 className="chart-title">Votes per Poll Overview</h1>

      <button className="back-button" onClick={() => navigate("/admin/analytics")}>
        ← Back to Analytics
      </button>

      <div className="chart-container">
        <div className="chart-inner-wrapper">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VotePerPollChart;
