import type { NoteChapter } from "./types";

export const biologyNervousNotes: NoteChapter = {
  subject: "Biology",
  title: "Nervous System & Hormones",
  pages: [
    {
      section: "6.1 The Nervous System",
      blocks: [
        {
          kind: "video",
          youtubeId: "46NnjGMKKwM",
          title: "Nervous System — IGCSE Biology (Cognito)",
          caption: "Neurones, reflex arcs, the eye and hormones",
        },
        {
          kind: "intro",
          text: "The nervous system allows rapid communication between different parts of the body. It consists of the central nervous system (CNS) and the peripheral nervous system.",
        },
        {
          kind: "comparison",
          left: {
            label: "Central Nervous System (CNS)",
            items: ["Brain — processes information, coordinates responses", "Spinal cord — relays signals between brain and body; controls reflex arcs"],
          },
          right: {
            label: "Peripheral Nervous System (PNS)",
            items: [
              "Sensory neurones — carry impulses FROM receptors TO CNS",
              "Motor neurones — carry impulses FROM CNS TO effectors",
              "Relay neurones — connect sensory and motor neurones within CNS",
            ],
          },
        },
        {
          kind: "highlight",
          text: "**Neurone structure:**\n• **Dendrites** — receive impulses from other neurones\n• **Cell body** — contains nucleus\n• **Axon** — long fibre transmitting impulses away from cell body\n• **Myelin sheath** — fatty insulation, speeds up transmission\n• **Axon terminals** — release neurotransmitters across the synapse",
          color: "blue",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Receptor", value: "detects a stimulus (e.g. light receptor in eye, pressure receptor in skin)" },
            { label: "Effector", value: "responds to a nerve impulse — either a muscle (contracts) or a gland (secretes)" },
            { label: "Synapse", value: "a junction between two neurones where a chemical neurotransmitter carries the signal across the gap" },
          ],
        },
      ],
    },
    {
      section: "6.2 Reflex Arcs",
      blocks: [
        {
          kind: "definition",
          term: "Reflex arc",
          definition: "a rapid, automatic response to a stimulus that bypasses the brain for speed. The pathway is: receptor → sensory neurone → relay neurone (in spinal cord) → motor neurone → effector.",
        },
        {
          kind: "highlight",
          text: "Reflex arc pathway:\nStimulus → Receptor → Sensory neurone → Relay neurone (spinal cord) → Motor neurone → Effector → Response\n\nExample: touching a hot object → hand withdraws before brain registers pain",
          color: "pink",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Why reflexes bypass the brain:",
              sub: [
                "Faster response — signal travels shorter distance",
                "Protects the body from damage before conscious thought",
                "Brain is informed AFTER the reflex has occurred",
                "Examples: knee-jerk reflex, pupil dilation, blinking",
              ],
            },
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "How a synapse works:",
              sub: [
                "Nerve impulse arrives at axon terminal",
                "Vesicles release neurotransmitter into synaptic cleft",
                "Neurotransmitter diffuses across the gap",
                "Binds to receptors on the next neurone",
                "Triggers a new nerve impulse in the next neurone",
                "Neurotransmitter is then broken down or reabsorbed",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Exam tip: Synapses ensure signals travel in ONE direction only (neurotransmitter is only released from one side). They also allow integration of signals — multiple inputs can be summed before triggering a response.",
        },
      ],
    },
    {
      section: "6.3 The Eye",
      blocks: [
        {
          kind: "highlight",
          text: "**Eye structure:**\n• **Cornea** — does most light refraction\n• **Iris** — controls pupil size (circular muscles constrict; radial muscles dilate)\n• **Lens** — fine-tunes focus by changing shape (accommodation)\n• **Retina** — rod cells (dim light) and cone cells (colour)\n• **Fovea** — highest cone density; sharpest vision\n• **Blind spot** — where optic nerve exits; no photoreceptors",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/600px-Schematic_diagram_of_the_human_eye_en.svg.png",
          caption: "Cross-section of the human eye: showing the cornea, lens, iris, fovea, and optic nerve.",
          side: "right"
        },
        {
          kind: "table",
          headers: ["Structure", "Function"],
          rows: [
            ["Cornea", "Refracts (bends) light as it enters the eye — does most of the focusing"],
            ["Iris", "Controls the amount of light entering — contains circular and radial muscles"],
            ["Pupil", "The hole in the iris through which light passes"],
            ["Lens", "Fine-tunes focusing by changing shape (accommodation)"],
            ["Retina", "Contains light-sensitive cells: rods (dim light, no colour) and cones (bright light, colour)"],
            ["Optic nerve", "Carries impulses from retina to brain"],
            ["Blind spot", "Where optic nerve leaves the eye — no rods or cones here"],
            ["Fovea", "Area of highest cone density — sharpest vision"],
          ],
        },
        {
          kind: "comparison",
          left: {
            label: "Bright light (pupil constricts)",
            items: [
              "Circular muscles of iris CONTRACT",
              "Radial muscles RELAX",
              "Pupil becomes smaller",
              "Less light enters — protects retina",
            ],
          },
          right: {
            label: "Dim light (pupil dilates)",
            items: [
              "Radial muscles of iris CONTRACT",
              "Circular muscles RELAX",
              "Pupil becomes larger",
              "More light enters — improves vision",
            ],
          },
        },
      ],
    },
    {
      section: "6.4 Hormones vs Nerves",
      blocks: [
        {
          kind: "table",
          headers: ["Feature", "Nervous system", "Hormonal system"],
          rows: [
            ["Signal type", "Electrical impulse", "Chemical (hormone in blood)"],
            ["Speed", "Very fast (milliseconds)", "Slow (seconds to hours)"],
            ["Duration", "Short-lived", "Long-lasting"],
            ["Target", "Specific (named muscle/gland)", "Widespread (all cells with receptors)"],
            ["Transmission", "Via neurones", "Via bloodstream"],
          ],
        },
        {
          kind: "table",
          headers: ["Hormone", "Gland", "Stimulus", "Effect"],
          rows: [
            ["Adrenaline", "Adrenal glands", "Stress/danger", "↑ heart rate, ↑ blood glucose, dilates pupils, redirects blood to muscles"],
            ["Insulin", "Pancreas (β cells)", "High blood glucose", "Converts glucose → glycogen (stored in liver/muscle); lowers blood glucose"],
            ["Glucagon", "Pancreas (α cells)", "Low blood glucose", "Converts glycogen → glucose; raises blood glucose"],
            ["Oestrogen", "Ovaries", "FSH from pituitary", "Develops female secondary sexual characteristics; controls menstrual cycle"],
            ["Testosterone", "Testes", "LH from pituitary", "Develops male secondary sexual characteristics"],
            ["ADH", "Pituitary gland", "Low water potential in blood", "Increases water reabsorption in kidney tubules"],
          ],
        },
        {
          kind: "highlight",
          text: "Blood glucose regulation (negative feedback):\nHigh glucose → pancreas releases insulin → glucose converted to glycogen → blood glucose falls\nLow glucose → pancreas releases glucagon → glycogen converted to glucose → blood glucose rises",
          color: "green",
        },
      ],
    },
    {
      section: "6.5 Homeostasis",
      blocks: [
        {
          kind: "definition",
          term: "Homeostasis",
          definition: "the maintenance of a constant internal environment despite changes in external conditions. Uses negative feedback mechanisms.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Variables regulated by homeostasis:",
              sub: [
                "Blood glucose concentration — regulated by insulin and glucagon",
                "Body temperature — regulated by skin, blood vessels, sweat glands, shivering",
                "Water content (osmoregulation) — regulated by kidneys and ADH",
                "Blood CO₂ concentration — regulated by breathing rate",
              ],
            },
            {
              text: "Temperature regulation (thermoregulation):",
              sub: [
                "Too hot: vasodilation (blood vessels widen → more heat lost at skin), sweating (evaporation cools skin), hairs lie flat",
                "Too cold: vasoconstriction (blood vessels narrow → less heat lost), shivering (muscle contractions generate heat), hairs stand up (trap air layer)",
                "Hypothalamus detects temperature changes and coordinates responses",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Negative feedback: when a variable moves away from the set point, a response is triggered that brings it BACK to the set point. This is the basis of all homeostatic mechanisms.",
          color: "blue",
        },
        {
          kind: "warning",
          text: "Diabetes mellitus: Type 1 — pancreas cannot produce insulin (autoimmune); treated with insulin injections. Type 2 — cells become resistant to insulin; treated with diet, exercise, and medication. Both result in high blood glucose if untreated.",
        },
      ],
    },
  ],
};
