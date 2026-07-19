import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { FaPen } from "react-icons/fa";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";
import MyBlabs from "../../Components/DashboardComponents/MyBlabs";
import ProfileSkeleton from "../../Components/Shared/Skeleton/ProfileSkeleton";
import Skeleton from "react-loading-skeleton";
const UserDashboard = () => {
    const { id } = useParams()
    const axiosSecure = useAxiosSecure()
    const { dbUser, user } = useAuth()
    const queryClient = useQueryClient()
    const [showEditBio, setShowEditBio] = useState(false)
    const [editedBio, setEditedBio] = useState("")
    const { data: userBlabs = [], isLoading } = useQuery({
        queryKey: ["userBlabs", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blabs/${id}`)
            return res.data
        }
    })
    const { data: userData = [], isLoading: userDataLoading } = useQuery({
        queryKey: ["userData", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}`)
            return res.data
        }
    })

    return (
        <div className="max-w-[95%] md:max-w-3xl mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-10 space-y-6">
            <Helmet><title>Blabber-Dashboard</title></Helmet>
            <div className="bg-white/10 backdrop-blur-2 border border-white/20 rounded-2xl p-4 md:p-6">
                {userDataLoading ? <ProfileSkeleton></ProfileSkeleton> : <div className="flex items-center gap-4 md:gap-6">
                    <div className="avatar ">
                        <div className="w-12 md:w-20 rounded-full ring ring-secondary ring-offset-base-200 ring-offset-2">
                            <img
                                src={
                                    userData?.photo ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.userName}`
                                }
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className=" md:text-2xl font-bold tracking-tight">
                            @{userData?.userName}
                        </h2>
                        <p className="text-xs md:text-sm opacity-60">
                            {userData?.email}
                        </p>
                        <div className="flex items-start gap-2">
                            {userData?.bio ? (
                                <p className="mt-2 text-xs md:text-sm">
                                    {userData?.bio}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs md:text-sm opacity-50 italic">
                                    No bio yet
                                </p>
                            )}
                            {dbUser?.fb_uid === id && <button onClick={() => setShowEditBio(!showEditBio)} className="bg-primary rounded-xs text-white p-1 mt-2">
                                <FaPen size={8} />
                            </button>}
                        </div>

                        <p className="text-xs opacity-50 mt-2">
                            Joined {new Date(userData?.createdAt).toDateString()}
                        </p>
                    </div>

                </div>
                }

                <div className="flex gap-6 md:gap-10 mt-4 md:mt-6 border-t border-white/20 pt-4">
                    {/* <div>
            <p className="text-xl font-semibold">
              {dbUser?.blabsCount}
            </p>
            <p className="text-xs opacity-60">
              Blabs
            </p>
          </div> */}
                </div>
                {
                    showEditBio && <div className="mt-2">
                        <textarea rows={2} className='w-full mt-2 bg-white/10 rounded-sm p-1' name="editedBio" defaultValue={userData?.bio} onChange={(e) => setEditedBio(e.target.value)} id="" />
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditBio(userData.fb_uid)} className="btn btn-primary btn-xs rounded-xs text-white p-1">Save</button>
                            <button onClick={() => setShowEditBio(!showEditBio)} className="btn btn-primary btn-xs rounded-xs text-white p-1">Cancel</button>
                        </div>
                    </div>
                }
            </div>
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
                            <p className="pb-5 text-sm opacity-50">
                                No blabs yet
                            </p>
                        </div>
                    ) : (
                        <MyBlabs myBlabs={userBlabs} />
                    )
                }
            </div>

        </div>
    );
};

export default UserDashboard;