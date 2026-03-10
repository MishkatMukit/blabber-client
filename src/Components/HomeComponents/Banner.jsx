import React from 'react';
import { easeInOut, motion } from "motion/react"
import { Link } from 'react-router';

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

                    <div className="flex flex-col items-center sm:flex-row gap-4 md:justify-start justify-center">
                        <Link to="/addBlabs" className="btn btn-primary px-8">
                            Start Blabbering
                        </Link>
                        <Link to="/allBlabs" className='btn btn-outline hover:bg-transparent hover:border-primary border-2 shadow-none hover:text-primary'>Browse Blabs</Link>
                        
                    </div>
                </div>

                {/* RIGHT SIDE – FEED PREVIEW */}
                <div className="relative w-full max-w-xl mx-auto">

                    {/* Post 1 */}
                    <motion.div animate={{ x: [20, 0, 20] }}
                        transition={{ duration: 8, repeat: Infinity, ease: easeInOut }}
                        className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg">
                        <div className="flex justify-between text-sm text-base-content/60 mb-2">
                            <span>#tech</span>
                            <span>12 echoes</span>
                        </div>
                        <h3 className="font-semibold  text-lg mb-1">
                            Why do devs keep old projects forever?
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Because deleting them feels like deleting memories.
                        </p>
                    </motion.div>

                    {/* Post 2 */}
                    <motion.div
                        animate={{ x: [-30, 0, -30] }}
                        transition={{ duration: 7.5, repeat: Infinity, ease: easeInOut }}
                        className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg mt-4 ml-6">
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
                    </motion.div>

                    {/* Post 3 */}
                    <motion.div
                        animate={{ x: [0, 30, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: easeInOut }}
                        className="p-5 rounded-2xl bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-lg mt-4 -ml-4">
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
                    </motion.div>

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