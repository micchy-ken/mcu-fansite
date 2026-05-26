import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API Route to fetch latest MCU Works via Gemini & Search Grounding
app.post("/api/fetch-official-mcu", async (req, res) => {
  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured",
      solution: "Please configure GEMINI_API_KEY in the Settings > Secrets panel on the top right.",
    });
  }

  // Lazy initialize the Gemini client so it always picks up the latest key
  const dynamicAi = new GoogleGenAI({
    apiKey: currentApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  try {
    // We will ask Gemini to fetch latest MCU schedule and movies/dramas
    const prompt = `
      Perform a Google Search to get the absolute latest, accurate list and schedules of Marvel Cinematic Universe (MCU) films, series, and specials slated for release or recently released (spanning from late 2024, 2025, 2026, 2027, to 2028 and beyond).
      This includes works like "Captain America: Brave New World", "Thunderbolts*", "The Fantastic Four: First Steps", "Avengers: Doomsday", "Avengers: Secret Wars", "Spider-Man 4", "Blade", "Ironheart", "Daredevil: Born Again", "Eyes of Wakanda", "Wonder Man", "Marvel Zombies", and any newly confirmed MCU projects.

      Retrieve their precise or currently scheduled USA release/premiere dates, official directors/creators, estimated episodes or run times, synopsis/outline (in Japanese), importance, and associated character IDs from our database.

      Represent the data in the required JSON format matching the schema perfectly. All text fields like titleJa, importanceReason, synopsis, directorOrCreator and chronoSetting MUST be written in Japanese.
    `;

    const response = await dynamicAi.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
                description: "Unique string id using lowercase letters, numbers, and underscores (e.g., 'captain_america_bnw', 'thunderbolts', 'fantastic_four_first_steps', 'avengers_doomsday')",
              },
              titleJa: {
                type: Type.STRING,
                description: "Japanese official title of the MCU work"
              },
              titleEn: {
                type: Type.STRING,
                description: "English / Original title of the MCU work"
              },
              type: {
                type: Type.STRING,
                description: "Type of content: 'movie', 'drama', or 'special'"
              },
              releaseDate: {
                type: Type.STRING,
                description: "USA release or premiere date (YYYY-MM-DD. E.g., '2025-02-14'. If precise date isn't known, estimate a reasonable date in that month like '2026-05-01')"
              },
              releaseOrder: {
                type: Type.INTEGER,
                description: "Estimated continuation count of publication order index. E.g., since currently there are about 45+ projects, the 2025 works start around 47, 48, etc."
              },
              chronoOrder: {
                type: Type.INTEGER,
                description: "Estimated storyline timeline sequence index. E.g., a high number such as 50+ matches modern chronological placements"
              },
              chronoSetting: {
                type: Type.STRING,
                description: "Brief storyline timeline setting description in Japanese (e.g., '2025年（キャプテン・アメリカ新章の幕開け）')"
              },
              phase: {
                type: Type.INTEGER,
                description: "MCU Phase. E.g., 5 or 6"
              },
              importance: {
                type: Type.INTEGER,
                description: "Marvel Cinematic importance: 3 (Essential/Main story), 2 (Recommended/Character deep dive), 1 (Supplemental/Spin-off/Sp)"
              },
              importanceReason: {
                type: Type.STRING,
                description: "Short reasoning why this work holds importance in the MCU overarching narrative (in Japanese)"
              },
              synopsis: {
                type: Type.STRING,
                description: "Clean, spoilers-free brief description or synopsis of the work (in Japanese)"
              },
              directorOrCreator: {
                type: Type.STRING,
                description: "Director name or creator name (in Japanese, if known)"
              },
              durationOrEpisodes: {
                type: Type.STRING,
                description: "Runtime or episode count (e.g., '2時間11分', '全9話', or '未定' if unknown)"
              },
              officialUrl: {
                type: Type.STRING,
                description: "Official Marvel Disney JP or US movie promo website / Disney+ url if available, otherwise fallback to marvel.com webpage URL"
              },
              explanationUrlQuery: {
                type: Type.STRING,
                description: "Recommended search query keywords in Japanese for users to lookup explanations/theories online"
              },
              heroIcon: {
                type: Type.STRING,
                description: "A single fitting emoji/symbol representing this work / the main hero (e.g., 🦅, ⚡, 🛡️, 🕷️, 💀)"
              },
              accentColor: {
                type: Type.STRING,
                description: "Hex color code matching the work's theme (e.g., '#ef4444' for Red, '#3b82f6' for Blue)"
              },
              characterIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Listed character keys that are confirmed or expected to appear in this work (Choose from: 'sam_wilson', 'bucky_barnes', 'thaddeus_ross', 'peter_parker', 'stephen_strange', 'shuri', 'scott_lang', 'carol_danvers', 'kamala_khan', 'shang_chi', 'kate_bishop', 'marc_spector', 'matt_murdock', 'deadpool', 'wolverine', 'agatha_harkness', 'riri_williams', 'kingpin', 'reed_richards', 'doctor_doom', 'tony_stark', 'bruce_banner', 'loki', 'thor')"
              }
            },
            required: [
              "id",
              "titleJa",
              "titleEn",
              "type",
              "releaseDate",
              "phase"
            ]
          }
        }
      }
    });

    const parsedText = response.text || "[]";
    const rawItems = JSON.parse(parsedText);
    
    // Parse response items and populate highly resilient defaults for any optional fields
    const items = rawItems.map((fetched: any, idx: number) => {
      const cleanId = fetched.id || `mcu_sync_${idx}_${Date.now().toString(36)}`;
      const titleJa = fetched.titleJa || "未定のMCU作品";
      return {
        id: cleanId,
        titleJa: titleJa,
        titleEn: fetched.titleEn || titleJa,
        type: fetched.type || "movie",
        releaseDate: fetched.releaseDate || "2025-01-01",
        releaseOrder: fetched.releaseOrder !== undefined ? Number(fetched.releaseOrder) : 50 + idx,
        chronoOrder: fetched.chronoOrder !== undefined ? Number(fetched.chronoOrder) : 50 + idx,
        chronoSetting: fetched.chronoSetting || "時系列調査中",
        phase: fetched.phase !== undefined ? Number(fetched.phase) : 5,
        importance: fetched.importance !== undefined ? Number(fetched.importance) : 2,
        importanceReason: fetched.importanceReason || "MCUの未来・世界観に繋がる注目作です。",
        synopsis: fetched.synopsis || "あらすじや予告情報は現在調査中です。",
        directorOrCreator: fetched.directorOrCreator || "未発表",
        durationOrEpisodes: fetched.durationOrEpisodes || "未定",
        officialUrl: fetched.officialUrl || "https://marvel.disney.co.jp/",
        explanationUrlQuery: fetched.explanationUrlQuery || titleJa,
        heroIcon: fetched.heroIcon || "🎬",
        accentColor: fetched.accentColor || "#ef4444",
        characterIds: Array.isArray(fetched.characterIds) ? fetched.characterIds : []
      };
    });

    return res.json({ items });
  } catch (error: any) {
    console.error("Gemini sync error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to query Gemini API",
      solution: "もう一度お試しいただくか、SettingsのAPIキー設定が正しいことをご確認ください。"
    });
  }
});

