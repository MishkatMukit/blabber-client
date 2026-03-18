import React, { useEffect, useState } from 'react';
import { BiCommentDots, BiEdit } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import useApplause from '../../Hooks/useApplause';
import useAuth from '../../Hooks/useAuth';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoMdBookmark } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router';
const BlabCard = ({ blab }) => {

    const { user } = useAuth()
    const { mutate: applauseBlab } = useApplause()
    const initialApplauded = blab?.applause?.includes(user?.uid)
    const [isApplauded, setIsApplauded] = useState(initialApplauded);
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
    return (
        <div>
            <div key={blab._id} className=" bg-white/8 backdrop-blur-2 p-4 my-4 border border-white/20 shadow-lg rounded-sm transition">
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
                {/* Author */}
                <div className="flex relative items-center gap-3 mb-3">


                    <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${blab.authorUsername}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-semibold">@{blab.authorUsername}</p>
                        <p className="text-xs opacity-60">
                            {new Date(blab.createdAt).toLocaleString()}
                        </p>
                    </div>


                </div>

                {/* Content */}
                <p className="leading-relaxed mb-4 text-base">
                    {blab.content}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center gap-6 text-sm ">

                    <div className='flex items-center gap-6 text-sm '>
                        <div className="flex items-center gap-1 ">
                            <button
                                onClick={handleApplause}
                                className={`cursor-pointer transition ${isApplauded ? "text-primary" : "hover:text-primary"
                                    }`}
                            >
                                <FaHeart size={18} />
                            </button>
                            {/* <LuHeartHandshake  size={18}/> */}
                            {/* fill='#E11D48' */}
                            {blab.applauseCount}
                        </div>

                        <div className="flex items-center gap-1 ">
                            <Link to={`/blabdetails/${blab._id}`} className='cursor-pointer hover:text-primary transition'><BiCommentDots size={18} /></Link>
                            {blab.echoesCount}

                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button><IoMdBookmark size={20} /></button>
                        {
                            user && <button><FiEdit size={16} /></button>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BlabCard;