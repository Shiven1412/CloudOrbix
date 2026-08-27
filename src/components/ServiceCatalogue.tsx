import { useState } from "react";

export interface Service {
  index: string;
  title: string;
  tagline: string;
  creating: string;
  capabilities: string[];
  image: string;
}

export const DEFAULT_SERVICES: Service[] = [
  {
    index: "01",
    title: "Software Development",
    tagline: "Built to last, built to scale",
    creating: "Creating reliable, scalable software products that teams are proud to ship and users are happy to return to — from first commit to production and beyond.",
    capabilities: [
      "Full-stack web and mobile application engineering",
      "API design, integration, and microservices architecture",
      "CI/CD pipeline setup and DevOps automation",
      "Code audits, legacy modernisation, and technical debt reduction",
      "Ongoing maintenance, performance tuning, and feature delivery",
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=600&fit=crop&auto=format",
  },
  {
    index: "02",
    title: "Consultancy & Transformation",
    tagline: "Clarity before commitment",
    creating: "Creating the conditions for lasting digital change — helping organisations cut through complexity, align technology with business goals, and move from reactive IT to strategic advantage.",
    capabilities: [
      "Digital transformation strategy and execution roadmaps",
      "Technology landscape assessments and architecture reviews",
      "Vendor evaluation, selection, and contract negotiation",
      "Operating model design and IT governance frameworks",
      "CTO advisory and embedded fractional leadership",
    ],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=600&fit=crop&auto=format",
  },
  {
    index: "03",
    title: "Cloud & Infrastructure",
    tagline: "Reliable at any altitude",
    creating: "Creating infrastructure that scales without friction — cloud environments engineered for resilience, security, and cost efficiency from day one.",
    capabilities: [
      "Cloud architecture design and migration (AWS, Azure, GCP)",
      "Kubernetes orchestration and container platform management",
      "Infrastructure-as-Code with Terraform and Pulumi",
      "Cost optimisation, FinOps, and resource governance",
      "24/7 monitoring, incident management, and SRE practices",
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop&auto=format",
  },
  {
    index: "04",
    title: "Cybersecurity",
    tagline: "Defence without compromise",
    creating: "Creating security postures that protect without slowing teams down — threat-led, compliance-aware, and built to withstand real-world attack vectors.",
    capabilities: [
      "Penetration testing, red team exercises, and vulnerability assessments",
      "Security Operations Centre (SOC) setup and managed detection",
      "ISO 27001, SOC 2, and GDPR compliance programmes",
      "Zero Trust network architecture and identity management",
      "Incident response planning, tabletop exercises, and forensics",
    ],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&h=600&fit=crop&auto=format",
  },
  {
    index: "05",
    title: "Data & Analytics",
    tagline: "Decisions backed by evidence",
    creating: "Creating data ecosystems that turn raw events into reliable business intelligence — pipelines that run, dashboards that get used, and insights that actually change decisions.",
    capabilities: [
      "Data warehouse and lakehouse architecture (Snowflake, BigQuery, Databricks)",
      "ETL/ELT pipeline engineering with dbt, Airflow, and Fivetran",
      "BI dashboard design and self-serve analytics enablement",
      "Data governance, cataloguing, and quality frameworks",
      "ML model development, deployment, and monitoring in production",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format",
  },
  {
    index: "06",
    title: "AI & Automation",
    tagline: "Leverage intelligence, reduce friction",
    creating: "Creating AI-powered systems that handle the repetitive, surface the important, and free teams to focus on work that genuinely requires human judgement.",
    capabilities: [
      "LLM integration, prompt engineering, and RAG pipeline development",
      "Intelligent document processing and unstructured data extraction",
      "Robotic Process Automation (RPA) for back-office workflows",
      "Computer vision systems for quality control and asset monitoring",
      "AI product strategy, ethics review, and responsible deployment",
    ],
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=600&fit=crop&auto=format",
  },
];

export interface ServiceCatalogueProps {
  services?: Service[];
  heading?: string;
  intro?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
}

export default function ServiceCatalogue({
  services = DEFAULT_SERVICES,
  heading = "What we build.",
  intro = "We are a full-service IT company delivering software, infrastructure, security, data, and AI solutions. Every engagement is outcome-focused and built to last.",
  hideHeader = false,
  hideFooter = false,
  className = "",
}: ServiceCatalogueProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={`w-full ${className}`} style={{ fontFamily: "var(--font-sans, 'Inter', system-ui, sans-serif)", color: "#0F172A" }}>

      {!hideHeader && (
        <header className="px-8 md:px-16 pt-12 pb-8 flex items-start justify-between border-b border-[#E2E8F0] bg-white">
          <div>
            <span className="mono" style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#3B82F6", textTransform: "uppercase" }}>
              Service Catalogue
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0F172A", marginTop: "0.4rem" }}>
              What we{" "}<span style={{ color: "#1E40AF" }}>build.</span>
            </h1>
          </div>
        </header>
      )}

      <div className="px-8 md:px-16 py-10 grid md:grid-cols-2 gap-8 border-b border-[#E2E8F0] bg-white">
        <p style={{ fontWeight: 400, fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", lineHeight: 1.75, color: "#64748B", maxWidth: "520px" }}>
          {intro}
        </p>
        <div className="flex items-end justify-start md:justify-end">
          <span style={{ fontWeight: 800, fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.85, color: "#DBEAFE", letterSpacing: "-0.04em" }}>
            {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="bg-white mt-4 mx-4 md:mx-8 rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        <ul className="divide-y divide-[#E2E8F0]">
          {services.map((s, i) => (
            <ServiceRow
              key={s.index}
              service={s}
              isActive={active === i}
              onToggle={() => setActive(active === i ? null : i)}
            />
          ))}
        </ul>
      </div>

      {!hideFooter && (
        <footer className="px-8 md:px-16 py-8 mt-4 flex flex-col md:flex-row justify-between gap-4">
          <span className="mono" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#CBD5E1" }}>
            © {new Date().getFullYear()} Studio — All rights reserved
          </span>
          <span className="mono" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#CBD5E1" }}>
            SOFTWARE · CLOUD · SECURITY · DATA · AI
          </span>
        </footer>
      )}
    </div>
  );
}

function ServiceRow({
  service,
  isActive,
  onToggle,
}: {
  service: Service;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button className="w-full text-left group" onClick={onToggle} aria-expanded={isActive}>
        <div
          className="px-6 md:px-10 py-6 flex items-center gap-5 md:gap-8 transition-all duration-300"
          style={{ background: isActive ? "#F8FAFC" : "transparent" }}
        >
          <span className="mono shrink-0" style={{ fontSize: "11px", letterSpacing: "0.14em", color: isActive ? "#3B82F6" : "#CBD5E1", minWidth: "2rem", transition: "color 0.3s" }}>
            {service.index}
          </span>

          <h2
            className="flex-1 transition-colors duration-300 group-hover:text-[#1E40AF]"
            style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: isActive ? "#1E40AF" : "#0F172A" }}
          >
            {service.title}
          </h2>

          <span className="hidden lg:block shrink-0" style={{ fontSize: "0.82rem", color: isActive ? "#64748B" : "#CBD5E1", maxWidth: "200px", textAlign: "right", transition: "color 0.3s", fontWeight: 400 }}>
            {service.tagline}
          </span>

          <span
            className="ml-2 shrink-0 flex items-center justify-center"
            style={{
              width: "28px",
              height: "28px",
              border: `1.5px solid ${isActive ? "#3B82F6" : "#E2E8F0"}`,
              borderRadius: "50%",
              color: isActive ? "#3B82F6" : "#CBD5E1",
              fontSize: "16px",
              lineHeight: 1,
              transition: "all 0.3s",
              background: isActive ? "#DBEAFE" : "transparent",
            }}
          >
            {isActive ? "−" : "+"}
          </span>
        </div>
      </button>

      {/* Expanded panel */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isActive ? "700px" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.35s",
        }}
      >
        <div className="border-t border-[#E2E8F0]" style={{ background: "#F8FAFC" }}>
          <div className="px-6 md:px-10 py-8 grid md:grid-cols-5 gap-8 items-start">

            {/* Left — image */}
            <div className="md:col-span-2 overflow-hidden rounded-lg border border-[#E2E8F0]" style={{ aspectRatio: "4/3", background: "#F1F5F9" }}>
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)", transform: isActive ? "scale(1)" : "scale(1.06)" }}
              />
            </div>

            {/* Right — content */}
            <div className="md:col-span-3 flex flex-col gap-6">

              {/* Creating paragraph */}
              <div>
                <span className="mono" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#3B82F6", textTransform: "uppercase", fontWeight: 500 }}>
                  Creating
                </span>
                <p style={{ marginTop: "0.5rem", fontWeight: 400, fontSize: "0.975rem", lineHeight: 1.8, color: "#475569" }}>
                  {service.creating}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#E2E8F0" }} />

              {/* Core Capabilities */}
              <div>
                <span className="mono" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#64748B", textTransform: "uppercase", fontWeight: 500 }}>
                  Core Capabilities
                </span>
                <ul className="mt-3 flex flex-col gap-2">
                  {service.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {/* Bullet */}
                      <span
                        className="shrink-0 mt-[6px]"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#3B82F6",
                          display: "inline-block",
                        }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.65, fontWeight: 400 }}>
                        {cap}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
