"use client";
import { Button } from '@/components/Button';
import { UserContext } from '@/context/UserContext';
import { Sidebar } from '@/layouts/Sidebar'
import baseUrl from '@/service/BaseUrl';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { PiEyeThin, PiPencil, PiPencilThin, PiPlusThin, PiTrashThin } from 'react-icons/pi';
import Swal from 'sweetalert2';

export default function RoleIndex() {

  const { token } = useContext(UserContext);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (token) {
      fetchRole();
    }
  }, [token]);

  const fetchRole = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles);
        setLoading(false);
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

  const deleteRole = async (e, id) => {
    e.preventDefault();
    setDeleting(id);

    try {
      const response = await fetch(`${baseUrl}/api/admin/role/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        setRoles(prev => prev.filter(role => role.id !== id));
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
    <Sidebar header={`บทบาท`}>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">

            <div>
              <Link href={'/admin/role/create'}>
                <Button icon={<PiPlusThin size={25} />} onClick={toggleTabCard} />
              </Link>
            </div>

            <div>
              <table className={`w-full`}>
                <thead>
                  <tr className={`text-left border-b border-[#176db0]`}>
                    <th>รหัส</th>
                    <th>สลัก</th>
                    <th>ชื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map((role, index) => (
                      <tr key={index} className={`border-b border-[#176db0]`}>
                        <td>{role?.id}</td>
                        <td>{role?.slug}</td>
                        <td>{role?.name}</td>
                        <td>
                          <div className={`flex items-center gap-2`}>

                            <Link href={`/admin/role/show/${role.id}`}>
                              <Button icon={<PiEyeThin size={25} />} />
                            </Link>

                            <Link href={`/admin/role/edit/${role.id}/`}>
                              <Button icon={<PiPencilThin size={25} />} />
                            </Link>

                            <Button icon={deleting === role.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => deleteRole(e, role.id)} />
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
            </div>

          </div>
        </>
      )}
    </Sidebar>
  )
}
