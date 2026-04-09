import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import useApplause from '../../Hooks/useApplause';
import useAuth from '../../Hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import useApplauseEchoe from '../../Hooks/useApplauseEchoe';
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { RiDeleteBackLine } from 'react-icons/ri';
import axiosPublic from '../../Hooks/useAxiosPublic';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
const EchoeCard = ({ echoe, blabId, page }) => {
    const queryClient = useQueryClient()
    const [showEdit, setShowEdit] = useState(false)
    const [editedText, setEditedText] = useState("")
    const { user } = useAuth()
    const { mutate: applauseEchoe, isPending } = useApplauseEchoe()
    const initialApplauded = echoe?.applause?.includes(user?.uid)
    const [isApplauded, setIsApplauded] = useState(initialApplauded);
    useEffect(() => {
        if (user && echoe?.applause) {
            setIsApplauded(echoe.applause.includes(user.uid));
        }
    }, [user, echoe]);
    const handleApplause = () => {
        // instant UI update
        setIsApplauded((prev) => !prev);
        // mutation runs in background
        applauseEchoe({ echoId: echoe._id, blabId });
    };
    const handleEditEcho = async (id, blabId) => {
        const updatedEcho = {
            content: editedText
        }
        axiosPublic.patch(`/editedEcho/${id}`, updatedEcho).then(async res => {
            setShowEdit(false)
            await queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
            // console.log(res.data)
        })
    }
    const handleDeleteEcho = async (id, blabId) => {
        const result = await Swal.fire({
            title: 'Delete Echo?',
            text: 'This action cannot be undone.',
            color: "white",
            icon: 'warning',
            showCancelButton: true,
            background: "#111827",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#E11D48",
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/deleteEcho/${id}`);
                await queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
                await queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
                await queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete echo.', 'error');
            }
        }
    }
    return (
        <div>
            <div key={echoe._id} className="bg-white/8 backdrop-blur-2 p-3 md:p-4 my-3 md:my-4 border border-white/20 shadow-lg rounded-sm transition">
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="dark"
                    toastClassName="bg-white/20  border border-white/10 text-white rounded-xl shadow-lg"
                    bodyClassName="text-sm font-medium"
                    closeButton={false}
                />
                <div className='flex justify-between'>
                    {/* Author */}
                    <div className="flex relative items-center gap-3 mb-3">
                        <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${echoe?.authorUserName}`}
                            alt="avatar"
                            className="w-8 h-8   rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-xs">@{echoe.authorUserName}</p>
                            <p className="text-xs opacity-60">
                                {new Date(echoe.createdAt).toLocaleString()}
                            </p>
                        </div>


                    </div>
                    <div className=" text-sm ">

                        <div className='flex items-center gap-6 text-sm '>

                            <div>
                                {
                                    (user?.uid === echoe?.authorId) && <div className="dropdown dropdown-end md:dropdown-right">
                                        <div tabIndex={0} role="button" className=""><HiDotsHorizontal className='text-lg' /></div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-black/30 rounded-box z-1 ml-5 w-24 p-1 shadow-sm">
                                            <li onClick={() => setShowEdit(!showEdit)}><a>Edit <BiEdit></BiEdit></a></li>
                                            <li onClick={() => handleDeleteEcho(echoe._id, echoe.blabId)}><a>Delete<RiDeleteBackLine /></a></li>
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-end'>
                    {/* Content */}
                    <p className="leading-relaxed text-sm">
                        {echoe.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ">
                        <button
                            disabled={isPending}
                            onClick={handleApplause}
                            className={`cursor-pointer transition ${isApplauded ? "text-primary" : "hover:text-primary"
                                }`}
                        >
                            <FaHeart size={14} />
                        </button>
                        {/* <LuHeartHandshake  size={18}/> */}
                        {/* fill='#E11D48' */}
                        <p className='text-sm'>{echoe.applauseCount}</p>
                    </div>
                </div>
                {
                    showEdit && <div>
                        <h2 className='text-xs divider'>Edit Echoe</h2>
                        <textarea rows={2} className='w-full mt-2 bg-white/10 rounded-sm p-1' name="editedEcho" defaultValue={echoe?.content} onChange={(e) => setEditedText(e.target.value)} id="" />
                        <div className='flex gap-1  justify-end'>
                            <button onClick={() => setShowEdit(false)} className=' btn btn-xs btn-secondary'>Cancel </button>
                            <button onClick={() => handleEditEcho(echoe._id, echoe.blabId)} className=' btn btn-xs btn-primary'>Update </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default EchoeCard;