import useAuth from "../../Hooks/useAuth";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import MyBlabs from "../../Components/DashboardComponents/MyBlabs"
import useMyBlabsAPI from "../../API/UseMyBlabsAPI";
import 'react-loading-skeleton/dist/skeleton.css'
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../Components/ui/card";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
const Dashboard = () => {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false);
  const { dbUser, setDbuser } = useAuth()
  const [editedBio, setEditedBio] = useState(dbUser?.bio || "")
  const [editedPhoto, setEditedPhoto] = useState(dbUser?.photo || "")
  const [photoFile, setPhotoFile] = useState(null)
  const { data: myBlabs = [], isLoading } = useMyBlabsAPI()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    setEditedBio(dbUser?.bio || "")
    setEditedPhoto(dbUser?.photo || "")
  }, [dbUser])

  const handleEditProfile = async () => {
    setIsUpdating(true);
    try {
      let profilePhoto = editedPhoto;
      if (photoFile) {
        profilePhoto = await uploadImageToCloudinary(photoFile);
      }

      const payload = {
        bio: editedBio,
        profilePhoto,
      };

      const response = await axiosSecure.patch(`/auth/profile`, payload);
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ["dbUser"] });
      setDbuser((prev) => ({
        ...prev,
        bio: response.data?.data?.bio ?? prev?.bio,
        photo: response.data?.data?.photo ?? prev?.photo,
      }));
      setShowEditProfile(false);
      setPhotoFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  }
  return (
    <div className="max-w-[95%] md:max-w-3xl mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-10 space-y-6">
      <Helmet><title>Blabber-Dashboard</title></Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="bg-white/10 backdrop-blur-2 border-white/20 rounded-2xl p-0">
          <CardContent className="p-4 md:p-6">
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
                <div className="space-y-3">
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
                  <button onClick={() => setShowEditProfile(!showEditProfile)} className="btn btn-primary btn-xs rounded-xs text-white">
                    {showEditProfile ? 'Cancel Edit' : 'Edit Profile'}
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
              {showEditProfile && (
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
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Update your bio"
                  />
                        <div className="mt-3">
                    <label className="block text-sm font-medium text-muted-foreground">Profile photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className='w-full mt-2 bg-white/10 rounded-sm p-1 border border-white/10 focus:outline-none focus:border-primary/50 file:mr-2 file:rounded-sm file:border-0 file:bg-primary file:text-white file:px-3 file:py-1 file:text-xs'
                      onChange={(e) => {
                        setPhotoFile(e.target.files?.[0] || null);
                        if (e.target.files?.[0]) {
                          setEditedPhoto(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                    {photoFile && (
                      <p className="text-xs opacity-60 mt-1">{photoFile.name}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setShowEditProfile(false)} className="btn btn-secondary btn-xs rounded-xs text-white p-1">Cancel</button>
                    <button onClick={handleEditProfile} disabled={isUpdating} className="btn btn-primary btn-xs rounded-xs text-white p-1">{isUpdating ? 'Saving...' : 'Save'}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="bg-white/10 border-white/20 rounded-2xl p-0">
        <CardHeader className="px-4 md:px-6 pt-4">
          <CardTitle>Your Blabs</CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            Latest posts from your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4">
          {isLoading ? (
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
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
