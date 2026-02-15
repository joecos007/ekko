export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg text-neutral-400">
                    <p>Last updated: February 14, 2026</p>
                    <p>Your privacy is important to us. It is Ekko&apos;s policy to respect your privacy regarding any information we may collect from you across our website, https://ekko.ai, and other sites we own and operate.</p>
                    <h3>1. Information We Collect</h3>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                    <h3>2. Usage of AI Data</h3>
                    <p>When you use our generative tools, we may analyze your inputs to improve our models. However, we anonymize this data and do not use personal identifiers in our training sets.</p>
                    <h3>3. Audio Fingerprinting</h3>
                    <p>We use audio fingerprinting technology to identify copyright claims and ensure proper attribution for artists on our platform.</p>
                    <p>We generally retain collected information for as long as necessary to provide you with your requested service.</p>
                </div>
            </div>
        </div>
    );
}
