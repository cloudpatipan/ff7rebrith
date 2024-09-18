"use client";

import { Layout } from "@/layouts/Layout";

export default function Home() {


  return (
    <Layout>
      <div className={`relative overflow-hidden`}>
        <iframe className={`w-full aspect-video`} allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="FINAL FANTASY VII REBIRTH WEB - TOP" src="https://www.youtube.com/embed/o5a9Xe3K3zI?rel=0&autoplay=1&loop=1&controls=0&mute=0&showinfo=1&disablekb=1&modestbranding=1&iv_load_policy=3&fs=0" />

        <div className={`w-[40%] absolute top-0 right-4`}>
          <img className="" src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/logo.png" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/release_v3.png" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/btn_tw_sp.png" alt="" />

          <div className={`grid grid-cols-2 gap-4 mt-8`}>

            <div className={`bg-gradient-to-t from-[#003668]/70 to-[#004d7e]/70 outline outline-offset-2 outline-1 outline-[#176db0] border-r-4 border-l-4 border-[#268dac] hover:scale-110 transition-all duration-100 `}>
              <img className={`w-full h-full object-cover`} src="https://www.jp.square-enix.com/ffvii_rebirth/news/_articleimg/ff7r-digest_pc.jpg" alt="" />
            </div>

            <div className={`bg-gradient-to-t from-[#003668]/70 to-[#004d7e]/70 outline outline-offset-2 outline-1 outline-[#176db0] border-r-4 border-l-4 border-[#268dac]`}>
              <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/bnr/msg_pc.jpg`} alt="" />
            </div>

          </div>

        </div>

        <div className="min-h-dvh bg-cover" style={{ backgroundImage: `url('https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/visual_pc.jpg')` }}>
          <h1 className={` text-2xl py-4 text-center border-b-2 border-[#9a0000] bg-black/40`}>เนื้อเรื่อง</h1>
          <div className="min-h-dvh flex flex-col justify-center  bg-black/40">
            <p className="p-4 md:w-1/2 drop-shadow-2xl mx-auto text-justify">ในตอนท้ายของภาคที่แล้ว แซ็คกรุยทางผ่านทหารชินระที่ห้อมล้อมเขาและมีชีวิตรอดมาได้ นี่เป็นสิ่งที่แตกต่างจากที่เราเห็นใน FFVII OG อย่างไรก็ตาม เป็นที่ชัดเจนแล้วว่าเหตุการณ์เหล่านี้เกิดขึ้นในโลกที่แตกต่างจากโลกที่พวกคลาวด์อาศัยอยู่ นอกจากนี้ เซฟิรอธยังเปิดเผยในช่วงท้ายของเรื่องว่า มีโลกอันมากมายดำรงอยู่ภายในดวงดาวของเกมนี้ เราสามารถแยกโลกเหล่านั้นออกจากกัน ด้วยการสังเกตลักษณะของสแตมป์ (Stamp) น้อยผู้ภักดี มีโลกอย่างน้อย 5 ใบปรากฏขึ้นตลอดทั้งเกม เซฟิรอธคุ้นเคยกับโครงสร้างของโลกเหล่านี้ดี และชัดเจนว่าเขากำลังใช้โลกเหล่านี้ “เพื่อยืดอายุขัยของดวงดาว”</p>
          </div>

        </div>


        <div className="grid grid-cols-3">
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic1.jpg" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic2.jpg" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic3.jpg" alt="" />
        </div>

      </div>

    </Layout>
  );
}
