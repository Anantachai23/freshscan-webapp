import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp, ShieldAlert, ThermometerSnowflake } from "lucide-react";

const gradeData = [
  { name: "เกรด A · Extra Fresh (0–4 Demerits)", value: 62, color: "#10b981" },
  { name: "เกรด B · Commercial Fresh (5–9 Demerits)", value: 25, color: "#06b6d4" },
  { name: "เกรด C · Acceptable (10–14 Demerits)", value: 10, color: "#f59e0b" },
  { name: "เกรด D · Spoiled / Reject (15–20 Demerits)", value: 3, color: "#ef4444" },
];

const speciesData = [
  { type: "ปลาทู", scans: 342 },
  { type: "กุ้งขาวแวนนาไม", scans: 289 },
  { type: "หมึกกล้วย", scans: 215 },
  { type: "ปลากะพงขาว", scans: 184 },
  { type: "หอยแมลงภู่", scans: 142 },
  { type: "ปลาอินทรี", scans: 118 },
];

const impactTargets = [
  { k: "QIM 0–20", label: "Demerit Point Rubric", desc: "มาตรฐานยุโรป & TAS 7001-2550" },
  { k: "< 0.8s", label: "Inference Latency", desc: "สแกนและประมวลผลทันทีบนอุปกรณ์" },
  { k: "16 สายพันธุ์", label: "Calibrated Species", desc: "ครอบคลุม 4 วงศ์สัตว์น้ำเศรษฐกิจ" },
  { k: "0–4 °C", label: "Cold-Chain Range", desc: "คำนวณอายุเก็บรักษาบนน้ำแข็ง" },
];

export function Stats() {
  return (
    <section
      id="standards"
      className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <BarChart3 className="size-3.5 text-cyan-400" />
            ANALYTICAL BENCHMARKS
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            สถิติคุณภาพและการกระจายตัว <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              ในห่วงโซ่อุปทานอาหารทะเล
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            ฐานข้อมูลการปรับเทียบ (Empirical Baseline) ช่วยให้แยกแยะความสดแท้จริงจากลักษณะทางกายภาพ
            ลดความเสี่ยงการเกิดฮีสตามีนและสารก่อภูมิแพ้ในอาหารทะเล
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {impactTargets.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-lg hover:border-cyan-400/40 transition-all"
            >
              <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                {t.k}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-200">{t.label}</div>
              <div className="mt-1 text-xs text-slate-400">{t.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* 2 Charts */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Grade Distribution Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-sky-500/20 bg-slate-900/50 p-6 sm:p-7 shadow-xl"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">การกระจายเกรดความสด (QIM Distribution)</h3>
                <p className="text-xs text-slate-400 mt-1">อ้างอิงจากเกณฑ์มาตรฐาน TAS 7001-2550</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 border border-sky-500/30 rounded-full px-2 py-0.5 bg-sky-500/10">
                Baseline N=160
              </span>
            </div>

            <div className="mt-6 grid sm:grid-cols-[1fr_1.1fr] gap-4 items-center">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {gradeData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#090d16",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <ul className="space-y-3">
                {gradeData.map((d) => (
                  <li key={d.name} className="flex items-center gap-3">
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 text-xs text-slate-300 leading-tight">{d.name}</div>
                    <div className="font-mono font-bold text-sm text-white">{d.value}%</div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Top Species Inspected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-sky-500/20 bg-slate-900/50 p-6 sm:p-7 shadow-xl"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">ชนิดสัตว์น้ำที่ได้รับการประเมินสูงสุด</h3>
                <p className="text-xs text-slate-400 mt-1">อันดับความถี่การใช้งานในระบบ</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 border border-sky-500/30 rounded-full px-2 py-0.5 bg-sky-500/10">
                Commercial Species
              </span>
            </div>

            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speciesData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" vertical={false} />
                  <XAxis
                    dataKey="type"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(56, 189, 248, 0.1)" }}
                    contentStyle={{
                      background: "#090d16",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="scans" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
