import { Link } from 'react-router';
import { Button } from '../ui/button';

const CTASection = () => {
    return (
        <section className="px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-14 md:px-12 text-center">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/10 blur-3xl"
                    />

                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="mx-auto mb-6 text-primary"
                    >
                        <rect x="15" y="12" width="14" height="11" rx="4.5" fill="#9A3412" />
                        <rect x="3" y="4" width="19" height="16" rx="6" fill="currentColor" />
                        <path d="M10 20h7l-3.5 5Z" fill="currentColor" />
                    </svg>

                    <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                        Your next conversation
                        <br className="hidden md:block" />
                        <span className="text-primary"> is one blab away</span>
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-base-content/70 max-w-md mx-auto">
                        Join the community, share what\u2019s on your mind, and
                        see where the echoes take it.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="px-8">
                            <Link to="/register">Get started</Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg">
                            <Link to="/allBlabs">Explore blabs</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
