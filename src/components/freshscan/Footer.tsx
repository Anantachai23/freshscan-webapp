import { Link } from "@tanstack/react-router";
import { Fish, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-white/10 grid place-items-center">
                <Fish className="size-5 text-white" strokeWidth={2.4} />
              </div>
              <div className="font-display font-bold text-lg text-white">FreshScan</div>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              ระบบประเมินความสดของอาหารทะเลด้วยเทคโนโลยีวิเคราะห์ภาพถ่าย
              เพื่อความมั่นใจในทุกมื้ออาหาร ช่วยยกระดับมาตรฐานความปลอดภัยและลด Food Waste
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">
              บริการหลัก
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/analyze" className="hover:text-white transition">
                  วิเคราะห์ความสดอาหารทะเล
                </Link>
              </li>
              <li>
                <Link to="/species" className="hover:text-white transition">
                  คู่มือและฐานความรู้สัตว์น้ำ
                </Link>
              </li>
              <li>
                <a href="#how" className="hover:text-white transition">
                  ขั้นตอนการทำงาน
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-white transition">
                  เกณฑ์ประเมินคุณภาพ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">
              ความปลอดภัยและข้อกำหนด
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li className="flex items-start gap-1.5">
                <Shield className="size-4 shrink-0 mt-0.5 text-ocean" />
                <span>ประมวลผลบนเบราว์เซอร์ ไม่เก็บภาพส่วนตัว</span>
              </li>
              <li>เกณฑ์มาตรฐาน: 20-Point Visual Rubric</li>
              <li>คำแนะนำ: ตรวจสอบกลิ่นและเนื้อสัมผัสร่วมด้วยเสมอ</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} FreshScan. All rights reserved.</div>
          <div>
            ผลการประเมินจากภาพถ่ายใช้เป็นข้อมูลประกอบเบื้องต้น
            ไม่สามารถทดแทนการตรวจในห้องปฏิบัติการได้
          </div>
        </div>
      </div>
    </footer>
  );
}
