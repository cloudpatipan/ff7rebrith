
"use client";
import { Card } from "@/components/Card";
import { Grid } from "@/components/Grid";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Community() {

  const router = useRouter();

  const { token, setToken } = useContext(UserContext);
  const [ users, setUsers ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetchUser();
  }, []);

  const fetchUser= async () => {
    try {
      const response = await fetch(`${baseUrl}/api/viewuser`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
        setLoading(false);
      } else if (data.status === 401) {
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

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={`รายการโปรดของผู้ใช้`}>

          <Grid gap={2} className={` grid grid-cols-2 md:grid-cols-8`}>
            {users.length > 0 ? (
              users.map((user, index) => (
                <Card
                  key={index}
                  index={index}
                  link={`/community/userfavorite/${user?.id}`}
                  conditionImage={user?.avatar}
                  imageUrl={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของผู้ใช้ ${user?.name}`}
                  height={`h-[8rem]`}
                  name={user?.name}
                />
              ))
            ) : (
              <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-8">
                <span className="text-3xl">ไม่มีข้อมูล</span>
              </div>
            )}
          </Grid>

        </Layout >

      )}

    </>
  )
}
