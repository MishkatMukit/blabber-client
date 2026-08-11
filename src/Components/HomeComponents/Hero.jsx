import { Link } from 'react-router';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Button } from '../ui/button';

const bubbleData = [
    {
        tag: '#tech',
        echoes: '12 echoes',
        title: 'Why do devs keep old projects forever?',
        body: 'Because deleting them feels like deleting memories.',
        className: 'md:translate-x-0',
    },
    {
        tag: '#random',
        echoes: '5 echoes',
        title: 'What\u2019s your weird productivity habit?',
        body: 'I open 20 tabs so I feel busy even when I\u2019m not.',
        className: 'md:ml-10',
    },
    {
        tag: '#devlife',
        echoes: '21 echoes',
        title: 'Morning coding or night coding?',
        body: 'Night coding hits different. Fewer distractions, more chaos.',
        className: 'md:-ml-4',
    },
];

const Hero = () => {
    return (
        <section className="relative overflow-hidden px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-24">
            {/* soft brand glow, background plane only */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[480px] rounded-full bg-primary/10 blur-3xl"
            />

            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Copy */}
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
                        <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect x="15" y="12" width="14" height="11" rx="4.5" fill="#9A3412" />
                            <rect x="3" y="4" width="19" height="16" rx="6" fill="currentColor" />
                            <path d="M10 20h7l-3.5 5Z" fill="currentColor" />
                        </svg>
                        Less lurking, more talking
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                        Share thoughts,
                        <br />
                        <span className="text-primary">join conversations.</span>
                    </h1>

                    <p className="mt-6 text-base md:text-lg text-base-content/70 max-w-lg mx-auto lg:mx-0">
                        Blabber is where quick thoughts turn into real
                        conversations. Post a blab, get echoes back.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                        <Button asChild size="lg" className="px-8">
                            <Link to="/allBlabs">Start Blabbering</Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg" className="text-base-content/80">
                            <Link to="/register">Create an account</Link>
                        </Button>
                    </div>
                </div>

                {/* Live feed preview */}
                <div className="relative w-full max-w-xl mx-auto">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -m-6 rounded-3xl border border-white/5"
                    />
                    <div className="relative space-y-4">
                        {bubbleData.map((b, i) => (
                            <motion.article
                                key={b.tag}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.15 + i * 0.12,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                className={`p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg ${b.className}`}
                            >
                                <div className="flex justify-between text-xs text-base-content/60 mb-2">
                                    <span className="text-primary">{b.tag}</span>
                                    <span>{b.echoes}</span>
                                </div>
                                <h3 className="font-semibold text-base mb-1">{b.title}</h3>
                                <p className="text-sm text-base-content/70">{b.body}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
