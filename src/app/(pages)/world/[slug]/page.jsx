"use client";
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Layout } from '@/layouts/Layout';
import { GoTriangleDown } from 'react-icons/go';
import { Grid } from '@/components/Grid';
import { Card } from '@/components/Card';

export default function Detailworld() {

    const { slug } = useParams();
    const [world, setWorld] = useState([]);
    const [worlds, setWorlds] = useState([]);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchWorldDetail();
                await fetchWorld();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: error,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);


    const fetchWorldDetail = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/world/detail/${slug}`);
            const data = await response.json();
            if (response.ok) {
                setWorld(data.world);
                document.title = data.world?.name;
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

    const fetchWorld = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/world`);
            const data = await response.json();
            if (response.ok) {
                setWorlds(data.world);
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

    return (
        <>
            {loading ? (
                <div className={`min-h-dvh flex items-center justify-center`}>
                    <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
                </div>
            ) : (
                <Layout header={`โลก`}>
                    <div className="relative">
                        <div className={`bg-cover min-h-dvh flex flex-col gap-4`}
                            style={{
                                backgroundImage: `url('${baseUrl}/images/world/${world?.slug}/${world?.image}')`,
                            }}>

                            <div className={`w-full mt-4`}>

                                <div className={`w-[90%] mx-auto mt-4 md:mt-0 font-extralight`}>

                                    <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                                        {world?.name}
                                    </div>

                                    <div className="border-[#3d87ab] border-t">
                                        <p>
                                            {world?.description}
                                        </p>
                                    </div>


                                </div>

                            </div>

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
                                        condition={world?.slug === slug}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                    <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                                </div>
                            )}
                        </Grid>

                    </div>
                </Layout>
            )}
        </>
    )
}
