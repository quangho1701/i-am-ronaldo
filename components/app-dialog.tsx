"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export function AppDialog({ title, children, close, locked = false }: { title: string; children: ReactNode; close: () => void; locked?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = ref.current!; const previous = document.activeElement as HTMLElement; node.showModal(); node.querySelector<HTMLElement>("input:not([disabled]), select:not([disabled]), textarea:not([disabled])")?.focus(); document.body.style.overflow = "hidden"; return () => { node.close(); document.body.style.overflow = ""; previous?.focus(); }; }, []);
  return <dialog ref={ref} className="app-dialog" aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); if (!locked) close(); }} onClick={e => { if (e.target === ref.current && !locked) close(); }}>
    <div className="dialog-inner"><div className="section-heading"><h2 id="dialog-title">{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" disabled={locked} onClick={close}><X size={20}/></button></div>{children}</div>
  </dialog>;
}
