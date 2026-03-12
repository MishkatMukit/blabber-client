import React, { use } from 'react';
import { LuHeartHandshake } from 'react-icons/lu';
import { BiCommentDots } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import BlabCard from '../BlabCard/BlabCard';
const MyBlabs = ({myBlabs}) => {
    // const myBlabs = use(myBlabsPromise)
    // console.log(myBlabs);
    return (
        <div>
            {
                myBlabs?.map(blab=>(
                  <BlabCard key={blab._id} blab={blab}> </BlabCard>
                ))
            }

        </div>
    );
};

export default MyBlabs;