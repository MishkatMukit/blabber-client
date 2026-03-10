import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';

const AddBlubs = () => {
    const {dbUser} = useAuth()
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false)
    const maxChars = 500;
    const handleAddBlab=()=>{
        const blab = {
            content : text,
            authorId : dbUser?.fb_uid,
            authorUsername : dbUser?.userName,
        }
        Swal.fire({
                    title: "Are you sure?",
                    text: "proceed to post your new blab!",
                    icon: "warning",
                    color: "white",
                    showCancelButton: true,
                    background: "#111827",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#E11D48",
                    confirmButtonText: "Yes"
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post("http://localhost:3000/blabs", blab).then(res=>console.log(res.data))
                        setText('')
                        Swal.fire({
                            title: "Posted!",
                            text: "Successfully posted your blab!",
                            icon: "success",
                            background: "#111827",
                            color: "white"
                        });
                    }
                });
    }
    return (
        <div className="p-4 rounded-xl space-y-3 my-2 max-w-3xl mx-auto relative pt-20">

            <textarea
                className="textarea textarea-bordered w-full resize-none"
                rows="4"
                placeholder="Start blabbering..."
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
                                height={400}
                                searchDisabled
                                skinTonesDisabled
                                onEmojiClick={emoji=> setText(prev=>prev+ emoji.emoji)}
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
                    className="btn btn-primary"
                    disabled={!text.trim()}
                >
                    Blab
                </button>
                </div>
            </div>

        </div>
    );
};

export default AddBlubs;