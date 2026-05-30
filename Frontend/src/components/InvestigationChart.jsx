import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function InvestigationChart({ data }) {

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
        Investigation Progress
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3b82f6"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default InvestigationChart;