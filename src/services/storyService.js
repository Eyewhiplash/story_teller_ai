import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
})

export const generateStory = async (character, setting, adventure) => {
  try {
    const prompt = `Create a children's story with the following elements:
    Character: ${character.name} - ${character.description}
    Setting: ${setting.name} - ${setting.description}
    Adventure Type: ${adventure.name} - ${adventure.description}

    Please create a story that:
    1. Is appropriate for children aged 5-10
    2. Has a clear beginning, middle, and end
    3. Includes a moral or lesson
    4. Uses simple language and short paragraphs
    5. Is engaging and magical
    6. Is approximately 1000 words long

    Format the story with proper paragraphs and line breaks.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative children's story writer who creates engaging, magical tales with positive messages."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating story:', error)
    throw new Error('Failed to generate story. Please try again.')
  }
} 