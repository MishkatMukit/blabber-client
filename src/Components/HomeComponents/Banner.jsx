import React from 'react';

const Banner = () => {
    return (
        <section className="min-h-[70vh] flex items-center px-6 py-16">
            <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">

                {/* LEFT SIDE */}
                <div className=" font-soratext-center md:text-left">
                    <h1 className=" text-4xl md:text-6xl font-jersey tracking-wide mb-6">
                        Blabber
                    </h1>

                    <p className="text-lg md:text-xl text-base-content/70 mb-8 max-w-lg">
                        Less lurking, more talking.
                        Share thoughts, join conversations, and build communities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                        <button className="btn bg-rose-600 px-8">
                            Start Blabbering
                        </button>
                        <button className="btn btn-ghost">
                            Browse Blabs
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE – FEED PREVIEW */}
                <div className="relative w-full max-w-xl mx-auto">

                    {/* Post 1 */}
                    <div className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg">
                        <div className="flex justify-between text-sm text-base-content/60 mb-2">
                            <span>#tech</span>
                            <span>12 echoes</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                            Why do devs keep old projects forever?
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Because deleting them feels like deleting memories.
                        </p>
                    </div>

                    {/* Post 2 */}
                    <div className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg mt-4 ml-6">
                        <div className="flex justify-between text-sm text-base-content/60 mb-2">
                            <span>#random</span>
                            <span>5 echoes</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                            What’s your weird productivity habit?
                        </h3>
                        <p className="text-sm text-base-content/70">
                            I open 20 tabs so I feel busy even when I’m not.
                        </p>
                    </div>

                    {/* Post 3 */}
                    <div className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg mt-4 -ml-4">
                        <div className="flex justify-between text-sm text-base-content/60 mb-2">
                            <span>#devlife</span>
                            <span>21 echoes</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                            Morning coding or night coding?
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Night coding hits different. Fewer distractions, more chaos.
                        </p>
                    </div>

                </div>

            </div>
        </section>
        // <div className='max-w-[95%] mx-auto hero min-h-[500px]'>
        //     <div>
        //         <h1>Blabber- Less lurking, more talking</h1>
        //     </div>
        //     <div>

        //     </div>
        // </div>
    );
};

export default Banner;