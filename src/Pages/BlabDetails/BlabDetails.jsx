import { useParams } from "react-router";
import BlabCard from "../../Components/Card/BlabCard";
import useBlabById from "../../API/useBlabById";
import BlabSkeleton from "../../Components/Shared/Skeleton/BlabSkeleton";
import useEchoesAPI from "../../API/useEchoesAPI";
import EchoeCard from "../../Components/Card/EchoeCard";
import TextComposer from "../../Components/Shared/Composer/TextComposer";

const BlabDetails = () => {
    const { id } = useParams()
    const { data: blab = {}, isLoading } = useBlabById(id)
    const { data: echoes = [], isLoading: echoesLoading } = useEchoesAPI(id, !isLoading)
    // console.log(echoes)
    return (
        <div className='pt-16 pb-10 text-white max-w-[95%] md:max-w-3xl mx-auto px-1 md:px-0'>
            <div className="">
                {isLoading ? <BlabSkeleton></BlabSkeleton> : <BlabCard blab={blab}></BlabCard>}
            </div>
            {!isLoading && (
                <div>
                    <h3>Echoes</h3>
                    {/* <div className="divider"></div> */}
                    <div>
                        {
                            echoes.length === 0 && <p className=" text-gray-500 py-2">No echoes yet</p>
                        }
                    </div>
                    <div className="max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 transition-all">
                        <div className="max-w-2xl border-l-3 border-white/10 pl-2 md:pl-6">
                            {echoes.map(echoe => (
                                echoesLoading
                                    ? <BlabSkeleton key={Math.random()}></BlabSkeleton>
                                    : (
                                        <div key={echoe._id} className="relative pl-3 md:pl-6">
                                            {/* horizontal connector */}
                                            <div className="absolute md:-left-6 left-0 top-10  md:w-12 w-6 h-[3px] bg-white/10"></div>

                                            <EchoeCard echoe={echoe} blabId={id} />
                                        </div>
                                    )
                            ))}
                        </div>
                    </div>
                    <div>
                        <TextComposer blabId={id}></TextComposer>
                    </div>

                </div>
            )}

        </div>
    );
};

export default BlabDetails;