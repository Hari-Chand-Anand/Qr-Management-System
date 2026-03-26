import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { envPublic } from "@/lib/env";
import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Sheet,
  MessageCircle,
  Globe,
  Youtube,
  Instagram,
  ChevronRight,
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

export const runtime = "nodejs";

function buildWhatsAppLink(opts: {
  number: string;
  template: string;
  machineName: string;
  machineId: string;
  serialNumber: string;
}) {
  const msg = (opts.template || "")
    .replaceAll("[Machine Name]", opts.machineName)
    .replaceAll("[Machine ID]", opts.machineId)
    .replaceAll("[Serial Number]", opts.serialNumber);

  const numberDigits = (opts.number || "").replace(/\D/g, "");
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${numberDigits}?text=${encoded}`;
}

function SocialIconCard({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Globe;
}) {
  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      <Card className="p-4 text-center hover:bg-white/90 hover:shadow-md transition h-full">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
          <Icon className="h-6 w-6 text-black/70" />
        </div>
        <div className="mt-3 text-sm font-semibold text-[#1d1d1f]">{label}</div>
      </Card>
    </a>
  );
}

export default async function MachineLandingPage({
  params,
}: {
  params: Promise<{ machineId: string }>;
}) {
  noStore();

  const { machineId: rawMachineId } = await params;
  const machineId = (rawMachineId || "").trim();

  if (!machineId || machineId === "undefined" || machineId === "null") {
    return notFound();
  }

  const machine = await prisma.machine.findUnique({
    where: { machineId },
    include: { company: true },
  });

  if (!machine) return notFound();

  const waNumber = machine.whatsappNumber || envPublic.defaultWaNumber || "91";
  const waTemplate =
    machine.whatsappTemplate ||
    envPublic.defaultWaTemplate ||
    "Hi, I need technical help for [Machine Name]. Machine ID: [Machine ID]. Serial Number: [Serial Number].";

  const serialNumber = machine.serialNumber?.trim() || "Not available";

  const waLink = buildWhatsAppLink({
    number: waNumber,
    template: waTemplate,
    machineName: machine.name,
    machineId: machine.machineId,
    serialNumber,
  });

  const driveLink = machine.driveLink?.trim() || "";
  const sheetsLink = machine.sheetsLink?.trim() || "";
  const displayCompanyName = machine.company?.name?.trim() || envPublic.companyName;

  return (
    <main
      className="
        min-h-[100dvh]
        flex flex-col
        px-4 md:px-8
        pt-4 md:pt-8
        pb-[calc(env(safe-area-inset-bottom,0px)+16px)]
      "
    >
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col">
        <div className="space-y-4">
          {driveLink ? (
            <a href={driveLink} target="_blank" rel="noreferrer" className="block">
              <header className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-white/90 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  {envPublic.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={envPublic.logoUrl}
                      alt={`${displayCompanyName} logo`}
                      className="h-12 w-12 rounded-2xl object-contain bg-white p-1.5 shadow-sm"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-white text-[#1d1d1f] grid place-items-center font-bold shadow-sm">
                      {displayCompanyName.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-black/60">Company</div>
                    <h1 className="text-2xl font-semibold leading-tight text-[#1d1d1f]">
                      {displayCompanyName}
                    </h1>
                    <div className="mt-1 text-sm text-black/60">{machine.name}</div>
                    <div className="mt-1 text-sm text-black/70">
                      Machine ID:{" "}
                      <span className="font-medium text-black">{machine.machineId}</span>
                    </div>
                    <div className="mt-1 text-sm text-black/70">
                      S.No.: <span className="font-medium text-black">{serialNumber}</span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-black/40 shrink-0" />
                </div>
              </header>
            </a>
          ) : (
            <header className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                {envPublic.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={envPublic.logoUrl}
                    alt={`${displayCompanyName} logo`}
                    className="h-12 w-12 rounded-2xl object-contain bg-white p-1.5 shadow-sm"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-white text-[#1d1d1f] grid place-items-center font-bold shadow-sm">
                    {displayCompanyName.slice(0, 1).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="text-sm text-black/60">Company</div>
                  <h1 className="text-2xl font-semibold leading-tight text-[#1d1d1f]">
                    {displayCompanyName}
                  </h1>
                  <div className="mt-1 text-sm text-black/60">{machine.name}</div>
                  <div className="mt-1 text-sm text-black/70">
                    Machine ID:{" "}
                    <span className="font-medium text-black">{machine.machineId}</span>
                  </div>
                  <div className="mt-1 text-sm text-black/70">
                    S.No.: <span className="font-medium text-black">{serialNumber}</span>
                  </div>
                </div>
              </div>
            </header>
          )}

          <div className="grid gap-3">
            {sheetsLink ? (
              <Link href={`/m/${machine.machineId}/service`} className="block">
                <Card className="p-5 hover:bg-white/90 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
                      <Sheet className="h-6 w-6 text-black/70" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        Service & Installation Reports
                      </div>
                      <div className="text-sm text-black/60">
                        Installation date, tickets, work done
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card className="p-5">
                <div className="text-lg font-semibold">Service & Installation Reports</div>
                <div className="text-sm text-black/60">No sheets link added yet.</div>
              </Card>
            )}

            <a href={waLink} target="_blank" rel="noreferrer" className="block">
              <Card className="p-5 hover:bg-white/90 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-black/5 grid place-items-center">
                    <MessageCircle className="h-6 w-6 text-black/70" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Call Us for Technical Help</div>
                  </div>
                </div>
              </Card>
            </a>

            <div className="grid grid-cols-3 gap-3">
              <SocialIconCard
                href={envPublic.companyWebsiteUrl}
                label="Website"
                Icon={Globe}
              />
              <SocialIconCard
                href={envPublic.companyYoutubeUrl}
                label="YouTube"
                Icon={Youtube}
              />
              <SocialIconCard
                href={envPublic.companyInstagramUrl}
                label="Instagram"
                Icon={Instagram}
              />
            </div>
          </div>
        </div>

        <footer className="mt-auto text-center text-xs text-black/50 pt-4">
          Powered by Hari Chand Anand & Co.
        </footer>
      </div>
    </main>
  );
}