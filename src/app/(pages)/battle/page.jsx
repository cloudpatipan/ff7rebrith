"use client";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { Layout } from '@/layouts/Layout';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { Modal } from '@/components/Modal';

export default function ViewBattle() {

  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorld();
  }, []);

  const fetchWorld = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/battle`);
      const data = await response.json();
      if (response.ok) {
        setBattles(data.battle);
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "มีบางอย่างผิดปกติ",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  const [selectedBattle, setSelectedBattle] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (battle) => {
    setModalOpen(battle);
  };

  const closeModal = () => {
    setModalOpen(null);
  };

  const changeImageBG = (battle) => {
    setSelectedBattle(battle);
  };



  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={`แบทเทิล`}>
          <div className="relative overflow-scroll no-scroll-bar min-h-dvh bg-cover flex flex-col items-center justify-center" style={{ backgroundImage: `url('${selectedBattle?.image || 'https://www.jp.square-enix.com/ffvii_rebirth/battle/_img/basic/bg_pc.jpg'}')` }}>

            <div className="md:absolute top-0 flex flex-col-reverse md:flex-row gap-4">

              <Grid className="w-full md:w-[30%] grid grid-cols-1 gap-4" gap={2}>
                {battles.length > 0 ? (
                  battles.map((battle, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <h1 className="text-xl pb-2 border-b border-[#176db0]">{battle?.name}</h1>
                      <p className="truncate">{battle?.description}</p>
                      <Card
                        index={index}
                        conditionImage={battle?.image}
                        height={`h-[14rem]`}
                        imageUrl={battle?.image}
                        onClick={() => { openModal(battle); changeImageBG(battle) }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                    <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                  </div>
                )}
              </Grid>

              <div className={`w-full md:w-1/2 mx-auto p-4 md:mt-4 font-extralight`}>

                <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                  {selectedBattle?.name}
                </div>

                <div className="border-[#3d87ab] border-t">
                  <p>
                    {selectedBattle?.description}
                  </p>
                </div>


              </div>
              
            </div>
          </div>
          <Modal className={`p-[0.1rem]`} isOpen={!!modalOpen} onClose={closeModal}>
            {modalOpen?.image && (
              <div className={`group flex items-center duration-300`} onClick={closeModal}>
                <img className={`w-full h-full object-cover`} src={modalOpen?.image} alt={modalOpen?.name} />
              </div>
            )}
          </Modal>
        </Layout >
      )}
    </>
  );
}
