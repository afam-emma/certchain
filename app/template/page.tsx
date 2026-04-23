"use client";

import { useState } from "react";

const fonts = [
    "Arial",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Verdana",
];

export default function TemplateBuilder() {
    const [name, setName] = useState("John Doe");
    const [course, setCourse] = useState("Blockchain Certification");
    const [font, setFont] = useState("Arial");
    const [fontSize, setFontSize] = useState(24);
    const [bg, setBg] = useState<string | null>(null);

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setBg(url);
    };

    return (
        <div className="grid grid-cols-2 gap-10 p-10">

            {/* LEFT CONTROLS */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Template Builder</h1>

                <input
                    className="border p-2 w-full"
                    placeholder="Recipient Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="border p-2 w-full"
                    placeholder="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                />

                <select
                    className="border p-2 w-full"
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                >
                    {fonts.map((f) => (
                        <option key={f}>{f}</option>
                    ))}
                </select>

                <input
                    type="range"
                    min="16"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                />

                <p>Font Size: {fontSize}px</p>

                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* RIGHT PREVIEW */}
            <div
                className="border shadow-lg relative w-full h-[500px] flex flex-col items-center justify-center"
                style={{
                    backgroundImage: bg ? `url(${bg})` : "none",
                    backgroundSize: "cover",
                }}
            >
                <div className="bg-white/80 p-6 text-center rounded-xl">
                    <h1
                        style={{ fontFamily: font, fontSize }}
                        className="font-bold"
                    >
                        CERTIFICATE
                    </h1>

                    <p style={{ fontFamily: font, fontSize: fontSize - 4 }}>
                        This is awarded to
                    </p>

                    <h2
                        style={{ fontFamily: font, fontSize: fontSize + 4 }}
                        className="font-semibold"
                    >
                        {name}
                    </h2>

                    <p style={{ fontFamily: font }}>
                        For completing {course}
                    </p>
                </div>
            </div>
        </div>
    );
}