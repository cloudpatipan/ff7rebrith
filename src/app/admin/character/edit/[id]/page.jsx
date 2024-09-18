"use client"
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { Button } from '@/components/Button';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/layouts/Sidebar';
import { PiArrowFatLinesRightThin, PiImageThin } from 'react-icons/pi';
import { Textarea } from '@/components/Textarea';
import { Input } from '@/components/Input';
import { UserContext } from '@/context/UserContext';

export default function CharacterEdit() {

  const { token } = useContext(UserContext);

  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [newAvatar, setNewAvatar] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newBackground, setNewBackground] = useState(null);

  const handleAvatarUpload = () => {
    document.getElementById('avatarInput').click();
  };

  const onFileChangeAvatar = (event) => {
    const file = event.target.files[0];
    setNewAvatar(file);
    setCharacterField((prevState) => ({
      ...prevState,
      avatar: file,
    }));
  };

  const handleImageUpload = () => {
    document.getElementById('imageInput').click();
  };

  const onFileChangeImage = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
    setCharacterField((prevState) => ({
      ...prevState,
      image: file,
    }));
  };


  const handleBackgroundUpload = () => {
    document.getElementById('backgroundInput').click();
  };


  const onFileChangeBackground = (event) => {
    const file = event.target.files[0];
    setNewBackground(file);
    setCharacterField((prevState) => ({
      ...prevState,
      background: file,
    }));
  };


  const [error, setError] = useState([]);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          await fetchRole();
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
    }
  }, [id, token]);

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

  const [characterField, setCharacterField] = useState({
    name: '',
    avatar: '',
    image: '',
    voice_actor: '',
    description: '',
    background: '',
    role_id: '',
  });

  const changeCharacterFieldHandler = (e) => {
    setCharacterField({
      ...characterField,
      [e.target.name]: e.target.value
    });
  }


  const fetchCharacter = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/character/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharacterField(data.character)
      } else if (response.status === 400) {
        Swal.fire({
          icon: "success",
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
        text: "มีข้อผิดพลาดกับดึงข้อมูล",
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }


  const onSubmitChange = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', characterField.name);

    if (newAvatar) {
      formData.append('avatar', newAvatar);
    }
    if (newImage) {
      formData.append('image', newImage);
    }
    if (newBackground) {
      formData.append('background', newBackground);
    }

    formData.append('voice_actor', characterField.voice_actor);
    formData.append('description', characterField.description);
    formData.append('role_id', characterField.role_id);

    try {
      const response = await fetch(`${baseUrl}/api/admin/character/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
        setError([]);
        router.push('/admin/character');
      } else if (response.status === 400) {
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 422) {
        setError(data.errors);
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

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Sidebar header={`ตัวละคร (แก้ไข)`}>
          <form onSubmit={onSubmitChange}>

            <div className="flex flex-col gap-4">

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>

                <div>
                  <label>ชื่อตัวละคร</label>
                  <Input
                    type={`text`}
                    name="name"
                    placeholder={`ชื่อตัวละคร`}
                    value={characterField.name} onChange={e => changeCharacterFieldHandler(e)} />
                  {error && error.name && (
                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                      {error.name}
                    </div>
                  )}
                </div>

                <div>
                  <label>ชื่อนักพากย์</label>
                  <Input
                    type={`text`}
                    name="voice_actor"
                    placeholder={`ชื่อนักพากย์`}
                    value={characterField.voice_actor} onChange={e => changeCharacterFieldHandler(e)} />
                  {error && error.voice_actor && (
                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                      {error.voice_actor}
                    </div>
                  )}
                </div>

                <div>
                  <label>รายละเอียด</label>
                  <Textarea
                    type={`text`}
                    name="description"
                    placeholder={`รายละเอียด`}
                    value={characterField.description} onChange={e => changeCharacterFieldHandler(e)} />
                  {error && error.description && (
                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                      {error.description}
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-sm font-semibold mb-2`}>บทบาท</div>
                  <div className="flex gap-2">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <div key={role.id} className="flex gap-2">
                          <input
                            type="radio"
                            name="role_id"
                            value={role.id}
                            id={`role-${role.id}`}
                            checked={Number(characterField.role_id) === Number(role.id)}
                            // checked={parseInt(characterField.role_id) === parseInt(role.id)}
                            onChange={e => changeCharacterFieldHandler(e)}
                            className="accent-[#176db0]"
                          />
                          <label htmlFor={`role-${role.id}`}>{role.name}</label>
                        </div>
                      ))
                    ) : (
                      <div>ไม่มีบทบาท</div>
                    )}
                  </div>

                  {error && error.role_id && (
                    <div className="mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm">
                      {error.role_id}
                    </div>
                  )}
                </div>

                <div>

                  <div>
                    <label>รูปภาพตัวละคร</label>
                    <div className="h-[30rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                      <div
                        className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={handleAvatarUpload}
                      >
                        <div className="flex flex-col items-center text-white text-xl">
                          รูปภาพ
                          <PiImageThin size={40} />
                        </div>
                      </div>
                      {newAvatar ? (
                        <img className={`w-full h-full object-cover`} src={URL.createObjectURL(newAvatar)} alt={`อัพโหลดรูปภาพ`} />
                      ) : characterField.avatar ? (
                        <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${characterField.slug}/${characterField.avatar}`} alt={`รูปภาพของ ${characterField.name}`} />
                      ) : (
                        <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                      )}
                    </div>
                    <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleAvatarUpload} />
                    <input hidden id="avatarInput" type="file" onChange={onFileChangeAvatar} />
                    {error && error.avatar && (
                      <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                        {error.avatar}
                      </div>
                    )}
                  </div>

                </div>

                <div>

                  <div>
                    <label>พื้นหลังตัวละคร</label>
                    <div className="h-[12rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                      <div
                        className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={handleBackgroundUpload}
                      >
                        <div className="flex flex-col items-center text-white text-xl">
                          รูปภาพ
                          <PiImageThin size={40} />
                        </div>
                      </div>
                      {newBackground ? (
                        <img className={`w-full h-full object-cover`} src={URL.createObjectURL(newBackground)} alt={`อัพโหลดรูปภาพ`} />
                      ) : characterField.background ? (
                        <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${characterField.slug}/${characterField.background}`} alt={`รูปภาพของ ${characterField.name}`} />
                      ) : (
                        <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                      )}
                    </div>
                    <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleBackgroundUpload}>
                      <div className={`flex items-center gap-2`}>

                        <label>อัพโหลดรูปภาพ</label>
                      </div>
                    </Button>

                    <input hidden id="backgroundInput" type="file" onChange={onFileChangeBackground} />
                    {error && error.background && (
                      <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                        {error.background}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>รูปภาพเสริมตัวละคร</label>
                    <div className="h-[12rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                      <div
                        className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={handleImageUpload}
                      >
                        <div className="flex flex-col items-center text-white text-xl">
                          รูปภาพ
                          <PiImageThin size={40} />
                        </div>
                      </div>
                      {newImage ? (
                        <img className={`w-full h-full object-cover`} src={URL.createObjectURL(newBackground)} alt={`อัพโหลดรูปภาพ`} />
                      ) : characterField.image ? (
                        <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${characterField.slug}/${characterField.image}`} alt={`รูปภาพของ ${characterField.name}`} />
                      ) : (
                        <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                      )}
                    </div>
                    <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleImageUpload} />

                    <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
                    {error && error.image && (
                      <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                        {error.image}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              <div className="flex items-center justify-end">
                <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
              </div>

            </div>

          </form>
        </Sidebar>

      )}
    </>

  )
}
