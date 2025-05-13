import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import "./OptionBreakdownChart.css";

ChartJS.register(ArcElement, Tooltip);

// Hash label to a base hue
const hashStringToHue = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
};

// Generate distinct and spread colors for each label
const generateColors = (labels) => {
  return labels.map((label, index) => {
    const baseHue = hashStringToHue(label);
    const offsetHue = (baseHue + index * 37) % 360; // 37° golden angle spread
    return `hsl(${offsetHue}, 70%, 60%)`;
  });
};

const OptionBreakdownChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [legendColors, setLegendColors] = useState([]);
  const navigate = () => window.history.back();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3333/polls", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const polls = await res.json();
        const optionVoteMap = {};
        polls.forEach((poll) => {
          poll.options.forEach((opt) => {
            optionVoteMap[opt.name] = (optionVoteMap[opt.name] || 0) + opt.votes;
          });
        });

        const labels = Object.keys(optionVoteMap);
        const data = Object.values(optionVoteMap);
        const dynamicColors = generateColors(labels);

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: dynamicColors,
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        });

        setLegendColors(
          labels.map((label, index) => ({
            label,
            color: dynamicColors[index],
          }))
        );
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-page">
      <h1 className="chart-title">Option Breakdown Overview</h1>

      <button className="back-button" onClick={navigate}>
        ← Back to Analytics
      </button>

      <div className="combined-card">
        <div className="options-list">
          <ul>
            {legendColors.map((item, idx) => (
              <li key={idx}>
                <span style={{ backgroundColor: item.color }}></span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-wrapper">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionBreakdownChart;
