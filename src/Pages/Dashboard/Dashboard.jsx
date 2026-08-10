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
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Textarea } from "../../Components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "../../Components/ui/avatar";
import { SquarePen } from "lucide-react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import { formatJoinedDate } from "../../lib/utils";
const Dashboard = () => {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false);
  const { dbUser, setDbuser } = useAuth()
  const [editedBio, setEditedBio] = useState(dbUser?.bio || "")
  const [editedPhoto, setEditedPhoto] = useState(dbUser?.photo || "")
  const [editedUserName, setEditedUserName] = useState(dbUser?.userName || "")
  const [photoFile, setPhotoFile] = useState(null)
  const { data: myBlabs = [], isLoading } = useMyBlabsAPI()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    setEditedBio(dbUser?.bio || "")
    setEditedPhoto(dbUser?.photo || "")
    setEditedUserName(dbUser?.userName || "")
  }, [dbUser])

  const handleEditProfile = async () => {
    setIsUpdating(true);
    try {
      let profilePhoto = editedPhoto;
      if (photoFile) {
        profilePhoto = await uploadImageToCloudinary(photoFile);
      }

      const payload = {
        userName: editedUserName,
        bio: editedBio,
        profilePhoto,
      };

      const response = await axiosSecure.patch(`/auth/profile`, payload);
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ["dbUser"] });
      setDbuser((prev) => ({
        ...prev,
        userName: response.data?.data?.userName ?? prev?.userName,
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
        <Card className="rounded-2xl p-0 relative">
          <CardContent className="p-4 md:p-6">
            <Button
              onClick={() => setShowEditProfile(!showEditProfile)}
              variant="ghost"
              size="icon"
              aria-label={showEditProfile ? "Cancel editing profile" : "Edit profile"}
              className="absolute top-3 right-3 md:top-4 md:right-4"
            >
              <SquarePen className="size-4" />
            </Button>
            <div className="flex items-center gap-4 md:gap-6">
              <Avatar className="size-12 md:size-20 ring-2 ring-ring ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={
                    dbUser?.photo ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser?.userName}`
                  }
                  alt={`${dbUser?.userName}'s avatar`}
                />
                <AvatarFallback>
                  {(dbUser?.userName || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className=" md:text-2xl font-bold tracking-tight">
                  {dbUser?.userName}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
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
                          animate={{ opacity: 1 }}
                          className="mt-2 text-xs md:text-sm italic text-muted-foreground"
                        >
                          No bio yet
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {formatJoinedDate(dbUser?.createdAt) && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Joined {formatJoinedDate(dbUser?.createdAt)}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex gap-6 md:gap-10 mt-4 md:mt-6 border-t border-border pt-4">
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
                  <Textarea
                    rows={2}
                    className="mt-2"
                    name="editedBio"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Update your bio"
                  />
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="edited-username">User name</Label>
                    <Input
                      id="edited-username"
                      type="text"
                      className="mt-2"
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                      placeholder="Update your user name"
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="profile-photo">Profile photo</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-photo')?.click()}
                      >
                        Choose file
                      </Button>
                      <Input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          setPhotoFile(e.target.files?.[0] || null);
                          if (e.target.files?.[0]) {
                            setEditedPhoto(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                      {photoFile && (
                        <span className="text-xs text-muted-foreground">{photoFile.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button onClick={() => setShowEditProfile(false)} variant="ghost" size="sm">Cancel</Button>
                    <Button onClick={handleEditProfile} disabled={isUpdating} size="sm">{isUpdating ? 'Saving...' : 'Save'}</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="rounded-2xl p-0">
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
              <p className="pb-5 text-sm text-muted-foreground">
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
