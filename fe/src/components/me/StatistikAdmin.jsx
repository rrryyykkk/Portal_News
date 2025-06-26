import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStatistikAdmin } from "../../app/store/useNews";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatistikAdmin = () => {
  const { data, isLoading, isError } = useStatistikAdmin("month");
  const statistikPosts = data?.newsStat || [];

  const totalViews = statistikPosts.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );
  const totalLikes = statistikPosts.reduce(
    (sum, post) => sum + (post.likes || 0),
    0
  );
  const totalComments = statistikPosts.reduce(
    (sum, post) => sum + (post.comments || 0),
    0
  );
  const totalPosts = statistikPosts.length;

  const chartData = {
    labels: statistikPosts.map((p) => p.title || "Untitled"),
    datasets: [
      {
        label: "Views",
        data: statistikPosts.map((p) => p.views || 0),
        backgroundColor: "#3b82f6", // Tailwind blue-500
      },
      {
        label: "Likes",
        data: statistikPosts.map((p) => p.likes || 0),
        backgroundColor: "#10b981", // Tailwind green-500
      },
      {
        label: "Comments",
        data: statistikPosts.map((p) => p.comments || 0),
        backgroundColor: "#f59e0b", // Tailwind yellow-500
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280", // gray-500
          font: { size: 12, weight: "500" },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB", // gray-200
          borderDash: [4, 4],
        },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151", // gray-700
          font: { size: 13, weight: "600" },
        },
      },
      title: {
        display: true,
        text: "📊 Statistik Postingan Admin",
        color: "#111827", // gray-900
        font: { size: 18, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#1f2937", // gray-800
        titleColor: "#f3f4f6", // gray-100
        bodyColor: "#e5e7eb", // gray-200
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      },
    },
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📈 Statistik Admin</h2>

      {/* Card Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Views" value={totalViews} color="indigo" />
        <StatCard title="Total Likes" value={totalLikes} color="green" />
        <StatCard title="Total Comments" value={totalComments} color="yellow" />
        <StatCard title="Total Posts" value={totalPosts} color="gray" />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg min-h-[400px]">
        {isLoading ? (
          <p className="text-center text-gray-500">Memuat grafik...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Gagal memuat data.</p>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`bg-${color}-100 rounded-xl p-4 shadow-sm`}>
    <h4 className="text-sm font-medium text-gray-600">{title}</h4>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default StatistikAdmin;
