import {
  BedrockRuntimeClient,
  ConverseCommand,
  ContentBlock,
  Message,
} from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const DEFAULT_MODEL = "anthropic.claude-3-5-sonnet-20241022-v2:0";

interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface GenerateObjectOptions<T> {
  prompt: string;
  systemPrompt?: string;
  schema: z.ZodType<T>;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Generate text using AWS Bedrock Converse API
 */
export async function generateText(
  options: GenerateTextOptions
): Promise<string> {
  const {
    prompt,
    systemPrompt,
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    temperature = 1,
  } = options;

  const messages: Message[] = [
    {
      role: "user",
      content: [{ text: prompt }],
    },
  ];

  const command = new ConverseCommand({
    modelId: model,
    messages,
    ...(systemPrompt && {
      system: [{ text: systemPrompt }],
    }),
    inferenceConfig: {
      maxTokens,
      temperature,
    },
  });

  const response = await bedrockClient.send(command);

  // Extract text from response
  const outputMessage = response.output?.message;
  if (!outputMessage?.content) {
    throw new Error("No response from Bedrock");
  }

  const textContent = outputMessage.content
    .filter(
      (block): block is ContentBlock & { text: string } => "text" in block
    )
    .map((block) => block.text)
    .join("");

  return textContent;
}

/**
 * Generate structured object using AWS Bedrock Converse API with JSON validation
 */
export async function generateObject<T>(
  options: GenerateObjectOptions<T>
): Promise<T> {
  const {
    prompt,
    systemPrompt,
    schema,
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    temperature = 1,
  } = options;

  const jsonPrompt = `${prompt}

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any markdown formatting, code blocks, or explanatory text. Return raw JSON only.`;

  const jsonSystemPrompt = systemPrompt
    ? `${systemPrompt}\n\nYou must respond with valid JSON only. No markdown, no code blocks, no explanatory text.`
    : "You must respond with valid JSON only. No markdown, no code blocks, no explanatory text.";

  const text = await generateText({
    prompt: jsonPrompt,
    systemPrompt: jsonSystemPrompt,
    model,
    maxTokens,
    temperature,
  });

  // Clean up potential markdown formatting
  let cleanedText = text.trim();

  // Remove markdown code blocks if present
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON from Bedrock response:", cleanedText);
    throw new Error("Invalid JSON response from Bedrock");
  }

  // Validate with Zod schema
  const validated = schema.parse(parsed);
  return validated;
}
