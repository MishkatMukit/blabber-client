import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 md:gap-6">
                {/* Avatar */}
                <div className="w-12 md:w-20 h-12 md:h-20 shrink-0">
                    <Skeleton
                        circle
                        height="100%"
                        width="100%"
                        baseColor="#4E4F5450"
                        highlightColor="#2C2F36"
                    />
                </div>

                {/* User info */}
                <div className="flex-1 space-y-2">
                    <Skeleton height={20} width="40%" baseColor="#4E4F5450" highlightColor="#2C2F36" />
                    <Skeleton height={12} width="60%" baseColor="#4E4F5450" highlightColor="#2C2F36" />

                    <div className="mt-2">
                        <Skeleton height={10} width="100%" baseColor="#4E4F5450" highlightColor="#2C2F36" />
                        <Skeleton height={10} width="80%" baseColor="#4E4F5450" highlightColor="#2C2F36" />
                    </div>

                    <Skeleton height={10} width={150} baseColor="#4E4F5450" highlightColor="#2C2F36" />
                </div>
            </div>

            {/* Divider + stats */}
            {/* <div className="flex gap-6 md:gap-10 mt-4 md:mt-6 border-t border-white/20 pt-4">
                <div>
                    <Skeleton height={20} width={40} baseColor="#4E4F5450" highlightColor="#2C2F36" />
                    <Skeleton height={12} width={60} baseColor="#4E4F5450" highlightColor="#2C2F36" />
                </div>
            </div> */}
        </div>
    );
};

export default ProfileSkeleton;