import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Navigate, useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FaPen } from "react-icons/fa";
import { Send } from "lucide-react";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";
import MyBlabs from "../../Components/DashboardComponents/MyBlabs";
import ProfileSkeleton from "../../Components/Shared/Skeleton/ProfileSkeleton";
import Skeleton from "react-loading-skeleton";
import { Card, CardContent } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../Components/ui/avatar";
import { formatJoinedDate } from "../../lib/utils";
const UserDashboard = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const axiosSecure = useAxiosSecure()
    const { dbUser } = useAuth()
    const [showEditBio, setShowEditBio] = useState(false)
    const { data: userBlabs = [], isLoading } = useQuery({
        queryKey: ["userBlabs", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}/blabs`)
            return res.data.data
        }
    })
    const { data: userData = null, isLoading: userDataLoading, isError: userDataError } = useQuery({
        queryKey: ["userData", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}`)
            return res.data.data
        }
    })
    const handleStartChat = async () => {
        try {
            // create conversation (or get existing one) via REST
            const res = await axiosSecure.post('/conversations', {
                recipientId: id  // id comes from useParams — the profile we're viewing
            });
            const conversation = {
                ...res.data.data,
                otherUser: {
                    id: userData?.id,
                    userName: userData?.userName,
                    photo: userData?.photo
                }
            }
            // redirect to chat page with this conversation already selected
            navigate('/chat', { state: { conversation } });
        } catch {
            toast.error("Couldn't start chat. Something went wrong opening a conversation. Please try again.");
        }
    };

    // visiting your own profile redirects to the dashboard
    if (dbUser?.id === id) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="max-w-[95%] md:max-w-3xl mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-10 space-y-6">
            <Helmet><title>{userData?.userName ? `${userData.userName} | Blabber` : "Blabber"}</title></Helmet>
            <Card className="rounded-2xl p-0">
                <CardContent className="p-4 md:p-6">
                {userDataError ? (
                    <div className="py-10 text-center space-y-4">
                        <p className="text-muted-foreground">User not found.</p>
                        <Button onClick={() => navigate("/allBlabs")} variant="outline" size="sm">Back to Blabs</Button>
                    </div>
                ) : userDataLoading ? <ProfileSkeleton></ProfileSkeleton> : <div className="flex items-center gap-4 md:gap-6">
                    <Avatar className="size-12 md:size-20 ring-2 ring-ring ring-offset-2 ring-offset-background">
                        <AvatarImage
                            src={
                                userData?.photo ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.userName}`
                            }
                            alt={`${userData?.userName}'s avatar`}
                        />
                        <AvatarFallback>
                            {(userData?.userName || "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className=" md:text-2xl font-bold tracking-tight">
                            {userData?.userName}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {userData?.email}
                        </p>
                        <div className="flex items-start gap-2">
                            {userData?.bio ? (
                                <p className="mt-2 text-xs md:text-sm">
                                    {userData?.bio}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs md:text-sm text-muted-foreground italic">
                                    No bio yet
                                </p>
                            )}

                            {dbUser?.id === id && <Button onClick={() => setShowEditBio(!showEditBio)} variant="ghost" size="icon" aria-label="Edit bio" className="size-6 mt-2">
                                <FaPen className="size-3" />
                            </Button>}
                        </div>

                        {formatJoinedDate(userData?.createdAt) && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Joined {formatJoinedDate(userData?.createdAt)}
                            </p>
                        )}
                    </div>
                    {/* only show Message button on OTHER people's profiles, not your own */}
                    {dbUser && dbUser?.id !== id && (
                        <Button
                            onClick={handleStartChat}
                            size="sm"
                            className="px-3 sm:px-4"
                        >
                            <Send />
                            <span className="hidden sm:inline">Message</span>
                        </Button>
                    )}

                </div>
                }

                <div className="flex gap-6 md:gap-10 mt-4 md:mt-6 border-t border-border pt-4">
                    <div>
                        <p className="text-xl font-semibold">{userBlabs.length}</p>
                        <p className="text-xs text-muted-foreground">Blabs</p>
                    </div>
                </div>
                {
                    showEditBio && <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Profile editing is not available in the new API yet.</p>
                        <Button onClick={() => setShowEditBio(false)} variant="secondary" size="sm" className="mt-2">Close</Button>
                    </div>
                }
                </CardContent>
            </Card>
            {!userDataError && (
            <div>
                <h3 className="text-base md:text-lg font-semibold mb-4 mt-6 tracking-wide">
                    {userDataLoading ? <Skeleton height={15} width={220} baseColor="#4E4F5450" highlightColor="#2C2F36" /> : userData?.userName + "'s Blabs"}
                </h3>
                {
                    isLoading ? (
                        <div>
                            {Array.from({ length: 2 }).map((_, i) => (
                                <BlabSkeleton key={i} />
                            ))}
                        </div>
                    ) : userBlabs?.length === 0 ? (
                        <div>
                            <p className="pb-5 text-sm text-muted-foreground">
                                No blabs yet
                            </p>
                        </div>
                    ) : (
                        <MyBlabs myBlabs={userBlabs} />
                    )
                }
            </div>
            )}

        </div>
    );
};

export default UserDashboard;