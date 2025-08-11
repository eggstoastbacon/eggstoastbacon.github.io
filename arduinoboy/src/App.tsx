import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [query, setQuery] = useState("");

  const modes = useMemo(() => ([
    { id: 1, name: "LSDj as MIDI Slave Sync", slug: "lsdj-slave", desc: "LSDj follows incoming MIDI clock. Extra note triggers can toggle tempo divisions and control song start/stop." },
    { id: 2, name: "LSDj as MIDI Master Sync", slug: "lsdj-master", desc: "LSDj generates MIDI clock as master; also emits note messages that correspond to song row numbers on play." },
    { id: 3, name: "LSDj PC Keyboard Mode", slug: "lsdj-pckey", desc: "Type from a connected keyboard to enter notes / commands into LSDj (via Arduinoboy mapping)." },
    { id: 4, name: "MIDI → Nanoloop Sync", slug: "nanoloop-sync", desc: "Sync Nanoloop to external MIDI clock using Arduinoboy as clock translator." },
    { id: 5, name: "Full MIDI with mGB", slug: "mgb", desc: "Use the mGB cartridge to turn a Game Boy into a MIDI sound module (PU1/PU2/WAV/NOISE). Velocity and pitch control supported." },
    { id: 6, name: "LSDj MIDIMAP", slug: "lsdj-midimap", desc: "Map incoming MIDI notes/CCs to trigger LSDj actions (live map variants exist in some firmware/LSDj versions)." },
    { id: 7, name: "LSDj MIDIOUT", slug: "lsdj-midiout", desc: "Forward LSDj activity as outgoing MIDI (e.g., PU1, PU2, WAV, NOISE on channels 1–4)." },
  ]), []);

  const filtered = modes.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.desc.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Arduinoboy — Features & Modes</h1>
        <div className="text-xs sm:text-sm text-neutral-400">Game Boy MIDI (LSDj • mGB • Nanoloop)</div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 space-y-8">
        <Hero />

        <div className="grid md:grid-cols-3 gap-6">
          <Panel title="Quick Links">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li><a className="underline" href="https://arduinoboy-editor.web.app/" target="_blank">Arduinoboy Editor (web)</a></li>
              <li><a className="underline" href="https://github.com/Chiptune-Anamnesis/Arduinoboy_Main" target="_blank">HobbyChop Arduinoboy repo</a></li>
              <li><a className="underline" href="https://github.com/trash80/Arduinoboy" target="_blank">Upstream Arduinoboy (trash80)</a></li>
              <li><a className="underline" href="https://github.com/trash80/mGB" target="_blank">mGB cartridge (trash80)</a></li>
            </ul>
          </Panel>

          <Panel title="Highlights">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li>Seven core modes covering LSDj sync (slave/master), keyboard entry, Nanoloop sync, mGB full MIDI, and MIDI I/O.</li>
              <li>USB or DIN‑5 MIDI depending on your build; opto‑isolated input recommended.</li>
              <li>Compatible with DMG, Pocket, GBC, and GBA (link port connection).</li>
              <li>LED indicators show mode and MIDI activity; menu button cycles modes.</li>
              <li>Firmware variants add features like “Live Map” and Teensy USB MIDI support.</li>
            </ul>
          </Panel>

          <Panel title="Mode Finder">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search modes (mGB, LSDj, Nanoloop…)"
              className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            />
          </Panel>
        </div>

        <Panel title={`Modes (${filtered.length})`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.div key={m.slug}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4"
              >
                <div className="text-sm text-neutral-400">Mode {m.id}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-100">{m.name}</div>
                <p className="mt-2 text-sm text-neutral-300 leading-6">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="Setup Tips">
          <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
            <li>For <strong>LSDj Slave</strong>, set LSDj <em>SYNC</em> to <em>SLAVE</em>; use transport notes to start/stop and change tempo divisions.</li>
            <li>For <strong>LSDj Master</strong>, set LSDj <em>SYNC</em> to <em>MASTER</em>; Arduinoboy will output MIDI clock + optional row-number notes.</li>
            <li>For <strong>mGB</strong>, flash the <em>mGB</em> ROM onto a cart, set Arduinoboy to mGB mode, then route MIDI notes/CCs to channels 1–4.</li>
            <li>For <strong>Nanoloop</strong>, set Nanoloop sync to <em>SLAVE</em> and feed MIDI clock into Arduinoboy.</li>
          </ul>
        </Panel>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle at center, #ff2ea6 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }} />
      <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle at center, #21d0ff 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }} />
      <div className="relative">
        <h2 className="text-xl sm:text-2xl font-bold">What is Arduinoboy?</h2>
        <p className="mt-2 text-neutral-300 leading-7">
          Arduinoboy is a hardware/firmware bridge that connects MIDI gear to the Game Boy’s link port. 
          It enables tight sync with <strong>LSDj</strong>, full MIDI control of <strong>mGB</strong>, and clock sync for <strong>Nanoloop</strong>—plus handy keyboard and MIDI I/O modes.
        </p>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-[inset_0_1px_#111]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-200">{title}</h2>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
