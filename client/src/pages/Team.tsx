import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

import codyHeadshot from "../../../attached_assets/COdy_in_Library_2_1769807534796.png";
import bryceHeadshot from "../../../attached_assets/Bryce_Headshot_3_1769806381148.jpg";
import craigHeadshot from "../../../attached_assets/Gemini_Generated_Image_mvxfawmvxfawmvxf_1769809064307.png";

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

const teamMembers = [
  {
    id: "cody",
    name: "Cody Willard",
    title: "Portfolio Manager",
    photo: codyHeadshot,
    photoRight: false,
    link: "/about/leadership",
    bio: (
      <>
        Cody Willard founded 10,000 Days Capital Management in 2019, bringing over 30 years of Wall Street
        experience to the firm. Starting as an analyst at Oppenheimer and the first partner to famed
        stockbroker Andrew Lanyi, Cody later became a Fox Business anchor and on-air partner to Larry
        Kudlow on CNBC. His insights have been featured in <em>The Wall Street Journal</em>, <em>Financial Times</em>,
        <em> Barron&apos;s</em>, and <em>MarketWatch</em>.
      </>
    ),
  },
  {
    id: "bryce",
    name: "Bryce Smith",
    title: "Analyst / Attorney",
    photo: bryceHeadshot,
    photoRight: true,
    bio: (
      <>
        Bryce Smith leverages over ten years of portfolio management experience backed by a strong foundation
        in corporate law and economics. A magna cum laude graduate of Baylor Law School, his professional
        background includes corporate litigation, oil &amp; gas regulation, and project management for major
        public works. When not analyzing markets, Bryce can be found competitively team roping or working on
        his ranch in rural New Mexico.
      </>
    ),
  },
  {
    id: "craig",
    name: "Craig Delaune",
    title: "Research & Operations Associate",
    photo: craigHeadshot,
    photoRight: false,
    bio: (
      <>
        A graduate from the University of New Orleans, Craig Delaune brings prior experience from a GE joint
        venture during a major expansion cycle. A distinct achiever, he helped lead the UNO team to a 3rd
        place finish in Portfolio Performance at the 2024 Student Managed Investment Fund Competition. Craig
        Delaune is currently preparing for the CFA examinations with a specialized focus on equity research.
        In his downtime, he is an avid traveler, PC enthusiast, and connoisseur of fine wine.
      </>
    ),
  },
];

function TeamMemberRow({ member, index }: { member: (typeof teamMembers)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  const photoBlock = (
    <div className="md:w-[30%] flex-shrink-0">
      <div
        className="overflow-hidden"
        data-testid={`card-team-${member.id}-headshot`}
      >
        {member.link ? (
          <Link href={member.link} className="block" data-testid={`link-team-${member.id}-image`}>
            <img
              src={member.photo}
              alt={member.name}
              className="w-full aspect-[3/4] object-cover transition-all duration-700 ease-out"
              style={{
                filter: hovered ? "grayscale(0)" : "grayscale(1)",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
              data-testid={`img-team-${member.id}`}
            />
          </Link>
        ) : (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full aspect-[3/4] object-cover transition-all duration-700 ease-out"
            style={{
              filter: hovered ? "grayscale(0)" : "grayscale(1)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
            data-testid={`img-team-${member.id}`}
          />
        )}
      </div>
    </div>
  );

  const textBlock = (
    <div className="flex-1 flex flex-col justify-center">
      {member.link ? (
        <Link
          href={member.link}
          className="hover:opacity-80 transition-opacity"
          data-testid={`link-team-${member.id}-name`}
        >
          <h2
            className="font-display text-4xl md:text-5xl text-primary leading-tight"
            data-testid={`text-team-${member.id}-name`}
          >
            {member.name}
          </h2>
        </Link>
      ) : (
        <h2
          className="font-display text-4xl md:text-5xl text-primary leading-tight"
          data-testid={`text-team-${member.id}-name`}
        >
          {member.name}
        </h2>
      )}
      <div
        className="w-16 h-[2px] my-5"
        style={{ backgroundColor: "#C5A059" }}
      />
      <p
        className="text-sm text-secondary uppercase tracking-widest font-bold mb-6"
        data-testid={`text-team-${member.id}-role`}
      >
        {member.title}
      </p>
      <p
        className="text-muted-foreground leading-relaxed text-lg"
        data-testid={`text-team-${member.id}-bio`}
      >
        {member.bio}
      </p>
    </div>
  );

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className="py-16"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`card-team-${member.id}`}
    >
      <div className={`flex flex-col md:flex-row gap-12 md:gap-16 items-center ${member.photoRight ? "md:flex-row-reverse" : ""}`}>
        {photoBlock}
        {textBlock}
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm"
                data-testid="text-team-kicker"
              >
                Our People
              </div>
              <h1
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-team-title"
              >
                Investment Team
              </h1>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="divide-y divide-border">
              {teamMembers.map((member, i) => (
                <TeamMemberRow key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#001F3F]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <Link
                href="/about/leadership"
                className="inline-block border-2 border-white text-white font-display text-lg uppercase tracking-widest px-12 py-5 hover:bg-white hover:text-[#C5A059] transition-all duration-500"
                data-testid="link-journey-leadership"
              >
                Learn more about our Portfolio Manager, Cody Willard
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
