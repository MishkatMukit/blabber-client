import { useParams } from "react-router";
import BlabCard from "../../Components/BlabCard/BlabCard";
import useBlabById from "../../API/useBlabById";
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";

const BlabDetails = () => {
    const { id } = useParams()
    const { data: blab = {}, isLoading } = useBlabById(id)
    console.log(blab)
    return (
        <div className='pt-16 text-white max-w-[95%] mx-auto'>
            <div className="max-w-3xl mx-auto">
                {isLoading ? <BlabSkeleton></BlabSkeleton> : <BlabCard blab={blab}></BlabCard>}
            </div>

        </div>
    );
};

export default BlabDetails;