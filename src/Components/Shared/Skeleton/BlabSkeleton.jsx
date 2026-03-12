import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlabSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 my-4  rounded-sm transition">

      {/* Author */}
      <div className="flex items-center gap-3 mb-3">

        <Skeleton
          circle
          width={40}
          height={40}
          baseColor="#1F2128"
          highlightColor="#2C2F36"
        />

        <div className="flex flex-col gap-1">
          <Skeleton
            width={120}
            height={14}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
          <Skeleton
            width={90}
            height={10}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
        </div>

      </div>

      {/* Content */}
      <div className="mb-4">
        <Skeleton
          count={1}
          height={16}
          baseColor="#1F2128"
          highlightColor="#2C2F36"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-1">
          <Skeleton
            width={18}
            height={18}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
          <Skeleton
            width={20}
            height={12}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
        </div>

        <div className="flex items-center gap-1">
          <Skeleton
            width={18}
            height={18}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
          <Skeleton
            width={20}
            height={12}
            baseColor="#1F2128"
            highlightColor="#2C2F36"
          />
        </div>

      </div>

    </div>
  );
};

export default BlabSkeleton;