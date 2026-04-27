import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page prose">
        <div className="fourohfour">
          <div className="fourohfour-code">404</div>
          <p className="fourohfour-msg">这一页似乎还没被任何 builder 写出来。</p>
          <p className="fourohfour-msg-zh">No builder has written this page yet.</p>
          <div style={{ marginTop: "var(--s-5)" }}>
            <Link
              href="/"
              className="btn"
              data-variant="primary"
              style={{ textDecoration: "none" }}
            >
              回到今日 →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
