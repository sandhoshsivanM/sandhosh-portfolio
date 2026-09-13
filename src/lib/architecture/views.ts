import type { ViewId } from "./types";

export const VIEW_IDS = ["about", "experience", "skills", "projects", "cases", "contact"] as const;

export function isViewId(v: string | null | undefined): v is ViewId {
  return !!v && (VIEW_IDS as readonly string[]).includes(v);
}

export const VIEW_META: Record<ViewId, { title: string; kicker: string; href: string }> = {
  about: { title: "About", kicker: "GET /about", href: "/about" },
  experience: { title: "Experience", kicker: "GET /experience", href: "/experience" },
  skills: { title: "Skills", kicker: "GET /skills", href: "/skills" },
  projects: { title: "Projects", kicker: "GET /projects", href: "/projects" },
  cases: { title: "Case Studies", kicker: "GET /case-studies", href: "/case-studies" },
  contact: { title: "Contact", kicker: "POST /hello", href: "/contact" },
};
