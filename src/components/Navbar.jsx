"use client";
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import { UserContext } from '@/context/UserContext';
import { Button } from './Button';
import { Modal } from './Modal';
import { Login } from '@/components/auth/login/page';
import { Register } from '@/components/auth/register/page';
import baseUrl from '@/service/BaseUrl';
import Swal from 'sweetalert2';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown } from './Dropdown';
import { PiHeartThin, PiPlusThin } from 'react-icons/pi';
import { CiLogin, CiUser } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';

export function Navbar() {
  const router = useRouter();
  const { user, setUser, token, setToken } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);
  const [isModalOpenRegister, setIsModalOpenRegister] = useState(false);

  const menus = [
    { name: "หน้าหลัก", link: "/" },
    { name: "โลก", link: "/world" },
    { name: "ตัวละคร", link: "/character" },
    { name: "แบทเทิล", link: "/battle" },
    { name: "คอมมิวนิตี้", link: "/community" },
  ];

  const submitLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        router.push('/');
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setToken(null);
        closeModalLogin();
      } else if (response.status === 400) {
        Swal.fire({
          icon: "warning",
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

  useEffect(() => {
    if (token) {
      fetchFavorite();
    }
  }, []);

  const [favorite, setFavorite] = useState();

  const fetchFavorite = async () => {
    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setFavorite(data.favorites);
      } else if (data.status === 401) {
        Swal.fire({
          icon: 'error',
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModalLogin = () => {
    setIsModalOpenLogin(true);
  };

  const closeModalLogin = () => {
    setIsModalOpenLogin(false);
  };

  const openModalRegister = () => {
    setIsModalOpenRegister(true);
  };

  const closeModalRegister = () => {
    setIsModalOpenRegister(false);
  };

  const pathname = usePathname();


  return (
    <nav className={`p-0 md:p-4`}>
      <div className={`hidden md:flex justify-between items-center`}>

        <div className={`hidden md:flex items-center gap-4`}>
          {menus?.map((menu, index) => (
            <Link href={menu?.link} key={index + 1}>
              <Button name={menu?.name} condition={menu?.link === pathname} className={`px-8 group`} />
            </Link>
          ))}

        </div>

        <div className={`hidden md:flex items-center gap-4`}>
          {token ? (
            <>
              <Link href={`/favorite`}>
                <div className={`relative hover:brightness-150 p-[0.2rem]`}>
                  {favorite && (
                    favorite.length > 0 && (
                      <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                        {favorite.length}
                      </div>
                    )
                  )}
                  <Button condition={'/favorite' === pathname} icon={<PiHeartThin size={25} />} />
                </div>
              </Link>


              <Dropdown
                header={
                  <div className="w-[2.5rem] h-[2.5rem] border border-[#176db0] p-[0.1rem] overflow-hidden">
                    {user?.avatar ? (
                      <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของ ${user?.name}`} />
                    ) : (
                      <img className="w-full h-full object-cover" src="https://i.imgur.com/ubMG1L9.png" alt={`รูปภาพของ ${user?.name}`} />
                    )}
                  </div>
                }
              >
                <div className="flex flex-col gap-1">
                  <Button name={user?.name} className="w-full" />

                  {user?.role === 1 && (
                    <Link href={`/admin/dashboard`}>
                      <Button name="แอดมิน" className="w-full" />
                    </Link>
                  )}

                  <Link href={`/profile`}>
                    <Button name="โปรไฟล์" className="w-full" />
                  </Link>

                  <Button name="ออกจากระบบ" className="w-full" onClick={submitLogout} />
                </div>
              </Dropdown>

            </>
          ) : (
            <>
              <Button icon={<CiLogin size={25} />} name={`เข้าสู่ระบบ`} onClick={openModalLogin} />
              <Button icon={<PiPlusThin size={25} />} name={`สมัครสมาชิก`} onClick={openModalRegister} />

              <Modal className={'p-8'} isOpen={isModalOpenLogin} onClose={closeModalLogin}>
                <Login />
              </Modal>


              <Modal className={'p-8'} isOpen={isModalOpenRegister} onClose={closeModalRegister}>
                <Register />
              </Modal>

            </>
          )}
        </div>

      </div>


      <div className={`flex fixed z-20 top-2 right-2 gap-4 md:hidden`}>

        {token && user && (
          <>
            <Link href={`/favorite`}>
              <div className={`relative outline outline-offset-2 outline-1 outline-[#10538c]`}>
                {favorite && (
                  favorite.length > 0 && (
                    <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                      {favorite.length}
                    </div>
                  )
                )}
                <Button className="w-[2.5rem] h-[2.5rem]" condition={'/favorite' === pathname} icon={<PiHeartThin size={25} />} />
              </div>
            </Link>

            <Dropdown
              header={
                <div className={`h-[2.5rem] w-[2.5rem] bg-gradient-to-t from-[#003668] to-[#005e95] outline outline-offset-2 outline-1 outline-[#10538c] overflow-hidden`}>
                  {user?.avatar ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของ ${user?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://i.imgur.com/ubMG1L9.png`} alt={`รูปภาพของ ${user?.name}`} />
                  )}
                </div>
              }
            >

              <div className="flex flex-col gap-1">
                <Button name={user?.name} className="w-full" />

                {user?.role === 1 && (
                  <Link href={`/admin/dashboard`}>
                    <Button name="แอดมิน" className="w-full" />
                  </Link>
                )}

                <Link href={`/profile`}>
                  <Button name="โปรไฟล์" className="w-full" />
                </Link>

                <Button name="ออกจากระบบ" className="w-full" onClick={submitLogout} />
              </div>

            </Dropdown>
          </>
        )}

        <div onClick={toggleMenu}>
          <button className={`h-[2.5rem] w-[2.5rem] flex items-center justify-center text-white bg-cover bg-[#5e0a0a] outline outline-offset-2 outline-1 outline-[#d70000]`}>
            {isMenuOpen ? <IoCloseOutline size={25} /> : <RxHamburgerMenu size={25} />}
          </button>
        </div>

      </div>
      <>
        <div className={`md:hidden fixed z-10 bg-[#021c3f]/90 flex justify-center items-center top-0 left-0 h-full w-full transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-[80%] flex gap-2 flex-col">
            {menus?.map((menu, index) => (
              <Link className={`w-full`} href={menu?.link} key={index + 1}>
                <Button name={menu?.name} condition={menu?.link === pathname} className={`w-full`} />
              </Link>
            ))}

            {!token && !user && (
              <>
                <Button icon={<CiLogin size={25} />} onClick={openModalLogin} />

                <Button icon={<CiUser size={25} />} onClick={openModalRegister} />

                <Modal className={'p-8'} isOpen={isModalOpenLogin} onClose={closeModalLogin}>
                  <Login />
                </Modal>


                <Modal className={'p-8'} isOpen={isModalOpenRegister} onClose={closeModalRegister}>
                  <Register />
                </Modal>
              </>
            )}
          </div>
        </div>
      </>

    </nav>
  );
}
