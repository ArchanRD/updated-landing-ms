import { NextApiHandler } from "next";

const content = `
User-agent: *
Allow: /
Disallow: /external_click

User-agent: adidxbot
Crawl-delay: 10

User-agent: UbiCrawler
Disallow: /
User-agent: BUbiNG
Disallow: /
User-agent: DOC
Disallow: /
User-agent: Zao
Disallow: /
User-agent: sitecheck.internetseer.com
Disallow: /
User-agent: Zealbot
Disallow: /
User-agent: MSIECrawler
Disallow: /
User-agent: SiteSnagger
Disallow: /
User-agent: WebStripper
Disallow: /
User-agent: WebCopier
Disallow: /
User-agent: Fetch
Disallow: /
User-agent: Offline Explorer
Disallow: /
User-agent: Teleport
Disallow: /
User-agent: TeleportPro
Disallow: /
User-agent: WebZIP
Disallow: /
User-agent: linko
Disallow: /
User-agent: HTTrack
Disallow: /
User-agent: Microsoft.URL.Control
Disallow: /
User-agent: Xenu
Disallow: /
User-agent: larbin
Disallow: /
User-agent: libwww
Disallow: /
User-agent: ZyBORG
Disallow: /
User-agent: Download Ninja
Disallow: /
User-agent: wget
Disallow: /
User-agent: grub-client
Disallow: /
User-agent: k2spider
Disallow: /
User-agent: NPBot
Disallow: /
User-agent: WebReaper
Disallow: /
User-agent: psbot
Disallow: /
User-agent: Exabot
Disallow: /
User-agent: Speedy
Disallow: /
User-agent: dotbot
Disallow: /
User-agent: Bloglines/3.1
Disallow: /
User-agent: Jyxobot/1
Disallow: /
User-agent: cityreview
Disallow: /
User-agent: CrazyWebCrawler-Spider
Disallow: /
User-agent: Domain Re-Animator Bot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: SemrushBot-SA
Disallow: /
User-agent: Vegi
Disallow: /
User-agent: rogerbot
Disallow: /
User-agent: NTENTbot
Disallow: /

Sitemap: https://www.resources.missionsustainability.org/sitemap.xml
`;

const RobotsHandler: NextApiHandler = (_req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(content);
};

export default RobotsHandler;
