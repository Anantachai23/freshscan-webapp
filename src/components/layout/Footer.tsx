import { Link } from "@tanstack/react-router";
import { Fish, Shield, BookOpen, Compass, ExternalLink, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-sky-950/60 overflow-hidden">
      {/* Background ambient gradient glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 p-0.5">
                <div className="size-full bg-slate-950 rounded-[10px] grid place-items-center">
                  <Fish className="size-4.5 text-sky-400" strokeWidth={2.2} />
                </div>
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                FreshScan<span className="text-sky-400 font-light">Marine</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-md">
              แพลตฟอร์มตรวจประเมินคุณภาพและความสดของอาหารทะเลด้วยเทคโนโลยีวิเคราะห์พิกเซลทางชีวภาพ
              มาตรฐาน Quality Index Method (QIM) และมาตรฐานสินค้าเกษตร (มกษ.)
              เพื่อส่งเสริมความปลอดภัยของผู้บริโภคและลดการสูญเสียอาหารในห่วงโซ่ประมงไทย
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                In-Browser Processing
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                100% Privacy Preserved
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                QIM European Standard
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                TAS 7001 / 7002 Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">
              ระบบและการบริการ
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/analyze" className="hover:text-sky-400 transition-colors">
                  ระบบตรวจวัดความสด (Live Scanner)
                </Link>
              </li>
              <li>
                <Link to="/species" className="hover:text-sky-400 transition-colors">
                  สารานุกรมสายพันธุ์สัตว์น้ำ (Species Hub)
                </Link>
              </li>
              <li>
                <Link to="/dataset" className="hover:text-sky-400 transition-colors">
                  เกณฑ์การประเมิน QIM (Quality Rules)
                </Link>
              </li>
              <li>
                <a href="#qim-standards" className="hover:text-sky-400 transition-colors">
                  คู่มือสเกลคะแนน Demerit (0–20)
                </a>
              </li>
              <li>
                <a href="#tech-architecture" className="hover:text-sky-400 transition-colors">
                  สถาปัตยกรรม Computer Vision
                </a>
              </li>
            </ul>
          </div>

          {/* Reference Standards */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">
              มาตรฐานอ้างอิงระดับสากล
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>QIM Eurofish:</strong> Quality Index Method for Fresh Seafood
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>FAO TP 348:</strong> Quality and Quality Changes in Fresh Fish
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>มกษ. 7001-2550:</strong> มาตรฐานปลาสด สำนักงาน มกอช.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>มกษ. 7002-2550:</strong> มาตรฐานกุ้งสด กรมประมง
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>CODEX STAN:</strong> 165, 190, 311 Food Safety Protocols
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} FreshScan Marine™. All rights reserved.</div>
          <div className="text-center md:text-right max-w-xl text-slate-400">
            คำเตือนความปลอดภัย: ผลการประเมินจากภาพถ่ายเป็นการวิเคราะห์ลักษณะกายภาพเบื้องต้น
            ควรใช้ร่วมกับการตรวจสอบกลิ่นและเนื้อสัมผัสเสมอ เพื่อความปลอดภัยสูงสุดของผู้บริโภค
          </div>
        </div>
      </div>
    </footer>
  );
}
