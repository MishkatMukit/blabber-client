import { FaPen } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import MyBlabs from "../../Components/DashboardComponents/MyBlabs";
import { Suspense } from "react";
import Loading from "../../Components/Loader/Loading"
import useMyBlabsAPI from "../../API/UseMyBlabsAPI";

const Dashboard = () => {
  const { dbUser, user } = useAuth()
  const myBlabsPromise = useMyBlabsAPI()
  console.log(myBlabsPromise);
  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 space-y-6 ">

      {/* Profile Panel */}
      <div className="bg-white/10 backdrop-blur-2 border border-white/20 rounded-2xl p-6">

        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="avatar">
            <div className="w-20 rounded-full ring ring-secondary ring-offset-base-200 ring-offset-2">
              <img
                src={
                  dbUser?.photo ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser?.userName}`
                }
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">

            <h2 className="text-2xl font-bold tracking-tight">
              @{dbUser?.userName}
            </h2>

            <p className="text-sm opacity-60">
              {dbUser?.email}
            </p>

            {dbUser?.bio ? (
              <p className="mt-2 text-sm">
                {dbUser?.bio}
              </p>
            ) : (
              <p className="mt-2 text-sm opacity-50 italic">
                No bio yet
              </p>
            )}

            <p className="text-xs opacity-50 mt-2">
              Joined {new Date(dbUser?.createdAt).toDateString()}
            </p>

          </div>

          {/* Edit Button */}
          <button className="btn btn-primary btn-sm gap-2">
            <FaPen />
            Edit
          </button>

        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-6 border-t border-white/20 pt-4">

          {/* <div>
            <p className="text-xl font-semibold">
              {dbUser?.blabsCount}
            </p>
            <p className="text-xs opacity-60">
              Blabs
            </p>
          </div> */}

        </div>

      </div>

      {/* User Blabs Section */}
      <div>

        <h3 className="text-lg font-semibold mb-4 tracking-wide">
          Your Blabs
        </h3>
        <Suspense fallback={<Loading />}>
          {user?.uid && (
            <MyBlabs myBlabsPromise={myBlabsPromise(user.uid)} />
          )}
        </Suspense>
        {/* Map blabs here */}
        {/* <BlabCard /> */}

      </div>

    </div>
  );
};

export default Dashboard;