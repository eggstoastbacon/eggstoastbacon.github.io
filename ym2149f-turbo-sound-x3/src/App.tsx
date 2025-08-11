import React from "react";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">YM2149F Turbo Sound x3</h1>
        <div className="text-xs sm:text-sm text-neutral-400">3× PSG • MIDI over USB • 9 voices</div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 space-y-8">
        <Hero />

        <div className="grid md:grid-cols-3 gap-6">
          <Panel title="Quick Links">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li><a className="underline" href="https://github.com/Chiptune-Anamnesis/ym2149f-turbo-sound-x3" target="_blank">Project repository</a></li>
              <li><a className="underline" href="https://github.com/Chiptune-Anamnesis/Arduinoboy_Main" target="_blank">Arduinoboy_Main (related)</a></li>
            </ul>
          </Panel>

          <Panel title="Highlights">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li>Three <strong>YM2149F</strong> chips for up to <strong>9 mono voices</strong>.</li>
              <li><strong>Arduino Pro Micro (ATmega32U4)</strong> USB‑MIDI with optional DIN‑5 in.</li>
              <li>Chip select via <strong>74HC138</strong>; control gating with <strong>74LS08</strong>.</li>
              <li><strong>8 MHz</strong> clock divided via <strong>74LS93</strong> to feed all chips.</li>
              <li>Per‑chip activity LEDs and channel mapping from MIDI 1..9.</li>
              <li>Noise/percussion on Ch10 (optional), vibrato, arps, CC controls.</li>
            </ul>
          </Panel>

          <Panel title="Pin Map (current)">
            <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
              <li><strong>DATA_PINS:</strong> D2–D9 → YM2149 DA0–DA7</li>
              <li><strong>BC1:</strong> D10</li>
              <li><strong>BDIR:</strong> D20</li>
              <li><strong>SEL A/B/C (74HC138):</strong> A3 / A1 / A0</li>
              <li><strong>ENABLE:</strong> A2</li>
              <li><strong>LEDs:</strong> D15 (YM0), D14 (YM1), D16 (YM2)</li>
              <li><strong>MIDI In:</strong> D0 (RX) via 6N138 optocoupler</li>
              <li><strong>Clock:</strong> 8 MHz osc → 74LS93 → YM2149 CLOCK</li>
            </ul>
            <p className="text-xs text-neutral-500 mt-2">Map is configurable in firmware; match your wiring.</p>
          </Panel>
        </div>

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

        <Panel title="Firmware Features (selection)">
          <ul className="text-sm leading-7 text-neutral-300 list-disc pl-5">
            <li><strong>Velocity</strong> mapping with adjustable curves; expression (CC11).</li>
            <li><strong>Vibrato</strong> (rate/amount on CC‑6/7 in your build), <strong>Portamento</strong> (CC‑5 speed).</li>
            <li><strong>Arpeggiator</strong> with pattern select and rate CCs; octave offset control.</li>
            <li><strong>Sustain pedal</strong> support; per‑voice envelope shaping options.</li>
            <li><strong>Real‑time MIDI filtering</strong> and resync for robust OP‑Z/DAW use.</li>
          </ul>
          <p className="text-xs text-neutral-500 mt-2">Exact CC numbers/behavior may vary per firmware revision.</p>
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
          A three‑chip YM2149F synth controlled over MIDI. Great for crunchy PSG chords, stacked detune leads, and tracker‑style arps — all driven by a tiny Pro Micro.
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
