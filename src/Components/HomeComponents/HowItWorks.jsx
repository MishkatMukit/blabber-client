import { Link } from 'react-router';

const steps = [
    {
        n: '01',
        title: 'Post a blab',
        body: 'Drop a thought, question, or hot take. No walls of text needed.',
    },
    {
        n: '02',
        title: 'Get echoes',
        body: 'People reply to your blab with short echoes, keeping the loop moving.',
    },
    {
        n: '03',
        title: 'Give applause',
        body: 'Liked something? Applaud it so the good blabs rise to the top.',
    },
];

const HowItWorks = () => {
    return (
        <section className="px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                        How it works
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Blab, echo, applaud
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.n}
                            className="border-t border-white/10 pt-6"
                        >
                            <p className="text-sm font-semibold text-primary mb-3">
                                {step.n}
                            </p>
                            <h3 className="text-lg font-semibold mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-base-content/70 leading-relaxed">
                                {step.body}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/register"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Create a free account →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
