import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BiCommentDots, BiEdit } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import useApplause from '../../Hooks/useApplause';
import useAuth from '../../Hooks/useAuth';
import { IoMdBookmark } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router';
import { RiDeleteBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { HiDotsHorizontal } from 'react-icons/hi';
import axiosPublic from '../../Hooks/useAxiosPublic';
const BlabCard = ({ blab, page }) => {
    const [showEdit, setShowEdit] = useState(false)
    const [editedText, setEditedText] = useState(blab?.content)
    const { user } = useAuth()
    const { mutate: applauseBlab, isPending } = useApplause(page)
    const initialApplauded = blab?.applause?.includes(user?.uid)
    const [isApplauded, setIsApplauded] = useState(initialApplauded);
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    useEffect(() => {
        if (user && blab?.applause) {
            setIsApplauded(blab.applause.includes(user.uid));
        }
    }, [user, blab]);
    const notify = () => toast("Please login or register to give applause");
    const handleApplause = () => {
        if (!user) {
            notify()
            return
        }

        // instant UI update
        setIsApplauded((prev) => !prev);

        // mutation runs in background
        applauseBlab(blab._id);
    };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Blab?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            background: "#111827",
            color: "white",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#E11D48",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        const res = await axiosSecure.delete(`/blabs/delete/${id}`);
        if (res.data.success) {
            await queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
            await queryClient.invalidateQueries({ queryKey: ["myBlabs"] });
            await Swal.fire({
                color: "white",
                title: "Deleted!",
                text: "Your blab has been deleted.",
                icon: "success"
            });
            navigate('/allblabs');
        }
    }
    const handleEditBlab = async (id) => {
        const updatedBlab = {
            content: editedText
        }
        axiosPublic.patch(`/editedBlab/${id}`, updatedBlab).then(async res => {
            setShowEdit(false)
            await queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
            // console.log(res.data)
        })
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div key={blab._id} className="bg-white/8 backdrop-blur-2 p-3 md:p-4 my-3 md:my-4 border border-white/20 shadow-lg rounded-sm transition">
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


                            <img title='visit profile'
                                onClick={() => navigate(`/UserDashboard/${blab.authorId}`)}
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${blab.authorUsername}`}
                                alt="avatar"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-sm md:text-base">@{blab.authorUsername}</p>
                                <p className="text-xs opacity-60">
                                    {new Date(blab.createdAt).toLocaleString()}
                                </p>
                            </div>


                        </div>
                        <div>
                            {
                                user?.uid === blab?.authorId && <div className="dropdown dropdown-end md:dropdown-right">
                                    <button tabIndex={0} role="button" className="cursor-pointer"><HiDotsHorizontal className='text-xl' /></button>
                                    <ul tabIndex="-1" className="dropdown-content menu bg-black/30 rounded-box z-1 ml-5 w-24 p-1 shadow-sm">
                                        <li onClick={() => setShowEdit(!showEdit)}><a>Edit <BiEdit></BiEdit></a></li>
                                        <li onClick={() => handleDelete(blab._id)}><a>Delete<RiDeleteBackLine /></a></li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence initial={false} mode="wait">
                        <motion.p
                            key={blab.content}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="leading-relaxed mb-3 md:mb-4 text-sm md:text-base wrap-break-word"
                        >
                            {blab.content}
                        </motion.p>
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex justify-between items-center gap-6 text-sm ">

                        <div className='flex items-center gap-6 text-sm '>
                            <div className="flex items-center gap-1 ">
                                <button

                                    disabled={isPending}
                                    onClick={handleApplause}
                                    className={`cursor-pointer transition ${isApplauded ? "text-primary" : ""}`}
                                >
                                    <FaHeart size={18} />
                                </button>
                                {/* <LuHeartHandshake  size={18}/> */}
                                {/* fill='#E11D48' */}
                                {blab.applauseCount}
                            </div>

                            <Link to={`/blabdetails/${blab._id}`} className='flex items-center gap-1 cursor-pointer hover:text-primary transition'>
                                <BiCommentDots size={18} />
                                {blab.echoesCount}
                            </Link>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showEdit && (
                            <motion.div
                                key="edit-panel"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <h2 className='text-xs divider'>Edit Blab</h2>
                                <textarea rows={3} className='w-full mt-2 bg-white/10 rounded-sm p-1' name="editedEcho" defaultValue={blab?.content} onChange={(e) => setEditedText(e.target.value)} id="" />
                                <div className='flex gap-1  justify-end'>
                                    <button onClick={() => setShowEdit(false)} className=' btn btn-xs btn-secondary'>Cancel </button>
                                    <button onClick={() => handleEditBlab(blab._id)} className=' btn btn-xs btn-primary'>Update</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BlabCard;