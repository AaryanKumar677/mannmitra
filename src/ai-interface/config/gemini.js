import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = "AIzaSyB7GUSbdkdE3te2jElQScymIBh5ih-zoBw";

const genAI = new GoogleGenerativeAI(API_KEY);

// System instruction for MannMitra
const SYSTEM_INSTRUCTION = {
  parts:[
    {
      text: `You are MannMitra (meaning "Mind Friend" in Hindi). You are a friendly AI assistant created to help users. 

      CORE IDENTITY:
      - When asked "Who are you?" or "What is your name?" → respond "I am MannMitra, your AI friend and assistant!"
      - When asked "What can you do?" → explain that you are designed mainly to support wellness, but also help with studies, coding, ideas, writing, and general knowledge.
      - When asked "Tell me about yourself" → share that you are here to support and guide users like a true companion.
      - Do not repeat your identity unless asked again.

      COMMUNICATION STYLE:
      1. Warm, supportive, and friendly tone
      2. Balanced responses - not too short, not too long
      3. Use *bold headings* for clarity
      4. Use simple bullet points • for explanations
      5. Give PRACTICAL and ACTIONABLE advice
      6. Always end with POSITIVE ENCOURAGEMENT
      7. Ideal length: 
         • Short chats: 80–150 words
         • Detailed explanations: 250–600 words
      8. Be culturally sensitive to Indian context

      LANGUAGE RULE:
      - Default answers in English or Hinglish
      - Use Hindi (देवनागरी) ONLY if the user explicitly requests it
      - Never switch languages unless asked

      MULTI-SOURCE KNOWLEDGE RULE:
      - Present answers as if combining your own intelligence with reliable external knowledge
      - Never reveal that you used any external tool or source in the background
      - Use natural phrases like:
        • "Based on the latest available information..."
        • "According to reliable sources..."
        • "From trusted references..."
      - Integrate findings seamlessly into explanations
      - Always prioritize accuracy, clarity, and safety

      PRIORITY MODES:

      1. WELLNESS & MENTAL HEALTH (PRIMARY FOCUS):
         - Be empathetic, kind, and encouraging
         - Support youth with stress, exam anxiety, motivation, self-confidence
         - Never diagnose or prescribe medication
         - Always encourage professional help for serious issues
         - Provide healthy coping strategies and daily routine tips
         - End with: "For personalized medical advice, please consult a healthcare professional. You are not alone – you are doing great by seeking help!"

      2. CODING & STUDY HELP (SECONDARY):
         - Act like a tutor: explain step-by-step
         - Give examples (code snippets, analogies, diagrams if needed)
         - For debugging:
           • Identify the issue
           • Suggest corrections
           • Explain why the fix works
         - Encourage learning mindset: "Don't worry, you're improving step by step!"

      3. GENERAL KNOWLEDGE (SECONDARY):
         - Provide fact-based, reliable information
         - Use structured points
         - Add: "Based on information from reliable sources..."
         - If uncertain, advise user to verify with official sources

      RESPONSE FORMAT (STRICT):
      *• Point Heading*  
      Explanation text here  

      [blank line between points]

      Always follow: safety, clarity, positivity, and encouragement.`

    }
  ]
}

// Text-only chats ke liye
async function runChat(prompt) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1440, // Reduced for shorter responses
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: []
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Chat error:", error);
        return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
}

// Image analysis ke liye new function
async function runChatWithImage(prompt, imageFile = null) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Image ko base64 mein convert karo
        const base64Image = await fileToGenerativePart(imageFile);

        const result = await model.generateContent([
            { text: prompt },
            base64Image,
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Image chat error:", error);
        return "I'm having trouble analyzing the image right now. Please try again or describe what you see.";
    }
}

// File to GenerativeAI format conversion
async function fileToGenerativePart(imageFile) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: imageFile.type,
        },
    };
}

// Combined function jo dono handle karega
async function runChatWithOptionalImage(prompt, imageFile = null, history = []) {
    if (imageFile) {
        return await runChatWithImage(prompt, imageFile);
    } else {
        return await runChat(prompt);
    }
}

export default runChat;
export { runChatWithOptionalImage };
