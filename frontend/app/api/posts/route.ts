import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { word1, word2, word3 } = await request.json();

  try {
    console.log('request!');
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `「${word1}」「${word2}」「${word3}」の3つのキーワードを含む形で、3段落程度の短い日記の文章を作成してください。それぞれのキーワードについてなんのことかわかる場合はそれを加味した文章にしてほしいですし、知らないキーワードの場合は固有名詞だと思って扱ってください。`,
        model: 'text-davinci-003',
        max_tokens: 1000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return Response.json({ status: 200, text: data.choices[0].text});
      } else {
        return Response.json({text: 'No text generated' });
      }
    } else {
      return Response.json({ status: 500, message: 'Error calling OpenAI API' });
    }
  } catch (err) {
    return Response.json({ status: 500, message: 'Server error', error: err });
  }
}
