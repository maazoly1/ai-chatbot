import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Flow } from 'react-chatbotify';

function useGeminiAi() {
    const [apiKey, setApiKey] = React.useState<string>('');
    const modelType = "gemini-pro";
    let hasError = false;
    // example gemini stream
    // you can replace with other LLMs or even have a simulated stream
    const gemini_stream = async (params: { userInput: string; streamMessage: (arg0: string) => string; injectMessage: (arg0: string) => string; }) => {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelType });
            const result = await model.generateContentStream(params.userInput);

            let text = "";
            let offset = 0;
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
                // inner for-loop used to visually stream messages character-by-character
                // feel free to remove this loop if you are alright with visually chunky streams
                for (let i = offset; i < chunkText.length; i++) {
                    // while this example shows params.streamMessage taking in text input,
                    // you may also feed it custom JSX.Element if you wish
                    await new Promise(resolve => setTimeout(resolve, 30));
                    params.streamMessage(text.slice(0, i + 1));
                }
                offset += chunkText.length;
            }

            // in case any remaining chunks are missed (e.g. timeout)
            // you may do your own nicer logic handling for large chunks
            for (let i = offset; i < text.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 30));
                params.streamMessage(text.slice(0, i + 1));
            }
            params.streamMessage(text);
        } catch (error) {
            hasError = true;
            params.injectMessage("Unable to load model, is your API Key valid?");
        }
    }

    const flow: Flow = {
        start: {
          message: "Enter your Gemini api key and start asking away!",
          path: "api_key",
          isSensitive: true
        },
        api_key: {
          message: (params: { userInput: string; }) => {
            setApiKey(params.userInput.trim());
            return "Ask me anything!";
          },
          path: "loop",
        },
        loop: {
          message: async (params: never) => {
            await gemini_stream(params);
          },
          path: () => {
            if (hasError) {
              return "start"
            }
            return "loop"
          }
        }
      }

    return {
        flow
    };
}

export default useGeminiAi