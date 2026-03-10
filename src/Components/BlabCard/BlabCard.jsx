
import { use } from "react";
import { BiCommentDots } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { LuHeartHandshake } from "react-icons/lu";
import { PiHandsClapping } from "react-icons/pi";

const BlabCard = ({ allBlabsPromise }) => {
  const blabs = use(allBlabsPromise)
  return (
    <div className="max-w-4xl mx-auto">
      {
        blabs?.map(blab => (
          <div key={blab._id} className=" max-w-[90%] mx-auto bg-white/8 backdrop-blur-2 p-4 my-4 border border-white/20 shadow-lg rounded-sm transition">

            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${blab.authorUsername}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="font-semibold">@{blab.authorUsername}</p>
                <p className="text-xs opacity-60">
                  {new Date(blab.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Content */}
            <p className="leading-relaxed mb-4 text-base">
              {blab.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 text-sm opacity-80">

              <button className="flex items-center gap-1 hover:text-primary transition">
                <LuHeartHandshake size={18}/>
                {blab.applauseCount}
              </button>

              <button className="flex items-center gap-1 hover:text-primary transition">
                <BiCommentDots size={18} />
                {blab.echoesCount}
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default BlabCard;