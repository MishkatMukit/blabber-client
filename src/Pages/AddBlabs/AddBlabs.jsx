import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { Button } from '../../Components/ui/button';
import { Textarea } from '../../Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../Components/ui/dialog';

const AddBlubs = ({ open, onOpenChange }) => {
    const [text, setText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const maxChars = 500;
    const queryClient = useQueryClient()
    const axiosSecure = useAxiosSecure()

    const handleAddBlab = () => {
        const blab = { content: text }
        setIsPosting(true);
        axiosSecure.post("/blabs", blab)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["allBlabs"] })
                queryClient.invalidateQueries({ queryKey: ["myBlabs"] })
                setText('')
                onOpenChange(false)
                toast.success('Blab posted successfully');
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Failed to post blab");
            })
            .finally(() => {
                setIsPosting(false);
            });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Blab</DialogTitle>
                    <DialogDescription>Share what&apos;s on your mind...</DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Textarea
                        className="w-full resize-none"
                        rows="4"
                        placeholder="Start blabbering..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={maxChars}
                    />

                    <div className="mt-2 flex justify-end items-center">
                        <span className="text-xs opacity-70">
                            {text.length}/{maxChars}
                        </span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="ghost"
                        disabled={isPosting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddBlab}
                        disabled={!text.trim() || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Blab'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddBlubs;
