import { FaPen } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MyBlabs from "../../Components/DashboardComponents/MyBlabs"
import Loading from "../../Components/Loader/Loading"
import useMyBlabsAPI from "../../API/UseMyBlabsAPI";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
const Dashboard = () => {
  const [showEditBio, setShowEditBio] = useState(false)
  const { dbUser, user } = useAuth()
  const [editedBio, setEditedBio] = useState(dbUser?.bio || "")
  const { data: myBlabs = [], isLoading } = useMyBlabsAPI()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()
  const handleEditBio = async () => {
    axiosSecure.patch(`/users/updateBio/${dbUser.fb_uid}`, { bio: editedBio })
      .then(res => {
        queryClient.invalidateQueries({ queryKey: ["dbUser"] })
        console.log(res.data)
        setShowEditBio(!showEditBio)
      })

  }
  return (
    <div className="max-w-[95%] md:max-w-3xl mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-10 space-y-6">
      <Helmet><title>Blabber-Dashboard</title></Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-2 border border-white/20 rounded-2xl p-4 md:p-6"
      >

        <div className="flex items-center gap-4 md:gap-6">
          <div className="avatar ">
            <div className="w-12 md:w-20 rounded-full ring ring-secondary ring-offset-base-200 ring-offset-2">
              <img
                src={
                  dbUser?.photo ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser?.userName}`
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className=" md:text-2xl font-bold tracking-tight">
              @{dbUser?.userName}
            </h2>
            <p className="text-xs md:text-sm opacity-60">
              {dbUser?.email}
            </p>
            <div className="flex items-center gap-2">
              <AnimatePresence initial={false} mode="wait">
                {dbUser?.bio ? (
                  <motion.p
                    key={dbUser.bio}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-xs md:text-sm"
                  >
                    {dbUser?.bio}
                  </motion.p>
                ) : (
                  <motion.p
                    key="no-bio"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="mt-2 text-xs md:text-sm italic"
                  >
                    No bio yet
                  </motion.p>
                )}
              </AnimatePresence>
              <button onClick={() => setShowEditBio(!showEditBio)} className="bg-primary rounded-xs text-white p-1 mt-2">
                <FaPen size={8} />
              </button>
            </div>

            <p className="text-xs opacity-50 mt-2">
              Joined {new Date(dbUser?.createdAt).toDateString()}
            </p>
          </div>

        </div>

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
        <AnimatePresence>
          {showEditBio && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
              className="mt-2"
            >
              <textarea
                rows={2}
                className='w-full mt-2 bg-white/10 rounded-sm p-1 border border-white/10 focus:outline-none focus:border-primary/50'
                name="editedBio"
                defaultValue={dbUser?.bio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowEditBio(false)} className="btn btn-secondary btn-xs rounded-xs text-white p-1">Cancel</button>
                <button onClick={() => handleEditBio(dbUser.fb_uid)} className="btn btn-primary btn-xs rounded-xs text-white p-1">Save</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div>
        <h3 className="text-base md:text-lg font-semibold mb-4 mt-6 tracking-wide">
          Your Blabs
        </h3>
        {
          isLoading ? (
            <div>
              {Array.from({ length: 2 }).map((_, i) => (
                <BlabSkeleton key={i} />
              ))}
            </div>
          ) : myBlabs?.length === 0 ? (
            <div>
              <p className="pb-5 text-sm opacity-50">
                No blabs yet
              </p>
            </div>
          ) : (
            <MyBlabs myBlabs={myBlabs} />
          )
        }
      </div>

    </div>
  );
};

export default Dashboard;