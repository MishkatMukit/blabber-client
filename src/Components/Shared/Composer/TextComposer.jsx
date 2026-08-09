import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';

const TextComposer = ({ blabId }) => {

    useAuth()
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false)
    const [isPosting, setIsPosting] = useState(false);
    const maxChars = 500;
    const queryClient = useQueryClient()
    const axiosSecure = useAxiosSecure()
    const handleAddBlab = async () => {
        const echoe = { blabId, content: text };
        setIsPosting(true);
        try {
            await axiosSecure.post("/echo", echoe);
            toast.success('Echo posted successfully');
            queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
            queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
            queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
            setText('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post echo');
        } finally {
            setIsPosting(false);
        }
    }
    return (
        <div className=" rounded-xl space-y-3 max-w-2xl relative ">
            <Textarea
                className="w-full resize-none"
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

                    <Button
                        onClick={handleAddBlab}
                        size="sm"
                        disabled={!text.trim() || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Echo'}
                    </Button>
                </div>
            </div>

        </div>
    )
};

export default TextComposer;