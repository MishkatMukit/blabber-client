import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { BiCommentDots, BiEdit } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import useApplause from '../../Hooks/useApplause';
import useAuth from '../../Hooks/useAuth';
import { IoMdBookmark } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router';
import { RiDeleteBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
const BlabCard = ({ blab, page }) => {
    const [showEdit, setShowEdit] = useState(false)
    const [editedText, setEditedText] = useState(blab?.content)
    const [, setIsUpdating] = useState(false);
    const { user, dbUser } = useAuth()
    const { mutate: applauseBlab, isPending } = useApplause(page)
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const notify = () => toast("Please login or register to give applause");
    const handleApplause = () => {
        if (!user) {
            notify()
            return
        }

        applauseBlab(blab.id);
    };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Blab?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            background: "#111827",
            color: "white",
            confirmButtonColor: "#EA580C",
            cancelButtonColor: "#E11D48",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        const res = await axiosSecure.delete(`/blabs/${id}`);
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
        setIsUpdating(true);
        try {
            await axiosSecure.patch(`/blabs/${id}`, updatedBlab);
            setShowEdit(false);
            toast.success('Blab updated successfully');
            await queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
            await queryClient.invalidateQueries({ queryKey: ["myBlabs"] });

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update blab');
        } finally {
            setIsUpdating(false);
        }
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div key={blab.id} className="bg-white/8 backdrop-blur-2 p-3 md:p-4 my-3 md:my-4 border border-white/20 shadow-lg rounded-sm transition">
                    <div className='flex justify-between'>
                        {/* Author */}
                        <div className="flex relative items-center gap-3 mb-3">


                            <img title='visit profile'
                                onClick={() => navigate(`/UserDashboard/${blab.author?.id}`)}
                                src={blab.author?.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${blab.author?.userName}`}
                                alt="avatar"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-sm md:text-base">@{blab.author?.userName}</p>
                                <p className="text-xs opacity-60">
                                    {new Date(blab.createdAt).toLocaleString()}
                                </p>
                            </div>


                        </div>
                        <div>
                            {
                                dbUser?.id === blab?.author?.id && <div className="dropdown dropdown-end md:dropdown-right">
                                    <button 
                                        tabIndex={0} 
                                        role="button" 
                                        aria-label="Blab options menu"
                                        aria-expanded={showEdit}
                                        className="cursor-pointer"
                                    >
                                        <HiDotsHorizontal className='text-xl' />
                                    </button>
                                    <ul 
                                        tabIndex="-1" 
                                        className="dropdown-content menu bg-black/30 rounded-box z-1 ml-5 w-24 p-1 shadow-sm"
                                        role="menu"
                                    >
                                        <li role="menuitem" onClick={() => setShowEdit(!showEdit)}><a>Edit <BiEdit aria-hidden="true"></BiEdit></a></li>
                                        <li role="menuitem" onClick={() => handleDelete(blab.id)}><a>Delete<RiDeleteBackLine aria-hidden="true" /></a></li>
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
                                    aria-label={blab?.applauded ? "Remove applause from this blab" : "Give applause to this blab"}
                                    className={`cursor-pointer transition ${blab?.applauded ? "text-primary" : ""}`}
                                >
                                    <FaHeart size={18} />
                                </button>
                                {/* <LuHeartHandshake  size={18}/> */}
                                {/* fill='#E11D48' */}
                                {blab._count?.applause ?? 0}
                            </div>

                            <Link to={`/blabdetails/${blab.id}`} className='flex items-center gap-1 cursor-pointer hover:text-primary transition' aria-label={`View ${blab._count?.echoes ?? 0} echoes for this blab`}>
                                <BiCommentDots size={18} />
                                {blab._count?.echoes ?? 0}
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
                                <Textarea rows={3} className="mt-2" name="editedEcho" defaultValue={blab?.content} onChange={(e) => setEditedText(e.target.value)} id="" />
                                <div className='flex gap-1  justify-end'>
                                    <Button onClick={() => setShowEdit(false)} variant="ghost" size="sm">Cancel</Button>
                                    <Button onClick={() => handleEditBlab(blab.id)} size="sm">Update</Button>
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