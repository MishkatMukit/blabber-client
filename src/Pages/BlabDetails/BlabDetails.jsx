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
                    <div className="max-h-[450px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 transition-all">
                        <div className="max-w-2xl border-l-2 border-white/10">
                            {echoesLoading ? (
                                <div>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={`echo-skeleton-${i}`} className="relative pl-4 md:pl-8">
                                            <div className="absolute left-0 top-10 w-4 md:w-8 h-[2px] bg-white/10"></div>
                                            <BlabSkeleton />
                                        </div>
                                    ))}
                                </div>
                            ) : echoes.length === 0 ? (
                                <p className="text-muted-foreground py-3">No echoes yet</p>
                            ) : (
                                echoes.map(echoe => (
                                    <div key={echoe.id} className="relative pl-4 md:pl-8">
                                        <div className="absolute left-0 top-10 w-4 md:w-8 h-[2px] bg-white/10"></div>
                                        <EchoeCard echoe={echoe} blabId={id} />
                                    </div>
                                ))
                            )}
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