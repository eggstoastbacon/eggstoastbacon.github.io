import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CCRow = { cc: string; name: string; range: string; notes?: string };

export default function App() {
  const [query, setQuery] = useState("");

  const ccRows: CCRow[] = useMemo(() => [
    { cc: "1", name: "Mod Wheel → Vibrato Depth", range: "0–127", notes: "Scales vibrato amount" },
    { cc: "4", name: "Volume Env Shape", range: "0=Off • 1–63=Ramp Up • 64–127=Ramp Down" },
    { cc: "5", name: "Portamento Time", range: "0–127", notes: "Glide speed (≈0.005–0.5s units)" },
    { cc: "7", name: "Channel Volume", range: "0–127", notes: "Alternate expression control" },
    { cc: "9", name: "Pitch Sweep Amount", range: "0–127", notes: "Max semitone sweep (0–2 semis)" },
    { cc: "10", name: "Pitch Sweep Envelope", range: "<64 = Attack • ≥64 = Release", notes: "Envelope shape for sweep" },
    { cc: "11", name: "Expression", range: "0–127", notes: "Per‑channel volume scaling" },
    { cc: "64", name: "Sustain Pedal", range: "0/≥64", notes: "≥64 = sustain; 0 or All Notes Off to stop" },
    { cc: "65", name: "Portamento On/Off", range: "0/≥64", notes: "≥64 enables glide" },
    { cc: "68", name: "Laser‑Jump On/Off", range: "0/≥64", notes: "One‑shot 'laser' jump on Note‑On when Portamento enabled" },
    { cc: "69", name: "Laser‑Jump Amount", range: "0–127", notes: "0.0–1.0 blend toward zero for laser effect" },
    { cc: "76", name: "Vibrato Rate", range: "0–127", notes: "Maps to ~0–10 Hz LFO" },
    { cc: "77", name: "Vibrato Depth", range: "0–127", notes: "Maps to ~0–2 semitone LFO range" },
    { cc: "85", name: "Vibrato Delay", range: "0–127", notes: "Delay before LFO engages" },
    { cc: "120/123", name: "All Sound Off / All Notes Off", range: "—", notes: "Emergency channel reset" },
  ], []);

  const filtered = ccRows.filter(r => {
    const hay = (r.cc + " " + r.name + " " + (r.notes ?? "")).toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">YM2149F Turbo Sound x3</h1>
        <div className="text-xs sm:text-sm text-neutral-400">3× PSG • 9 voices • USB/DIN MIDI</div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 space-y-8">
        <Hero />

        <div className="grid md:grid-cols-3 gap-6">
          <Panel title="Quick Links">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li><a className="underline" href="https://github.com/Chiptune-Anamnesis/ym2149f-turbo-sound-x3" target="_blank">Project repository</a></li>
            </ul>
          </Panel>

          <Panel title="Highlights (from README)">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li>Three <strong>YM2149F</strong> chips for <strong>9 independent tone voices</strong> (3 per chip).</li>
              <li><strong>MIDI Input:</strong> USB‑MIDI (MIDIUSB) and TRS serial MIDI (31250 baud).</li>
              <li><strong>Mapping:</strong> Ch.1–3 → Chip0 A/B/C; Ch.4–6 → Chip1 A/B/C; Ch.7–9 → Chip2 A/B/C.</li>
              <li><strong>Pitch bend</strong> (±2 semitones), <strong>vibrato</strong>, <strong>expression</strong>, <strong>portamento</strong>, <strong>pitch sweep</strong>, and optional <strong>noise drums</strong> on Ch.10.</li>
              <li>LED indicators per chip; 74HC138 for chip select; 74xx logic for gating; 8‑bit data bus.</li>
            </ul>
          </Panel>

          <Panel title="MIDI Channel Map (default)">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { ch: 1, text: "Chip 0 • Voice A" },
                { ch: 2, text: "Chip 0 • Voice B" },
                { ch: 3, text: "Chip 0 • Voice C" },
                { ch: 4, text: "Chip 1 • Voice A" },
                { ch: 5, text: "Chip 1 • Voice B" },
                { ch: 6, text: "Chip 1 • Voice C" },
                { ch: 7, text: "Chip 2 • Voice A" },
                { ch: 8, text: "Chip 2 • Voice B" },
                { ch: 9, text: "Chip 2 • Voice C" },
                { ch: 10, text: "Noise/Drums (optional)" },
              ].map((c, i) => (
                <motion.div key={c.ch} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.02}}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                  <div className="text-neutral-400 text-sm">MIDI Ch {c.ch}</div>
                  <div className="font-semibold mt-1">{c.text}</div>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title={`CC Reference (${filtered.length}/${ccRows.length})`}>
          <div className="mb-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filter by CC or name… (e.g., 76, vibrato, sustain)"
              className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            />
          </div>
          <div className="rounded-xl border border-neutral-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/60 text-neutral-300">
                <tr className="text-left">
                  <Th>CC</Th><Th>Name</Th><Th>Range</Th><Th>Notes</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                <AnimatePresence initial={false}>
                  {filtered.map((r) => (
                    <motion.tr key={r.cc} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="hover:bg-neutral-900/40">
                      <Td>{r.cc}</Td><Td className="font-medium text-neutral-100">{r.name}</Td><Td>{r.range}</Td><Td className="text-neutral-400">{r.notes}</Td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-neutral-500 mt-2">Source: Project README.</div>
        </Panel>

        <Panel title="Setup Tips">
          <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
            <li>Send notes on MIDI channels 1–9 for tone voices; channel 10 for noise percussion (if enabled).</li>
            <li>Use CC1 for vibrato depth, CC76 for rate, CC77 for overall depth, CC85 for vibrato delay.</li>
            <li>Enable glide with CC65 and set time with CC5; sustain with CC64.</li>
            <li>Pitch sweep via CC9 (amount) + CC10 (envelope shape).</li>
            <li>Emergency stop: CC120 (All Sound Off) / CC123 (All Notes Off).</li>
          </ul>
        </Panel>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle at center, #17ff7f 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }} />
      <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle at center, #21d0ff 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }} />
      <div className="relative">
        <h2 className="text-xl sm:text-2xl font-bold">What is this?</h2>
        <p className="mt-2 text-neutral-300 leading-7">
          A three‑chip YM2149F synth controlled over MIDI. Nine voices of crunchy PSG plus optional drums, built around an Arduino Pro Micro.
        </p>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-[inset_0_1px_#111]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-200">{title}</h2>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>;
}

