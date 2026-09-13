import socialDemocratsLogo from "@/assets/party-logos/s.svg.asset.json";
import leftPartyLogo from "@/assets/party-logos/v.svg.asset.json";
import greenPartyLogo from "@/assets/party-logos/mp.svg.asset.json";
import centrePartyLogo from "@/assets/party-logos/c.svg.asset.json";
import moderatePartyLogo from "@/assets/party-logos/m.webp.asset.json";
import liberalPartyLogo from "@/assets/party-logos/l.svg.asset.json";
import christianDemocratsLogo from "@/assets/party-logos/kd.svg.asset.json";
import swedenDemocratsLogo from "@/assets/party-logos/sd.svg.asset.json";

export type PartyRole = "governing" | "support" | "opposition" | "other";

export type PartyMeta = {
  code: string;
  officialName: string;
  swedishName: string;
  englishName: string;
  color: string;
  onColor: string;
  logo?: { src: string; alt: string };
  blurb: string;
  solnaFocus: string;
  regionFocus: string;
  solnaRole: PartyRole;
  regionRole: PartyRole;
};

/**
 * Editorial summaries of each party's general orientation, written for a
 * first-time voter. Roles reflect the mandate period that ends with today's
 * election (Solna Coalition 2022-2026 / Region Stockholm 2022-2026).
 */
export const PARTIES: PartyMeta[] = [
  {
    code: "S",
    officialName: "Arbetarepartiet-Socialdemokraterna",
    swedishName: "Socialdemokraterna",
    englishName: "Social Democrats",
    color: "#E8112D",
    onColor: "#FFFFFF",
    logo: { src: socialDemocratsLogo.url, alt: "Social Democrats logo" },
    blurb: "Centre-left. Strong public sector, welfare funded by taxes, union-friendly.",
    solnaFocus:
      "Leads the governing Solna Coalition. Smaller class sizes, more staff in preschools and elderly care, slower privatisation of municipal services.",
    regionFocus:
      "Leads the regional administration. Priority on shorter care queues, more staff in hospitals and keeping public transport fares down.",
    solnaRole: "governing",
    regionRole: "governing",
  },
  {
    code: "V",
    officialName: "Vänsterpartiet",
    swedishName: "Vänsterpartiet",
    englishName: "Left Party",
    color: "#AF0000",
    onColor: "#FFFFFF",
    logo: { src: leftPartyLogo.url, alt: "Left Party logo" },
    blurb: "Left. Against profit in tax-funded welfare, strong focus on equality and public ownership.",
    solnaFocus:
      "Part of the governing coalition in Solna. Wants more municipally owned rental housing, no profit-driven school or care providers.",
    regionFocus:
      "Formal support partner for the regional majority. Wants care run in public hands and cheaper, eventually free, public transport.",
    solnaRole: "governing",
    regionRole: "support",
  },
  {
    code: "MP",
    officialName: "Miljöpartiet de gröna",
    swedishName: "Miljöpartiet de gröna",
    englishName: "Green Party",
    color: "#83CF39",
    onColor: "#10240B",
    logo: { src: greenPartyLogo.url, alt: "Green Party logo" },
    blurb: "Green. Climate, nature and cycling before car traffic.",
    solnaFocus:
      "Part of the governing coalition in Solna. Protects green areas and the National City Park, prioritises walking, cycling and transit in new city planning.",
    regionFocus:
      "In the regional coalition. Expands SL services, pushes climate targets and preventive healthcare.",
    solnaRole: "governing",
    regionRole: "governing",
  },
  {
    code: "C",
    officialName: "Centerpartiet",
    swedishName: "Centerpartiet",
    englishName: "Centre Party",
    color: "#009933",
    onColor: "#FFFFFF",
    logo: { src: centrePartyLogo.url, alt: "Centre Party logo" },
    blurb: "Liberal centre. Small business friendly, decentralised decisions, green market solutions.",
    solnaFocus:
      "The centre-right party that crossed the bloc line to join the Solna Coalition. Focus on local enterprise, green space and school choice within a public framework.",
    regionFocus:
      "In the regional coalition. Emphasis on primary care close to home and a reliable transport network across the whole county.",
    solnaRole: "governing",
    regionRole: "governing",
  },
  {
    code: "M",
    officialName: "Moderaterna",
    swedishName: "Moderaterna",
    englishName: "Moderate Party",
    color: "#52BDEC",
    onColor: "#062A38",
    logo: { src: moderatePartyLogo.url, alt: "Moderate Party logo" },
    blurb: "Centre-right. Lower taxes, private providers in welfare, law-and-order focus.",
    solnaFocus:
      "Largest opposition party. Governed Solna for 24 years until 2022 and campaigns on low municipal tax, freedom of choice and continued city development.",
    regionFocus:
      "Largest opposition party in the region. Wants more private care providers and cost control in healthcare and SL.",
    solnaRole: "opposition",
    regionRole: "opposition",
  },
  {
    code: "L",
    officialName: "Liberalerna (tidigare Folkpartiet)",
    swedishName: "Liberalerna",
    englishName: "Liberal Party",
    color: "#006AB3",
    onColor: "#FFFFFF",
    logo: { src: liberalPartyLogo.url, alt: "Liberal Party logo" },
    blurb: "Liberal. School quality, individual rights, pro-EU.",
    solnaFocus:
      "In opposition. Strong emphasis on schools, teacher pay and knowledge results, plus integration through language and work.",
    regionFocus:
      "In opposition. Focus on specialist care, psychiatry and accessible transport.",
    solnaRole: "opposition",
    regionRole: "opposition",
  },
  {
    code: "KD",
    officialName: "Kristdemokraterna",
    swedishName: "Kristdemokraterna",
    englishName: "Christian Democrats",
    color: "#000077",
    onColor: "#FFFFFF",
    logo: { src: christianDemocratsLogo.url, alt: "Christian Democrats logo" },
    blurb: "Christian-democratic centre-right. Family policy, elderly care, civil society.",
    solnaFocus:
      "In opposition. Elderly care quality, support for families and voluntary organisations in Solna.",
    regionFocus:
      "In opposition. Long-standing focus on elderly care, hospital capacity and shorter queues.",
    solnaRole: "opposition",
    regionRole: "opposition",
  },
  {
    code: "SD",
    officialName: "Sverigedemokraterna",
    swedishName: "Sverigedemokraterna",
    englishName: "Sweden Democrats",
    color: "#DDDD00",
    onColor: "#2B2B00",
    logo: { src: swedenDemocratsLogo.url, alt: "Sweden Democrats logo" },
    blurb: "Nationalist right. Restrictive immigration policy, crime and welfare chauvinism.",
    solnaFocus:
      "In opposition. Campaigns on safety, restrictive local reception of newcomers and cost cuts in municipal administration.",
    regionFocus:
      "In opposition. Focus on security in public transport and prioritising healthcare resources.",
    solnaRole: "opposition",
    regionRole: "opposition",
  },
];

export const PARTY_BY_OFFICIAL_NAME = new Map(PARTIES.map((p) => [p.officialName, p]));

export const OTHER_PARTY: Omit<PartyMeta, "officialName" | "swedishName" | "englishName"> = {
  code: "—",
  color: "#6B7280",
  onColor: "#FFFFFF",
  blurb: "Smaller party standing in this election.",
  solnaFocus: "No summary available — see the party's own material.",
  regionFocus: "No summary available — see the party's own material.",
  solnaRole: "other",
  regionRole: "other",
};

export const ROLE_LABEL: Record<PartyRole, string> = {
  governing: "In government",
  support: "Support partner",
  opposition: "Opposition",
  other: "Smaller party",
};
