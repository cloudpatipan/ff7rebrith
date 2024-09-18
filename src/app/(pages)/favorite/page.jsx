
"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { PiTrashSimpleThin } from "react-icons/pi";
import Swal from "sweetalert2";

export default function Favorite() {

  const router = useRouter();

  const { token, setToken } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingFavoriteId, setDeletingFavoriteId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchFavorite();
    }
  }, [token]);

  const fetchFavorite = async () => {
    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setFavorites(data.favorites);
        setLoading(false);
      } else if (response.status === 401) {
        Swal.fire({
          icon: 'warning',
          text: data.message,
          color: 'white',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#005e95',
          background: 'rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0',
        });
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
  };

  const deleteFavoriteItem = async (e, favorite_id) => {
    e.preventDefault();
    setDeletingFavoriteId(favorite_id);

      try {
        const response = await fetch(`${baseUrl}/api/delete-favoriteitem/${favorite_id}`, {
          method: 'DELETE',
          headers: {
            
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(favorite_id),
        });
        const data = await response.json();
        if (response.ok) {
          setFavorites((prevFavorites) => prevFavorites.filter(favorite => favorite.id !== favorite_id));
          Swal.fire({
            icon: "success",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
          setDeletingFavoriteId(null);
        } else if (response.status === 400) {
          Swal.fire({
            icon: "error",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
          setDeletingFavoriteId(null);
        } else if (response.status === 401) {
          Swal.fire({
            icon: "error",
            text: data.message,
            color: "white",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005e95",
            background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
          });
          router.push('/');
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


  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={`ตัวละครโปรด`}>

          <div className={`p-4 border-r-4 border-l-4 border-[#3d87ab] bg-[#033D71]/60 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
            {favorites.length > 0 ? (
              favorites.map((favorite, index) => (
                <Card
                  key={index}
                  index={index}
                  link={`/character/${favorite?.character?.slug}`}
                  backgroundImageUrl={`${baseUrl}/images/character/${favorite?.character?.slug}/${favorite?.character?.background}`}
                  conditionImage={favorite?.character?.avatar}
                  imageUrl={`${baseUrl}/images/character/${favorite?.character?.slug}/${favorite?.character?.avatar}`}
                  name={favorite?.character?.name}
                  Favorite={
                    <button type="button" className="absolute top-2 right-2 text-[#176db0] hover:brightness-125" onClick={(e) => deleteFavoriteItem(e, favorite.id)}>
                      {deletingFavoriteId === favorite.id ? "กำลังลบ..." : <PiTrashSimpleThin size={25} />}
                    </button>
                  }
                />
              ))
            ) : (
              <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-6">
                <span className="text-3xl">ไม่มีข้อมูล</span>
              </div>
            )}
          </div>

        </Layout >

      )}

    </>
  )
}
