import Lottie from "lottie-react";
import loadingAnimation from "../../assets/Loading.json"

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">

      <div className="w-40 md:w-62">
        <Lottie animationData={loadingAnimation} loop />
      </div>

    </div>
  );
};

export default Loading;