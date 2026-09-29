"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Command, State } from "@/lib/domain";

type Pending = { requestId: string; revision: number; command: Command; done?: (state: State) => void };
export function useWorkspace(focus: boolean) {
  const [state, setState] = useState<State | null>(null);
  const latest = useRef<State | null>(null);
  const [access, setAccess] = useState<"loading" | "required" | "ready">("loading");
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const pending = useRef<Pending | null>(null);
  const writing = useRef(false);
  const accessKey = useRef("");
  const anchor = useRef({ server: 0, mono: 0 });
  const [now, setNow] = useState(() => Date.now());
  const accept = useCallback((next: State) => {
    if (latest.current && next.revision < latest.current.revision) return;
    latest.current = next;
    anchor.current = { server: next.serverNow, mono: performance.now() };
    setNow(next.serverNow); setState(next); setAccess("ready"); setOffline(false);
  }, []);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/state", { cache: "no-store", signal: AbortSignal.timeout(12000) });
      if (response.status === 401) { latest.current = null; setState(null); setAccess("required"); return; }
      if (!response.ok) throw new Error("Your tasks could not be loaded. Try again when connected.");
      accept(await response.json() as State);
    } catch (e) { setOffline(true); if (!latest.current) setError(e instanceof Error ? e.message : "Could not connect."); }
  }, [accept]);
  const unlock = useCallback(async (link?: string) => {
    if (link) {
      try { accessKey.current = new URLSearchParams(new URL(link).hash.slice(1)).get("key") ?? ""; }
      catch { accessKey.current = link.replace(/^#?key=/, "").trim(); }
    }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: accessKey.current }), signal: AbortSignal.timeout(12000) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error);
      accessKey.current = ""; await refresh();
    } catch (e) { setAccess("required"); setError(e instanceof Error ? e.message : "Could not connect. Try your private link again."); }
    finally { setBusy(false); }
  }, [refresh]);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ronaldo-pending");
      if (saved) { pending.current = JSON.parse(saved) as Pending; queueMicrotask(() => { setUncertain(true); setError("A previous action needs confirmation. Retry it to reconcile your devices."); }); }
    } catch { /* Storage is optional. */ }
    const key = new URLSearchParams(window.location.hash.slice(1)).get("key");
    if (key) { accessKey.current = key; history.replaceState(null, "", window.location.pathname + window.location.search); }
    if (accessKey.current) void unlock(); else void refresh();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, [refresh, unlock]);
  useEffect(() => {
    const sync = () => { if (!document.hidden) void refresh(); };
    const timer = setInterval(sync, focus ? 5000 : 15000);
    document.addEventListener("visibilitychange", sync); window.addEventListener("online", sync);
    const disconnect = () => setOffline(true);
    window.addEventListener("offline", disconnect);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); window.removeEventListener("online", sync); window.removeEventListener("offline", disconnect); };
  }, [focus, refresh]);
  useEffect(() => { const timer = setInterval(() => { if (!document.hidden && latest.current) setNow(anchor.current.server + performance.now() - anchor.current.mono); }, 250); return () => clearInterval(timer); }, []);
  const send = useCallback(async (item: Pending) => {
    if (writing.current) return;
    writing.current = true; setBusy(true); setError("");
    try {
      const { done, ...body } = item;
      const response = await fetch("/api/command", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) });
      if (response.status >= 500) throw new Error("Connection interrupted. Retry to confirm this action before making another change.");
      const data = await response.json() as State & { error?: string };
      if (!response.ok) {
        pending.current = null; setUncertain(false);
        try { sessionStorage.removeItem("ronaldo-pending"); } catch { /* Storage is optional. */ }
        if (response.status === 401) { setState(null); latest.current = null; setAccess("required"); }
        else if (response.status === 409) await refresh();
        setError(data.error ?? "Please try again."); return;
      }
      accept(data); pending.current = null; setUncertain(false);
      try { sessionStorage.removeItem("ronaldo-pending"); } catch { /* Storage is optional. */ }
      done?.(data);
    } catch (e) { setOffline(true); setUncertain(true); setError(e instanceof Error ? e.message : "Could not confirm this action. Please retry."); }
    finally { writing.current = false; setBusy(false); }
  }, [accept, refresh]);
  const command = useCallback((command: Command, done?: (state: State) => void) => {
    if (writing.current || pending.current || !latest.current) return;
    const item = { requestId: crypto.randomUUID(), revision: latest.current.revision, command, done };
    try { sessionStorage.setItem("ronaldo-pending", JSON.stringify({ requestId: item.requestId, revision: item.revision, command })); } catch { /* In-memory retry remains available. */ }
    pending.current = item; void send(item);
  }, [send]);
  const retry = () => { if (pending.current) void send(pending.current); else { setError(""); void refresh(); } };
  return { state, access, now, busy, uncertain, offline, error, command, retry, unlock, clearError: () => setError("") };
}

