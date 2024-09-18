"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { useParams } from 'next/navigation';
import { Layout } from '@/layouts/Layout';
import { motion } from 'framer-motion';


// ไอคอน
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { Modal } from '@/components/Modal';

export default function DetailCharacter() {

    const { slug } = useParams();
    const [character, setCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchCharacterDetail();
                await fetchCharacter();
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


    const fetchCharacterDetail = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/character/detail/${slug}`);
            const data = await response.json();
            if (response.ok) {
                setCharacter(data.character);
                document.title = data.character?.name;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    }

    const fetchCharacter = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/character`);
            const data = await response.json();
            if (response.ok) {
                setCharacters(data.characters);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: error,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    }

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    }

    return (
        <>
            {loading ? (
                <div className={`min-h-dvh flex items-center justify-center`}>
                    <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
                </div>
            ) : (
                <Layout header={`ตัวละคร`}>
                    <div className={`relative flex flex-col gap-4 items-center md:flex-row p-4 md:p-0`} style={{ backgroundImage: `url('${baseUrl}/images/character/${character?.slug}/${character?.background}')` }}>

                        <motion.div
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{
                                ease: "easeInOut",
                                duration: 0.5,
                            }} className={`md:w-[50%]`}>
                            <img className={`w-full h-full object-cover transition-opacity`} src={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`} alt={`รูปภาพของตัวละคร ${character?.name}`} />
                        </motion.div>

                        <div className={`md:w-[40%] md:p-4`}>

                            <motion.div
                                variants={variants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{
                                    delay: 1,
                                    ease: "easeInOut",
                                    duration: 0.5,
                                }}
                                className={`mx-auto mt-4 md:mt-0 font-extralight`}>

                                <div className={`px-2 w-[40%] border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                                    {character?.role?.name}
                                </div>

                                <div className={`mb-2 text-3xl`}>
                                    {character?.name}
                                </div>

                                <div className={`mb-2 rounded-full flex items-center overflow-hidden outline outline-offset-2 outline-1 outline-[#9a0000]/60`}>

                                    <span className={`px-2 bg-[#9a0000]`}>
                                        นักพากย์
                                    </span>

                                    <span className={`px-2`}>
                                        {character?.voice_actor}
                                    </span>

                                </div>

                                <p className="text-justify">
                                    {character?.description}
                                </p>

                                <div className={`flex flex-col md:flex-row gap-4 mt-4`}>

                                    {character?.image && (
                                        <>
                                            <div className={`md:w-[40%] group flex items-center hover:brightness-125 hover:scale-110 translate-scale duration-300 border border-[#176db0] p-[0.1rem]`} onClick={openModal}>
                                                <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${character?.slug}/${character?.image}`} alt={`รูปภาพของเสริมตัวละคร ${character?.name}`} />
                                            </div>
                                            <Modal className={`p-[0.1rem]`} isOpen={modalOpen} onClose={closeModal}>
                                                {character?.image && (
                                                    <div className={`group flex items-center duration-300`} onClick={openModal}>
                                                        <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${character?.slug}/${character?.image}`} alt={`รูปภาพของเสริมตัวละคร ${character?.name}`} />
                                                    </div>
                                                )}
                                            </Modal>
                                        </>
                                    )}
                                </div>

                            </motion.div>

                        </div>

                        <Grid className={`md:absolute bottom-0 grid grid-cols-4 md:grid-cols-[repeat(16,minmax(100px,500px))]  `} gap={2}>
                            {characters.length > 0 ? (
                                characters.map((character, index) => (
                                    <Card
                                        key={index}
                                        index={index}
                                        link={`/character/${character?.slug}`}
                                        backgroundImageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.background}`}
                                        conditionImage={character?.avatar}
                                        height={`h-[4rem]`}
                                        imageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`}
                                        condition={character?.slug === slug}
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
    )
}
