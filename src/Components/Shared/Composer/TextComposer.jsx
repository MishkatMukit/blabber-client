import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';
import axiosPublic from '../../../Hooks/useAxiosPublic';

const TextComposer = ({ blabId }) => {

    const { dbUser, setDbUser } = useAuth()
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false)
    const maxChars = 500;
    const queryClient = useQueryClient()
    const handleAddBlab = async () => {
        const echoe = {
            blabId,
            content: text,
            authorId: dbUser?.fb_uid,
            authorUsername: dbUser?.userName,
        };
        await axiosPublic.post("/blabs/echoes", echoe);
        queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
        queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
        setText('');
    }
    return (
        <div className=" rounded-xl space-y-3 max-w-2xl relative ">
            <textarea
                className="textarea textarea-bordered w-full resize-none"
                rows="2"
                placeholder="Create echo..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={maxChars}
            />

            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center ">

                    <div>
                        <button
                            type="button"
                            onClick={() => setShowEmoji(!showEmoji)}
                        >
                            <MdOutlineEmojiEmotions size={20} />
                        </button>


                        <div className="absolute z-10">
                            {
                                showEmoji && <EmojiPicker
                                    theme="dark"
                                    height={350}
                                    width={280}
                                    searchDisabled
                                    skinTonesDisabled
                                    onEmojiClick={emoji => setText(prev => prev + emoji.emoji)}
                                />
                            }
                        </div>
                    </div>


                </div>
                <div className='flex gap-2 items-center'>
                    <span className="text-sm opacity-70">
                        {text.length}/{maxChars}
                    </span>

                    <button
                        onClick={handleAddBlab}
                        className="btn btn-sm md:btn-md btn-primary"
                        disabled={!text.trim()}
                    >
                        Echo
                    </button>
                </div>
            </div>

        </div>
    )
};

export default TextComposer;