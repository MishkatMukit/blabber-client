import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { FaHeart } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth';
import { toast } from 'react-toastify';
import useApplauseEchoe from '../../Hooks/useApplauseEchoe';
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { RiDeleteBackLine } from 'react-icons/ri';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
const EchoeCard = ({ echoe, blabId }) => {
    const queryClient = useQueryClient()
    const [showEdit, setShowEdit] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [editedText, setEditedText] = useState(echoe?.content)
    const [isUpdating, setIsUpdating] = useState(false);
    const { dbUser } = useAuth()
    const { mutate: applauseEchoe, isPending } = useApplauseEchoe()
    const axiosSecure = useAxiosSecure();
    const handleApplause = () => {
        applauseEchoe({ echoId: echoe.id, blabId });
    };
    const handleEditEcho = async (id, blabId) => {
        const updatedEcho = {
            content: editedText
        }
        setIsUpdating(true);
        try {
            await axiosSecure.patch(`/echo/${id}`, updatedEcho);
            setShowEdit(false);
            // toast.success('Echo updated successfully');
            await queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update echo');
        } finally {
            setIsUpdating(false);
        }
    }
    const handleDeleteEcho = async (id, blabId) => {
        setDeleting(true);
        try {
            await axiosSecure.delete(`/echo/${id}`);
            setShowDeleteConfirm(false);
            await queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
            await queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
            await queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        } catch {
            toast.error('Failed to delete echo');
        } finally {
            setDeleting(false);
        }
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div key={echoe.id} className="bg-white/8 backdrop-blur-2 p-3 md:p-4 my-3 md:my-4 border border-white/20 shadow-lg rounded-sm transition">
                    <div className='flex justify-between'>
                        {/* Author */}
                        <div className="flex relative items-center gap-3 mb-3">
                            <img
                                src={echoe.author?.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${echoe.author?.userName}`}
                                alt="avatar"
                                className="w-8 h-8   rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-xs">{echoe.author?.userName}</p>
                                <p className="text-xs opacity-60">
                                    {new Date(echoe.createdAt).toLocaleString()}
                                </p>
                            </div>


                        </div>
                        <div className=" text-sm ">

                            <div className='flex items-center gap-6 text-sm '>

                                <div>
                                    {
                                        (dbUser?.id === echoe?.author?.id) && <div className="dropdown dropdown-end md:dropdown-right">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                aria-label="Echo options menu"
                                                aria-expanded={showEdit}
                                                className=""
                                            >
                                                <HiDotsHorizontal className='text-lg' />
                                            </div>
                                            <ul
                                                tabIndex="-1"
                                                className="dropdown-content menu bg-black/30 rounded-box z-1 ml-5 w-24 p-1 shadow-sm"
                                                role="menu"
                                            >
                                                <li role="menuitem" onClick={() => setShowEdit(!showEdit)}><a>Edit <BiEdit aria-hidden="true"></BiEdit></a></li>
                                                <li role="menuitem" onClick={() => setShowDeleteConfirm(true)}><a>Delete<RiDeleteBackLine aria-hidden="true" /></a></li>
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between items-end'>
                        {/* Content */}
                        <AnimatePresence initial={false} mode="wait">
                            <motion.p
                                key={echoe.content}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="leading-relaxed text-sm"
                            >
                                {echoe.content}
                            </motion.p>
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ">
                            <button
                                disabled={isPending}
                                onClick={handleApplause}
                                className={`cursor-pointer transition ${echoe?.applauded ? "text-primary" : "hover:text-primary"
                                    }`}
                            >
                                <FaHeart size={14} />
                            </button>
                            {/* <LuHeartHandshake  size={18}/> */}
                            {/* fill='#E11D48' */}
                            <p className='text-sm'>{echoe._count?.applause ?? 0}</p>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showEdit && (
                            <motion.div
                                key="echoe-edit-panel"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <h2 className='text-xs divider'>Edit Echoe</h2>
                                <Textarea rows={2} className="mt-2" name="editedEcho" defaultValue={echoe?.content} onChange={(e) => setEditedText(e.target.value)} id="" />
                                <div className='flex gap-1 justify-end'>
                                    <Button onClick={() => setShowEdit(false)} variant="ghost" size="sm">Cancel</Button>
                                    <Button onClick={() => handleEditEcho(echoe.id, echoe.blabId)} disabled={isUpdating} size="sm">{isUpdating ? 'Updating...' : 'Update'}</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Echo?</DialogTitle>
                                <DialogDescription>This action cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDeleteEcho(echoe.id, blabId)} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EchoeCard;