"use client";
import { Button } from "@/components/Button";
import { Sidebar } from "@/layouts/Sidebar"
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

// ไอคอน
import { PiPlusThin } from "react-icons/pi";
import { PiSquaresFourThin } from "react-icons/pi";
import { PiTableThin } from "react-icons/pi";
import { PiEyeThin } from "react-icons/pi";
import { PiPencilThin } from "react-icons/pi";
import { PiTrashThin } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function CharacterIndex() {

  const { token } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchChatacter();
    }
  }, [token])

  const fetchChatacter = async () => {

    try {
      const response = await fetch(`${baseUrl}/api/admin/character`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCharacters(data.characters);
        setLoading(false);
      } 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: error,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
    });
    }
  }

  const deleteCharacter = async (e, id) => {
    e.preventDefault();
    setDeleting(id);

    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
      const response = await fetch(`${baseUrl}/api/admin/character/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
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
        setCharacters(prev => prev.filter(character => character.id !== id));
        setDeleting(null);
      } else if (response.status === 400) {
        Swal.fire({
          icon: "warning",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        setDeleting(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "มีข้อผิดพลาดกับดึงข้อมูล",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  const [tab, setTab] = useState(true);

  const toggleTabTable = () => {
    setTab(true);
  };

  const toggleTabCard = () => {
    setTab(false);
  };

  return (
    <Sidebar header={`ตัวละคร`}>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>
              <Link href={'/admin/character/create'}>
                <Button icon={<PiPlusThin size={25} />} />
              </Link>
            </div>

            <div className="flex gap-4">

              <Button condition={tab === true} icon={<PiTableThin size={25} />} onClick={toggleTabTable} />

              <Button condition={tab === false} icon={<PiSquaresFourThin size={25} />} onClick={toggleTabCard} />

              <div className="relative">
                <input type="text" placeholder="ค้นหา"
                  className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
              </div>
            </div>
          </div>

          <div className={`overflow-auto no-scroll-bar`}>
            {tab === true ? (
              <table className={`w-full`}>
                <thead>
                  <tr className={`text-left border-b border-[#176db0]`}>
                    <th>รูปภาพ</th>
                    <th>สลัก</th>
                    <th>ชื่อ</th>
                    <th>นักพากย์</th>
                    <th>บทบาท</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.length > 0 ? (
                    characters.map((character, index) => (
                      <tr key={index} className={`border-b border-[#176db0]`}>
                        <td>
                          <img className={`w-10`} src={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`} alt={`รูปภาพของ ${character?.name}`} />
                        </td>
                        <td>{character?.slug}</td>
                        <td>{character?.name}</td>
                        <td>{character?.voice_actor}</td>
                        <td>{character?.role?.name}</td>
                        <td>
                          <div className={`flex items-center gap-2`}>

                            <div>
                              <Link href={`/admin/character/show/${character.id}`}>
                                <Button icon={<PiEyeThin size={25} />} />
                              </Link>
                            </div>

                            <div>
                              <Link href={`/admin/character/edit/${character.id}`}>
                                <Button icon={<PiPencilThin size={25} />} />
                              </Link>
                            </div>

                            <div>
                              <Button icon={deleting === character.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => deleteCharacter(e, character.id)} />
                            </div>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>ไม่มีข้อมูล</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : tab === false && (
              <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2`}>
                {characters.length > 0 ? (
                  characters.map((character, index) => (
                    <div
                      key={index}
                      className={`overflow-hidden border border-[#176db0] p-[0.1rem] hover:brightness-125`}
                    >
                      <div
                        className={`h-[10rem] relative overflow-hidden bg-cover bg-center group`}
                        style={{
                          backgroundImage: `url('${baseUrl}/images/character/${character?.slug}/${character?.background}')`,
                          backgroundPosition: `top`
                        }}
                      >
                        {character?.image ? (
                          <img
                            className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-105`}
                            src={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`}
                            alt={`รูปภาพของตัวละคร ${character?.name}`}
                          />
                        ) : (
                          <img
                            className={`w-full h-full object-cover`}
                            src={`https://i.imgur.com/epnbr1l.png`}
                            alt={`ไม่มีรูปภาพ`}
                          />
                        )}

                        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                          <GoTriangleDown size={20} className="text-[#176db0] brightness-150" />
                        </div>

                        <div className={`absolute bottom-2 w-full`}>
                          <div className={`mx-auto w-[80%] px-2 border-l-4 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                            {character?.name}
                          </div>
                        </div>

                      </div>

                      <div className={`flex items-center gap-1 justify-between my-1 w-[80%] mx-auto`}>

                        <div>
                          <Link href={`/admin/character/show/${character.id}`}>
                            <Button icon={<PiEyeThin size={25} />} />
                          </Link>
                        </div>

                        <div>
                          <Link href={`/admin/character/edit/${character.id}`}>
                            <Button icon={<PiPencilThin size={25} />} />
                          </Link>
                        </div>

                        <div>
                          <Button icon={deleting === character.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => deleteCharacter(e, character.id)} />
                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                    <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                  </div>
                )}
              </div>

            )}
          </div>

        </div>
      )}
    </Sidebar>
  )
}
