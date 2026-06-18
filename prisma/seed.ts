import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  const existing = await prisma.admin.count();
  if (existing > 0) {
    console.log("Already seeded — skipping.");
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      email: "admin@jobboard.demo",
      passwordHash: await bcrypt.hash("Admin1234", 12),
      name: "Site Admin",
    },
  });

  const listings = [
    {
      title: "Head of Product",
      company: "Flutterwave",
      location: "Lagos, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Lead product strategy and execution for Africa's leading payments company. Own the product roadmap, work closely with engineering and design, and define the vision for our core payments infrastructure across 34 African markets. You will manage a team of 8 product managers and report directly to the CPO.",
      requirements:
        "5+ years of product management experience, 2+ years in a leadership role. Experience in fintech or payments strongly preferred. Proven track record of launching products at scale. Excellent analytical and communication skills. MBA or equivalent experience preferred.",
      salaryMin: 800_000,
      salaryMax: 1_200_000,
      contactEmail: "careers@flutterwave.com",
      postDate: daysAgo(2),
    },
    {
      title: "Senior Backend Engineer",
      company: "Andela",
      location: "Remote (Africa)",
      type: "REMOTE" as const,
      description:
        "Join Andela's engineering team to build the talent-matching infrastructure connecting African engineers with global technology companies. You will design and implement scalable APIs, own critical microservices, and collaborate with distributed teams across multiple time zones.",
      requirements:
        "4+ years backend development experience. Strong proficiency in Node.js, Python, or Go. Experience with microservices and REST APIs. PostgreSQL and Redis required. AWS or GCP certification a plus.",
      salaryMin: 900_000,
      salaryMax: 1_400_000,
      contactEmail: "talent@andela.com",
      postDate: daysAgo(4),
    },
    {
      title: "Senior UX Designer",
      company: "Paystack",
      location: "Lagos, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Design intuitive, world-class payment experiences used by over 200,000 businesses across Africa. You will lead end-to-end design for our merchant dashboard and checkout flows, conduct user research, and collaborate with product and engineering to ship high-impact features.",
      requirements:
        "4+ years UX design experience. Strong portfolio demonstrating complex product design. Proficiency in Figma and user research methodologies. Experience designing for mobile and web. Background in fintech or SaaS a plus.",
      salaryMin: 600_000,
      salaryMax: 900_000,
      contactEmail: "design@paystack.com",
      postDate: daysAgo(6),
    },
    {
      title: "Cloud Solutions Architect",
      company: "MTN Nigeria",
      location: "Lagos, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Design and implement cloud infrastructure strategies for Nigeria's largest telecoms company. You will lead the migration of legacy systems to AWS, define cloud security frameworks, and support a team of 12 cloud engineers delivering services to 80 million subscribers.",
      requirements:
        "6+ years infrastructure/cloud experience. AWS Solutions Architect Professional or equivalent required. Strong knowledge of networking, security, and DevOps practices. Experience with large-scale enterprise environments. Team leadership experience essential.",
      salaryMin: 900_000,
      salaryMax: 1_400_000,
      contactEmail: "it.recruitment@mtn.com.ng",
      postDate: daysAgo(7),
    },
    {
      title: "Brand & Marketing Manager",
      company: "Jumia Nigeria",
      location: "Lagos, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Drive brand strategy and performance marketing for Africa's leading e-commerce platform. Manage integrated campaigns across digital and offline channels, oversee a budget of ₦500M annually, and lead a team of 5 marketing executives to grow customer acquisition and retention.",
      requirements:
        "4+ years marketing experience, 2+ in a management role. Strong background in digital marketing and performance analytics. Experience with e-commerce or consumer brands preferred. Google Analytics, Meta Ads, and CRM tools required.",
      salaryMin: 450_000,
      salaryMax: 700_000,
      contactEmail: "marketing.jobs@jumia.com",
      postDate: daysAgo(9),
    },
    {
      title: "Operations Manager",
      company: "Dangote Group",
      location: "Abuja, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Oversee day-to-day operations across our Abuja business units, driving efficiency, cost reduction, and team performance. You will manage cross-functional operations teams, liaise with logistics and procurement, and report to the Regional Director.",
      requirements:
        "5+ years operations management experience. Degree in Business Administration, Engineering, or related field. Strong analytical skills and proficiency in ERP systems. Demonstrated ability to manage large teams in high-pressure environments.",
      salaryMin: 700_000,
      salaryMax: 1_000_000,
      contactEmail: "hr@dangote.com",
      postDate: daysAgo(11),
    },
    {
      title: "Data Analyst",
      company: "Access Bank Plc",
      location: "Lagos, Nigeria",
      type: "CONTRACT" as const,
      description:
        "Support the retail banking analytics team by building dashboards, running ad hoc analyses, and identifying patterns in customer behaviour data. This is a 12-month contract with a strong possibility of conversion to a permanent role.",
      requirements:
        "2+ years data analysis experience. Proficiency in SQL, Python (pandas), and Power BI or Tableau. Strong understanding of financial data. Experience in banking or financial services preferred. Excellent communication skills.",
      salaryMin: null,
      salaryMax: null,
      contactEmail: "analytics@accessbankplc.com",
      postDate: daysAgo(14),
    },
    {
      title: "React Developer",
      company: "Interswitch Group",
      location: "Lagos, Nigeria",
      type: "PART_TIME" as const,
      description:
        "Build and maintain consumer-facing web interfaces for Interswitch's fintech product portfolio, including Quickteller and Verve. Work 20 hours per week alongside a full engineering team. Ideal for someone looking for a high-quality part-time engagement with a leading fintech.",
      requirements:
        "3+ years React experience. Strong knowledge of TypeScript, Next.js, and REST API integration. Experience with design systems and Tailwind CSS. Ability to work independently and communicate clearly with remote teammates.",
      salaryMin: 250_000,
      salaryMax: 400_000,
      contactEmail: "dev.talent@interswitch.com",
      postDate: daysAgo(16),
    },
    {
      title: "Content Strategist",
      company: "TechCabal",
      location: "Remote (Nigeria)",
      type: "REMOTE" as const,
      description:
        "Develop and execute content strategy for TechCabal, Africa's most-read technology publication. Plan editorial calendars, manage a team of freelance writers, optimise content for SEO and social distribution, and support branded content partnerships.",
      requirements:
        "3+ years content or editorial experience. Excellent writing, editing, and storytelling skills. Understanding of SEO, analytics, and content distribution. Passion for African technology and startup ecosystems. Experience with CMS platforms.",
      salaryMin: 180_000,
      salaryMax: 280_000,
      contactEmail: "editorial@techcabal.com",
      postDate: daysAgo(20),
    },
    {
      title: "Business Development Manager",
      company: "Konga Online Shopping",
      location: "Abuja, Nigeria",
      type: "FULL_TIME" as const,
      description:
        "Lead seller acquisition and merchant partnerships for Konga's marketplace in the FCT region. Identify and close high-value merchant accounts, develop B2B relationships, and work with product teams to improve the seller experience.",
      requirements:
        "3+ years B2B sales or business development experience. Strong negotiation and relationship management skills. Experience in e-commerce or retail preferred. Proficiency in CRM tools. Willingness to travel within Abuja and surrounding areas.",
      salaryMin: 400_000,
      salaryMax: 600_000,
      contactEmail: "biz@konga.com",
      postDate: daysAgo(23),
    },
    {
      title: "Finance & Accounting Intern",
      company: "KPMG Nigeria",
      location: "Lagos, Nigeria",
      type: "INTERNSHIP" as const,
      description:
        "Join KPMG's audit and assurance division as a paid intern and gain hands-on experience in financial reporting, client audits, and tax compliance. You will be mentored by senior managers and considered for our graduate recruitment programme upon successful completion.",
      requirements:
        "Final-year or recently graduated student in Accounting, Finance, or Economics. Strong academic record (minimum 2:1). Basic knowledge of IFRS and financial statements. Proficiency in Excel. ICAN or ACCA student membership is an advantage.",
      salaryMin: 120_000,
      salaryMax: 180_000,
      contactEmail: "graduate.recruitment@kpmg.com.ng",
      postDate: daysAgo(26),
    },
  ];

  for (const listing of listings) {
    await prisma.jobListing.create({
      data: { ...listing, adminId: admin.id },
    });
  }

  console.log(`✓ Seeded ${listings.length} job listings.`);
  console.log("  Admin login: admin@jobboard.demo / Admin1234");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
