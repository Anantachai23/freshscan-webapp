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

const gradeData = [
  { name: "เกรด A · สดมาก", value: 58, color: "var(--grade-a)" },
  { name: "เกรด B · ปานกลาง", value: 29, color: "var(--grade-b)" },
  { name: "เกรด C · ไม่สด", value: 13, color: "var(--grade-c)" },
];

const typeData = [
  { type: "ปลาทู", scans: 124 },
  { type: "กุ้งขาว", scans: 98 },
  { type: "หมึก", scans: 72 },
  { type: "ปลาทูน่า", scans: 65 },
  { type: "หอยแมลงภู่", scans: 48 },
  { type: "ปลาอินทรี", scans: 41 },
];

const targets = [
  { k: "เกรด A/B/C", v: "ระบบตัดเกรดชัดเจน เข้าใจง่าย" },
  { k: "< 3 วินาที", v: "ความเร็วในการวิเคราะห์ผล" },
  { k: "4 หมวดหลัก", v: "ปลา · กุ้ง · หอย · ปลาหมึก" },
  { k: "100%", v: "ปลอดภัย ไร้กังวลเรื่องข้อมูลส่วนตัว" },
];

export function Stats() {
  return (
    <section
      id="standards"
      className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
            มาตรฐานการประเมิน
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            เกณฑ์คุณภาพที่โปร่งใส
            <br />
            และตรวจสอบได้
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            เราออกแบบเกณฑ์การประเมินให้ผู้บริโภค แม่บ้าน และร้านอาหารสามารถตัดสินใจได้อย่างมั่นใจ
            พร้อมกราฟวิเคราะห์คุณลักษณะรอบด้านในทุกการสแกน
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targets.map((t, i) => (
            <motion.div
              key={t.v}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl p-6 bg-card border border-border"
            >
              <div className="text-3xl font-display font-bold text-gradient-ocean">{t.k}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t.v}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-card border border-border p-7 shadow-card-soft"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-bold text-lg">การกระจายเกรดความสด</h3>
              <span className="text-xs text-muted-foreground">ข้อมูลจำลอง</span>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4 items-center">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {gradeData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-3">
                {gradeData.map((d) => (
                  <li key={d.name} className="flex items-center gap-3">
                    <span className="size-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 text-sm">{d.name}</div>
                    <div className="font-display font-bold">{d.value}%</div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-card border border-border p-7 shadow-card-soft"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-bold text-lg">ประเภทที่สแกนสูงสุด</h3>
              <span className="text-xs text-muted-foreground">7 วันล่าสุด</span>
            </div>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="type"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--secondary)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="scans" fill="var(--ocean)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