// API Route to search a specific work and extract metadata from Gemini & Google Search
app.post("/api/search-mcu-work", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured",
      solution: "Please configure GEMINI_API_KEY in the Settings > Secrets panel on the top right.",
    });
  }

  // Lazy initialize the Gemini client so it always picks up the latest key
  const dynamicAi = new GoogleGenAI({
    apiKey: currentApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  try {
    const prompt = `
      Perform a Google Search to fetch information about the Marvel Cinematic Universe (MCU) work matching the keyword: "${query}".
      
      Look up the official translation titles (Japanese and English), its release/premiere date (YYYY-MM-DD), category ('movie', 'drama', or 'special'), Phase (1 to 6), storyline timeline placement summary (Japanese), directors/creators, estimated runtime or episode counts, a short spoilers-free description/synopsis (Japanese), importance level (3=Essential, 2=Recommended, 1=Supplemental) and why it's important (Japanese).
      
      Map the characters appearing in this work to their IDs if they are confirmed or expected to appear. Return character IDs from this whitelist ONLY:
      ['tony_stark', 'steve_rogers', 'thor', 'bruce_banner', 'natasha_romanoff', 'clint_barton', 'nick_fury', 'loki', 'phil_colson', 'jane_foster', 'wanda_maximoff', 'vision', 'sam_wilson', 'bucky_barnes', 'james_rhodes', 'peter_parker', 'stephen_strange', 'wong', 't_challa', 'shuri', 'okoye', 'peter_quill', 'gamora', 'rocket', 'groot', 'dra_x', 'nebula', 'mantis', 'scott_lang', 'hope_van_dyne', 'carol_danvers', 'kamala_khan', 'shang_chi', 'kate_bishop', 'marc_spector', 'jennifer_walters', 'matt_murdock', 'deadpool', 'wolverine', 'agatha_harkness', 'thaddeus_ross', 'riri_williams', 'kingpin', 'reed_richards', 'doctor_doom']

      Choose an appropriate single emoji representative parameter for 'heroIcon' (e.g., 🕸️, 🛡️, 🕷️, 💀), and an appropriate hex code for 'accentColor' based on the theme of this character/title.
      
      Output MUST be a single JSON object corresponding to the required schema. Ensure titles, synopsis, chronoSetting, and importanceReason are written in Japanese.
    `;

    const response = await dynamicAi.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: {
              type: Type.STRING,
              description: "Unique string id using lowercase letters, numbers, and underscores (e.g., 'blade_mcu', 'spiderman_beyond_spiderverse', 'marvel_zombies')"
            },
            titleJa: {
              type: Type.STRING,
              description: "Official/most standard Japanese title of the work"
            },
            titleEn: {
              type: Type.STRING,
              description: "Official/most standard English title of the work"
            },
            type: {
              type: Type.STRING,
              description: "Category of the work: 'movie', 'drama', or 'special'"
            },
            releaseDate: {
              type: Type.STRING,
              description: "USA release/premiere date in YYYY-MM-DD format (if precise date is unknown, estimate a reasonable date in that month)"
            },
            releaseOrder: {
              type: Type.INTEGER,
              description: "Estimate sequence index of publication order relative to others (usually an integer between 45 and 65 for upcoming works)"
            },
            chronoOrder: {
              type: Type.INTEGER,
              description: "Estimate chronological sequence timeline order index relative to others (suggest 45 to 65)"
            },
            chronoSetting: {
              type: Type.STRING,
              description: "Description of the timeline setting/era in Japanese"
            },
            phase: {
              type: Type.INTEGER,
              description: "MCU phase number (e.g. 5 or 6)"
            },
            importance: {
              type: Type.INTEGER,
              description: "MCU importance rating: 3 (Essential/Main), 2 (Recommended), 1 (Supplemental)"
            },
            importanceReason: {
              type: Type.STRING,
              description: "Short reason why this work is important/relevant in Japanese"
            },
            synopsis: {
              type: Type.STRING,
              description: "Brief non-spoiler description/synopsis of the work in Japanese"
            },
            directorOrCreator: {
              type: Type.STRING,
              description: "Director or creator name in Japanese"
            },
            durationOrEpisodes: {
              type: Type.STRING,
              description: "Run-time or episode count (e.g., '全6話' or '2時間10分' or '未定')"
            },
            officialUrl: {
              type: Type.STRING,
              description: "Official URL or search fallback URL"
            },
            explanationUrlQuery: {
              type: Type.STRING,
              description: "Recommended search query keywords in Japanese for users to lookup explanations/theories online"
            },
            heroIcon: {
              type: Type.STRING,
              description: "A single representative emoji/symbol"
            },
            accentColor: {
              type: Type.STRING,
              description: "Hex code representative of the franchise color"
            },
            characterIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Expected characters list from the whitelist provided in the prompt"
            }
          },
          required: [
            "id",
            "titleJa",
            "titleEn",
            "type",
            "releaseDate",
            "phase"
          ]
        }
      }
    });

    const parsedText = response.text || "{}";
    const fetched = JSON.parse(parsedText);

    // Provide reliable defaults
    const finalItem = {
      id: fetched.id || `mcu_ai_${Date.now().toString(36)}`,
      titleJa: fetched.titleJa || query,
      titleEn: fetched.titleEn || query,
      type: fetched.type || "movie",
      releaseDate: fetched.releaseDate || "2026-01-01",
      releaseOrder: fetched.releaseOrder !== undefined ? Number(fetched.releaseOrder) : 55,
      chronoOrder: fetched.chronoOrder !== undefined ? Number(fetched.chronoOrder) : 55,
      chronoSetting: fetched.chronoSetting || "劇中時系列調整中",
      phase: fetched.phase !== undefined ? Number(fetched.phase) : 6,
      importance: fetched.importance !== undefined ? Number(fetched.importance) : 2,
      importanceReason: fetched.importanceReason || "MCUの未来・世界観に繋がる注目作です。",
      synopsis: fetched.synopsis || "あらすじや予告情報は現在調査中です。",
      directorOrCreator: fetched.directorOrCreator || "未発表",
      durationOrEpisodes: fetched.durationOrEpisodes || "未定",
      officialUrl: fetched.officialUrl || "https://marvel.disney.co.jp/",
      explanationUrlQuery: fetched.explanationUrlQuery || query,
      heroIcon: fetched.heroIcon || "🎬",
      accentColor: fetched.accentColor || "#ef4444",
      characterIds: Array.isArray(fetched.characterIds) ? fetched.characterIds : []
    };

    return res.json({ item: finalItem });
  } catch (error: any) {
    console.error("Gemini search item error:", error);
    return res.status(500).json({
      error: error.message || "Failed to search and generate metadata with Gemini",
      solution: "もう一度お試しいただくか、SettingsのAPIキー設定が正しいことをご確認ください。"
    });
  }
});

// Serve Frontend using Vite Middleware (development) or Static Assets (production)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
