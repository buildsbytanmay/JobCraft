import { GoogleGenAI } from '@google/genai';

export interface GenerateJobPromptParams {
  jobTitle: string;
  company: string;
  experience: string;
  skills: string[] | string;
  location: string;
  employmentType: string;
}

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return aiClient;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Short, clean fallback generator (approx 120–180 words)
 */
function generateStructuredFallbackDescription(params: GenerateJobPromptParams): string {
  const { jobTitle, company, experience, skills, location, employmentType } = params;
  const skillsArray = Array.isArray(skills)
    ? skills
    : skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  const skillsList = skillsArray.join(', ');

  const responsibilities: string[] = [
    `Develop and maintain features for the ${jobTitle} role.`,
    `Build solutions using ${skillsArray.slice(0, 3).join(', ')}.`,
    `Collaborate with team members to ship high-quality work.`,
    `Troubleshoot issues and maintain system performance.`,
  ];

  const requiredSkills: string[] = [
    `${experience} of relevant experience as a ${jobTitle}.`,
    ...skillsArray.map((s) => `Hands-on experience with ${s}.`),
    `Strong problem-solving and communication skills.`,
  ];

  return `## ${jobTitle}

**${company} · ${location} · ${employmentType} · ${experience}**

### About the Role

${company} is seeking a ${jobTitle} to join the team in ${location}. In this ${employmentType.toLowerCase()} role, you will work with ${skillsList} to build and maintain core features.

### Responsibilities

${responsibilities.map((r) => `* ${r}`).join('\n')}

### Required Skills

${requiredSkills.map((s) => `* ${s}`).join('\n')}`;
}

/**
 * Generate a short, punchy, concise job description using Gemini AI (150–250 words).
 */
export async function generateJobDescription(params: GenerateJobPromptParams): Promise<string> {
  const { jobTitle, company, experience, skills, location, employmentType } = params;

  const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;

  const prompt = `You are a recruiter writing a short, direct, and concise job description.

Strict Rules:
1. TARGET LENGTH: 150–250 words total. Keep it brief, crisp, and to the point.
2. DO NOT write long paragraphs or corporate filler.
3. DO NOT invent company details, mission statements, or company culture.
4. DO NOT invent benefits or perks.
5. DO NOT invent unrelated technologies. Use only: ${skillsList}.
6. Keep every bullet point to a single short sentence (under 15 words).

User Inputs:
- Job Title: ${jobTitle}
- Company: ${company}
- Experience: ${experience}
- Skills: ${skillsList}
- Location: ${location}
- Employment Type: ${employmentType}

Structure to Output:
## ${jobTitle}

**${company} · ${location} · ${employmentType} · ${experience}**

### About the Role
[1 short paragraph of 2–3 sentences stating the role and core focus with ${skillsList}. No marketing fluff.]

### Responsibilities
* [4–5 short, single-line bullet points directly related to ${jobTitle} and ${skillsList}]

### Required Skills
* [4–5 short, single-line bullet points covering ${skillsList} and ${experience}]

Output ONLY the Markdown text.`;

  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-flash-latest'];
  let ai: GoogleGenAI | null = null;

  try {
    ai = getAIClient();
  } catch (initErr) {
    console.warn('Gemini client init skipped, using fallback:', initErr);
    return generateStructuredFallbackDescription(params);
  }

  for (const modelName of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.5,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (error: any) {
        const errMsg = error?.message || String(error);
        const isTemporary =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary && attempt === 0) {
          await wait(600);
          continue;
        }

        if (isTemporary) {
          console.warn(`Model ${modelName} unavailable (${errMsg}). Trying fallback model...`);
          break;
        } else {
          console.warn(`Gemini error (${errMsg}), switching to fallback.`);
          return generateStructuredFallbackDescription(params);
        }
      }
    }
  }

  return generateStructuredFallbackDescription(params);
}
