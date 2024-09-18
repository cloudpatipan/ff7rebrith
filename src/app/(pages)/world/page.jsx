"use client";
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { Layout } from '@/layouts/Layout';
import { usePathname } from 'next/navigation';
import { GoTriangleDown } from 'react-icons/go';
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';

export default function ViewWorld() {

  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchWorld = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/world`);
      const data = await response.json();
      if (response.ok) {
        setWorlds(data.world);
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
  }, []);

  useEffect(() => {
    fetchWorld();
  }, [fetchWorld]);

  const pathname = usePathname();

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={`โลก`}>
          <div className="relative">
            <div className="min-h-dvh bg-cover flex flex-col items-center justify-center" style={{ backgroundImage: `url('https://www.jp.square-enix.com/ffvii_rebirth/world/_img/hero/visual_pc.jpg')` }}>
              <p className="p-4 drop-shadow text-xl">"คุณจะไม่สามารถเข้าใจความหมายของบทความนี้ได้ มีหลายสิ่งหลายอย่างในโลก"</p>
            </div>
            <Grid className="md:absolute bottom-0 grid grid-cols-2 md:grid-cols-[repeat(16,minmax(100px,500px))]  " gap={2}>
              {worlds.length > 0 ? (
                worlds.map((world, index) => (
                  <Card
                    key={index}
                    index={index}
                    link={`/world/${world?.slug}`}
                    conditionImage={world?.image}
                    height={`h-[4rem]`}
                    imageUrl={`${baseUrl}/images/world/${world?.slug}/${world?.image}`}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                  <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                </div>
              )}
            </Grid>
          </div>
        </Layout >
      )
      }
    </>
  );
}
