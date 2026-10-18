const TEXT_MODEL = "gemini-3.8-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";
const API_ROOT = "https://generativelanguage.googleapis.com/v1/models";

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Add your Gemini API key to .env.local as VITE_GEMINI_API_KEY, then restart the app.",
    );
  }
  return key;
}

async function request(model, contents, generationConfig) {
  const response = await fetch(
    `${API_ROOT}/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getApiKey(),
      },
      body: JSON.stringify({ contents, ...(generationConfig && { generationConfig }) }),
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error?.message || `Gemini request failed (${response.status}).`,
    );
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((part) => part.text)
    .map((part) => part.text)
    .join("\n")
    .trim();
  const images = parts
    .filter((part) => part.inlineData?.data)
    .map(
      (part) =>
        `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`,
    );

  if (!text && images.length === 0) {
    throw new Error("Gemini returned an empty response. Try a different prompt.");
  }

  return { text, images };
}

function userParts(prompt, image) {
  const parts = [{ text: prompt }];
  if (image) {
    parts.push({
      inline_data: {
        mime_type: image.mimeType,
        data: image.data,
      },
    });
  }
  return parts;
}

export function generateResponse(messages, prompt, image) {
  const history = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: userParts(message.text, message.image),
  }));
  history.push({ role: "user", parts: userParts(prompt, image) });
  return request(TEXT_MODEL, history);
}

export function generateImage(prompt, image) {
  return request(
    IMAGE_MODEL,
    [{ role: "user", parts: userParts(prompt, image) }],
    { responseModalities: ["Text", "Image"] },
  );
}
