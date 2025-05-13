import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./VotesOverTime.css";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Title);

const VotesOverTime = () => {
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

        // Group polls by date (YYYY-MM-DD)
        const grouped = data.reduce((acc, poll) => {
          const dateKey = new Date(poll.createdAt).toISOString().split("T")[0];
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort();

        setChartData({
          labels: sortedDates.map(date => new Date(date)),
          datasets: [
            {
              label: "Polls Created",
              data: sortedDates.map(date => grouped[date]),
              borderColor: "#ff6b81",
              backgroundColor: "rgba(255, 107, 129, 0.2)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#ff6b81",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching polls:", err);
      }
    };

    fetchPolls();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#fff" }
      },
      title: {
        display: true,
        text: "Polls Created Over Time",
        color: "#fff",
        font: { size: 22 }
      }
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "day" },
        ticks: { color: "#fff" },
        title: {
          display: true,
          text: "Time",
          color: "#fff"
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        title: {
          display: true,
          text: "Poll Count",
          color: "#fff"
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
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VotesOverTime;
