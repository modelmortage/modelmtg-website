import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Meet Our Team | Model Mortgage Houston',
    description: 'Meet the elite team behind Houston\'s most prestigious institutional residential lending. Matthew Bramow and Rolston Nicholls lead Model Mortgage.',
    keywords: 'Model Mortgage team, Matthew Bramow, Rolston Nicholls, Houston mortgage brokers, mortgage team',
    openGraph: {
        title: 'Meet Our Team | Model Mortgage Houston',
        description: 'Meet the elite team behind Houston\'s most prestigious institutional residential lending.',
        type: 'website',
    },
    alternates: {
        canonical: '/meet-our-team',
    },
}

export default function MeetOurTeamPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#f9f9f8] pt-28 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-8 mb-12">
                    <div className="flex flex-col md:flex-row items-start gap-16">
                        <div className="flex-1">
                            <span className="text-[#c5a059] font-bold uppercase tracking-[0.2em] mb-4 block text-xs">
                                Our People
                            </span>
                            <h1 className="font-serif text-5xl md:text-6xl text-[#1a1a1a] leading-tight mb-6">
                                Meet the Team
                            </h1>
                            <div className="w-0.5 h-12 bg-[#c5a059]"></div>
                        </div>
                        <div className="flex-1 pt-10">
                            <p className="text-[#6b6b6b] text-lg md:text-xl font-light leading-relaxed">
                                Based in the heart of Houston, our team blends deep financial heritage with modern precision to guide you through every step of your homeownership journey.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Profiles Grid */}
                <section className="max-w-7xl mx-auto px-8 space-y-20">
                    {/* Matthew Bramow */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Left: image + nameplate stacked */}
                        <div>
                            <div className="overflow-hidden rounded-lg bg-[#e8e8e8] w-full" style={{ height: '480px' }}>
                                <Image
                                    src="/matthew-bramow.png"
                                    alt="Professional portrait of Matthew Bramow"
                                    width={500}
                                    height={480}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    style={{ objectPosition: 'center 15%' }}
                                />
                            </div>
                            <div className="mt-4 bg-white p-5 shadow border border-[#e0e0e0] rounded-md inline-block">
                                <span className="text-[#c5a059] font-bold text-[10px] tracking-widest uppercase mb-1 block">
                                    Founding Partner
                                </span>
                                <h2 className="font-serif text-2xl text-[#1a1a1a] mb-0.5">Matthew Bramow</h2>
                                <p className="text-xs text-[#888888]">NMLS #1373388</p>
                            </div>
                        </div>
                        {/* Right: bio */}
                        <div>
                            <h3 className="font-serif text-xl text-[#1a1a1a] mb-4 italic">Strategic Loan Management</h3>
                            <p className="text-[#6b6b6b] leading-relaxed mb-6 text-base">
                                With over 15 years of experience in the Houston mortgage landscape, Matthew specializes in navigating complex financial profiles for high-net-worth individuals and first-time buyers alike.
                            </p>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">Jumbo & Conventional Financing</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">Refinancing Strategy</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">Houston Market Specialist</span>
                                </div>
                            </div>
                            <Link
                                href="/matthew-bramow"
                                className="text-xs font-bold text-[#c5a059] uppercase tracking-widest border-b-2 border-[#c5a059]/20 pb-1 hover:border-[#c5a059] transition-all inline-block"
                            >
                                View Full Profile
                            </Link>
                        </div>
                    </div>

                    {/* Rolston Nicholls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Right: image + nameplate (reversed on desktop) */}
                        <div className="md:order-2">
                            <div className="overflow-hidden rounded-lg bg-[#e8e8e8] w-full" style={{ height: '480px' }}>
                                <Image
                                    src="/rolston-nicholls.png"
                                    alt="Professional portrait of Rolston Nicholls"
                                    width={500}
                                    height={480}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    style={{ objectPosition: 'center 15%' }}
                                />
                            </div>
                            <div className="mt-4 bg-white p-5 shadow border border-[#e0e0e0] rounded-md inline-block">
                                <span className="text-[#c5a059] font-bold text-[10px] tracking-widest uppercase mb-1 block">
                                    Senior Loan Officer
                                </span>
                                <h2 className="font-serif text-2xl text-[#1a1a1a] mb-0.5">Rolston Nicholls</h2>
                                <p className="text-xs text-[#888888]">NMLS #2516810</p>
                            </div>
                        </div>
                        {/* Left: bio */}
                        <div className="md:order-1">
                            <h3 className="font-serif text-xl text-[#1a1a1a] mb-4 italic">The Precision Architect</h3>
                            <p className="text-[#6b6b6b] leading-relaxed mb-6 text-base">
                                Rolston is renowned for his meticulous attention to detail and his ability to structure loans that others find impossible. His client-first approach has earned him a top-tier reputation in Texas.
                            </p>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">Investment Property Portfolio</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">FHA & VA Loan Expert</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c5a059] text-lg">✓</span>
                                    <span className="text-sm text-[#1a1a1a]">Rate Lock Optimization</span>
                                </div>
                            </div>
                            <Link
                                href="/rolston-nicholls"
                                className="text-xs font-bold text-[#c5a059] uppercase tracking-widest border-b-2 border-[#c5a059]/20 pb-1 hover:border-[#c5a059] transition-all inline-block"
                            >
                                View Full Profile
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact CTA Section */}
                <section className="mt-32 max-w-7xl mx-auto px-8">
                    <div className="bg-[#f3f3f1] p-12 md:p-16 rounded-lg flex flex-col items-center text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-6">
                            Ready to start your journey?
                        </h2>
                        <p className="text-[#6b6b6b] max-w-2xl text-base mb-10">
                            Our team is available for one-on-one consultations to discuss your unique financial goals and property aspirations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/schedule-a-call"
                                className="bg-[#c5a059] text-white px-8 py-3 rounded-md text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#b08f4a] transition-colors"
                            >
                                Schedule Consultation
                            </Link>
                            <Link 
                                href="/contact"
                                className="bg-transparent text-[#c5a059] px-8 py-3 rounded-md text-xs font-bold uppercase tracking-[0.15em] border border-[#c5a059]/30 hover:bg-white transition-colors"
                            >
                                Call (832) 727-4128
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
