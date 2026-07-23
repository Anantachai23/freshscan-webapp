import { Fish } from "lucide-react";

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
              ระบบประเมินความสดของอาหารทะเลด้วย AI สำหรับผู้บริโภค ร้านอาหาร และผู้ค้า
              เพื่อสุขภาพและลด Food Waste
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">โครงการ</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>NSC ครั้งที่ 28</li>
              <li>หมวด: โปรแกรมประยุกต์</li>
              <li>ระดับ: นักเรียน</li>
              <li>ปีงบประมาณ 2569</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">สนับสนุนโดย</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.)</li>
              <li>กระทรวง อว.</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs text-white/50">
          <div>© 2026 FreshScan · โรงเรียนเทพศิรินทร์ สมุทรปราการ</div>
          <div>รหัสโครงการ 28P23W01274</div>
        </div>
      </div>
    </footer>
  );
}
