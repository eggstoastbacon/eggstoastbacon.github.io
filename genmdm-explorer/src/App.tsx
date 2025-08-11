import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroSwirlBackground from "./components/RetroSwirlBackground";

/**
 * GenMDM Explorer — full App.tsx
 * - Animated neon background (RetroSwirlBackground)
 * - Feature/spec panels
 * - Searchable CC browser w/ copy button
 * - Firmware toggle (v102/v103)
 */

export default function GenMDMExplorer() {
  // UI state
  const [query, setQuery] = useState("");
  const [fw, setFw] = useState<"v103" | "v102">("v103");
  const [chipFilter, setChipFilter] = useState<ChipGroup | "ALL">("ALL");
  const [groupFilter, setGroupFilter] = useState<Group | "ALL">("ALL");

  const ccRows = useMemo(() => buildRows(fw), [fw]);
  const filtered = useMemo(
    () =>
      ccRows.filter(
        (r) =>
          (chipFilter === "ALL" || r.chip === chipFilter) &&
          (groupFilter === "ALL" || r.group === groupFilter) &&
          (query.trim() === "" ||
            (r.name + " " + (r.notes ?? ""))
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            String(r.cc).includes(query))
      ),
    [ccRows, chipFilter, groupFilter, query]
  );

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white relative">
      {/* Animated retro swirls background (sits under content) */}
      // nearer the top (one-third down)
<RetroSwirlBackground fixed yBias={0.28} speed={1} density={6} glow={0.5} />

// or lock it even higher:
<RetroSwirlBackground fixed yBias={0.22} />

// if you *don’t* want it fixed, but still biased up:
<RetroSwirlBackground fixed={false} yBias={0.25} />

      <header className="relative z-10 mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">GenMDM Explorer</h1>
        <div className="text-xs sm:text-sm text-neutral-400">Little-Scale archive • YM2612 + SN76489</div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 grid lg:grid-cols-4 gap-6">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-1">
          <Panel title="Firmware">
            <div className="grid grid-cols-2 gap-2">
              <Toggle active={fw === "v103"} onClick={() => setFw("v103")} label="v103" />
              <Toggle active={fw === "v102"} onClick={() => setFw("v102")} label="v102" />
            </div>
            <p className="mt-2 text-xs text-neutral-300">
              v103 adds TL Equal mode and FM/PSG data capture & acquire. v102 introduced RAM instrument store/recall and native DIN MIDI mod.
            </p>
          </Panel>

          <Panel title="Filters">
            <Search value={query} onChange={setQuery} placeholder="Search CC name, number, notes…" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              {(["ALL", "YM2612", "SN76489", "DAC", "OTHER"] as const).map((k) => (
                <Toggle key={k} active={chipFilter === k} onClick={() => setChipFilter(k as any)} label={k} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              {(["ALL", "Global", "Channel", "Operator"] as const).map((k) => (
                <Toggle key={k} active={groupFilter === (k as any)} onClick={() => setGroupFilter(k as any)} label={k} />
              ))}
            </div>
          </Panel>

          <Panel title="MIDI Channel Map">
            <ChannelMap />
          </Panel>

          <Panel title="Resources">
            <ul className="text-sm leading-6 text-neutral-200/90 list-disc pl-5">
              <li>
                <a className="underline" href="https://little-scale.blogspot.com/2014/01/genmdm-v103-equal-tl-mode-fm-and-psg.html" target="_blank">
                  GenMDM v103 post + mapping
                </a>
              </li>
              <li>
                <a className="underline" href="https://little-scale.blogspot.com/2013/01/genmdm-firmware-v102.html" target="_blank">
                  GenMDM v102 post + notes
                </a>
              </li>
              <li>
                <a className="underline" href="https://www.alyjameslab.com/tutorials/GENMDM_102_FMDrive.pdf" target="_blank">
                  v102 Quick Ref (PDF)
                </a>
              </li>
              <li>
                <a className="underline" href="https://2xaa.github.io/genmdm-editor/" target="_blank">
                  genMDM Editor (web)
                </a>
              </li>
              <li>
                <a className="underline" href="https://github.com/2xAA/genmdm-editor" target="_blank">
                  genMDM Editor GitHub
                </a>
              </li>
              <li>
                <a className="underline" href="https://chipmusic.org/forums/topic/562/sega-md-gen-genmdm-sega-genesis-mega-drive-midi-interface/" target="_blank">
                  ChipMusic feature thread
                </a>
              </li>
            </ul>
          </Panel>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-3">
          <HeroCard />
          <FeatureSpecs />

          <Panel title={`CC Browser (${filtered.length} items)`}>
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-[1px] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-900/60 text-neutral-300">
                  <tr className="text-left">
                    <Th>Chip</Th>
                    <Th>Group</Th>
                    <Th>Name</Th>
                    <Th>CC</Th>
                    <Th>Range</Th>
                    <Th>Channel(s)</Th>
                    <Th>Notes</Th>
                    <Th>Copy</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  <AnimatePresence initial={false}>
                    {filtered.map((r) => (
                      <motion.tr
                        key={`${r.cc}-${r.name}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-neutral-900/40"
                      >
                        <Td>{r.chip}</Td>
                        <Td>{r.group}</Td>
                        <Td className="font-medium text-neutral-100">{r.name}</Td>
                        <Td>{r.cc}</Td>
                        <Td>{r.range}</Td>
                        <Td>{r.channels}</Td>
                        <Td className="text-neutral-300/90">{r.notes}</Td>
                        <Td>
                          <button
                            className="px-2 py-1 text-xs rounded-lg border border-neutral-700 hover:bg-neutral-800"
                            onClick={() => copyRow(r)}
                          >
                            Copy
                          </button>
                        </Td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}

/* =========================
   CC mapping + small UI kit
   ========================= */

type ChipGroup = "YM2612" | "SN76489" | "DAC" | "OTHER";
type Group = "Global" | "Channel" | "Operator";

type Row = {
  chip: ChipGroup;
  group: Group;
  name: string;
  cc: string | number;
  range: string;
  channels: string;
  notes?: string;
};

function buildRows(fw: "v103" | "v102"): Row[] {
  const rows: Row[] = [];

  // YM2612 — Global
  rows.push(
    { chip: "YM2612", group: "Global", name: "LFO Enable (Global)", cc: 74, range: "0–1", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "LFO Speed", cc: 1, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Pitch Transposition", cc: 85, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Octave Division", cc: 84, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "PAL/NTSC Tuning", cc: 83, range: "0–1", channels: "1–6" },
    {
      chip: "YM2612",
      group: "Global",
      name: "Voice 3 Special Mode",
      cc: 80,
      range: "0–1",
      channels: "3 / 11–13",
      notes: "Operator freqs on ch 3,11,12,13; velocity = TL",
    },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x27 (low 6 bits)", cc: 92, range: "0–63", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x27 (high 1 bit)", cc: 93, range: "0–1", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x20 (low 4 bits)", cc: 94, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x20 (high 4 bits)", cc: 95, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x2C (low 4 bits)", cc: 96, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Global", name: "Test Reg 0x2C (high 4 bits)", cc: 97, range: "0–15", channels: "1–6" }
  );

  // YM2612 — Channel/Voice control
  rows.push(
    {
      chip: "YM2612",
      group: "Channel",
      name: "Instrument Store (RAM)",
      cc: 6,
      range: "1–16",
      channels: "1–6",
      notes: fw === "v102" || fw === "v103" ? "15 RAM slots noted in v102" : undefined,
    },
    { chip: "YM2612", group: "Channel", name: "Instrument Recall (RAM)", cc: 9, range: "1–16", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "Frequency", cc: "Note Number", range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "Pitch Bend Amount", cc: 81, range: "0–17", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "FM Algorithm", cc: 14, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "FM Feedback", cc: 15, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "Stereo Configuration", cc: 77, range: "0–3", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "Amplitude Modulation Level", cc: 76, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "Frequency Modulation Level", cc: 75, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "SSG-EG OP1 On/Setting", cc: 90, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "SSG-EG OP2 On/Setting", cc: 91, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "SSG-EG OP3 On/Setting", cc: 92, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Channel", name: "SSG-EG OP4 On/Setting", cc: 93, range: "0–15", channels: "1–6" }
  );

  // YM2612 — Operator control
  rows.push(
    { chip: "YM2612", group: "Operator", name: "Total Level OP1", cc: 16, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Total Level OP2", cc: 17, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Total Level OP3", cc: 18, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Total Level OP4", cc: 19, range: "0–127", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Multiple OP1", cc: 20, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Multiple OP2", cc: 21, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Multiple OP3", cc: 22, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Multiple OP4", cc: 23, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Detune OP1", cc: 24, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Detune OP2", cc: 25, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Detune OP3", cc: 26, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Detune OP4", cc: 27, range: "0–7", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Rate Scaling OP1", cc: 39, range: "0–3", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Rate Scaling OP2", cc: 40, range: "0–3", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Rate Scaling OP3", cc: 41, range: "0–3", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Rate Scaling OP4", cc: 42, range: "0–3", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Attack Rate OP1", cc: 43, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Attack Rate OP2", cc: 44, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Attack Rate OP3", cc: 45, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Attack Rate OP4", cc: 46, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "First Decay Rate OP1", cc: 47, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "First Decay Rate OP2", cc: 48, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "First Decay Rate OP3", cc: 49, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "First Decay Rate OP4", cc: 50, range: "0–31", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Decay Rate OP1", cc: 51, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Decay Rate OP2", cc: 52, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Decay Rate OP3", cc: 53, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Decay Rate OP4", cc: 54, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Amp Level OP1", cc: 55, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Amp Level OP2", cc: 56, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Amp Level OP3", cc: 57, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Second Amp Level OP4", cc: 58, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Release Rate OP1", cc: 59, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Release Rate OP2", cc: 60, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Release Rate OP3", cc: 61, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "Release Rate OP4", cc: 62, range: "0–15", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "AM Enable OP1", cc: 70, range: "0–1", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "AM Enable OP2", cc: 71, range: "0–1", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "AM Enable OP3", cc: 72, range: "0–1", channels: "1–6" },
    { chip: "YM2612", group: "Operator", name: "AM Enable OP4", cc: 73, range: "0–1", channels: "1–6" }
  );

  // YM2612 — DAC (Ch 6)
  rows.push(
    { chip: "DAC", group: "Channel", name: "DAC Enable", cc: 78, range: "0–1", channels: "Ch 6" },
    { chip: "DAC", group: "Channel", name: "DAC Direct Data", cc: 79, range: "0–127", channels: "Ch 6" },
    { chip: "DAC", group: "Channel", name: "Sample Pitch Speed", cc: 86, range: "0–127", channels: "Ch 6" },
    { chip: "DAC", group: "Channel", name: "Sample Oversample Multiplier", cc: 88, range: "0–15", channels: "Ch 6" },
    { chip: "DAC", group: "Channel", name: "Noise / Custom Wave Mode", cc: 89, range: "0–1", channels: "Ch 6" },
    { chip: "DAC", group: "Channel", name: "Custom Wave Bytes 1–14", cc: "100–113", range: "0–127", channels: "Ch 6", notes: "send 14 bytes in order" }
  );

  // SN76489 — Global + Noise note map
  rows.push(
    { chip: "SN76489", group: "Global", name: "Pitch Transposition", cc: 85, range: "0–127", channels: "7–10" },
    { chip: "SN76489", group: "Global", name: "PAL/NTSC", cc: 83, range: "0–1", channels: "7–10" },
    {
      chip: "SN76489",
      group: "Channel",
      name: "Noise Control (notes C..B)",
      cc: "Note Pitches",
      range: "C..B",
      channels: "9–10",
      notes:
        "C/C#: Hi periodic • D/D#: Mid periodic • E: Low periodic • F: Hi noise • F#: Mid noise • G/G#: Low noise • A/A#: Ch9 periodic • B: Ch9 noise",
    }
  );

  // OTHER (Data capture / acquire — v103 only)
  if (fw === "v103") {
    rows.push(
      { chip: "OTHER", group: "Global", name: "Enable/Disable Data Capture", cc: 114, range: "0–1", channels: "Global" },
      { chip: "OTHER", group: "Global", name: "Enable Data Acquire", cc: 115, range: "0–1", channels: "Global" },
      { chip: "OTHER", group: "Global", name: "Disable Acquire (Note)", cc: "Ch16 Note 127", range: "—", channels: "Global" }
    );
  }

  return rows;
}

function copyRow(r: Row) {
  const text =
    `${r.name} — CC ${r.cc} — Range ${r.range} — ${r.chip} (${r.group})` + (r.notes ? `\n${r.notes}` : "");
  navigator.clipboard?.writeText(text);
}

/* =========
   UI pieces
   ========= */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-[inset_0_1px_#111] backdrop-blur-[1px]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-200">{title}</h2>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-lg border text-xs transition ${
        active ? "bg-neutral-800 border-neutral-600" : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      {label}
    </button>
  );
}

function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-neutral-900/70 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600 backdrop-blur-[2px]"
    />
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>;
}

function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-950/90 to-neutral-900/70 p-6 backdrop-blur-[2px]">
      <div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle at center, #1ef4a6 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }}
      />
      <div
        className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full"
        style={{ background: "radial-gradient(circle at center, #21d0ff 0%, transparent 60%)", filter: "blur(40px)", opacity: 0.25 }}
      />
      <div className="relative">
        <h2 className="text-xl sm:text-2xl font-bold">What is GenMDM?</h2>
        <p className="mt-2 text-neutral-200 leading-7">
          GenMDM is a MIDI interface for the Sega Mega Drive / Genesis that exposes the <strong>YM2612</strong> (6 FM voices + DAC) and{" "}
          <strong>SN76489</strong> (4 PSG voices) to your DAW via USB or DIN MIDI. It’s up to <strong>10-part multitimbral</strong>, responds to notes /
          velocity / pitch bend and extensive MIDI CCs, and supports PAL/NTSC and microtonal tuning.
        </p>
      </div>
    </div>
  );
}

function FeatureSpecs() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Panel title="Features (highlights)">
        <ul className="list-disc pl-5 text-neutral-200 leading-7 text-sm">
          <li>USB MIDI device + optional 5-pin DIN input (Teensy UART RX mod)</li>
          <li>6× FM (YM2612) + 4× PSG (SN76489); Ch. 11–13 for YM2612 Voice-3 special mode</li>
          <li>Full FM parameter control via CCs: algorithm, feedback, TL, envelopes, detune, AMS/FMS, SSG-EG</li>
          <li>DAC channel: sample playback, oversampling, direct data, custom 14-byte waveform, noise mode</li>
          <li>PAL/NTSC tuning; pitch transpose; octave division; microtonal tuning</li>
          <li>RAM instrument store/recall for quick patch switching</li>
          <li>v103: TL Equal mode, FM/PSG data capture & acquire (experimental VGM generation)</li>
        </ul>
      </Panel>
      <Panel title="Technical specifications">
        <ul className="list-disc pl-5 text-neutral-200 leading-7 text-sm">
          <li>
            <strong>MIDI Channels:</strong> 1–6 = YM2612 voices; 7–10 = SN76489; 11–13 = YM2612 Voice-3 Special Mode
          </li>
          <li>
            <strong>Firmware:</strong> v101–v103 documented; v102 adds DIN MIDI mod + 15 RAM instruments; v103 adds capture/acquire
          </li>
          <li>
            <strong>Host:</strong> Appears as standard USB MIDI device (class-compliant)
          </li>
          <li>
            <strong>Console:</strong> Runs via cartridge; teensy-based interface to controller port
          </li>
          <li>
            <strong>Supported controls:</strong> note on/off, velocity, pitch bend, extensive CCs (see browser)
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function ChannelMap() {
  const cells = [
    { ch: 1, txt: "YM2612 V1" },
    { ch: 2, txt: "YM2612 V2" },
    { ch: 3, txt: "YM2612 V3" },
    { ch: 4, txt: "YM2612 V4" },
    { ch: 5, txt: "YM2612 V5" },
    { ch: 6, txt: "YM2612 V6/DAC" },
    { ch: 7, txt: "PSG 1" },
    { ch: 8, txt: "PSG 2" },
    { ch: 9, txt: "PSG 3 / Noise" },
    { ch: 10, txt: "PSG 4" },
    { ch: 11, txt: "V3 OP1 (spec)" },
    { ch: 12, txt: "V3 OP2 (spec)" },
    { ch: 13, txt: "V3 OP3 (spec)" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div
          key={c.ch}
          className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 text-center text-xs backdrop-blur-[1px]"
        >
          <div className="text-neutral-300">Ch {c.ch}</div>
          <div className="font-semibold text-neutral-100 mt-1">{c.txt}</div>
        </div>
      ))}
    </div>
  );
}
