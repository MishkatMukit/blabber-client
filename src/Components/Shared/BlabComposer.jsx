import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";

const BlabComposer = () => {
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false)
    const maxChars = 500;

    return (
        <div className="p-4 rounded-xl space-y-3 my-2 max-w-3xl mx-auto relative">

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

                    <span className="text-sm opacity-70">
                        {text.length}/{maxChars}
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    disabled={!text.trim()}
                >
                    Blab
                </button>
            </div>

        </div>
    );
};

export default BlabComposer;