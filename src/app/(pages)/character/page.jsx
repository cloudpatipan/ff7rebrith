"use client";
import { Layout } from '@/layouts/Layout';
import { PiHeartThin } from 'react-icons/pi';
import { useCallback, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { UserContext } from '@/context/UserContext';
import baseUrl from '@/service/BaseUrl';

export default function ViewCharacter() {

  const { token } = useContext(UserContext);

  const [characters, setCharacters] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchCharacter = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/character`);
      const data = await response.json();
      if (response.ok) {
        setCharacters(data.characters);
        setLoading(false);
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
  }, []);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);


  const addToFavorite = async (character_id) => {

    if (token) {
      try {
        await fetch(`${baseUrl}/sanctum/csrf-cookie`);
        const response = await fetch(`${baseUrl}/api/add-to-favorite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ character_id }),
        });
        const data = await response.json();
        if (response.ok) {
          Swal.fire({
            icon: "success",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
        } else if (response.status === 400) {
          Swal.fire({
            icon: "error",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
        } else if (response.status === 401) {
          Swal.fire({
            icon: "warning",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
        } else if (response.status === 404) {
          Swal.fire({
            icon: "error",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "warning",
          text: error,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      }
    }
  }

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Layout header={`ตัวละคร`}>

          <Grid className={'grid grid-cols-2 md:grid-cols-[repeat(8,minmax(100px,500px))]  '} gap={2}>
            {characters.length > 0 ? (
              characters.map((character, index) => (
                <Card
                  key={index}
                  index={index}
                  link={`/character/${character?.slug}`}
                  backgroundImageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.background}`}
                  conditionImage={character?.avatar}
                  height={`h-[14rem]`}
                  name={character?.name}
                  imageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`}
                  Favorite={
                    <PiHeartThin key={index} size={25} className={`absolute top-2 right-2 text-[#176db0] hover:brightness-125`} onClick={(e) => addToFavorite(character?.id)} />
                  }
                />
              ))
            ) : (
              <div className="flex items-center justify-center rounded-lg col-span-2 md:col-span-8">
                <span className="text-3xl">ไม่มีข้อมูล</span>
              </div>
            )}
          </Grid>
        </Layout>
      )}
    </>
  );
}
