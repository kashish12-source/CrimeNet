import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#3b82f6"
];

function DashboardChart({ data }) {

  return (
    <div
      className="
        bg-white
        dark:bg-slate-700
        rounded-2xl
        p-6
        shadow-lg
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-4
          dark:text-white
        "
      >
        Crime Status Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {
              data?.map((entry,index)=>(
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            }
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default DashboardChart;